import os
from unittest.mock import patch

from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.source.snowflake.snowflake_queries import SnowflakeQueriesSource


@patch("snowflake.connector.connect")
def test_source_close_cleans_tmp(snowflake_connect, tmp_path):
    with patch("tempfile.tempdir", str(tmp_path)):
        source = SnowflakeQueriesSource.create(
            {
                "connection": {
                    "account_id": "ABC12345.ap-south-1.aws",
                    "username": "TST_USR",
                    "password": "TST_PWD",
                }
            },
            PipelineContext("run-id"),
        )
        assert len(os.listdir(tmp_path)) > 0
        # This closes QueriesExtractor which in turn closes SqlParsingAggregator
        source.close()
        assert len(os.listdir(tmp_path)) == 0


@patch("snowflake.connector.connect")
def test_user_identifiers_email_as_identifier(snowflake_connect, tmp_path):
    with patch("tempfile.tempdir", str(tmp_path)):
        source = SnowflakeQueriesSource.create(
            {
                "connection": {
                    "account_id": "ABC12345.ap-south-1.aws",
                    "username": "TST_USR",
                    "password": "TST_PWD",
                },
                "email_as_user_identifier": True,
                "email_domain": "example.com",
            },
            PipelineContext("run-id"),
        )
        assert (
            source.identifiers.get_user_identifier("username", "username@example.com")
            == "username@example.com"
        )
        assert (
            source.identifiers.get_user_identifier("username", None)
            == "username@example.com"
        )


@patch("snowflake.connector.connect")
def test_user_identifiers_username_as_identifier(snowflake_connect, tmp_path):
    with patch("tempfile.tempdir", str(tmp_path)):
        source = SnowflakeQueriesSource.create(
            {
                "connection": {
                    "account_id": "ABC12345.ap-south-1.aws",
                    "username": "TST_USR",
                    "password": "TST_PWD",
                },
                "email_as_user_identifier": False,
            },
            PipelineContext("run-id"),
        )
        assert (
            source.identifiers.get_user_identifier("username", "username@example.com")
            == "username"
        )
        assert source.identifiers.get_user_identifier("username", None) == "username"
