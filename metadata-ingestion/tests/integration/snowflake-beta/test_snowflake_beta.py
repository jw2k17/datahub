import json
import random
import string
from datetime import datetime, timezone
from unittest import mock

import pandas as pd
from freezegun import freeze_time
from pytest import fixture

from datahub.configuration.common import AllowDenyPattern, DynamicTypedConfig
from datahub.ingestion.glossary.classifier import (
    ClassificationConfig,
    DynamicTypedClassifierConfig,
)
from datahub.ingestion.glossary.datahub_classifier import (
    DataHubClassifierConfig,
    InfoTypeConfig,
    PredictionFactorsAndWeights,
)
from datahub.ingestion.run.pipeline import Pipeline
from datahub.ingestion.run.pipeline_config import PipelineConfig, SourceConfig
from datahub.ingestion.source.snowflake import snowflake_query
from datahub.ingestion.source.snowflake.snowflake_config import SnowflakeV2Config
from datahub.ingestion.source.snowflake.snowflake_query import SnowflakeQuery
from tests.test_helpers import mce_helpers

NUM_TABLES = 10
NUM_COLS = 10
NUM_OPS = 10


def default_query_results(query):  # noqa: C901
    if query == SnowflakeQuery.current_account():
        return [{"CURRENT_ACCOUNT()": "ABC12345"}]
    if query == SnowflakeQuery.current_region():
        return [{"CURRENT_REGION()": "AWS_AP_SOUTH_1"}]
    if query == SnowflakeQuery.show_tags():
        return []
    if query == SnowflakeQuery.current_role():
        return [{"CURRENT_ROLE()": "TEST_ROLE"}]
    elif query == SnowflakeQuery.current_version():
        return [{"CURRENT_VERSION()": "X.Y.Z"}]
    elif query == SnowflakeQuery.current_database():
        return [{"CURRENT_DATABASE()": "TEST_DB"}]
    elif query == SnowflakeQuery.current_schema():
        return [{"CURRENT_SCHEMA()": "TEST_SCHEMA"}]
    elif query == SnowflakeQuery.current_warehouse():
        return [{"CURRENT_WAREHOUSE()": "TEST_WAREHOUSE"}]
    elif query == SnowflakeQuery.show_databases():
        return [
            {
                "name": "TEST_DB",
                "created_on": datetime(2021, 6, 8, 0, 0, 0, 0),
                "comment": "Comment for TEST_DB",
            }
        ]
    elif query == SnowflakeQuery.get_databases("TEST_DB"):
        return [
            {
                "DATABASE_NAME": "TEST_DB",
                "CREATED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "LAST_ALTERED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "COMMENT": "Comment for TEST_DB",
            }
        ]
    elif query == SnowflakeQuery.schemas_for_database("TEST_DB"):
        return [
            {
                "SCHEMA_NAME": "TEST_SCHEMA",
                "CREATED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "LAST_ALTERED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "COMMENT": "comment for TEST_DB.TEST_SCHEMA",
            },
            {
                "SCHEMA_NAME": "TEST2_SCHEMA",
                "CREATED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "LAST_ALTERED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "COMMENT": "comment for TEST_DB.TEST_SCHEMA",
            },
        ]
    elif query == SnowflakeQuery.tables_for_database("TEST_DB"):
        raise Exception("Information schema query returned too much data")
    elif query == SnowflakeQuery.tables_for_schema("TEST_SCHEMA", "TEST_DB"):
        return [
            {
                "TABLE_SCHEMA": "TEST_SCHEMA",
                "TABLE_NAME": "TABLE_{}".format(tbl_idx),
                "CREATED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "LAST_ALTERED": datetime(2021, 6, 8, 0, 0, 0, 0),
                "BYTES": 1024,
                "ROW_COUNT": 10000,
                "COMMENT": "Comment for Table",
                "CLUSTERING_KEY": None,
            }
            for tbl_idx in range(1, NUM_TABLES + 1)
        ]
    elif query == SnowflakeQuery.columns_for_schema("TEST_SCHEMA", "TEST_DB"):
        raise Exception("Information schema query returned too much data")
    elif query in [
        SnowflakeQuery.columns_for_table(
            "TABLE_{}".format(tbl_idx), "TEST_SCHEMA", "TEST_DB"
        )
        for tbl_idx in range(1, NUM_TABLES + 1)
    ]:
        return [
            {
                # "TABLE_CATALOG": "TEST_DB",
                # "TABLE_SCHEMA": "TEST_SCHEMA",
                # "TABLE_NAME": "TABLE_{}".format(tbl_idx),
                "COLUMN_NAME": "COL_{}".format(col_idx),
                "ORDINAL_POSITION": col_idx,
                "IS_NULLABLE": "NO",
                "DATA_TYPE": "TEXT" if col_idx > 1 else "NUMBER",
                "COMMENT": "Comment for column",
                "CHARACTER_MAXIMUM_LENGTH": 255 if col_idx > 1 else None,
                "NUMERIC_PRECISION": None if col_idx > 1 else 38,
                "NUMERIC_SCALE": None if col_idx > 1 else 0,
            }
            for col_idx in range(1, NUM_COLS + 1)
        ]
    elif query in (
        SnowflakeQuery.use_database("TEST_DB"),
        SnowflakeQuery.show_primary_keys_for_schema("TEST_SCHEMA", "TEST_DB"),
        SnowflakeQuery.show_foreign_keys_for_schema("TEST_SCHEMA", "TEST_DB"),
    ):
        return []
    elif query == SnowflakeQuery.get_access_history_date_range():
        return [
            {
                "MIN_TIME": datetime(2021, 6, 8, 0, 0, 0, 0),
                "MAX_TIME": datetime(2022, 6, 7, 7, 17, 0, 0),
            }
        ]
    elif query == snowflake_query.SnowflakeQuery.operational_data_for_time_window(
        1654499820000,
        1654586220000,
    ):
        return [
            {
                "QUERY_START_TIME": datetime(2022, 6, 2, 4, 41, 1, 367000).replace(
                    tzinfo=timezone.utc
                ),
                "QUERY_TEXT": "create or replace table TABLE_{}  as select * from TABLE_2 left join TABLE_3 using COL_1 left join TABLE 4 using COL2".format(
                    op_idx
                ),
                "QUERY_TYPE": "CREATE_TABLE_AS_SELECT",
                "ROWS_INSERTED": 0,
                "ROWS_UPDATED": 0,
                "ROWS_DELETED": 0,
                "BASE_OBJECTS_ACCESSED": json.dumps(
                    [
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_2",
                        },
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_3",
                        },
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_4",
                        },
                    ]
                ),
                "DIRECT_OBJECTS_ACCESSED": json.dumps(
                    [
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_2",
                        },
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_3",
                        },
                        {
                            "columns": [
                                {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_4",
                        },
                    ]
                ),
                "OBJECTS_MODIFIED": json.dumps(
                    [
                        {
                            "columns": [
                                {
                                    "columnId": 0,
                                    "columnName": "COL_{}".format(col_idx),
                                    "directSources": [
                                        {
                                            "columnName": "COL_{}".format(col_idx),
                                            "objectDomain": "Table",
                                            "objectId": 0,
                                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_2",
                                        }
                                    ],
                                }
                                for col_idx in range(1, NUM_COLS + 1)
                            ],
                            "objectDomain": "Table",
                            "objectId": 0,
                            "objectName": "TEST_DB.TEST_SCHEMA.TABLE_{}".format(op_idx),
                        }
                    ]
                ),
                "USER_NAME": "SERVICE_ACCOUNT_TESTS_ADMIN",
                "FIRST_NAME": None,
                "LAST_NAME": None,
                "DISPLAY_NAME": "SERVICE_ACCOUNT_TESTS_ADMIN",
                "EMAIL": "abc@xyz.com",
                "ROLE_NAME": "ACCOUNTADMIN",
            }
            for op_idx in range(1, NUM_OPS + 1)
        ]
    elif query in (
        snowflake_query.SnowflakeQuery.table_to_table_lineage_history(
            1654499820000,
            1654586220000,
        ),
        snowflake_query.SnowflakeQuery.table_to_table_lineage_history(
            1654499820000, 1654586220000, False
        ),
    ):
        return [
            {
                "DOWNSTREAM_TABLE_NAME": "TEST_DB.TEST_SCHEMA.TABLE_{}".format(op_idx),
                "UPSTREAM_TABLE_NAME": "TEST_DB.TEST_SCHEMA.TABLE_2",
                "UPSTREAM_TABLE_COLUMNS": json.dumps(
                    [
                        {"columnId": 0, "columnName": "COL_{}".format(col_idx)}
                        for col_idx in range(1, NUM_COLS + 1)
                    ]
                ),
                "DOWNSTREAM_TABLE_COLUMNS": json.dumps(
                    [
                        {
                            "columnId": 0,
                            "columnName": "COL_{}".format(col_idx),
                            "directSources": [
                                {
                                    "columnName": "COL_{}".format(col_idx),
                                    "objectDomain": "Table",
                                    "objectId": 0,
                                    "objectName": "TEST_DB.TEST_SCHEMA.TABLE_2",
                                }
                            ],
                        }
                        for col_idx in range(1, NUM_COLS + 1)
                    ]
                ),
            }
            for op_idx in range(1, NUM_OPS + 1)
        ]
    elif query == snowflake_query.SnowflakeQuery.external_table_lineage_history(
        1654499820000,
        1654586220000,
    ):
        return []

    elif query == snowflake_query.SnowflakeQuery.show_external_tables():
        return []

    # Unreachable code
    raise Exception(f"Unknown query {query}")


