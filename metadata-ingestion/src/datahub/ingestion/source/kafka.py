import logging
from dataclasses import dataclass, field
from hashlib import md5
from typing import Dict, Iterable, List, Optional

import confluent_kafka
from confluent_kafka.schema_registry.schema_registry_client import (
    Schema,
    SchemaRegistryClient,
)

from datahub.configuration import ConfigModel
from datahub.configuration.common import AllowDenyPattern
from datahub.configuration.kafka import KafkaConsumerConnectionConfig
from datahub.emitter.mce_builder import DEFAULT_ENV, make_dataset_urn, make_domain_urn
from datahub.emitter.mcp_builder import add_domain_to_entity_wu
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

logger = logging.getLogger(__name__)


class KafkaSourceConfig(ConfigModel):
    env: str = DEFAULT_ENV
    # TODO: inline the connection config
    connection: KafkaConsumerConnectionConfig = KafkaConsumerConnectionConfig()
    topic_patterns: AllowDenyPattern = AllowDenyPattern(allow=[".*"], deny=["^_.*"])
    domain: Dict[str, AllowDenyPattern] = dict()


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
        self.schema_registry_client = SchemaRegistryClient(
            {
                "url": self.source_config.connection.schema_registry_url,
                **self.source_config.connection.schema_registry_config,
            }
        )
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
                yield from self._extract_record(t)
            else:
                self.report.report_dropped(t)

    def get_schema_str_replace_confluent_ref_avro(
        self, schema: Schema, schema_seen: Optional[set] = None
    ) -> str:
        if not schema.references:
            return schema.schema_str

        if schema_seen is None:
            schema_seen = set()
        schema_str = schema.schema_str
        for schema_ref in schema.references:
            ref_subject = schema_ref["subject"]
            if ref_subject in schema_seen:
                continue
            reference_schema = self.schema_registry_client.get_latest_version(
                ref_subject
            )
            schema_seen.add(ref_subject)
            logger.debug(
                f"ref for {ref_subject} is {reference_schema.schema.schema_str}"
            )
            ref_name = schema_ref["name"]
            schema_str = schema_str.replace(
                f'"{ref_name}"',
                self.get_schema_str_replace_confluent_ref_avro(
                    reference_schema.schema, schema_seen
                ),
            )
        return schema_str

    def _extract_record(self, topic: str) -> Iterable[MetadataWorkUnit]:
        logger.debug(f"topic = {topic}")
        platform = "kafka"
        dataset_name = topic

        dataset_urn = make_dataset_urn(
            platform=platform, name=dataset_name, env=self.source_config.env
        )

        dataset_snapshot = DatasetSnapshot(
            urn=dataset_urn,
            aspects=[],  # we append to this list later on
        )
        dataset_snapshot.aspects.append(Status(removed=False))
        # Fetch schema from the registry.
        schema: Optional[Schema] = None
        try:
            registered_schema = self.schema_registry_client.get_latest_version(
                topic + "-value"
            )
            schema = registered_schema.schema
        except Exception as e:
            self.report.report_warning(topic, f"failed to get value schema: {e}")

        # Parse the schema
        fields: List[SchemaField] = []
        if schema and schema.schema_type == "AVRO":
            cleaned_str = self.get_schema_str_replace_confluent_ref_avro(schema)
            # "value.id" or "value.[type=string]id"
            fields = schema_util.avro_schema_to_mce_fields(cleaned_str)
        elif schema is not None:
            self.report.report_warning(
                topic,
                f"Parsing kafka schema type {schema.schema_type} is currently not implemented",
            )
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
            pass

        # Parse the key schema
        key_fields: List[SchemaField] = []
        if key_schema and key_schema.schema_type == "AVRO":
            cleaned_key_str = self.get_schema_str_replace_confluent_ref_avro(key_schema)
            key_fields = schema_util.avro_schema_to_mce_fields(
                cleaned_key_str, is_key_schema=True
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

        mce = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
        wu = MetadataWorkUnit(id=f"kafka-{topic}", mce=mce)
        self.report.report_workunit(wu)
        yield wu

        domain_urn: Optional[str] = None

        for domain, pattern in self.source_config.domain.items():
            if pattern.allowed(dataset_name):
                domain_urn = make_domain_urn(domain)

        if domain_urn:
            yield from add_domain_to_entity_wu(
                entity_type="dataset",
                entity_urn=dataset_urn,
                domain_urn=domain_urn,
                report=self.report,
            )

    def get_report(self):
        return self.report

    def close(self):
        if self.consumer:
            self.consumer.close()
