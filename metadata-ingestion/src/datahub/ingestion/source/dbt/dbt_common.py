import itertools
import logging
import re
from abc import abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import auto
from typing import Any, Dict, Iterable, List, Optional, Tuple

import pydantic
from pydantic import root_validator, validator
from pydantic.fields import Field

from datahub.configuration.common import (
    AllowDenyPattern,
    ConfigEnum,
    ConfigModel,
    ConfigurationError,
    LineageConfig,
)
from datahub.configuration.source_common import DatasetSourceConfigMixin
from datahub.configuration.validate_field_deprecation import pydantic_field_deprecated
from datahub.emitter import mce_builder
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (
    SourceCapability,
    SupportStatus,
    capability,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.source import MetadataWorkUnitProcessor
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.common.subtypes import DatasetSubTypes
from datahub.ingestion.source.dbt.dbt_tests import (
    DBTTest,
    DBTTestResult,
    make_assertion_from_test,
    make_assertion_result_from_test,
)
from datahub.ingestion.source.sql.sql_types import (
    ATHENA_SQL_TYPES_MAP,
    BIGQUERY_TYPES_MAP,
    POSTGRES_TYPES_MAP,
    SNOWFLAKE_TYPES_MAP,
    SPARK_SQL_TYPES_MAP,
    TRINO_SQL_TYPES_MAP,
    VERTICA_SQL_TYPES_MAP,
    resolve_athena_modified_type,
    resolve_postgres_modified_type,
    resolve_trino_modified_type,
    resolve_vertica_modified_type,
)
from datahub.ingestion.source.state.stale_entity_removal_handler import (
    StaleEntityRemovalHandler,
    StaleEntityRemovalSourceReport,
    StatefulStaleMetadataRemovalConfig,
)
from datahub.ingestion.source.state.stateful_ingestion_base import (
    StatefulIngestionConfigBase,
    StatefulIngestionSourceBase,
)
from datahub.metadata.com.linkedin.pegasus2avro.common import (
    AuditStamp,
    GlossaryTermAssociation,
)
from datahub.metadata.com.linkedin.pegasus2avro.dataset import (
    DatasetLineageTypeClass,
    UpstreamClass,
    UpstreamLineage,
)
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import DatasetSnapshot
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    BooleanTypeClass,
    DateTypeClass,
    MySqlDDL,
    NullTypeClass,
    NumberTypeClass,
    RecordType,
    SchemaField,
    SchemaFieldDataType,
    SchemaMetadata,
    StringTypeClass,
    TimeTypeClass,
)
from datahub.metadata.schema_classes import (
    DataPlatformInstanceClass,
    DatasetPropertiesClass,
    GlobalTagsClass,
    GlossaryTermsClass,
    OwnerClass,
    OwnershipClass,
    OwnershipSourceTypeClass,
    OwnershipTypeClass,
    StatusClass,
    SubTypesClass,
    TagAssociationClass,
    UpstreamLineageClass,
    ViewPropertiesClass,
)
from datahub.specific.dataset import DatasetPatchBuilder
from datahub.utilities.mapping import Constants, OperationProcessor
from datahub.utilities.sqlglot_lineage import SchemaResolver, sqlglot_lineage
from datahub.utilities.time import datetime_to_ts_millis
from datahub.utilities.topological_sort import topological_sort

logger = logging.getLogger(__name__)
DBT_PLATFORM = "dbt"


@dataclass
class DBTSourceReport(StaleEntityRemovalSourceReport):
    pass


class EmitDirective(ConfigEnum):
    """A holder for directives for emission for specific types of entities"""

    YES = auto()  # Okay to emit for this type
    NO = auto()  # Do not emit for this type
    ONLY = auto()  # Only emit metadata for this type and no others


class DBTEntitiesEnabled(ConfigModel):
    """Controls which dbt entities are going to be emitted by this source"""

    models: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for dbt models when set to Yes or Only",
    )
    sources: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for dbt sources when set to Yes or Only",
    )
    seeds: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for dbt seeds when set to Yes or Only",
    )
    snapshots: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for dbt snapshots when set to Yes or Only",
    )
    test_definitions: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for test definitions when enabled when set to Yes or Only",
    )

    test_results: EmitDirective = Field(
        EmitDirective.YES,
        description="Emit metadata for test results when set to Yes or Only",
    )

    @root_validator
    def process_only_directive(cls, values):
        # Checks that at most one is set to ONLY, and then sets the others to NO.

        only_values = [k for k in values if values.get(k) == EmitDirective.ONLY]
        if len(only_values) > 1:
            raise ValueError(
                f"Cannot have more than 1 type of entity emission set to ONLY. Found {only_values}"
            )

        if len(only_values) == 1:
            for k in values:
                values[k] = EmitDirective.NO
            values[only_values[0]] = EmitDirective.YES

        return values

    def can_emit_node_type(self, node_type: str) -> bool:
        # Node type comes from dbt's node types.

        node_type_allow_map = {
            "model": self.models,
            "source": self.sources,
            "seed": self.seeds,
            "snapshot": self.snapshots,
            "test": self.test_definitions,
        }
        allowed = node_type_allow_map.get(node_type)
        if allowed is None:
            return False

        return allowed == EmitDirective.YES

    @property
    def can_emit_test_results(self) -> bool:
        return self.test_results == EmitDirective.YES