FROZEN_TIME = "2022-06-07 17:00:00"


def random_email():
    return (
        "".join(
            [
                random.choice(string.ascii_lowercase)
                for i in range(random.randint(10, 15))
            ]
        )
        + "@xyz.com"
    )


@freeze_time(FROZEN_TIME)
def test_snowflake_basic(pytestconfig, tmp_path, mock_time, mock_datahub_graph):
    test_resources_dir = pytestconfig.rootpath / "tests/integration/snowflake-beta"

    # Run the metadata ingestion pipeline.
    output_file = tmp_path / "snowflake_test_events.json"
    golden_file = test_resources_dir / "snowflake_beta_golden.json"

    with mock.patch("snowflake.connector.connect") as mock_connect, mock.patch(
        "datahub.ingestion.source.snowflake.snowflake_v2.SnowflakeV2Source.get_sample_values_for_table"
    ) as mock_sample_values:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        sf_cursor.execute.side_effect = default_query_results

        mock_sample_values.return_value = pd.DataFrame(
            data={
                "col_1": [random.randint(0, 100) for i in range(1, 200)],
                "col_2": [random_email() for i in range(1, 200)],
            }
        )

        datahub_classifier_config = DataHubClassifierConfig()
        datahub_classifier_config.confidence_level_threshold = 0.58
        datahub_classifier_config.info_types_config = {
            "Age": InfoTypeConfig(
                Prediction_Factors_and_Weights=PredictionFactorsAndWeights(
                    Name=0, Values=1, Description=0, Datatype=0
                )
            ),
        }
        pipeline = Pipeline(
            config=PipelineConfig(
                run_id="snowflake-beta-2022_06_07-17_00_00",
                source=SourceConfig(
                    type="snowflake",
                    config=SnowflakeV2Config(
                        account_id="ABC12345.ap-south-1.aws",
                        username="TST_USR",
                        password="TST_PWD",
                        include_views=False,
                        match_fully_qualified_names=True,
                        schema_pattern=AllowDenyPattern(allow=["test_db.test_schema"]),
                        include_technical_schema=True,
                        include_table_lineage=True,
                        include_view_lineage=False,
                        include_usage_stats=False,
                        include_operational_stats=True,
                        start_time=datetime(2022, 6, 6, 7, 17, 0, 0).replace(
                            tzinfo=timezone.utc
                        ),
                        end_time=datetime(2022, 6, 7, 7, 17, 0, 0).replace(
                            tzinfo=timezone.utc
                        ),
                        classification=ClassificationConfig(
                            enabled=True,
                            column_pattern=AllowDenyPattern(
                                allow=[".*col_1$", ".*col_2$"]
                            ),
                            classifiers=[
                                DynamicTypedClassifierConfig(
                                    type="datahub", config=datahub_classifier_config
                                )
                            ],
                        ),
                    ),
                ),
                sink=DynamicTypedConfig(
                    type="file", config={"filename": str(output_file)}
                ),
            )
        )
        pipeline.run()
        pipeline.pretty_print_summary()
        pipeline.raise_from_status()

        # Verify the output.

        mce_helpers.check_golden_file(
            pytestconfig,
            output_path=output_file,
            golden_path=golden_file,
            ignore_paths=[],
        )


