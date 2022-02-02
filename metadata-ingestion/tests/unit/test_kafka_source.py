import unittest
from unittest.mock import MagicMock, patch

import pytest
from confluent_kafka.schema_registry.schema_registry_client import (
    RegisteredSchema,
    Schema,
)

from datahub.configuration.common import ConfigurationError
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.source.kafka import KafkaSource
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent


class KafkaSourceTest(unittest.TestCase):
    def test_get_schema_str_replace_confluent_ref_avro(self):

        # References external schema 'TestTopic1' in the definition of 'my_field1' field.
        schema_str_orig = """
{
  "fields": [
    {
      "name": "my_field1",
      "type": "TestTopic1"
    }
  ],
  "name": "TestTopic1Val",
  "namespace": "io.acryl",
  "type": "record"
}
"""
        schema_str_ref = """
{
  "doc": "Sample schema to help you get started.",
  "fields": [
    {
      "doc": "The int type is a 32-bit signed integer.",
      "name": "my_field1",
      "type": "int"
    }
  ],
  "name": "TestTopic1",
  "namespace": "io.acryl",
  "type": "record"
}
"""

        schema_str_final = (
            """
{
  "fields": [
    {
      "name": "my_field1",
      "type": """
            + schema_str_ref
            + """
    }
  ],
  "name": "TestTopic1Val",
  "namespace": "io.acryl",
  "type": "record"
}
"""
        )

        ctx = PipelineContext(run_id="test")
        kafka_source = KafkaSource.create(
            {
                "connection": {"bootstrap": "localhost:9092"},
            },
            ctx,
        )

        def new_get_latest_version(_):
            return RegisteredSchema(
                schema_id="schema_id_1",
                schema=Schema(schema_str=schema_str_ref, schema_type="AVRO"),
                subject="test",
                version=1,
            )

        with patch.object(
            kafka_source.schema_registry_client,
            "get_latest_version",
            new_get_latest_version,
        ):
            schema_str = kafka_source.get_schema_str_replace_confluent_ref_avro(
                # The external reference would match by name.
                schema=Schema(
                    schema_str=schema_str_orig,
                    schema_type="AVRO",
                    references=[
                        dict(name="TestTopic1", subject="schema_subject_1", version=1)
                    ],
                )
            )
            assert schema_str == KafkaSource._compact_schema(schema_str_final)

        with patch.object(
            kafka_source.schema_registry_client,
            "get_latest_version",
            new_get_latest_version,
        ):
            schema_str = kafka_source.get_schema_str_replace_confluent_ref_avro(
                # The external reference would match by subject.
                schema=Schema(
                    schema_str=schema_str_orig,
                    schema_type="AVRO",
                    references=[
                        dict(name="schema_subject_1", subject="TestTopic1", version=1)
                    ],
                )
            )
            assert schema_str == KafkaSource._compact_schema(schema_str_final)

    @patch("datahub.ingestion.source.kafka.confluent_kafka.Consumer", autospec=True)
    def test_kafka_source_configuration(self, mock_kafka):
        ctx = PipelineContext(run_id="test")
        kafka_source = KafkaSource.create(
            {"connection": {"bootstrap": "foobar:9092"}}, ctx
        )
        kafka_source.close()
        assert mock_kafka.call_count == 1

    @patch("datahub.ingestion.source.kafka.confluent_kafka.Consumer", autospec=True)
    def test_kafka_source_workunits_wildcard_topic(self, mock_kafka):
        mock_kafka_instance = mock_kafka.return_value
        mock_cluster_metadata = MagicMock()
        mock_cluster_metadata.topics = ["foobar", "bazbaz"]
        mock_kafka_instance.list_topics.return_value = mock_cluster_metadata

        ctx = PipelineContext(run_id="test")
        kafka_source = KafkaSource.create(
            {"connection": {"bootstrap": "localhost:9092"}}, ctx
        )
        workunits = list(kafka_source.get_workunits())

        first_mce = workunits[0].metadata
        assert isinstance(first_mce, MetadataChangeEvent)
        mock_kafka.assert_called_once()
        mock_kafka_instance.list_topics.assert_called_once()
        assert len(workunits) == 2

    @patch("datahub.ingestion.source.kafka.confluent_kafka.Consumer", autospec=True)
    def test_kafka_source_workunits_topic_pattern(self, mock_kafka):
        mock_kafka_instance = mock_kafka.return_value
        mock_cluster_metadata = MagicMock()
        mock_cluster_metadata.topics = ["test", "foobar", "bazbaz"]
        mock_kafka_instance.list_topics.return_value = mock_cluster_metadata

        ctx = PipelineContext(run_id="test1")
        kafka_source = KafkaSource.create(
            {
                "topic_patterns": {"allow": ["test"]},
                "connection": {"bootstrap": "localhost:9092"},
            },
            ctx,
        )
        workunits = [w for w in kafka_source.get_workunits()]

        mock_kafka.assert_called_once()
        mock_kafka_instance.list_topics.assert_called_once()
        assert len(workunits) == 1

        mock_cluster_metadata.topics = ["test", "test2", "bazbaz"]
        ctx = PipelineContext(run_id="test2")
        kafka_source = KafkaSource.create(
            {
                "topic_patterns": {"allow": ["test.*"]},
                "connection": {"bootstrap": "localhost:9092"},
            },
            ctx,
        )
        workunits = [w for w in kafka_source.get_workunits()]
        assert len(workunits) == 2

    @patch("datahub.ingestion.source.kafka.confluent_kafka.Consumer", autospec=True)
    def test_close(self, mock_kafka):
        mock_kafka_instance = mock_kafka.return_value
        ctx = PipelineContext(run_id="test")
        kafka_source = KafkaSource.create(
            {
                "topic_patterns": {"allow": ["test.*"]},
                "connection": {"bootstrap": "localhost:9092"},
            },
            ctx,
        )
        kafka_source.close()
        assert mock_kafka_instance.close.call_count == 1

    def test_kafka_source_stateful_ingestion_requires_platform_instance(
        self,
    ):
        class StatefulProviderMock:
            def __init__(self, config, ctx):
                self.ctx = ctx
                self.config = config

            def is_stateful_ingestion_configured(self):
                return self.config.stateful_ingestion.enabled

        kafka_source_patcher = unittest.mock.patch.object(
            KafkaSource, "__bases__", (StatefulProviderMock,)
        )

        ctx = PipelineContext(run_id="test", pipeline_name="test")
        with pytest.raises(ConfigurationError):
            with kafka_source_patcher:
                # prevent delattr on __bases__ on context __exit__
                kafka_source_patcher.is_local = True
                KafkaSource.create(
                    {
                        "stateful_ingestion": {"enabled": "true"},
                        "connection": {"bootstrap": "localhost:9092"},
                    },
                    ctx,
                )