class DBTCommonConfig(
    StatefulIngestionConfigBase, DatasetSourceConfigMixin, LineageConfig
):
    env: str = Field(
        default=mce_builder.DEFAULT_ENV,
        description="Environment to use in namespace when constructing URNs.",
    )
    target_platform: str = Field(
        description="The platform that dbt is loading onto. (e.g. bigquery / redshift / postgres etc.)",
    )
    target_platform_instance: Optional[str] = Field(
        default=None,
        description="The platform instance for the platform that dbt is operating on. Use this if you have multiple instances of the same platform (e.g. redshift) and need to distinguish between them.",
    )
    use_identifiers: bool = Field(
        default=False,
        description="Use model identifier instead of model name if defined (if not, default to model name).",
    )
    _deprecate_use_identifiers = pydantic_field_deprecated(
        "use_identifiers", warn_if_value_is_not=False
    )

    entities_enabled: DBTEntitiesEnabled = Field(
        DBTEntitiesEnabled(),
        description="Controls for enabling / disabling metadata emission for different dbt entities (models, test definitions, test results, etc.)",
    )
    tag_prefix: str = Field(
        default=f"{DBT_PLATFORM}:", description="Prefix added to tags during ingestion."
    )
    node_name_pattern: AllowDenyPattern = Field(
        default=AllowDenyPattern.allow_all(),
        description="regex patterns for dbt model names to filter in ingestion.",
    )
    meta_mapping: Dict = Field(
        default={},
        description="mapping rules that will be executed against dbt meta properties. Refer to the section below on dbt meta automated mappings.",
    )
    column_meta_mapping: Dict = Field(
        default={},
        description="mapping rules that will be executed against dbt column meta properties. Refer to the section below on dbt meta automated mappings.",
    )
    enable_meta_mapping = Field(
        default=True,
        description="When enabled, applies the mappings that are defined through the meta_mapping directives.",
    )
    query_tag_mapping: Dict = Field(
        default={},
        description="mapping rules that will be executed against dbt query_tag meta properties. Refer to the section below on dbt meta automated mappings.",
    )
    enable_query_tag_mapping = Field(
        default=True,
        description="When enabled, applies the mappings that are defined through the `query_tag_mapping` directives.",
    )
    write_semantics: str = Field(
        # TODO: Replace with the WriteSemantics enum.
        default="PATCH",
        description='Whether the new tags, terms and owners to be added will override the existing ones added only by this source or not. Value for this config can be "PATCH" or "OVERRIDE"',
    )
    strip_user_ids_from_email: bool = Field(
        default=False,
        description="Whether or not to strip email id while adding owners using dbt meta actions.",
    )
    enable_owner_extraction: bool = Field(
        default=True,
        description="When enabled, ownership info will be extracted from the dbt meta",
    )
    owner_extraction_pattern: Optional[str] = Field(
        default=None,
        description='Regex string to extract owner from the dbt node using the `(?P<name>...) syntax` of the [match object](https://docs.python.org/3/library/re.html#match-objects), where the group name must be `owner`. Examples: (1)`r"(?P<owner>(.*)): (\\w+) (\\w+)"` will extract `jdoe` as the owner from `"jdoe: John Doe"` (2) `r"@(?P<owner>(.*))"` will extract `alice` as the owner from `"@alice"`.',
    )

    include_env_in_assertion_guid: bool = Field(
        default=False,
        description="Prior to version 0.9.4.2, the assertion GUIDs did not include the environment. If you're using multiple dbt ingestion "
        "that are only distinguished by env, then you should set this flag to True.",
    )
    stateful_ingestion: Optional[StatefulStaleMetadataRemovalConfig] = pydantic.Field(
        default=None, description="DBT Stateful Ingestion Config."
    )
    convert_column_urns_to_lowercase: bool = Field(
        default=False,
        description="When enabled, converts column URNs to lowercase to ensure cross-platform compatibility. "
        "If `target_platform` is Snowflake, the default is True.",
    )
    use_compiled_code: bool = Field(
        default=False,
        description="When enabled, uses the compiled dbt code instead of the raw dbt node definition.",
    )
    test_warnings_are_errors: bool = Field(
        default=False,
        description="When enabled, dbt test warnings will be treated as failures.",
    )
    infer_dbt_schemas: bool = Field(
        default=True,
        description="When enabled, schemas will be inferred from the dbt node definition.",
    )

    @validator("target_platform")
    def validate_target_platform_value(cls, target_platform: str) -> str:
        if target_platform.lower() == DBT_PLATFORM:
            raise ValueError(
                "target_platform cannot be dbt. It should be the platform which dbt is operating on top of. For e.g "
                "postgres."
            )
        return target_platform

    @root_validator(pre=True)
    def set_convert_column_urns_to_lowercase_default_for_snowflake(
        cls, values: dict
    ) -> dict:
        if values.get("target_platform", "").lower() == "snowflake":
            values.setdefault("convert_column_urns_to_lowercase", True)
        return values

    @validator("write_semantics")
    def validate_write_semantics(cls, write_semantics: str) -> str:
        if write_semantics.lower() not in {"patch", "override"}:
            raise ValueError(
                "write_semantics cannot be any other value than PATCH or OVERRIDE. Default value is PATCH. "
                "For PATCH semantics consider using the datahub-rest sink or "
                "provide a datahub_api: configuration on your ingestion recipe"
            )
        return write_semantics

    @validator("meta_mapping")
    def meta_mapping_validator(
        cls, meta_mapping: Dict[str, Any], values: Dict, **kwargs: Any
    ) -> Dict[str, Any]:
        for k, v in meta_mapping.items():
            if "match" not in v:
                raise ValueError(
                    f"meta_mapping section {k} doesn't have a match clause."
                )
            if "operation" not in v:
                raise ValueError(
                    f"meta_mapping section {k} doesn't have an operation clause."
                )
            if v["operation"] == "add_owner":
                owner_category = v["config"].get("owner_category")
                if owner_category:
                    allowed_categories = [
                        value
                        for name, value in vars(OwnershipTypeClass).items()
                        if not name.startswith("_")
                    ]
                    if (owner_category.upper()) not in allowed_categories:
                        raise ValueError(
                            f"Owner category {owner_category} is not one of {allowed_categories}"
                        )
        return meta_mapping


