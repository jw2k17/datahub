import logging
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Any, Iterable, List, Optional

import bson
import pymongo
from ete3 import Tree
from past.builtins import basestring
from pymongo.mongo_client import MongoClient

from datahub.configuration.common import AllowDenyPattern, ConfigModel
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.source import Source, SourceReport
from datahub.ingestion.source.metadata_common import MetadataWorkUnit
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import DatasetSnapshot
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import DatasetPropertiesClass

# These are MongoDB-internal databases, which we want to skip.
# See https://docs.mongodb.com/manual/reference/local-database/ and
# https://docs.mongodb.com/manual/reference/config-database/ and
# https://stackoverflow.com/a/48273736/5004662.
DENY_DATABASE_LIST = set(["admin", "config", "local"])

logger = logging.getLogger(__name__)


class MongoDBConfig(ConfigModel):
    # See the MongoDB authentication docs for details and examples.
    # https://pymongo.readthedocs.io/en/stable/examples/authentication.html
    connect_uri: str = "mongodb://localhost"
    username: Optional[str] = None
    password: Optional[str] = None
    authMechanism: Optional[str] = None
    options: dict = {}

    database_pattern: AllowDenyPattern = AllowDenyPattern.allow_all()
    collection_pattern: AllowDenyPattern = AllowDenyPattern.allow_all()


@dataclass
class MongoDBSourceReport(SourceReport):
    filtered: List[str] = field(default_factory=list)

    def report_dropped(self, name: str) -> None:
        self.filtered.append(name)


logger = logging.getLogger(__name__)

###
# Mapping from pymongo_type to type_string

PYMONGO_TYPE_TO_TYPE_STRING = {
    list: "ARRAY",
    dict: "OBJECT",
    type(None): "null",

    bool: "boolean",
    int: "integer",
    bson.int64.Int64: "biginteger",
    float: "float",

    str: "string",

    bson.datetime.datetime: "date",
    bson.timestamp.Timestamp: "timestamp",

    bson.dbref.DBRef: "dbref",
    bson.objectid.ObjectId: "oid",
}


def get_type_string(value):
    """
    Return mongo type string from a value
    :param value:
    :return type_string: str
    """
    value_type = type(value)
    try:
        type_string = PYMONGO_TYPE_TO_TYPE_STRING[value_type]
    except KeyError:
        logger.warning("Pymongo type %s is not mapped to a type_string. "
                       "We define it as 'unknown' for current schema extraction", value_type)
        PYMONGO_TYPE_TO_TYPE_STRING[value_type] = 'unknown'
        type_string = 'unknown'

    return type_string


###
# Define and use type_string_tree,
# to get the least common parent type_string from a list of type_string

NEWICK_TYPES_STRING_TREE = """
(
    (
        (
            float,
            ((boolean) integer) biginteger
        ) number,
        (
            oid,
            dbref
        ) string,
        date,
        timestamp,
        unknown
    ) general_scalar,
    OBJECT
) mixed_scalar_object
;"""

TYPES_STRING_TREE = Tree(NEWICK_TYPES_STRING_TREE, format=8)


def common_parent_type(list_of_type_string):
    """
    Get the common parent type from a list of types.
    :param list_of_type_string: list
    :return common_type: type_str
    """
    if not list_of_type_string:
        return 'null'
    # avoid duplicates as get_common_ancestor('integer', 'integer') -> 'number'
    list_of_type_string = list(set(list_of_type_string))
    if len(list_of_type_string) == 1:
        return list_of_type_string[0]
    return TYPES_STRING_TREE.get_common_ancestor(*list_of_type_string).name


MONGO_TO_PSQL_TYPE = {
    'boolean': 'BOOLEAN',
    'integer': 'INT',
    'biginteger': 'BIGINT',
    'float': 'REAL',
    'number': 'DOUBLE PRECISION',
    'date': 'TIMESTAMP',
    'string': 'TEXT',
    'oid': 'TEXT',
    'dbref': 'TEXT'
}


def psql_type(mongo_type_str):
    """ Map a MongoDB type string to a PSQL type string
    :param mongo_type_str: str
    :return psql_type_str: str
    """
    return MONGO_TO_PSQL_TYPE[mongo_type_str]