@freeze_time(FROZEN_TIME)
def test_snowflake_private_link(pytestconfig, tmp_path, mock_time, mock_datahub_graph):
    test_resources_dir = pytestconfig.rootpath / "tests/integration/snowflake-beta"

    # Run the metadata ingestion pipeline.
    output_file = tmp_path / "snowflake_privatelink_test_events.json"
    golden_file = test_resources_dir / "snowflake_privatelink_beta_golden.json"

    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor
        sf_cursor.execute.side_effect = default_query_results

        pipeline = Pipeline(
            config=PipelineConfig(
                run_id="snowflake-beta-2022_06_07-17_00_00",
                source=SourceConfig(
                    type="snowflake",
                    config=SnowflakeV2Config(
                        account_id="ABC12345.ap-south-1.privatelink",
                        username="TST_USR",
                        password="TST_PWD",
                        include_views=False,
                        schema_pattern=AllowDenyPattern(allow=["test_schema"]),
                        include_technical_schema=True,
                        include_table_lineage=True,
                        include_column_lineage=False,
                        include_view_lineage=False,
                        include_usage_stats=False,
                        include_operational_stats=False,
                        start_time=datetime(2022, 6, 6, 7, 17, 0, 0).replace(
                            tzinfo=timezone.utc
                        ),
                        end_time=datetime(2022, 6, 7, 7, 17, 0, 0).replace(
                            tzinfo=timezone.utc
                        ),
                    ),
                ),
                sink=DynamicTypedConfig(
                    type="file", config={"filename": str(output_file)}
                ),
            )
        )
        pipeline.run()
        pipeline.pretty_print_summary()
        pipeline.raise_from_status()

        # Verify the output.

        mce_helpers.check_golden_file(
            pytestconfig,
            output_path=output_file,
            golden_path=golden_file,
            ignore_paths=[],
        )


