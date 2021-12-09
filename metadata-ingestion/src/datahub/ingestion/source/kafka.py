import logging
from dataclasses import dataclass, field
from hashlib import md5
from typing import Iterable, List, Optional

import confluent_kafka
from confluent_kafka.schema_registry.schema_registry_client import (
    Schema,
    SchemaRegistryClient,
)

from datahub.configuration import ConfigModel
from datahub.configuration.common import AllowDenyPattern
from datahub.configuration.kafka import KafkaConsumerConnectionConfig
from datahub.emitter.mce_builder import DEFAULT_ENV
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.source import Source, SourceReport
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.extractor import schema_util
from datahub.metadata.com.linkedin.pegasus2avro.common import Status
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import DatasetSnapshot
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    KafkaSchema,
    SchemaField,
    SchemaMetadata,
)
from datahub.metadata.schema_classes import BrowsePathsClass
from datahub.configuration.import_resolver import pydantic_resolve_key

logger = logging.getLogger(__name__)


class KafkaSourceConfig(ConfigModel):
    env: str = DEFAULT_ENV
    # TODO: inline the connection config
    connection: KafkaConsumerConnectionConfig = KafkaConsumerConnectionConfig()
    topic_patterns: AllowDenyPattern = AllowDenyPattern(allow=[".*"], deny=["^_.*"])


@dataclass
class KafkaSourceReport(SourceReport):
    topics_scanned: int = 0
    filtered: List[str] = field(default_factory=list)

    def report_topic_scanned(self, topic: str) -> None:
        self.topics_scanned += 1

    def report_dropped(self, topic: str) -> None:
        self.filtered.append(topic)


@dataclass
class KafkaSource(Source):
    source_config: KafkaSourceConfig
    consumer: confluent_kafka.Consumer
    report: KafkaSourceReport

    def __init__(self, config: KafkaSourceConfig, ctx: PipelineContext):
        super().__init__(ctx)
        self.source_config = config
        self.consumer = confluent_kafka.Consumer(
            {
                "group.id": "test",
                "bootstrap.servers": self.source_config.connection.bootstrap,
                **self.source_config.connection.consumer_config,
            }
        )
        logger.info(f"Entering modified kafka.py {self.source_config.connection.schema_registry_class}")
        """
        schema_registry_class = "datahub.ingestion.source.ConfluentSchemaRegistry"
        if(self.source_config.connection.schema_registry_class != "confluent"):
            self.schema_registry_client =  SchemaRegistryClient(
                {"url": self.source_config.connection.schema_registry_url}
            )
        else:
            self.source_config.connection.schema_registry_class
        """
        self.schema_registry_client = pydantic_resolve_key(self.source_config.connection.schema_registry_class)
        self.report = KafkaSourceReport()

    @classmethod
    def create(cls, config_dict, ctx):
        config = KafkaSourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_workunits(self) -> Iterable[MetadataWorkUnit]:
        topics = self.consumer.list_topics().topics
        for t in topics:
            self.report.report_topic_scanned(t)

            if self.source_config.topic_patterns.allowed(t):
                mce = self._extract_record(t)
                wu = MetadataWorkUnit(id=f"kafka-{t}", mce=mce)
                self.report.report_workunit(wu)
                yield wu
            else:
                self.report.report_dropped(t)

    def _extract_record(self, topic: str) -> MetadataChangeEvent:
        logger.debug(f"topic = {topic}")
        platform = "kafka"
        dataset_name = topic

        dataset_snapshot = DatasetSnapshot(
            urn=f"urn:li:dataset:(urn:li:dataPlatform:{platform},{dataset_name},{self.source_config.env})",
            aspects=[],  # we append to this list later on
        )
        dataset_snapshot.aspects.append(Status(removed=False))

        logger.info(f"self.schema_registry_client -> {type(self.schema_registry_client)}")
        # Pass control to pluggable schema registry to get
        key_value_schema = self.schema_registry_client.get_topic_schema(topic)
        schema: Optional[Schema] = key_value_schema.value_schema
        key_schema: Optional[Schema] = key_value_schema.key_schema

        # Parse the schema
        fields: List[SchemaField] = []
        if schema and schema.schema_type == "AVRO":
            # "value.id" or "value.[type=string]id"
            fields = schema_util.avro_schema_to_mce_fields(schema.schema_str)
        elif schema is not None:
            self.report.report_warning(
                topic,
                f"Parsing kafka schema type {schema.schema_type} is currently not implemented",
            )

        try:
            registered_schema = self.schema_registry_client.get_latest_version(
                topic + "-key"
            )
            key_schema = registered_schema.schema
        except Exception as e:
            # do not report warnings because it is okay to not have key schemas
            logger.debug(f"{topic}: no key schema found. {e}")
            pass

        # Parse the key schema
        key_fields: List[SchemaField] = []
        if key_schema and key_schema.schema_type == "AVRO":
            key_fields = schema_util.avro_schema_to_mce_fields(
                key_schema.schema_str, is_key_schema=True
            )
        elif key_schema is not None:
            self.report.report_warning(
                topic,
                f"Parsing kafka schema type {key_schema.schema_type} is currently not implemented",
            )

        key_schema_str: Optional[str] = None
        if schema is not None or key_schema is not None:
            # create a merged string for the combined schemas and compute an md5 hash across
            schema_as_string = schema.schema_str if schema is not None else ""
            schema_as_string = (
                schema_as_string + key_schema.schema_str
                if key_schema is not None
                else ""
            )
            md5_hash = md5(schema_as_string.encode()).hexdigest()

            if key_schema:
                key_schema_str = key_schema.schema_str

            schema_metadata = SchemaMetadata(
                schemaName=topic,
                version=0,
                hash=md5_hash,
                platform=f"urn:li:dataPlatform:{platform}",
                platformSchema=KafkaSchema(
                    documentSchema=schema.schema_str if schema is not None else "",
                    keySchema=key_schema_str,
                ),
                fields=key_fields + fields,
            )
            dataset_snapshot.aspects.append(schema_metadata)

        browse_path = BrowsePathsClass(
            [f"/{self.source_config.env.lower()}/{platform}/{topic}"]
        )
        dataset_snapshot.aspects.append(browse_path)

        metadata_record = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
        return metadata_record

    def get_report(self):
        return self.report

    def close(self):
        if self.consumer:
            self.consumer.close()

@dataclass
class TopicSchema:
    key_schema: Optional[Schema]
    value_schema: Optional[Schema]


class ConfluentSchemaRegistry():

    def __init__(self):
        self.schema_registry_client = SchemaRegistryClient(
            {"url": schema_url}
        )

    def get_topic_schema(self, topic: str) -> TopicSchema:
        """

        :param topic:
        :return:
        """
        logger.info(f"ConfluentSchemaRegistry.get_topic_schema {topic}")
        schema: Optional[Schema] = None
        try:
            registered_schema = self.schema_registry_client.get_latest_version(
                topic + "-value"
            )
            schema = registered_schema.schema
        except Exception as e:
            logger.debug(f"{topic}: no schema found. {e}")

        # Fetch key schema from the registry
        key_schema: Optional[Schema] = None
        try:
            registered_schema = self.schema_registry_client.get_latest_version(
                topic + "-key"
            )
            key_schema = registered_schema.schema
        except Exception as e:
            # do not report warnings because it is okay to not have key schemas
            logger.debug(f"{topic}: no key schema found. {e}")

        return TopicSchema(key_schema=key_schema, value_schema=schema)