@dataclass
class DBTColumn:
    name: str
    comment: str
    description: str
    index: int
    data_type: str

    meta: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)

    datahub_data_type: Optional[SchemaFieldDataType] = None


@dataclass
class DBTNode:
    """
    The DBTNode is generated by joining data from the manifest and catalog files.
    It can contain source/model/seed/test nodes, and models can have a variety of
    materialization types.
    """

    database: Optional[str]
    schema: Optional[str]
    name: str  # name, identifier
    alias: Optional[str]  # alias if present
    comment: str
    description: str
    language: Optional[str]
    raw_code: Optional[str]

    dbt_adapter: str
    dbt_name: str
    dbt_file_path: Optional[str]

    node_type: str  # source, model, snapshot, seed, test, etc
    max_loaded_at: Optional[datetime]
    materialization: Optional[str]  # table, view, ephemeral, incremental, snapshot
    # see https://docs.getdbt.com/reference/artifacts/manifest-json
    catalog_type: Optional[str]

    owner: Optional[str]

    columns: List[DBTColumn] = field(default_factory=list)
    upstream_nodes: List[str] = field(default_factory=list)

    meta: Dict[str, Any] = field(default_factory=dict)
    query_tag: Dict[str, Any] = field(default_factory=dict)

    tags: List[str] = field(default_factory=list)
    compiled_code: Optional[str] = None

    test_info: Optional["DBTTest"] = None  # only populated if node_type == 'test'
    test_result: Optional["DBTTestResult"] = None

    def get_db_fqn(self) -> str:
        if self.database:
            fqn = f"{self.database}.{self.schema}.{self.name}"
        else:
            fqn = f"{self.schema}.{self.name}"
        return fqn.replace('"', "")

    def get_urn(
        self,
        target_platform: str,
        env: str,
        data_platform_instance: Optional[str],
    ) -> str:
        db_fqn = self.get_db_fqn()
        if target_platform != DBT_PLATFORM:
            db_fqn = db_fqn.lower()
        return mce_builder.make_dataset_urn_with_platform_instance(
            platform=target_platform,
            name=db_fqn,
            platform_instance=data_platform_instance,
            env=env,
        )

    @property
    def exists_in_target_platform(self):
        return not (self.materialization == "ephemeral" or self.node_type == "test")

    def merge_schema_fields(self, schema_fields: List[SchemaField]) -> None:
        """
        Merges the schema fields into the DBTNode.

        This will prefer the dbt columns info over the schema metadata info.
        """

        if self.columns:
            # If we already have columns, don't overwrite them.
            # TODO maybe we should augment them instead?
            return

        self.columns = [
            DBTColumn(
                name=schema_field.fieldPath,
                comment="",
                description="",
                index=i,
                data_type=schema_field.nativeDataType,
                datahub_data_type=schema_field.type,
            )
            for i, schema_field in enumerate(schema_fields)
        ]


def get_custom_properties(node: DBTNode) -> Dict[str, str]:
    # initialize custom properties to node's meta props
    # (dbt-native node properties)
    custom_properties = node.meta

    # additional node attributes to extract to custom properties
    node_attributes = {
        "node_type": node.node_type,
        "materialization": node.materialization,
        "dbt_file_path": node.dbt_file_path,
        "catalog_type": node.catalog_type,
        "language": node.language,
        "dbt_unique_id": node.dbt_name,
    }

    for attribute, node_attribute_value in node_attributes.items():
        if node_attribute_value is not None:
            custom_properties[attribute] = node_attribute_value

    custom_properties = {key: str(value) for key, value in custom_properties.items()}

    return custom_properties


def get_upstreams(
    upstreams: List[str],
    all_nodes: Dict[str, DBTNode],
    target_platform: str,
    target_platform_instance: Optional[str],
    environment: str,
    platform_instance: Optional[str],
) -> List[str]:
    upstream_urns = []

    for upstream in sorted(upstreams):
        if upstream not in all_nodes:
            logger.debug(
                f"Upstream node - {upstream} not found in all manifest entities."
            )
            continue

        upstream_manifest_node = all_nodes[upstream]

        # This logic creates lineages among dbt nodes.
        platform_value = DBT_PLATFORM
        platform_instance_value = platform_instance

        materialized = upstream_manifest_node.materialization

        if materialized in {"view", "table", "incremental", "snapshot"}:
            # upstream urns point to the target platform
            platform_value = target_platform
            platform_instance_value = target_platform_instance

        upstream_urns.append(
            upstream_manifest_node.get_urn(
                platform_value,
                environment,
                platform_instance_value,
            )
        )
    return upstream_urns


def get_upstream_lineage(upstream_urns: List[str]) -> UpstreamLineage:
    ucl: List[UpstreamClass] = []

    for dep in upstream_urns:
        uc = UpstreamClass(
            dataset=dep,
            type=DatasetLineageTypeClass.TRANSFORMED,
        )
        uc.auditStamp.time = int(datetime.utcnow().timestamp() * 1000)
        ucl.append(uc)

    return UpstreamLineage(upstreams=ucl)


