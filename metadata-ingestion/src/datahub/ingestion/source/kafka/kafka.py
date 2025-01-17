import base64
import concurrent.futures
import io
import json
import logging
import math
import random
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any, Dict, Iterable, List, Optional, Set, Type, cast

import avro.io
import avro.schema
import confluent_kafka
import confluent_kafka.admin
import pydantic
from confluent_kafka.admin import (
    AdminClient,
    ConfigEntry,
    ConfigResource,
    TopicMetadata,
)
from confluent_kafka.schema_registry.schema_registry_client import SchemaRegistryClient

from datahub.configuration.common import AllowDenyPattern
from datahub.configuration.kafka import KafkaConsumerConnectionConfig
from datahub.configuration.kafka_consumer_config import CallableConsumerConfig
from datahub.configuration.source_common import (
    DatasetSourceConfigMixin,
    LowerCaseDatasetUrnConfigMixin,
)
from datahub.emitter import mce_builder
from datahub.emitter.mce_builder import (
    make_data_platform_urn,
    make_dataplatform_instance_urn,
    make_dataset_urn_with_platform_instance,
    make_domain_urn,
)
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.emitter.mcp_builder import add_domain_to_entity_wu
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (
    SupportStatus,
    capability,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.registry import import_path
from datahub.ingestion.api.source import (
    CapabilityReport,
    MetadataWorkUnitProcessor,
    SourceCapability,
    TestableSource,
    TestConnectionReport,
)
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.common.subtypes import DatasetSubTypes
from datahub.ingestion.source.ge_profiling_config import GEProfilingBaseConfig
from datahub.ingestion.source.kafka.kafka_schema_registry_base import (
    KafkaSchemaRegistryBase,
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
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import (
    BrowsePathsClass,
    CalendarIntervalClass,
    DataPlatformInstanceClass,
    DatasetFieldProfileClass,
    DatasetProfileClass,
    DatasetPropertiesClass,
    DatasetSnapshotClass,
    HistogramClass,
    KafkaSchemaClass,
    OwnershipSourceTypeClass,
    PartitionSpecClass,
    PartitionTypeClass,
    QuantileClass,
    SchemaMetadataClass,
    StatusClass,
    SubTypesClass,
    TimeWindowClass,
    TimeWindowSizeClass,
    ValueFrequencyClass,
)
from datahub.utilities.mapping import Constants, OperationProcessor
from datahub.utilities.registries.domain_registry import DomainRegistry
from datahub.utilities.str_enum import StrEnum

logger = logging.getLogger(__name__)


class KafkaTopicConfigKeys(StrEnum):
    MIN_INSYNC_REPLICAS_CONFIG = "min.insync.replicas"
    RETENTION_SIZE_CONFIG = "retention.bytes"
    RETENTION_TIME_CONFIG = "retention.ms"
    CLEANUP_POLICY_CONFIG = "cleanup.policy"
    MAX_MESSAGE_SIZE_CONFIG = "max.message.bytes"
    UNCLEAN_LEADER_ELECTION_CONFIG = "unclean.leader.election.enable"


@dataclass
class KafkaFieldStatistics:
    field_path: str
    sample_values: List[str]
    unique_count: int = 0
    unique_proportion: float = 0.0
    null_count: int = 0
    null_proportion: float = 0.0
    min_value: Optional[Any] = None
    max_value: Optional[Any] = None
    mean_value: Optional[float] = None
    median_value: Optional[Any] = None
    stdev: Optional[float] = None
    quantiles: Optional[List[QuantileClass]] = None
    distinct_value_frequencies: Optional[Dict[str, int]] = None
    data_type: Optional[str] = None

    def __post_init__(self):
        if self.distinct_value_frequencies is None:
            self.distinct_value_frequencies = {}
        if self.quantiles is None:
            self.quantiles = []
        if self.sample_values is None:
            self.sample_values = []


class ProfilerConfig(GEProfilingBaseConfig):
    sample_size: pydantic.PositiveInt = pydantic.Field(
        default=100,
        description="Number of messages to sample for profiling",
    )
    max_sample_time_seconds: pydantic.PositiveInt = pydantic.Field(
        default=60,
        description="Maximum time to spend sampling messages in seconds",
    )


class KafkaSourceConfig(
    StatefulIngestionConfigBase,
    DatasetSourceConfigMixin,
    LowerCaseDatasetUrnConfigMixin,
):
    connection: KafkaConsumerConnectionConfig = KafkaConsumerConnectionConfig()

    topic_patterns: AllowDenyPattern = AllowDenyPattern(allow=[".*"], deny=["^_.*"])
    domain: Dict[str, AllowDenyPattern] = pydantic.Field(
        default={},
        description="A map of domain names to allow deny patterns. Domains can be urn-based (`urn:li:domain:13ae4d85-d955-49fc-8474-9004c663a810`) or bare (`13ae4d85-d955-49fc-8474-9004c663a810`).",
    )
    topic_subject_map: Dict[str, str] = pydantic.Field(
        default={},
        description="Provides the mapping for the `key` and the `value` schemas of a topic to the corresponding schema registry subject name. Each entry of this map has the form `<topic_name>-key`:`<schema_registry_subject_name_for_key_schema>` and `<topic_name>-value`:`<schema_registry_subject_name_for_value_schema>` for the key and the value schemas associated with the topic, respectively. This parameter is mandatory when the [RecordNameStrategy](https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html#how-the-naming-strategies-work) is used as the subject naming strategy in the kafka schema registry. NOTE: When provided, this overrides the default subject name resolution even when the `TopicNameStrategy` or the `TopicRecordNameStrategy` are used.",
    )
    stateful_ingestion: Optional[StatefulStaleMetadataRemovalConfig] = None
    schema_registry_class: str = pydantic.Field(
        default="datahub.ingestion.source.confluent_schema_registry.ConfluentSchemaRegistry",
        description="The fully qualified implementation class(custom) that implements the KafkaSchemaRegistryBase interface.",
    )
    schema_tags_field: str = pydantic.Field(
        default="tags",
        description="The field name in the schema metadata that contains the tags to be added to the dataset.",
    )
    enable_meta_mapping: bool = pydantic.Field(
        default=True,
        description="When enabled, applies the mappings that are defined through the meta_mapping directives.",
    )
    meta_mapping: Dict = pydantic.Field(
        default={},
        description="mapping rules that will be executed against top-level schema properties. Refer to the section below on meta automated mappings.",
    )
    field_meta_mapping: Dict = pydantic.Field(
        default={},
        description="mapping rules that will be executed against field-level schema properties. Refer to the section below on meta automated mappings.",
    )
    strip_user_ids_from_email: bool = pydantic.Field(
        default=False,
        description="Whether or not to strip email id while adding owners using meta mappings.",
    )
    tag_prefix: str = pydantic.Field(
        default="", description="Prefix added to tags during ingestion."
    )
    ignore_warnings_on_schema_type: bool = pydantic.Field(
        default=False,
        description="Disables warnings reported for non-AVRO/Protobuf value or key schemas if set.",
    )
    disable_topic_record_naming_strategy: bool = pydantic.Field(
        default=False,
        description="Disables the utilization of the TopicRecordNameStrategy for Schema Registry subjects. For more information, visit: https://docs.confluent.io/platform/current/schema-registry/serdes-develop/index.html#handling-differences-between-preregistered-and-client-derived-schemas:~:text=io.confluent.kafka.serializers.subject.TopicRecordNameStrategy",
    )
    ingest_schemas_as_entities: bool = pydantic.Field(
        default=False,
        description="Enables ingesting schemas from schema registry as separate entities, in addition to the topics",
    )
    profiling: ProfilerConfig = pydantic.Field(
        default=ProfilerConfig(),
        description="Settings for message sampling and profiling",
    )


class KafkaProfiler:
    """Handles advanced profiling of Kafka message samples"""

    def __init__(self, profiler_config: ProfilerConfig):
        self.profiler_config = profiler_config

    def profile_samples(
        self,
        samples: List[Dict[str, Any]],
        schema_metadata: Optional[SchemaMetadataClass] = None,
    ) -> DatasetProfileClass:
        """Profile a collection of samples and generate statistics"""
        field_values: Dict[str, List[Any]] = {}
        key_field_path: Optional[str] = None

        # Extract key field path from schema if available
        if schema_metadata and schema_metadata.fields:
            key_field = next(
                (
                    field
                    for field in schema_metadata.fields
                    if field.fieldPath.endswith("[key=True]")
                ),
                None,
            )
            if key_field:
                key_field_path = key_field.fieldPath

        # Extract field values from samples
        for sample in samples:
            for field_name, value in sample.items():
                if field_name not in ("offset", "timestamp"):
                    # Map field name to schema field path if available
                    field_path = field_name
                    if schema_metadata and schema_metadata.fields:
                        if field_name == "key" and key_field_path:
                            field_path = key_field_path
                        else:
                            # Try to find matching schema field
                            clean_field = clean_field_path(
                                field_name, preserve_types=False
                            )
                            for schema_field in schema_metadata.fields:
                                if (
                                    clean_field_path(
                                        schema_field.fieldPath, preserve_types=False
                                    )
                                    == clean_field
                                ):
                                    field_path = schema_field.fieldPath
                                    break

                    if field_path not in field_values:
                        field_values[field_path] = []
                    field_values[field_path].append(value)

        field_stats = {}
        for field_name, values in field_values.items():
            field_stats[field_name] = self._process_field_statistics(
                field_path=field_name,
                values=values,
            )

        return self.create_profile_data(field_stats, len(samples))

    def _process_field_statistics(
        self,
        field_path: str,
        values: List[Any],
    ) -> KafkaFieldStatistics:
        """Calculate statistics for a single field based on profiling config"""
        total_count = len(values)
        non_null_values = [v for v in values if v is not None and v != ""]

        stats = KafkaFieldStatistics(
            field_path=field_path,
            sample_values=random.sample(
                [str(v) for v in non_null_values] if non_null_values else [""],
                min(3, len(non_null_values)) if non_null_values else 1,
            )
            if self.profiler_config.include_field_sample_values
            else [],
        )

        # Calculate null statistics - always calculate for all types
        if self.profiler_config.include_field_null_count:
            stats.null_count = total_count - len(non_null_values)
            stats.null_proportion = (
                stats.null_count / total_count if total_count > 0 else 0
            )

        # Calculate distinct value stats - always calculate for all types
        if self.profiler_config.include_field_distinct_count:
            value_counts: Dict[str, int] = {}
            for value in values:
                str_value = str(value)
                value_counts[str_value] = value_counts.get(str_value, 0) + 1

            stats.unique_count = len(value_counts)
            stats.unique_proportion = (
                stats.unique_count / total_count if total_count > 0 else 0
            )

        # Only calculate other statistics for numeric fields
        if non_null_values:
            try:
                numeric_values = [
                    float(v)
                    for v in non_null_values
                    if str(v).replace(".", "").isdigit()
                ]
                if numeric_values:
                    if self.profiler_config.include_field_min_value:
                        stats.min_value = min(numeric_values)
                    if self.profiler_config.include_field_max_value:
                        stats.max_value = max(numeric_values)
                    if self.profiler_config.include_field_mean_value:
                        stats.mean_value = sum(numeric_values) / len(numeric_values)
                    if self.profiler_config.include_field_median_value:
                        stats.median_value = sorted(numeric_values)[
                            len(numeric_values) // 2
                        ]

                    # Calculate standard deviation if enabled
                    if (
                        self.profiler_config.include_field_stddev_value
                        and len(numeric_values) > 1
                    ):
                        mean = stats.mean_value or 0
                        variance = sum((x - mean) ** 2 for x in numeric_values) / (
                            len(numeric_values) - 1
                        )
                        stats.stdev = math.sqrt(variance)

                    # Calculate quantiles if enabled
                    if self.profiler_config.include_field_quantiles:
                        sorted_values = sorted(numeric_values)
                        stats.quantiles = [
                            QuantileClass(
                                quantile=str(0.25),
                                value=str(
                                    sorted_values[int(len(sorted_values) * 0.25)]
                                ),
                            ),
                            QuantileClass(
                                quantile=str(0.5),
                                value=str(sorted_values[int(len(sorted_values) * 0.5)]),
                            ),
                            QuantileClass(
                                quantile=str(0.75),
                                value=str(
                                    sorted_values[int(len(sorted_values) * 0.75)]
                                ),
                            ),
                        ]

                    stats.data_type = "NUMERIC"
                else:
                    stats.data_type = "STRING"
            except (ValueError, TypeError):
                stats.data_type = "STRING"

        return stats

    def create_profile_data(
        self, field_stats: Dict[str, KafkaFieldStatistics], sample_count: int
    ) -> DatasetProfileClass:
        """Create DataHub profile class from field statistics"""
        timestamp_millis = int(datetime.now().timestamp() * 1000)
        field_profiles = []

        for field_path, stats in field_stats.items():
            histogram = None
            if (
                self.profiler_config.include_field_histogram
                and stats.distinct_value_frequencies
            ):
                sorted_frequencies = sorted(
                    stats.distinct_value_frequencies.items(),
                    key=lambda x: x[1],
                    reverse=True,
                )[:10]

                boundaries = [str(value) for value, _ in sorted_frequencies]
                heights = [float(freq) for _, freq in sorted_frequencies]

                histogram = HistogramClass(boundaries=boundaries, heights=heights)

            field_profile = DatasetFieldProfileClass(
                fieldPath=field_path,
                sampleValues=stats.sample_values
                if self.profiler_config.include_field_sample_values
                else None,
                uniqueCount=stats.unique_count
                if self.profiler_config.include_field_distinct_count
                else None,
                uniqueProportion=stats.unique_proportion
                if self.profiler_config.include_field_distinct_count
                else None,
                nullCount=stats.null_count
                if self.profiler_config.include_field_null_count
                else None,
                nullProportion=stats.null_proportion
                if self.profiler_config.include_field_null_count
                else None,
                min=str(stats.min_value)
                if self.profiler_config.include_field_min_value
                and stats.min_value is not None
                else None,
                max=str(stats.max_value)
                if self.profiler_config.include_field_max_value
                and stats.max_value is not None
                else None,
                mean=str(stats.mean_value)
                if self.profiler_config.include_field_mean_value
                and stats.mean_value is not None
                else None,
                median=str(stats.median_value)
                if self.profiler_config.include_field_median_value
                and stats.median_value is not None
                else None,
                stdev=str(stats.stdev)
                if self.profiler_config.include_field_stddev_value
                and hasattr(stats, "stdev")
                else None,
                quantiles=stats.quantiles
                if self.profiler_config.include_field_quantiles
                and hasattr(stats, "quantiles")
                else None,
                distinctValueFrequencies=[
                    ValueFrequencyClass(value=str(value), frequency=freq)
                    for value, freq in sorted(
                        stats.distinct_value_frequencies.items(),
                        key=lambda x: x[1],
                        reverse=True,
                    )[:10]
                ]
                if self.profiler_config.include_field_distinct_value_frequencies
                and stats.distinct_value_frequencies
                else None,
                histogram=histogram
                if self.profiler_config.include_field_histogram
                else None,
            )
            field_profiles.append(field_profile)

        return DatasetProfileClass(
            timestampMillis=timestamp_millis,
            columnCount=len(field_profiles),
            eventGranularity=TimeWindowSizeClass(
                unit=CalendarIntervalClass.SECOND,
                multiple=self.profiler_config.max_sample_time_seconds,
            ),
            # Add partition specification
            partitionSpec=PartitionSpecClass(
                partition=f"SAMPLE ({self.profiler_config.sample_size}/{self.profiler_config.max_sample_time_seconds} seconds)",
                type=PartitionTypeClass.QUERY,
                timePartition=TimeWindowClass(
                    startTimeMillis=timestamp_millis,
                    length=TimeWindowSizeClass(
                        unit=CalendarIntervalClass.SECOND,
                        multiple=self.profiler_config.max_sample_time_seconds,
                    ),
                ),
            ),
            fieldProfiles=field_profiles,
        )


def get_kafka_consumer(
    connection: KafkaConsumerConnectionConfig,
) -> confluent_kafka.Consumer:
    consumer = confluent_kafka.Consumer(
        {
            "group.id": "datahub-kafka-ingestion",
            "bootstrap.servers": connection.bootstrap,
            **connection.consumer_config,
        }
    )

    if CallableConsumerConfig.is_callable_config(connection.consumer_config):
        # As per documentation, we need to explicitly call the poll method to make sure OAuth callback gets executed
        # https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html#kafka-client-configuration
        logger.debug("Initiating polling for kafka consumer")
        consumer.poll(timeout=30)
        logger.debug("Initiated polling for kafka consumer")

    return consumer


def get_kafka_admin_client(
    connection: KafkaConsumerConnectionConfig,
) -> AdminClient:
    client = AdminClient(
        {
            "group.id": "datahub-kafka-ingestion",
            "bootstrap.servers": connection.bootstrap,
            **connection.consumer_config,
        }
    )
    if CallableConsumerConfig.is_callable_config(connection.consumer_config):
        # As per documentation, we need to explicitly call the poll method to make sure OAuth callback gets executed
        # https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html#kafka-client-configuration
        logger.debug("Initiating polling for kafka admin client")
        client.poll(timeout=30)
        logger.debug("Initiated polling for kafka admin client")
    return client


def clean_field_path(field_path: str, preserve_types: bool = True) -> str:
    """Clean field path by optionally preserving or removing version, type and other metadata.

    Args:
        field_path: The full field path string
        preserve_types: If True, preserves version and type information in the path

    Returns:
        The cleaned field path string
    """
    # Handle the key[key=True] special case first
    if field_path.endswith("[key=True]"):
        return "key"

    if preserve_types:
        # When preserving types, return the full path as-is
        return field_path

    # If not preserving types, use the original stripping logic
    parts = field_path.split(".")
    # Return last non-empty part that isn't a type or version declaration
    for part in reversed(parts):
        if part and not (part.startswith("[version=") or part.startswith("[type=")):
            return part

    return field_path


def flatten_json(
    nested_json: Dict[str, Any],
    parent_key: str = "",
    flattened_dict: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Flatten a nested JSON object into a single level dictionary.
    """
    if flattened_dict is None:
        flattened_dict = {}

    if isinstance(nested_json, dict):
        for key, value in nested_json.items():
            new_key = f"{parent_key}.{key}" if parent_key else key
            if isinstance(value, (dict, list)):
                flatten_json(
                    {"value": value} if isinstance(value, list) else value,
                    new_key,
                    flattened_dict,
                )
            else:
                flattened_dict[new_key] = value
    elif isinstance(nested_json, list):
        for i, item in enumerate(nested_json):
            new_key = f"{parent_key}[{i}]"
            if isinstance(item, (dict, list)):
                flatten_json({"item": item}, new_key, flattened_dict)
            else:
                flattened_dict[new_key] = item
    else:
        flattened_dict[parent_key] = nested_json

    return flattened_dict


@dataclass
class KafkaSourceReport(StaleEntityRemovalSourceReport):
    topics_scanned: int = 0
    filtered: List[str] = field(default_factory=list)

    def report_topic_scanned(self, topic: str) -> None:
        self.topics_scanned += 1

    def report_dropped(self, topic: str) -> None:
        self.filtered.append(topic)


class KafkaConnectionTest:
    def __init__(self, config_dict: dict):
        self.config = KafkaSourceConfig.parse_obj_allow_extras(config_dict)
        self.report = KafkaSourceReport()
        self.consumer: confluent_kafka.Consumer = get_kafka_consumer(
            self.config.connection
        )

    def get_connection_test(self) -> TestConnectionReport:
        capability_report = {
            SourceCapability.SCHEMA_METADATA: self.schema_registry_connectivity(),
        }
        return TestConnectionReport(
            basic_connectivity=self.basic_connectivity(),
            capability_report={
                k: v for k, v in capability_report.items() if v is not None
            },
        )

    def basic_connectivity(self) -> CapabilityReport:
        try:
            self.consumer.list_topics(timeout=10)
            return CapabilityReport(capable=True)
        except Exception as e:
            return CapabilityReport(capable=False, failure_reason=str(e))

    def schema_registry_connectivity(self) -> CapabilityReport:
        try:
            SchemaRegistryClient(
                {
                    "url": self.config.connection.schema_registry_url,
                    **self.config.connection.schema_registry_config,
                }
            ).get_subjects()
            return CapabilityReport(capable=True)
        except Exception as e:
            return CapabilityReport(capable=False, failure_reason=str(e))


@platform_name("Kafka")
@config_class(KafkaSourceConfig)
@support_status(SupportStatus.CERTIFIED)
@capability(
    SourceCapability.DESCRIPTIONS,
    "Set dataset description to top level doc field for Avro schema",
)
@capability(
    SourceCapability.PLATFORM_INSTANCE,
    "For multiple Kafka clusters, use the platform_instance configuration",
)
@capability(
    SourceCapability.SCHEMA_METADATA,
    "Schemas associated with each topic are extracted from the schema registry. Avro and Protobuf (certified), JSON (incubating). Schema references are supported.",
)
class KafkaSource(StatefulIngestionSourceBase, TestableSource):
    """
    This plugin extracts the following:
    - Topics from the Kafka broker
    - Schemas associated with each topic from the schema registry (Avro, Protobuf and JSON schemas are supported)
    """

    platform: str = "kafka"

    @classmethod
    def create_schema_registry(
        cls, config: KafkaSourceConfig, report: KafkaSourceReport
    ) -> KafkaSchemaRegistryBase:
        try:
            schema_registry_class: Type = import_path(config.schema_registry_class)
            return schema_registry_class.create(config, report)
        except Exception as e:
            logger.debug(e, exc_info=e)
            raise ImportError(config.schema_registry_class)

    def __init__(self, config: KafkaSourceConfig, ctx: PipelineContext):
        super().__init__(config, ctx)
        self.source_config: KafkaSourceConfig = config
        self.consumer: confluent_kafka.Consumer = get_kafka_consumer(
            self.source_config.connection
        )
        self.init_kafka_admin_client()
        self.report: KafkaSourceReport = KafkaSourceReport()
        self.schema_registry_client: KafkaSchemaRegistryBase = (
            KafkaSource.create_schema_registry(config, self.report)
        )
        if self.source_config.domain:
            self.domain_registry = DomainRegistry(
                cached_domains=[k for k in self.source_config.domain],
                graph=self.ctx.graph,
            )

        self.profiler = KafkaProfiler(profiler_config=self.source_config.profiling)

        self.meta_processor = OperationProcessor(
            self.source_config.meta_mapping,
            self.source_config.tag_prefix,
            OwnershipSourceTypeClass.SERVICE,
            self.source_config.strip_user_ids_from_email,
            match_nested_props=True,
        )

    def init_kafka_admin_client(self) -> None:
        try:
            # TODO: Do we require separate config than existing consumer_config ?
            self.admin_client = get_kafka_admin_client(self.source_config.connection)
        except Exception as e:
            logger.debug(e, exc_info=e)
            self.report.report_warning(
                "kafka-admin-client",
                f"Failed to create Kafka Admin Client due to error {e}.",
            )

    @staticmethod
    def test_connection(config_dict: dict) -> TestConnectionReport:
        return KafkaConnectionTest(config_dict).get_connection_test()

    @classmethod
    def create(cls, config_dict: Dict, ctx: PipelineContext) -> "KafkaSource":
        config: KafkaSourceConfig = KafkaSourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_workunit_processors(self) -> List[Optional[MetadataWorkUnitProcessor]]:
        return [
            *super().get_workunit_processors(),
            StaleEntityRemovalHandler.create(
                self, self.source_config, self.ctx
            ).workunit_processor,
        ]

    def get_workunits_internal(self) -> Iterable[MetadataWorkUnit]:
        topics = self.consumer.list_topics(
            timeout=self.source_config.connection.client_timeout_seconds
        ).topics
        extra_topic_details = self.fetch_extra_topic_details(topics.keys())

        for topic, topic_detail in topics.items():
            self.report.report_topic_scanned(topic)
            if self.source_config.topic_patterns.allowed(topic):
                try:
                    yield from self._extract_record(
                        topic, False, topic_detail, extra_topic_details.get(topic)
                    )
                except Exception as e:
                    logger.warning(f"Failed to extract topic {topic}", exc_info=True)
                    self.report.report_warning(
                        "topic", f"Exception while extracting topic {topic}: {e}"
                    )
            else:
                self.report.report_dropped(topic)

        if self.source_config.ingest_schemas_as_entities:
            # Get all subjects from schema registry and ingest them as SCHEMA DatasetSubTypes
            for subject in self.schema_registry_client.get_subjects():
                try:
                    yield from self._extract_record(
                        subject, True, topic_detail=None, extra_topic_config=None
                    )
                except Exception as e:
                    logger.warning(
                        f"Failed to extract subject {subject}", exc_info=True
                    )
                    self.report.report_warning(
                        "subject", f"Exception while extracting topic {subject}: {e}"
                    )

    def _process_message_part(
        self, data: Any, prefix: str, topic: str, is_key: bool = False
    ) -> Optional[Any]:
        """Process either key or value part of a message using schema registry for decoding."""
        if data is None:
            return None

        if isinstance(data, bytes):
            try:
                # Get schema metadata
                schema_metadata = self.schema_registry_client.get_schema_metadata(
                    topic, make_data_platform_urn(self.platform), False
                )

                if schema_metadata and isinstance(
                    schema_metadata.platformSchema, KafkaSchemaClass
                ):
                    schema_str = (
                        schema_metadata.platformSchema.keySchema
                        if is_key
                        else schema_metadata.platformSchema.documentSchema
                    )

                    if schema_str:
                        try:
                            # Parse schema and create reader
                            schema = avro.schema.parse(schema_str)
                            # Decode Avro data - first 5 bytes are magic byte and schema ID
                            decoder = avro.io.BinaryDecoder(io.BytesIO(data[5:]))
                            reader = avro.io.DatumReader(schema)
                            decoded_value = reader.read(decoder)

                            if isinstance(decoded_value, (dict, list)):
                                # Flatten nested structures
                                if isinstance(decoded_value, list):
                                    decoded_value = {"item": decoded_value}
                                return flatten_json(decoded_value)
                            return decoded_value
                        except Exception as e:
                            logger.warning(f"Failed to decode Avro message: {e}")

                # Fallback to JSON decode if no schema or Avro decode fails
                try:
                    decoded = json.loads(data.decode("utf-8"))
                    if isinstance(decoded, (dict, list)):
                        if isinstance(decoded, list):
                            decoded = {"item": decoded}
                        return flatten_json(decoded)
                    return decoded
                except Exception:
                    # If JSON fails, use base64 as last resort
                    return base64.b64encode(data).decode("utf-8")

            except Exception as e:
                logger.warning(f"Failed to process message part: {e}")
                return base64.b64encode(data).decode("utf-8")

        return data

    def get_sample_messages(self, topic: str) -> List[Dict[str, Any]]:
        """
        Collects sample messages from a Kafka topic, handling both key and value fields.
        """
        samples: List[Dict[str, Any]] = []
        try:
            self.consumer.subscribe([topic])

            # Poll for messages until timeout or we get desired number of samples
            end_time = datetime.now() + timedelta(
                seconds=float(self.source_config.profiling.max_sample_time_seconds)
            )

            while datetime.now() < end_time:
                msg = self.consumer.poll(timeout=1.0)

                if msg is None:
                    continue

                if msg.error():
                    logger.warning(f"Error while consuming from {topic}: {msg.error()}")
                    break

                try:
                    # Process both key and value
                    key = msg.key() if callable(msg.key) else msg.key
                    value = msg.value() if callable(msg.value) else msg.value
                    processed_key = self._process_message_part(
                        key, "key", topic, is_key=True
                    )
                    processed_value = self._process_message_part(
                        value, "value", topic, is_key=False
                    )

                    msg_timestamp = msg.timestamp()[1]
                    timestamp_dt = datetime.fromtimestamp(
                        msg_timestamp / 1000.0
                        if msg_timestamp > 1e10
                        else msg_timestamp
                    )

                    sample = {
                        "offset": msg.offset(),
                        "timestamp": timestamp_dt.isoformat(),
                    }

                    # Add key and value data with proper prefixing
                    if processed_key is not None:
                        if isinstance(processed_key, dict):
                            # Don't prefix with 'key.'
                            sample.update(processed_key)
                        else:
                            sample["key"] = processed_key

                    if processed_value is not None:
                        if isinstance(processed_value, dict):
                            # Add value fields without prefix
                            sample.update(processed_value)
                        else:
                            sample["value"] = processed_value

                    samples.append(sample)

                    if len(samples) >= self.source_config.profiling.sample_size:
                        break

                except Exception as e:
                    logger.warning(f"Failed to decode message from {topic}: {e}")

        except Exception as e:
            logger.warning(f"Failed to collect samples from {topic}: {e}")
        finally:
            self.consumer.unsubscribe()

        return samples

    def _process_sample_data(
        self,
        samples: List[Dict[str, Any]],
        schema_metadata: Optional[SchemaMetadataClass] = None,
    ) -> Dict[str, Any]:
        """Process sample data to extract field information from both key and value schemas."""
        all_keys: Set[str] = set()
        field_sample_map: Dict[str, List[str]] = {}
        key_field_path: Optional[str] = None

        # Initialize from schema if available
        if schema_metadata is not None and isinstance(
            schema_metadata.platformSchema, KafkaSchemaClass
        ):
            # Find the key field path from schema metadata fields
            key_field = next(
                (
                    schema_field
                    for schema_field in (schema_metadata.fields or [])
                    if schema_field.fieldPath.endswith("[key=True]")
                ),
                None,
            )
            if key_field:
                key_field_path = key_field.fieldPath
                all_keys.add(key_field_path)
                field_sample_map[key_field_path] = []

            # Handle all schema fields (both key and value)
            for schema_field in schema_metadata.fields or []:
                field_path = schema_field.fieldPath
                if field_path not in field_sample_map:
                    field_sample_map[field_path] = []
                    all_keys.add(field_path)

        # Process samples
        for sample in samples:
            # Process each field in the sample
            for field_name, value in sample.items():
                if field_name not in ["offset", "timestamp"]:
                    # For sample data, we need to map the simplified field names back to full paths
                    matching_schema_field = None
                    if schema_metadata and schema_metadata.fields:
                        clean_field = clean_field_path(field_name, preserve_types=False)

                        # Special handling for key field
                        if field_name == "key" and key_field_path:
                            matching_schema_field = next(
                                schema_field
                                for schema_field in schema_metadata.fields
                                if schema_field.fieldPath == key_field_path
                            )
                        else:
                            # Find matching schema field by comparing the end of the path
                            for schema_field in schema_metadata.fields:
                                if (
                                    clean_field_path(
                                        schema_field.fieldPath, preserve_types=False
                                    )
                                    == clean_field
                                ):
                                    matching_schema_field = schema_field
                                    break

                    # Use the full path from schema if found, otherwise use original field name
                    field_path = (
                        matching_schema_field.fieldPath
                        if matching_schema_field
                        else field_name
                    )

                    if field_path not in field_sample_map:
                        field_sample_map[field_path] = []
                        all_keys.add(field_path)
                    field_sample_map[field_path].append(str(value))

        return {"all_keys": all_keys, "field_sample_map": field_sample_map}

    def _create_profile_data(
        self, all_keys: set, field_sample_map: Dict[str, List[str]], sample_count: int
    ) -> DatasetProfileClass:
        """Create profile data from processed samples."""
        timestamp_millis = int(datetime.now().timestamp() * 1000)
        return DatasetProfileClass(
            timestampMillis=timestamp_millis,
            columnCount=len(all_keys),
            fieldProfiles=[
                DatasetFieldProfileClass(
                    fieldPath=field_name,
                    sampleValues=random.sample(
                        field_samples, min(3, len(field_samples))
                    ),
                )
                for field_name, field_samples in field_sample_map.items()
            ],
        )

    def create_profiling_wu(
        self,
        entity_urn: str,
        topic: str,
        schema_metadata: Optional[SchemaMetadataClass] = None,
    ) -> Iterable[MetadataWorkUnit]:
        """Create samples work unit incorporating both schema fields and sample values."""
        # Only proceed if profiling is enabled
        if not self.source_config.profiling.enabled:
            return

        samples = self.get_sample_messages(topic)
        if not samples:
            return

        # Respect sample size limit if configured
        if self.source_config.profiling.limit:
            samples = samples[: self.source_config.profiling.limit]

        # Apply offset if configured
        if self.source_config.profiling.offset:
            samples = samples[self.source_config.profiling.offset :]

        # If table-level only profiling is enabled, skip detailed field profiling
        if self.source_config.profiling.profile_table_level_only:
            profile_data = DatasetProfileClass(
                timestampMillis=int(datetime.now().timestamp() * 1000),
                columnCount=len({k for sample in samples for k in sample.keys()}),
            )
        else:
            profile_data = self.profiler.profile_samples(
                samples=samples, schema_metadata=schema_metadata
            )

        yield MetadataChangeProposalWrapper(
            entityUrn=entity_urn, aspect=profile_data
        ).as_workunit()

    def get_dataset_description(
        self,
        dataset_name: str,
        dataset_snapshot: DatasetSnapshotClass,
        custom_props: Dict[str, str],
        schema_metadata: Optional[SchemaMetadataClass],
    ) -> DatasetSnapshotClass:
        AVRO = "AVRO"
        description: Optional[str] = None
        if (
            schema_metadata is not None
            and isinstance(schema_metadata.platformSchema, KafkaSchemaClass)
            and schema_metadata.platformSchema.documentSchemaType == AVRO
        ):
            # Point to note:
            # In Kafka documentSchema and keySchema both contains "doc" field.
            # DataHub Dataset "description" field is mapped to documentSchema's "doc" field.

            avro_schema = avro.schema.parse(
                schema_metadata.platformSchema.documentSchema
            )
            description = getattr(avro_schema, "doc", None)
            # set the tags
            all_tags: List[str] = []
            try:
                schema_tags = cast(
                    Iterable[str],
                    avro_schema.other_props.get(
                        self.source_config.schema_tags_field, []
                    ),
                )
                for tag in schema_tags:
                    all_tags.append(self.source_config.tag_prefix + tag)
            except TypeError:
                pass

            if self.source_config.enable_meta_mapping:
                meta_aspects = self.meta_processor.process(avro_schema.other_props)

                meta_owners_aspects = meta_aspects.get(Constants.ADD_OWNER_OPERATION)
                if meta_owners_aspects:
                    dataset_snapshot.aspects.append(meta_owners_aspects)

                meta_terms_aspect = meta_aspects.get(Constants.ADD_TERM_OPERATION)
                if meta_terms_aspect:
                    dataset_snapshot.aspects.append(meta_terms_aspect)

                # Create the tags aspect
                meta_tags_aspect = meta_aspects.get(Constants.ADD_TAG_OPERATION)
                if meta_tags_aspect:
                    all_tags += [
                        tag_association.tag[len("urn:li:tag:") :]
                        for tag_association in meta_tags_aspect.tags
                    ]

            if all_tags:
                dataset_snapshot.aspects.append(
                    mce_builder.make_global_tag_aspect_with_tag_list(all_tags)
                )

        dataset_properties = DatasetPropertiesClass(
            name=dataset_name, customProperties=custom_props, description=description
        )
        dataset_snapshot.aspects.append(dataset_properties)

        return dataset_snapshot

    def _extract_record(
        self,
        topic: str,
        is_subject: bool,
        topic_detail: Optional[TopicMetadata],
        extra_topic_config: Optional[Dict[str, ConfigEntry]],
    ) -> Iterable[MetadataWorkUnit]:
        kafka_entity = "subject" if is_subject else "topic"

        logger.debug(f"extracting schema metadata from kafka entity = {kafka_entity}")

        platform_urn = make_data_platform_urn(self.platform)

        # 1. Create schemaMetadata aspect (pass control to SchemaRegistry)
        schema_metadata = self.schema_registry_client.get_schema_metadata(
            topic, platform_urn, is_subject
        )

        # topic can have no associated subject, but still it can be ingested without schema
        # for schema ingestion, ingest only if it has valid schema
        if is_subject:
            if schema_metadata is None:
                return
            dataset_name = schema_metadata.schemaName
        else:
            dataset_name = topic

        # 2. Create the default dataset snapshot for the topic.
        dataset_urn = make_dataset_urn_with_platform_instance(
            platform=self.platform,
            name=dataset_name,
            platform_instance=self.source_config.platform_instance,
            env=self.source_config.env,
        )
        dataset_snapshot = DatasetSnapshotClass(
            urn=dataset_urn,
            aspects=[StatusClass(removed=False)],  # we append to this list later on
        )

        if schema_metadata is not None:
            dataset_snapshot.aspects.append(schema_metadata)

        # 3. Attach browsePaths aspect
        browse_path_str = f"/{self.source_config.env.lower()}/{self.platform}"
        if self.source_config.platform_instance:
            browse_path_str += f"/{self.source_config.platform_instance}"
        browse_path = BrowsePathsClass([browse_path_str])
        dataset_snapshot.aspects.append(browse_path)

        # build custom properties for topic, schema properties may be added as needed
        custom_props: Dict[str, str] = {}
        if not is_subject:
            custom_props = self.build_custom_properties(
                topic, topic_detail, extra_topic_config
            )
            schema_name: Optional[
                str
            ] = self.schema_registry_client._get_subject_for_topic(
                topic, is_key_schema=False
            )
            if schema_name is not None:
                custom_props["Schema Name"] = schema_name

        # 4. Set dataset's description, tags, ownership, etc, if topic schema type is avro
        dataset_snapshot = self.get_dataset_description(
            dataset_name=dataset_name,
            dataset_snapshot=dataset_snapshot,
            custom_props=custom_props,
            schema_metadata=schema_metadata,
        )

        # 5. Attach dataPlatformInstance aspect.
        if self.source_config.platform_instance:
            dataset_snapshot.aspects.append(
                DataPlatformInstanceClass(
                    platform=platform_urn,
                    instance=make_dataplatform_instance_urn(
                        self.platform, self.source_config.platform_instance
                    ),
                )
            )

        # 6. Emit the datasetSnapshot MCE
        mce = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
        yield MetadataWorkUnit(id=f"kafka-{kafka_entity}", mce=mce)

        # 7. Add the subtype aspect marking this as a "topic" or "schema"
        typeName = DatasetSubTypes.SCHEMA if is_subject else DatasetSubTypes.TOPIC
        yield MetadataChangeProposalWrapper(
            entityUrn=dataset_urn,
            aspect=SubTypesClass(typeNames=[typeName]),
        ).as_workunit()

        domain_urn: Optional[str] = None

        # 8. Emit domains aspect MCPW
        for domain, pattern in self.source_config.domain.items():
            if pattern.allowed(dataset_name):
                domain_urn = make_domain_urn(
                    self.domain_registry.get_domain_urn(domain)
                )

        if domain_urn:
            yield from add_domain_to_entity_wu(
                entity_urn=dataset_urn,
                domain_urn=domain_urn,
            )

        # 9. Emit sample values
        if not is_subject and self.source_config.profiling.enabled:
            yield from self.create_profiling_wu(
                entity_urn=dataset_urn,
                topic=topic,
                schema_metadata=schema_metadata,
            )

    def build_custom_properties(
        self,
        topic: str,
        topic_detail: Optional[TopicMetadata],
        extra_topic_config: Optional[Dict[str, ConfigEntry]],
    ) -> Dict[str, str]:
        custom_props: Dict[str, str] = {}
        self.update_custom_props_with_topic_details(topic, topic_detail, custom_props)
        self.update_custom_props_with_topic_config(
            topic, extra_topic_config, custom_props
        )
        return custom_props

    def update_custom_props_with_topic_details(
        self,
        topic: str,
        topic_detail: Optional[TopicMetadata],
        custom_props: Dict[str, str],
    ) -> None:
        if topic_detail is None or topic_detail.partitions is None:
            logger.info(
                f"Partitions and Replication Factor not available for topic {topic}"
            )
            return

        custom_props["Partitions"] = str(len(topic_detail.partitions))
        replication_factor: Optional[int] = None
        for _, p_meta in topic_detail.partitions.items():
            if replication_factor is None or len(p_meta.replicas) > replication_factor:
                replication_factor = len(p_meta.replicas)

        if replication_factor is not None:
            custom_props["Replication Factor"] = str(replication_factor)

    def update_custom_props_with_topic_config(
        self,
        topic: str,
        topic_config: Optional[Dict[str, ConfigEntry]],
        custom_props: Dict[str, str],
    ) -> None:
        if topic_config is None:
            return

        for config_key in KafkaTopicConfigKeys:
            try:
                if (
                    config_key in topic_config.keys()
                    and topic_config[config_key] is not None
                ):
                    config_value = topic_config[config_key].value
                    custom_props[config_key] = (
                        config_value
                        if isinstance(config_value, str)
                        else json.dumps(config_value)
                    )
            except Exception as e:
                logger.info(f"{config_key} is not available for topic due to error {e}")

    def get_report(self) -> KafkaSourceReport:
        return self.report

    def close(self) -> None:
        if self.consumer:
            self.consumer.close()
        super().close()

    def _get_config_value_if_present(
        self, config_dict: Dict[str, ConfigEntry], key: str
    ) -> Any:
        return

    def fetch_extra_topic_details(self, topics: List[str]) -> Dict[str, dict]:
        extra_topic_details = {}

        if not hasattr(self, "admin_client"):
            logger.debug(
                "Kafka Admin Client missing. Not fetching config details for topics."
            )
        else:
            try:
                extra_topic_details = self.fetch_topic_configurations(topics)
            except Exception as e:
                logger.debug(e, exc_info=e)
                logger.warning(f"Failed to fetch config details due to error {e}.")
        return extra_topic_details

    def fetch_topic_configurations(self, topics: List[str]) -> Dict[str, dict]:
        logger.info("Fetching config details for all topics")
        configs: Dict[
            ConfigResource, concurrent.futures.Future
        ] = self.admin_client.describe_configs(
            resources=[ConfigResource(ConfigResource.Type.TOPIC, t) for t in topics],
            request_timeout=self.source_config.connection.client_timeout_seconds,
        )
        logger.debug("Waiting for config details futures to complete")
        concurrent.futures.wait(configs.values())
        logger.debug("Config details futures completed")

        topic_configurations: Dict[str, dict] = {}
        for config_resource, config_result_future in configs.items():
            self.process_topic_config_result(
                config_resource, config_result_future, topic_configurations
            )
        return topic_configurations

    def process_topic_config_result(
        self,
        config_resource: ConfigResource,
        config_result_future: concurrent.futures.Future,
        topic_configurations: dict,
    ) -> None:
        try:
            topic_configurations[config_resource.name] = config_result_future.result()
        except Exception as e:
            logger.warning(
                f"Config details for topic {config_resource.name} not fetched due to error {e}"
            )
        else:
            logger.info(
                f"Config details for topic {config_resource.name} fetched successfully"
            )