def query_permission_error_override(override_for_query, error_msg):
    def my_function(query):
        if query in override_for_query:
            raise Exception(error_msg)
        else:
            return default_query_results(query)

    return my_function


def query_permission_response_override(override_for_query, response):
    def my_function(query):
        if query in override_for_query:
            return response
        else:
            return default_query_results(query)

    return my_function


@fixture(scope="function")
def snowflake_pipeline_config(tmp_path):

    output_file = tmp_path / "snowflake_test_events_permission_error.json"
    config = PipelineConfig(
        run_id="snowflake-beta-2022_06_07-17_00_00",
        source=SourceConfig(
            type="snowflake",
            config=SnowflakeV2Config(
                account_id="ABC12345.ap-south-1.aws",
                username="TST_USR",
                password="TST_PWD",
                role="TEST_ROLE",
                warehouse="TEST_WAREHOUSE",
                include_views=False,
                include_technical_schema=True,
                match_fully_qualified_names=True,
                schema_pattern=AllowDenyPattern(allow=["test_db.test_schema"]),
                include_view_lineage=False,
                include_usage_stats=False,
                start_time=datetime(2022, 6, 6, 7, 17, 0, 0).replace(
                    tzinfo=timezone.utc
                ),
                end_time=datetime(2022, 6, 7, 7, 17, 0, 0).replace(tzinfo=timezone.utc),
            ),
        ),
        sink=DynamicTypedConfig(type="file", config={"filename": str(output_file)}),
    )
    return config


def role_not_granted_to_user(**kwargs):
    raise Exception(
        "250001 (08001): Failed to connect to DB: abc12345.ap-south-1.snowflakecomputing.com:443. Role 'TEST_ROLE' specified in the connect string is not granted to this user. Contact your local system administrator, or attempt to login with another role, e.g. PUBLIC"
    )