def extract_collection_schema(pymongo_collection, sample_size=0):
    """
    Iterate through all document of a collection to create its schema
    - Init collection schema
    - Add every document from MongoDB collection to the schema
    - Post-process schema
    :param pymongo_collection: pymongo.collection.Collection
    :param sample_size: int, default 0
    :return collection_schema: dict
    """
    collection_schema = {
        'count': 0,
        "object": init_empty_object_schema()
    }

    n = pymongo_collection.count()
    collection_schema['count'] = n
    if sample_size:
        documents = pymongo_collection.aggregate([{'$sample': {'size': sample_size}}], allowDiskUse=True)
    else:
        documents = pymongo_collection.find({})
    scan_count = sample_size or n
    for i, document in enumerate(documents, start=1):
        add_document_to_object_schema(document, collection_schema['object'])
        if i % 10 ** 5 == 0 or i == scan_count:
            logger.info('   scanned %s documents out of %s (%.2f %%)', i, scan_count, (100. * i) / scan_count)

    post_process_schema(collection_schema)
    collection_schema = recursive_default_to_regular_dict(collection_schema)
    return collection_schema


def recursive_default_to_regular_dict(value):
    """
    If value is a dictionary, recursively replace defaultdict to regular dict
    Note : defaultdict are instances of dict
    :param value:
    :return d: dict or original value
    """
    if isinstance(value, dict):
        return {k: recursive_default_to_regular_dict(v) for k, v in value.items()}
    else:
        return value


def post_process_schema(object_count_schema):
    """
    Clean and add information to schema once it has been built
    - compute the main type for each field
    - compute the proportion of non null values in the parent object
    - recursively postprocess nested object schemas
    :param object_count_schema: dict
    This schema can either be a field_schema or a collection_schema
    """
    object_count = object_count_schema['count']
    object_schema = object_count_schema['object']
    for field_schema in object_schema.values():

        summarize_types(field_schema)
        field_schema['prop_in_object'] = round((field_schema['count']) / float(object_count), 4)
        if 'object' in field_schema:
            post_process_schema(field_schema)


def summarize_types(field_schema):
    """
    Summarize types information to one 'type' field
    Add a 'type' field, compatible with all encountered types in 'types_count'.
    This is done by taking the least common parent type between types.
    If 'ARRAY' type count is not null, the main type is 'ARRAY'.
    An 'array_type' is defined, as the least common parent type between 'types' and 'array_types'
    :param field_schema:
    """

    type_list = list(field_schema['types_count'])
    # Only if 'ARRAY' in 'types_count':
    type_list += list(field_schema.get('array_types_count', {}))

    cleaned_type_list = [
        type_name
        for type_name in type_list
        if type_name not in ['ARRAY', 'null']
    ]

    common_type = common_parent_type(cleaned_type_list)

    if 'ARRAY' in field_schema['types_count']:
        field_schema['type'] = 'ARRAY'
        field_schema['array_type'] = common_type
    else:
        field_schema['type'] = common_type


def init_empty_object_schema():
    """
    Generate an empty object schema.
    We use a defaultdict of empty fields schema. This avoid to test for the presence of fields.
    :return: defaultdict(empty_field_schema)
    """

    def empty_field_schema():
        return {
            'types_count': defaultdict(int),
            'count': 0,
        }

    empty_object = defaultdict(empty_field_schema)  # type: defaultdict[str, dict[str, Any]]
    return empty_object


def add_document_to_object_schema(document, object_schema):
    """
    Add a all fields of a document to a local object_schema.
    :param document: dict
    contains a MongoDB Object
    :param object_schema: dict
    """
    for doc_field, doc_value in document.items():
        add_value_to_field_schema(doc_value, object_schema[doc_field])


def add_value_to_field_schema(value, field_schema):
    """
    Add a value to a field_schema
    - Update count or 'null_count' count.
    - Define or check the type of value.
    - Recursively add 'list' and 'dict' value to the schema.
    :param value:
    value corresponding to a field in a MongoDB Object
    :param field_schema: dict
    subdictionary of the global schema dict corresponding to a field
    """
    field_schema['count'] += 1
    add_value_type(value, field_schema)
    add_potential_list_to_field_schema(value, field_schema)
    add_potential_document_to_field_schema(value, field_schema)