# See https://github.com/fishtown-analytics/dbt/blob/master/core/dbt/adapters/sql/impl.py
_field_type_mapping = {
    "boolean": BooleanTypeClass,
    "date": DateTypeClass,
    "time": TimeTypeClass,
    "numeric": NumberTypeClass,
    "text": StringTypeClass,
    "timestamp with time zone": DateTypeClass,
    "timestamp without time zone": DateTypeClass,
    "integer": NumberTypeClass,
    "float8": NumberTypeClass,
    "struct": RecordType,
    **POSTGRES_TYPES_MAP,
    **SNOWFLAKE_TYPES_MAP,
    **BIGQUERY_TYPES_MAP,
    **SPARK_SQL_TYPES_MAP,
    **TRINO_SQL_TYPES_MAP,
    **ATHENA_SQL_TYPES_MAP,
    **VERTICA_SQL_TYPES_MAP,
}


def get_column_type(
    report: DBTSourceReport, dataset_name: str, column_type: str, dbt_adapter: str
) -> SchemaFieldDataType:
    """
    Maps known DBT types to datahub types
    """
    TypeClass: Any = _field_type_mapping.get(column_type)

    if TypeClass is None:
        # resolve a modified type
        if dbt_adapter == "trino":
            TypeClass = resolve_trino_modified_type(column_type)
        elif dbt_adapter == "athena":
            TypeClass = resolve_athena_modified_type(column_type)
        elif dbt_adapter == "postgres" or dbt_adapter == "redshift":
            # Redshift uses a variant of Postgres, so we can use the same logic.
            TypeClass = resolve_postgres_modified_type(column_type)
        elif dbt_adapter == "vertica":
            TypeClass = resolve_vertica_modified_type(column_type)

    # if still not found, report the warning
    if TypeClass is None:
        report.report_warning(
            dataset_name, f"unable to map type {column_type} to metadata schema"
        )
        TypeClass = NullTypeClass

    return SchemaFieldDataType(type=TypeClass())


