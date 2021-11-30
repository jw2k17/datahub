import logging
import unittest
from unittest.mock import Mock

from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.cdh_hive import CDH_HiveSource, CDHHiveConfig
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import DatasetSnapshot
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    NumberTypeClass,
    SchemaField,
    SchemalessClass,
    StringTypeClass,
)
from datahub.metadata.schema_classes import (
    AuditStampClass,
    ChangeTypeClass,
    DatasetFieldProfileClass,
    DatasetProfileClass,
    DatasetPropertiesClass,
    OwnerClass,
    OwnershipClass,
    SchemaFieldDataTypeClass,
    SchemaMetadataClass,
)

logger = logging.getLogger(__name__)


class CDHHiveSourceTest(unittest.TestCase):
    def test_cdh_hive_source_configuration(self):
        """
        Test if the config is accepted without throwing an exception
        """
        ctx = PipelineContext(run_id="test")
        hive_source = CDH_HiveSource.create(CDHHiveConfig(), ctx)
        url, _, _ = hive_source.config.get_url()
        assert url == "jdbc:hive2://localhost:10000/default;"

    def test_hive_source_workunits(self):
        """
        test that the ingestion is able to pull out a workunit
        """
        mock_engine = Mock(
            description=[("id",), ("name",)],
        )
        mock_execute = Mock()
        mock_execute.side_effect = [
            "show tables",
            "describe table",
            "describe_formatted table",
            "show table",
            "select * from table",
        ]  # show tables, show
        mock_fetch = Mock()
        all_tables_in_schema = [("my_first_table",)]
        describe_value = [
            (
                "id",
                "bigint",
                "",
            ),
            (
                "name",
                "string",
                "",
            ),
        ]
        table_formatted_stats = [
            ("# col_name            ", "data_type           ", "comment             "),
            ("", None, None),
            ("foo", "int", ""),
            ("bar", "string", ""),
            ("", None, None),
            ("# Detailed Table Information", None, None),
            ("Database:           ", "default             ", None),
            ("Owner:              ", "root                ", None),
            ("CreateTime:         ", "Sun Aug 01 09:27:13 UTC 2021", None),
            ("LastAccessTime:     ", "UNKNOWN             ", None),
            ("Retention:          ", "0                   ", None),
            (
                "Location:           ",
                "hdfs://namenode:8020/user/hive/warehouse/my_first_table",
                None,
            ),
            ("Table Type:         ", "MANAGED_TABLE       ", None),
            ("Table Parameters:", None, None),
            ("", "numFiles            ", "1                   "),
            ("", "numRows             ", "0                   "),
            ("", "rawDataSize         ", "0                   "),
            ("", "totalSize           ", "5812                "),
            ("", "transient_lastDdlTime", "1635681747          "),
            ("", None, None),
            ("# Storage Information", None, None),
            (
                "SerDe Library:      ",
                "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe",
                None,
            ),
            ("InputFormat:        ", "org.apache.hadoop.mapred.TextInputFormat", None),
            (
                "OutputFormat:       ",
                "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
                None,
            ),
            ("Compressed:         ", "No                  ", None),
            ("Num Buckets:        ", "-1                  ", None),
            ("Bucket Columns:     ", "[]                  ", None),
            ("Sort Columns:       ", "[]                  ", None),
            ("Storage Desc Params:", None, None),
            ("", "serialization.format", "1                   "),
        ]
        dataframe = [
            (1, "mary"),
            (1, "mary"),
            (1, "mary"),
            (1, "mary"),
        ]
        mock_fetch.side_effect = [
            all_tables_in_schema,
            describe_value,
            table_formatted_stats,
            all_tables_in_schema,
            dataframe,
        ]

        mock_engine.execute = mock_execute
        mock_engine.fetchall = mock_fetch

        ctx = PipelineContext(run_id="test")
        src = CDH_HiveSource(CDHHiveConfig(), ctx)
        yield_dataset = src.loop_tables(mock_engine, "default", CDHHiveConfig())
        generated_dataset = next(yield_dataset)  # type: ignore
        yield_profile = src.loop_profiler(mock_engine, "default", CDHHiveConfig())
        generated_profile = next(yield_profile)  # type: ignore
        expected_dataset = MetadataWorkUnit(
            id="default.my_first_table",
            mce=MetadataChangeEvent(
                proposedSnapshot=DatasetSnapshot(
                    urn="urn:li:dataset:(urn:li:dataPlatform:hive,default.my_first_table,PROD)",
                    aspects=[
                        OwnershipClass(
                            owners=[
                                OwnerClass(
                                    owner="urn:li:corpuser:root",
                                    type="DATAOWNER",
                                )
                            ],
                        ),
                        DatasetPropertiesClass(
                            customProperties={
                                "table_location": "hdfs://namenode:8020/user/hive/warehouse/my_first_table",
                                "table_type": "MANAGED_TABLE",
                            },
                            description="",
                        ),
                        SchemaMetadataClass(
                            schemaName="default.my_first_table",
                            version=0,
                            hash="",
                            platform="urn:li:dataPlatform:hive",
                            platformSchema=SchemalessClass(),
                            created=AuditStampClass(
                                time=0, actor="urn:li:corpuser:etl"
                            ),
                            lastModified=AuditStampClass(
                                time=0, actor="urn:li:corpuser:etl"
                            ),
                            fields=[
                                SchemaField(
                                    fieldPath="id",
                                    nativeDataType="'bigint'",
                                    type=SchemaFieldDataTypeClass(
                                        type=NumberTypeClass()
                                    ),
                                    description="",
                                    nullable=False,
                                    recursive=False,
                                ),
                                SchemaField(
                                    fieldPath="name",
                                    nativeDataType="'string'",
                                    type=SchemaFieldDataTypeClass(
                                        type=StringTypeClass()
                                    ),
                                    description="",
                                    nullable=False,
                                    recursive=False,
                                ),
                            ],
                            primaryKeys=None,
                            foreignKeysSpecs=None,
                        ),
                    ],
                )
            ),
        )
        expected_profile = MetadataWorkUnit(
            id="profile-default.my_first_table",
            mcp=MetadataChangeProposalWrapper(
                entityType="dataset",
                entityUrn="urn:li:dataset:(urn:li:dataPlatform:hive,default.my_first_table,PROD)",
                changeType=ChangeTypeClass.UPSERT,
                aspectName="datasetProfile",
                aspect=DatasetProfileClass(
                    timestampMillis=0,
                    rowCount=4,
                    columnCount=2,
                    fieldProfiles=[
                        DatasetFieldProfileClass(
                            fieldPath="id",
                            uniqueCount=0,
                            uniqueProportion=0.0,
                            nullCount=0,
                            nullProportion=0.0,
                            min=str(1),
                            max=str(1),
                            median="",
                            mean=str(1.0),
                            sampleValues=["1", "1", "1"],
                        ),
                        DatasetFieldProfileClass(
                            fieldPath="name",
                            uniqueCount=0,
                            uniqueProportion=0.0,
                            nullCount=0,
                            nullProportion=0.0,
                            min="",
                            max="",
                            median="",
                            mean="",
                            sampleValues=["mary", "mary", "mary"],
                        ),
                    ],
                ),
            ),
        )

        generated_profile.metadata.aspect.timestampMillis = 0
        logger.error(generated_dataset)
        logger.error("-------------")
        logger.error(expected_dataset)
        self.assertEqual(generated_dataset, expected_dataset)
        self.assertEqual(generated_profile, expected_profile)