@freeze_time(FROZEN_TIME)
def test_snowflake_missing_role_access_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):
    with mock.patch("snowflake.connector.connect") as mock_connect:
        # Snowflake connection fails role not granted error
        mock_connect.side_effect = role_not_granted_to_user

        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "permission-error" in pipeline.source.get_report().failures.keys()


@freeze_time(FROZEN_TIME)
def test_snowflake_missing_warehouse_access_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):
    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Current warehouse query leads to blank result
        sf_cursor.execute.side_effect = query_permission_response_override(
            [SnowflakeQuery.current_warehouse()],
            [(None,)],
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "permission-error" in pipeline.source.get_report().failures.keys()


@freeze_time(FROZEN_TIME)
def test_snowflake_no_databases_with_access_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):
    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in listing databases
        sf_cursor.execute.side_effect = query_permission_error_override(
            [SnowflakeQuery.get_databases("TEST_DB")],
            "Database 'TEST_DB' does not exist or not authorized.",
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "permission-error" in pipeline.source.get_report().failures.keys()


@freeze_time(FROZEN_TIME)
def test_snowflake_no_tables_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):
    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in listing databases
        sf_cursor.execute.side_effect = query_permission_response_override(
            [SnowflakeQuery.tables_for_schema("TEST_SCHEMA", "TEST_DB")],
            [],
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "permission-error" in pipeline.source.get_report().failures.keys()


@freeze_time(FROZEN_TIME)
def test_snowflake_list_columns_error_causes_pipeline_warning(
    pytestconfig,
    snowflake_pipeline_config,
):

    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in listing columns
        sf_cursor.execute.side_effect = query_permission_error_override(
            [
                SnowflakeQuery.columns_for_table(
                    "TABLE_{}".format(tbl_idx), "TEST_SCHEMA", "TEST_DB"
                )
                for tbl_idx in range(1, NUM_TABLES + 1)
            ],
            "Database 'TEST_DB' does not exist or not authorized.",
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "columns-for-table" in pipeline.source.get_report().warnings.keys()
        assert len(pipeline.source.get_report().failures) == 0


@freeze_time(FROZEN_TIME)
def test_snowflake_list_primary_keys_error_causes_pipeline_warning(
    pytestconfig,
    snowflake_pipeline_config,
):

    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in listing keys leads to warning
        sf_cursor.execute.side_effect = query_permission_error_override(
            [SnowflakeQuery.show_primary_keys_for_schema("TEST_SCHEMA", "TEST_DB")],
            "Insufficient privileges to operate on TEST_DB",
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "keys-for-table" in pipeline.source.get_report().warnings.keys()
        assert len(pipeline.source.get_report().failures) == 0


@freeze_time(FROZEN_TIME)
def test_snowflake_missing_snowflake_lineage_access_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):

    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in getting lineage
        sf_cursor.execute.side_effect = query_permission_error_override(
            [
                snowflake_query.SnowflakeQuery.table_to_table_lineage_history(
                    1654499820000,
                    1654586220000,
                )
            ],
            "Database 'SNOWFLAKE' does not exist or not authorized.",
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert (
            "lineage-permission-error" in pipeline.source.get_report().failures.keys()
        )


@freeze_time(FROZEN_TIME)
def test_snowflake_missing_snowflake_operations_access_causes_pipeline_failure(
    pytestconfig,
    snowflake_pipeline_config,
):

    with mock.patch("snowflake.connector.connect") as mock_connect:
        sf_connection = mock.MagicMock()
        sf_cursor = mock.MagicMock()
        mock_connect.return_value = sf_connection
        sf_connection.cursor.return_value = sf_cursor

        # Error in getting access history date range
        sf_cursor.execute.side_effect = query_permission_error_override(
            [snowflake_query.SnowflakeQuery.get_access_history_date_range()],
            "Database 'SNOWFLAKE' does not exist or not authorized.",
        )
        pipeline = Pipeline(snowflake_pipeline_config)
        pipeline.run()
        assert "usage-permission-error" in pipeline.source.get_report().failures.keys()
