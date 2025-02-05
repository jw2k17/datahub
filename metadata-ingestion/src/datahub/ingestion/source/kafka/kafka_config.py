from typing import Dict, Optional

import pydantic

from datahub.configuration.common import AllowDenyPattern
from datahub.configuration.kafka import KafkaConsumerConnectionConfig
from datahub.configuration.source_common import (
    DatasetSourceConfigMixin,
    LowerCaseDatasetUrnConfigMixin,
)
from datahub.ingestion.source.ge_profiling_config import GEProfilingBaseConfig
from datahub.ingestion.source.state.stale_entity_removal_handler import (
    StatefulStaleMetadataRemovalConfig,
)
from datahub.ingestion.source.state.stateful_ingestion_base import (
    StatefulIngestionConfigBase,
)


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