@platform_name("dbt")
@config_class(DBTCommonConfig)
@support_status(SupportStatus.CERTIFIED)
@capability(SourceCapability.DELETION_DETECTION, "Enabled via stateful ingestion")
@capability(SourceCapability.LINEAGE_COARSE, "Enabled by default")
class DBTSourceBase(StatefulIngestionSourceBase):
    def __init__(self, config: DBTCommonConfig, ctx: PipelineContext, platform: str):
        super().__init__(config, ctx)
        self.config = config
        self.platform: str = platform
        self.report: DBTSourceReport = DBTSourceReport()
        self.compiled_owner_extraction_pattern: Optional[Any] = None
        if self.config.owner_extraction_pattern:
            self.compiled_owner_extraction_pattern = re.compile(
                self.config.owner_extraction_pattern
            )
        # Create and register the stateful ingestion use-case handler.
        self.stale_entity_removal_handler = StaleEntityRemovalHandler.create(
            self, self.config, ctx
        )

    def create_test_entity_mcps(
        self,
        test_nodes: List[DBTNode],
        custom_props: Dict[str, str],
        all_nodes_map: Dict[str, DBTNode],
    ) -> Iterable[MetadataWorkUnit]:
        for node in sorted(test_nodes, key=lambda n: n.dbt_name):
            assertion_urn = mce_builder.make_assertion_urn(
                mce_builder.datahub_guid(
                    {
                        k: v
                        for k, v in {
                            "platform": DBT_PLATFORM,
                            "name": node.dbt_name,
                            "instance": self.config.platform_instance,
                            **(
                                # Ideally we'd include the env unconditionally. However, we started out
                                # not including env in the guid, so we need to maintain backwards compatibility
                                # with existing PROD assertions.
                                {"env": self.config.env}
                                if self.config.env != mce_builder.DEFAULT_ENV
                                and self.config.include_env_in_assertion_guid
                                else {}
                            ),
                        }.items()
                        if v is not None
                    }
                )
            )

            if self.config.entities_enabled.can_emit_node_type("test"):
                yield MetadataChangeProposalWrapper(
                    entityUrn=assertion_urn,
                    aspect=DataPlatformInstanceClass(
                        platform=mce_builder.make_data_platform_urn(DBT_PLATFORM)
                    ),
                ).as_workunit()

            upstream_urns = get_upstreams(
                upstreams=node.upstream_nodes,
                all_nodes=all_nodes_map,
                target_platform=self.config.target_platform,
                target_platform_instance=self.config.target_platform_instance,
                environment=self.config.env,
                platform_instance=None,
            )

            for upstream_urn in sorted(upstream_urns):
                if self.config.entities_enabled.can_emit_node_type("test"):
                    yield make_assertion_from_test(
                        custom_props,
                        node,
                        assertion_urn,
                        upstream_urn,
                    )

                if node.test_result:
                    if self.config.entities_enabled.can_emit_test_results:
                        yield make_assertion_result_from_test(
                            node,
                            assertion_urn,
                            upstream_urn,
                            test_warnings_are_errors=self.config.test_warnings_are_errors,
                        )
                    else:
                        logger.debug(
                            f"Skipping test result {node.name} emission since it is turned off."
                        )

    @abstractmethod
    def load_nodes(self) -> Tuple[List[DBTNode], Dict[str, Optional[str]]]:
        # return dbt nodes + global custom properties
        raise NotImplementedError()

    def get_workunit_processors(self) -> List[Optional[MetadataWorkUnitProcessor]]:
        return [
            *super().get_workunit_processors(),
            self.stale_entity_removal_handler.workunit_processor,
        ]

    def get_workunits_internal(self) -> Iterable[MetadataWorkUnit]:
        if self.config.write_semantics == "PATCH":
            self.ctx.require_graph("Using dbt with write_semantics=PATCH")
        if self.config.infer_dbt_schemas:
            self.ctx.require_graph("Using dbt with infer_dbt_schemas=True")

        all_nodes, additional_custom_props = self.load_nodes()

        all_nodes_map = {node.dbt_name: node for node in all_nodes}
        additional_custom_props_filtered = {
            key: value
            for key, value in additional_custom_props.items()
            if value is not None
        }

        inferred_schemas = self._infer_schemas_and_update_cll(all_nodes_map)

        nodes = self._filter_nodes(all_nodes)
        non_test_nodes = [
            dataset_node for dataset_node in nodes if dataset_node.node_type != "test"
        ]
        test_nodes = [test_node for test_node in nodes if test_node.node_type == "test"]

        yield from self.create_platform_mces(
            non_test_nodes,
            additional_custom_props_filtered,
            all_nodes_map,
            DBT_PLATFORM,
            self.config.platform_instance,
        )

        yield from self.create_platform_mces(
            non_test_nodes,
            additional_custom_props_filtered,
            all_nodes_map,
            self.config.target_platform,
            self.config.target_platform_instance,
        )

        yield from self.create_test_entity_mcps(
            test_nodes,
            additional_custom_props_filtered,
            all_nodes_map,
        )

    def _filter_nodes(self, all_nodes: List[DBTNode]) -> List[DBTNode]:
        nodes = []
        for node in all_nodes:
            key = node.dbt_name

            if not self.config.node_name_pattern.allowed(key):
                continue

            nodes.append(node)

        return nodes

    def _infer_schemas_and_update_cll(
        self, all_nodes_map: Dict[str, DBTNode]
    ) -> Dict[str, SchemaMetadata]:
        if not self.config.infer_dbt_schemas:
            return {}

        graph = self.ctx.require_graph("Using dbt with infer_dbt_schemas")

        # TODO: maybe write these to the nodes directly?
        schemas: Dict[str, SchemaMetadata] = {}
        schema_resolver = SchemaResolver(
            platform=self.config.target_platform,
            platform_instance=self.config.target_platform_instance,
            env=self.config.env,
        )

        # TODO maintain bidict of dbt node name <-> target platform urn

        # TODO: only process non-test nodes here

        # Iterate over the dbt nodes in topological order.
        # This ensures that we process upstream nodes before downstream nodes.
        for dbt_name in topological_sort(
            list(all_nodes_map.keys()),
            edges=list(
                itertools.chain.from_iterable(
                    [(upstream, node.dbt_name) for upstream in node.upstream_nodes]
                    for node in all_nodes_map.values()
                )
            ),
        ):
            node = all_nodes_map[dbt_name]

            dbt_node_urn = node.get_urn(
                DBT_PLATFORM, self.config.env, self.config.platform_instance
            )
            if node.exists_in_target_platform:
                target_node_urn = node.get_urn(
                    self.config.target_platform,
                    self.config.env,
                    self.config.target_platform_instance,
                )
            else:
                target_node_urn = None

            # Fetch the schema from the graph if possible.
            schema_fields: Optional[List[SchemaField]] = None
            if target_node_urn:
                schema_metadata = graph.get_aspect(target_node_urn, SchemaMetadata)
                if schema_metadata:
                    schema_fields = schema_metadata.fields

            # Run sql parser to infer the schema + generate column lineage.
            sql_result = None
            if node.compiled_code:
                sql_result = sqlglot_lineage(
                    node.compiled_code, schema_resolver=schema_resolver
                )

            # TODO when saving the lineage info, drop transitive deps

            # If we didn't fetch the schema from the graph, use the inferred schema.
            if not schema_fields and sql_result and sql_result.column_lineage:
                schema_fields = [
                    SchemaField(
                        fieldPath=column_lineage.downstream.column,
                        type=column_lineage.downstream.column_type
                        or SchemaFieldDataType(type=NullTypeClass()),
                        nativeDataType="",
                    )
                    for column_lineage in sql_result.column_lineage
                ]

            # Merge the schema fields into the dbt node.
            if schema_fields:
                node.merge_schema_fields(schema_fields)

            # Add the node to the schema resolver, so that CLL works for
            # downstream nodes.
            if target_node_urn and node.columns:
                schema_resolver.add_raw_schema_info(
                    target_node_urn,
                    {
                        # TODO: This raw type logic is a bit hacky.
                        column.name: str(column.datahub_data_type.type)
                        if column.datahub_data_type
                        else column.data_type
                        for column in node.columns
                    },
                )

        return schemas

    def create_platform_mces(
        self,
        dbt_nodes: List[DBTNode],
        additional_custom_props_filtered: Dict[str, str],
        all_nodes_map: Dict[str, DBTNode],
        mce_platform: str,
        mce_platform_instance: Optional[str],
    ) -> Iterable[MetadataWorkUnit]:
        """
        This function creates mce based out of dbt nodes. Since dbt ingestion creates "dbt" nodes
        and nodes for underlying platform the function gets called twice based on the mce_platform
        parameter. Further, this function takes specific actions based on the mce_platform passed in.
        It creates platform entities with all metadata information.
        """
        action_processor = OperationProcessor(
            self.config.meta_mapping,
            self.config.tag_prefix,
            "SOURCE_CONTROL",
            self.config.strip_user_ids_from_email,
        )

        action_processor_tag = OperationProcessor(
            self.config.query_tag_mapping,
            self.config.tag_prefix,
            "SOURCE_CONTROL",
            self.config.strip_user_ids_from_email,
        )
        for node in sorted(dbt_nodes, key=lambda n: n.dbt_name):
            is_primary_source = mce_platform == DBT_PLATFORM
            node_datahub_urn = node.get_urn(
                mce_platform,
                self.config.env,
                mce_platform_instance,
            )
            if not self.config.entities_enabled.can_emit_node_type(node.node_type):
                logger.debug(
                    f"Skipping emission of node {node_datahub_urn} because node_type {node.node_type} is disabled"
                )
                continue
            if not is_primary_source:
                # We previously, erroneously added non-dbt nodes to the state object.
                # This call ensures that we don't try to soft-delete them after an
                # upgrade of acryl-datahub.
                self.stale_entity_removal_handler.add_urn_to_skip(node_datahub_urn)

            meta_aspects: Dict[str, Any] = {}
            if self.config.enable_meta_mapping and node.meta:
                meta_aspects = action_processor.process(node.meta)

            if self.config.enable_query_tag_mapping and node.query_tag:
                self.extract_query_tag_aspects(
                    action_processor_tag, meta_aspects, node
                )  # mutates meta_aspects

            if mce_platform == DBT_PLATFORM:
                aspects = self._generate_base_aspects(
                    node, additional_custom_props_filtered, mce_platform, meta_aspects
                )

                # add upstream lineage
                upstream_lineage_class = self._create_lineage_aspect_for_dbt_node(
                    node, all_nodes_map
                )
                if upstream_lineage_class:
                    aspects.append(upstream_lineage_class)

                # add view properties aspect
                view_prop_aspect = self._create_view_properties_aspect(node)
                if view_prop_aspect:
                    aspects.append(view_prop_aspect)

                # emit subtype mcp
                sub_type_wu = self._create_subType_wu(node, node_datahub_urn)
                if sub_type_wu:
                    yield sub_type_wu

            else:
                # We are creating empty node for platform and only add lineage/keyaspect.
                aspects = []
                if not node.exists_in_target_platform:
                    continue

                # This code block is run when we are generating entities of platform type.
                # We will not link the platform not to the dbt node for type "source" because
                # in this case the platform table existed first.
                if node.node_type != "source":
                    upstream_dbt_urn = node.get_urn(
                        DBT_PLATFORM,
                        self.config.env,
                        self.config.platform_instance,
                    )
                    upstreams_lineage_class = get_upstream_lineage([upstream_dbt_urn])
                    if self.config.incremental_lineage:
                        patch_builder: DatasetPatchBuilder = DatasetPatchBuilder(
                            urn=node_datahub_urn
                        )
                        for upstream in upstreams_lineage_class.upstreams:
                            patch_builder.add_upstream_lineage(upstream)

                        for mcp in patch_builder.build():
                            yield MetadataWorkUnit(
                                id=f"upstreamLineage-for-{node_datahub_urn}",
                                mcp_raw=mcp,
                                is_primary_source=is_primary_source,
                            )
                    else:
                        aspects.append(upstreams_lineage_class)

            if len(aspects) == 0:
                continue
            dataset_snapshot = DatasetSnapshot(urn=node_datahub_urn, aspects=aspects)
            mce = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
            if self.config.write_semantics == "PATCH":
                mce = self.get_patched_mce(mce)
            yield MetadataWorkUnit(
                id=dataset_snapshot.urn, mce=mce, is_primary_source=is_primary_source
            )

    def extract_query_tag_aspects(
        self,
        action_processor_tag: OperationProcessor,
        meta_aspects: Dict[str, Any],
        node: DBTNode,
    ) -> None:
        query_tag_aspects = action_processor_tag.process(node.query_tag)
        if "add_tag" in query_tag_aspects:
            if "add_tag" in meta_aspects:
                meta_aspects["add_tag"].tags.extend(query_tag_aspects["add_tag"].tags)
            else:
                meta_aspects["add_tag"] = query_tag_aspects["add_tag"]

    def get_aspect_from_dataset(
        self, dataset_snapshot: DatasetSnapshot, aspect_type: type
    ) -> Any:
        for aspect in dataset_snapshot.aspects:
            if isinstance(aspect, aspect_type):
                return aspect
        return None

    def get_patched_mce(self, mce):
        owner_aspect = self.get_aspect_from_dataset(
            mce.proposedSnapshot, OwnershipClass
        )
        if owner_aspect:
            transformed_owner_list = self.get_transformed_owners_by_source_type(
                owner_aspect.owners,
                mce.proposedSnapshot.urn,
                str(OwnershipSourceTypeClass.SOURCE_CONTROL),
            )
            owner_aspect.owners = transformed_owner_list

        tag_aspect = self.get_aspect_from_dataset(mce.proposedSnapshot, GlobalTagsClass)
        if tag_aspect:
            transformed_tag_list = self.get_transformed_tags_by_prefix(
                tag_aspect.tags,
                mce.proposedSnapshot.urn,
                mce_builder.make_tag_urn(self.config.tag_prefix),
            )
            tag_aspect.tags = transformed_tag_list

        term_aspect: GlossaryTermsClass = self.get_aspect_from_dataset(
            mce.proposedSnapshot, GlossaryTermsClass
        )
        if term_aspect:
            transformed_terms = self.get_transformed_terms(
                term_aspect.terms, mce.proposedSnapshot.urn
            )
            term_aspect.terms = transformed_terms
        return mce

    def _create_dataset_properties_aspect(
        self, node: DBTNode, additional_custom_props_filtered: Dict[str, str]
    ) -> DatasetPropertiesClass:
        description = node.description

        custom_props = {
            **get_custom_properties(node),
            **additional_custom_props_filtered,
        }
        dbt_properties = DatasetPropertiesClass(
            description=description,
            customProperties=custom_props,
            tags=node.tags,
            name=node.name,
        )
        dbt_properties.externalUrl = self.get_external_url(node)

        return dbt_properties

    @abstractmethod
    def get_external_url(self, node: DBTNode) -> Optional[str]:
        pass

    def _create_view_properties_aspect(
        self, node: DBTNode
    ) -> Optional[ViewPropertiesClass]:
        view_logic = (
            node.compiled_code if self.config.use_compiled_code else node.raw_code
        )

        if node.language != "sql" or not view_logic:
            return None

        materialized = node.materialization in {"table", "incremental", "snapshot"}
        view_properties = ViewPropertiesClass(
            materialized=materialized,
            viewLanguage="SQL",
            viewLogic=view_logic,
        )
        return view_properties

    def _generate_base_aspects(
        self,
        node: DBTNode,
        additional_custom_props_filtered: Dict[str, str],
        mce_platform: str,
        meta_aspects: Dict[str, Any],
    ) -> List[Any]:
        """
        There are some common aspects that get generated for both dbt node and platform node depending on whether dbt
        node creation is enabled or not.
        """

        # create an empty list of aspects and keep adding to it. Initializing with Any to avoid a
        # large union of aspect types.
        aspects: List[Any] = []

        # add dataset properties aspect
        dbt_properties = self._create_dataset_properties_aspect(
            node, additional_custom_props_filtered
        )
        aspects.append(dbt_properties)

        # add status aspect
        status = StatusClass(removed=False)
        aspects.append(status)
        # add owners aspect
        if self.config.enable_owner_extraction:
            # we need to aggregate owners added by meta properties and the owners that are coming from server.
            meta_owner_aspects = meta_aspects.get(Constants.ADD_OWNER_OPERATION)
            aggregated_owners = self._aggregate_owners(node, meta_owner_aspects)
            if aggregated_owners:
                aspects.append(OwnershipClass(owners=aggregated_owners))

        # add tags aspects
        meta_tags_aspect = meta_aspects.get(Constants.ADD_TAG_OPERATION)
        aggregated_tags = self._aggregate_tags(node, meta_tags_aspect)
        if aggregated_tags:
            aspects.append(
                mce_builder.make_global_tag_aspect_with_tag_list(aggregated_tags)
            )

        # add meta term aspects
        if (
            meta_aspects.get(Constants.ADD_TERM_OPERATION)
            and self.config.enable_meta_mapping
        ):
            aspects.append(meta_aspects.get(Constants.ADD_TERM_OPERATION))

        # add meta links aspect
        meta_links_aspect = meta_aspects.get(Constants.ADD_DOC_LINK_OPERATION)
        if meta_links_aspect and self.config.enable_meta_mapping:
            aspects.append(meta_links_aspect)

        # add schema metadata aspect
        schema_metadata = self.get_schema_metadata(self.report, node, mce_platform)
        aspects.append(schema_metadata)

        return aspects

    def get_schema_metadata(
        self, report: DBTSourceReport, node: DBTNode, platform: str
    ) -> SchemaMetadata:
        action_processor = OperationProcessor(
            self.config.column_meta_mapping,
            self.config.tag_prefix,
            "SOURCE_CONTROL",
            self.config.strip_user_ids_from_email,
        )

        # TODO if infer_dbt_schemas, load from saved schemas too

        canonical_schema: List[SchemaField] = []
        for column in node.columns:
            description = None

            if (
                column.comment
                and column.description
                and column.comment != column.description
            ):
                description = f"{platform} comment: {column.comment}\n\ndbt model description: {column.description}"
            elif column.comment:
                description = column.comment
            elif column.description:
                description = column.description

            meta_aspects: Dict[str, Any] = {}
            if self.config.enable_meta_mapping and column.meta:
                meta_aspects = action_processor.process(column.meta)

            if meta_aspects.get(Constants.ADD_OWNER_OPERATION):
                logger.warning("The add_owner operation is not supported for columns.")

            meta_tags: Optional[GlobalTagsClass] = meta_aspects.get(
                Constants.ADD_TAG_OPERATION
            )
            globalTags = None
            if meta_tags or column.tags:
                # Merge tags from meta mapping and column tags.
                globalTags = GlobalTagsClass(
                    tags=(meta_tags.tags if meta_tags else [])
                    + [
                        TagAssociationClass(mce_builder.make_tag_urn(tag))
                        for tag in column.tags
                    ]
                )

            glossaryTerms = None
            if meta_aspects.get(Constants.ADD_TERM_OPERATION):
                glossaryTerms = meta_aspects.get(Constants.ADD_TERM_OPERATION)

            field_name = column.name
            if self.config.convert_column_urns_to_lowercase:
                field_name = field_name.lower()

            field = SchemaField(
                fieldPath=field_name,
                nativeDataType=column.data_type,
                type=column.datahub_data_type
                or get_column_type(
                    report, node.dbt_name, column.data_type, node.dbt_adapter
                ),
                description=description,
                nullable=False,  # TODO: actually autodetect this
                recursive=False,
                globalTags=globalTags,
                glossaryTerms=glossaryTerms,
            )

            canonical_schema.append(field)

        last_modified = None
        if node.max_loaded_at is not None:
            actor = mce_builder.make_user_urn("dbt_executor")
            last_modified = AuditStamp(
                time=datetime_to_ts_millis(node.max_loaded_at),
                actor=actor,
            )

        return SchemaMetadata(
            schemaName=node.dbt_name,
            platform=mce_builder.make_data_platform_urn(platform),
            version=0,
            hash="",
            platformSchema=MySqlDDL(tableSchema=""),
            lastModified=last_modified,
            fields=canonical_schema,
        )

    def _aggregate_owners(
        self, node: DBTNode, meta_owner_aspects: Any
    ) -> List[OwnerClass]:
        owner_list: List[OwnerClass] = []
        if meta_owner_aspects and self.config.enable_meta_mapping:
            # we disregard owners generated from node.owner because that is also coming from the meta section
            owner_list = meta_owner_aspects.owners
        elif node.owner:
            owner: str = node.owner
            if self.compiled_owner_extraction_pattern:
                match: Optional[Any] = re.match(
                    self.compiled_owner_extraction_pattern, owner
                )
                if match:
                    owner = match.group("owner")
                    logger.debug(
                        f"Owner after applying owner extraction pattern:'{self.config.owner_extraction_pattern}' is '{owner}'."
                    )
            if self.config.strip_user_ids_from_email:
                owner = owner.split("@")[0]
                logger.debug(f"Owner (after stripping email):{owner}")

            owner_list.append(
                OwnerClass(
                    owner=mce_builder.make_user_urn(owner),
                    type=OwnershipTypeClass.DATAOWNER,
                )
            )

        owner_list = sorted(owner_list, key=lambda x: x.owner)
        return owner_list

    def _aggregate_tags(self, node: DBTNode, meta_tag_aspect: Any) -> List[str]:
        tags_list: List[str] = []
        if node.tags:
            tags_list = tags_list + node.tags
        if meta_tag_aspect and self.config.enable_meta_mapping:
            tags_list = tags_list + [
                tag_association.tag[len("urn:li:tag:") :]
                for tag_association in meta_tag_aspect.tags
            ]
        return sorted(tags_list)

    def _create_subType_wu(
        self, node: DBTNode, node_datahub_urn: str
    ) -> Optional[MetadataWorkUnit]:
        if not node.node_type:
            return None

        subtypes: List[str] = [node.node_type.capitalize()]
        if node.node_type == "source":
            # In the siblings association hook, we previously looked for an exact
            # match of "source" to determine if a node was a source. While we now
            # also check for a capitalized "Source" subtype, this maintains compatibility
            # with older GMS versions.
            subtypes.append("source")
        if node.materialization == "table":
            subtypes.append(DatasetSubTypes.TABLE)

        if node.node_type == "model" or node.node_type == "snapshot":
            # We need to add the view subtype so that the view properties tab shows up in the UI.
            subtypes.append(DatasetSubTypes.VIEW)

        return MetadataChangeProposalWrapper(
            entityUrn=node_datahub_urn,
            aspect=SubTypesClass(typeNames=subtypes),
        ).as_workunit()

    def _create_lineage_aspect_for_dbt_node(
        self,
        node: DBTNode,
        all_nodes_map: Dict[str, DBTNode],
    ) -> Optional[UpstreamLineageClass]:
        """
        This method creates lineage amongst dbt nodes. A dbt node can be linked to other dbt nodes or a platform node.
        """
        upstream_urns = get_upstreams(
            node.upstream_nodes,
            all_nodes_map,
            self.config.target_platform,
            self.config.target_platform_instance,
            self.config.env,
            self.config.platform_instance,
        )

        # if a node is of type source in dbt, its upstream lineage should have the corresponding table/view
        # from the platform. This code block is executed when we are generating entities of type "dbt".
        if node.node_type == "source":
            upstream_urns.append(
                node.get_urn(
                    self.config.target_platform,
                    self.config.env,
                    self.config.target_platform_instance,
                )
            )
        if upstream_urns:
            upstreams_lineage_class = get_upstream_lineage(upstream_urns)
            return upstreams_lineage_class
        return None

    # This method attempts to read-modify and return the owners of a dataset.
    # From the existing owners it will remove the owners that are of the source_type_filter and
    # then add all the new owners to that list.
    def get_transformed_owners_by_source_type(
        self, owners: List[OwnerClass], entity_urn: str, source_type_filter: str
    ) -> List[OwnerClass]:
        transformed_owners: List[OwnerClass] = []
        if owners:
            transformed_owners += owners
        if self.ctx.graph:
            existing_ownership = self.ctx.graph.get_ownership(entity_urn)
            if not existing_ownership or not existing_ownership.owners:
                return transformed_owners

            for existing_owner in existing_ownership.owners:
                if (
                    existing_owner.source
                    and existing_owner.source.type != source_type_filter
                ):
                    transformed_owners.append(existing_owner)
        return sorted(transformed_owners, key=self.owner_sort_key)

    def owner_sort_key(self, owner_class: OwnerClass) -> str:
        return str(owner_class)

    # This method attempts to read-modify and return the tags of a dataset.
    # From the existing tags it will remove the tags that have a prefix tags_prefix_filter and
    # then add all the new tags to that list.
    def get_transformed_tags_by_prefix(
        self,
        new_tags: List[TagAssociationClass],
        entity_urn: str,
        tags_prefix_filter: str,
    ) -> List[TagAssociationClass]:
        tag_set = set([new_tag.tag for new_tag in new_tags])

        if self.ctx.graph:
            existing_tags_class = self.ctx.graph.get_tags(entity_urn)
            if existing_tags_class and existing_tags_class.tags:
                for exiting_tag in existing_tags_class.tags:
                    if not exiting_tag.tag.startswith(tags_prefix_filter):
                        tag_set.add(exiting_tag.tag)
        return [TagAssociationClass(tag) for tag in sorted(tag_set)]

    # This method attempts to read-modify and return the glossary terms of a dataset.
    # This will combine all new and existing terms and return the final deduped list.
    def get_transformed_terms(
        self, new_terms: List[GlossaryTermAssociation], entity_urn: str
    ) -> List[GlossaryTermAssociation]:
        term_id_set = set([term.urn for term in new_terms])
        if self.ctx.graph:
            existing_terms_class = self.ctx.graph.get_glossary_terms(entity_urn)
            if existing_terms_class and existing_terms_class.terms:
                for existing_term in existing_terms_class.terms:
                    term_id_set.add(existing_term.urn)
        return [GlossaryTermAssociation(term_urn) for term_urn in sorted(term_id_set)]

    def get_report(self):
        return self.report
