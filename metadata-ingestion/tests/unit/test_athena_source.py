from datetime import datetime
from unittest import mock

import pytest
from freezegun import freeze_time

from datahub.ingestion.api.common import PipelineContext
from src.datahub.ingestion.source.aws.s3_util import make_s3_urn

FROZEN_TIME = "2020-04-14 07:00:00"


@pytest.mark.integration
def test_athena_config_query_location_old_plus_new_value_not_allowed():
    from datahub.ingestion.source.sql.athena import AthenaConfig

    with pytest.raises(ValueError):
        AthenaConfig.parse_obj(
            {
                "aws_region": "us-west-1",
                "s3_staging_dir": "s3://sample-staging-dir/",
                "query_result_location": "s3://query_result_location",
                "work_group": "test-workgroup",
            }
        )


@pytest.mark.integration
def test_athena_config_staging_dir_is_set_as_query_result():
    from datahub.ingestion.source.sql.athena import AthenaConfig

    config = AthenaConfig.parse_obj(
        {
            "aws_region": "us-west-1",
            "s3_staging_dir": "s3://sample-staging-dir/",
            "work_group": "test-workgroup",
        }
    )

    expected_config = AthenaConfig.parse_obj(
        {
            "aws_region": "us-west-1",
            "query_result_location": "s3://sample-staging-dir/",
            "work_group": "test-workgroup",
        }
    )

    assert config.json() == expected_config.json()


@pytest.mark.integration
def test_athena_uri():
    from datahub.ingestion.source.sql.athena import AthenaConfig

    config = AthenaConfig.parse_obj(
        {
            "aws_region": "us-west-1",
            "query_result_location": "s3://query-result-location/",
            "work_group": "test-workgroup",
        }
    )
    assert (
        config.get_sql_alchemy_url()
        == "awsathena+rest://@athena.us-west-1.amazonaws.com:443/?s3_staging_dir=s3%3A%2F%2Fquery-result-location%2F&work_group=test-workgroup&catalog_name=awsdatacatalog&duration_seconds=3600"
    )


@pytest.mark.integration
@freeze_time(FROZEN_TIME)
def test_athena_get_table_properties():
    from pyathena.model import AthenaTableMetadata

    from datahub.ingestion.source.sql.athena import AthenaConfig, AthenaSource

    config = AthenaConfig.parse_obj(
        {
            "aws_region": "us-west-1",
            "s3_staging_dir": "s3://sample-staging-dir/",
            "work_group": "test-workgroup",
        }
    )
    schema: str = "test_schema"
    table: str = "test_table"

    table_metadata = {
        "TableMetadata": {
            "Name": "test",
            "TableType": "testType",
            "CreateTime": datetime.now(),
            "LastAccessTime": datetime.now(),
            "PartitionKeys": [
                {"Name": "testKey", "Type": "string", "Comment": "testComment"}
            ],
            "Parameters": {
                "comment": "testComment",
                "location": "s3://testLocation",
                "inputformat": "testInputFormat",
                "outputformat": "testOutputFormat",
                "serde.serialization.lib": "testSerde",
            },
        },
    }

    mock_cursor = mock.MagicMock()
    mock_inspector = mock.MagicMock()
    mock_inspector.engine.raw_connection().cursor.return_value = mock_cursor
    mock_cursor.get_table_metadata.return_value = AthenaTableMetadata(
        response=table_metadata
    )

    ctx = PipelineContext(run_id="test")
    source = AthenaSource(config=config, ctx=ctx)
    description, custom_properties, location = source.get_table_properties(
        inspector=mock_inspector, table=table, schema=schema
    )
    assert custom_properties == {
        "comment": "testComment",
        "create_time": "2020-04-14 07:00:00",
        "inputformat": "testInputFormat",
        "last_access_time": "2020-04-14 07:00:00",
        "location": "s3://testLocation",
        "outputformat": "testOutputFormat",
        "partition_keys": '[{"name": "testKey", "type": "string", "comment": "testComment"}]',
        "serde.serialization.lib": "testSerde",
        "table_type": "testType",
    }

    assert location == make_s3_urn("s3://testLocation", "PROD")