def add_potential_document_to_field_schema(document, field_schema):
    """
    Add a document to a field_schema
    - Exit if document is not a dict
    :param document: dict (or skipped)
    :param field_schema:
    """
    if isinstance(document, dict):
        if 'object' not in field_schema:
            field_schema['object'] = init_empty_object_schema()
        add_document_to_object_schema(document, field_schema['object'])


def add_potential_list_to_field_schema(value_list, field_schema):
    """
    Add a list of values to a field_schema
    - Exit if value_list is not a list
    - Define or check the type of each value of the list.
    - Recursively add 'dict' values to the schema.
    :param value_list: list (or skipped)
    :param field_schema: dict
    """
    if isinstance(value_list, list):
        if 'array_types_count' not in field_schema:
            field_schema['array_types_count'] = defaultdict(int)

        if not value_list:
            add_value_type(None, field_schema, type_str='array_types_count')

        for value in value_list:
            add_value_type(value, field_schema, type_str='array_types_count')
            add_potential_document_to_field_schema(value, field_schema)


def add_value_type(value, field_schema, type_str='types_count'):
    """
    Define the type_str in field_schema, or check it is equal to the one previously defined.
    :param value:
    :param field_schema: dict
    :param type_str: str, either 'types_count' or 'array_types_count'
    """
    value_type_str = get_type_string(value)
    field_schema[type_str][value_type_str] += 1


@dataclass
class MongoDBSource(Source):
    config: MongoDBConfig
    report: MongoDBSourceReport
    mongo_client: MongoClient

    def __init__(self, ctx: PipelineContext, config: MongoDBConfig):
        super().__init__(ctx)
        self.config = config
        self.report = MongoDBSourceReport()

        options = {}
        if self.config.username is not None:
            options["username"] = self.config.username
        if self.config.password is not None:
            options["password"] = self.config.password
        if self.config.authMechanism is not None:
            options["authMechanism"] = self.config.authMechanism
        options = {
            **options,
            **self.config.options,
        }

        self.mongo_client = pymongo.MongoClient(self.config.connect_uri, **options)

        # This cheaply tests the connection. For details, see
        # https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient
        self.mongo_client.admin.command("ismaster")

    @classmethod
    def create(cls, config_dict: dict, ctx: PipelineContext) -> "MongoDBSource":
        config = MongoDBConfig.parse_obj(config_dict)
        return cls(ctx, config)

    def get_workunits(self) -> Iterable[MetadataWorkUnit]:
        env = "PROD"
        platform = "mongodb"

        database_names: List[str] = self.mongo_client.list_database_names()

        # traverse databases in sorted order so output is consistent
        for database_name in sorted(database_names):
            if database_name in DENY_DATABASE_LIST:
                continue
            if not self.config.database_pattern.allowed(database_name):
                self.report.report_dropped(database_name)
                continue

            database = self.mongo_client[database_name]
            collection_names: List[str] = database.list_collection_names()

            # traverse collections in sorted order so output is consistent
            for collection_name in sorted(collection_names):
                dataset_name = f"{database_name}.{collection_name}"

                if not self.config.collection_pattern.allowed(dataset_name):
                    self.report.report_dropped(dataset_name)
                    continue

                dataset_snapshot = DatasetSnapshot(
                    urn=f"urn:li:dataset:(urn:li:dataPlatform:{platform},{dataset_name},{env})",
                    aspects=[],
                )

                dataset_properties = DatasetPropertiesClass(
                    tags=[],
                    customProperties={},
                )
                dataset_snapshot.aspects.append(dataset_properties)

                # TODO: Guess the schema via sampling

                # code adapted from https://github.com/pajachiet/pymongo-schema
                collection_schema = extract_collection_schema(database[collection_name])

                # TODO: use list_indexes() or index_information() to get index information
                # See https://pymongo.readthedocs.io/en/stable/api/pymongo/collection.html#pymongo.collection.Collection.list_indexes.

                mce = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
                wu = MetadataWorkUnit(id=dataset_name, mce=mce)
                self.report.report_workunit(wu)
                yield wu

    def get_report(self) -> MongoDBSourceReport:
        return self.report

    def close(self):
        self.mongo_client.close()
