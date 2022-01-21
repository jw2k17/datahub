import json
from unittest import mock

from freezegun import freeze_time

from datahub.ingestion.run.pipeline import Pipeline
from tests.test_helpers import mce_helpers

FROZEN_TIME = "2021-12-07 07:00:00"

test_resources_dir = None


def _read_response(file_name):
    response_json_path = f"{test_resources_dir}/setup/{file_name}"
    with open(response_json_path) as file:
        data = json.loads(file.read())
        return data


def side_effect_query_metadata(query):
    if "workbooksConnection (first:0" in query:
        return _read_response("workbooksConnection_0.json")

    if "workbooksConnection (first:8" in query:
        return _read_response("workbooksConnection_8.json")

    if "publishedDatasourcesConnection (first:0" in query:
        return _read_response("publishedDatasourcesConnection_0.json")

    if "publishedDatasourcesConnection (first:2" in query:
        return _read_response("publishedDatasourcesConnection_2.json")

    if "customSQLTablesConnection (first:0" in query:
        return _read_response("customSQLTablesConnection_0.json")

    if "customSQLTablesConnection (first:2" in query:
        return _read_response("customSQLTablesConnection_2.json")


@freeze_time(FROZEN_TIME)
def test_tableau_ingest(pytestconfig, tmp_path):
    attrs = {
        "auth.sign_in.return_value": None,
        "metadata.query.side_effect": side_effect_query_metadata,
    }
    mocked_client = mock.MagicMock(**attrs)
    with mock.patch("tableauserverclient.Server") as mock_sdk:
        mock_sdk.return_value = mocked_client

        global test_resources_dir
        test_resources_dir = pytestconfig.rootpath / "tests/integration/tableau"

        pipeline = Pipeline.create(
            {
                "run_id": "tableau-test",
                "source": {
                    "type": "tableau",
                    "config": {
                        "username": "username",
                        "password": "pass`",
                        "connect_uri": "https://prod-ca-a.online.tableau.com/",
                        "site": "acryl",
                        "projects": ["default", "Project 2"],
                        "default_schema": "public",
                    },
                },
                "sink": {
                    "type": "file",
                    "config": {
                        "filename": f"{tmp_path}/tableau_mces.json",
                    },
                },
            }
        )
        pipeline.run()
        pipeline.raise_from_status()

        mce_helpers.check_golden_file(
            pytestconfig,
            output_path=f"{tmp_path}/tableau_mces.json",
            golden_path=test_resources_dir / "tableau_mces_golden.json",
            ignore_paths=mce_helpers.IGNORE_PATH_TIMESTAMPS,
        )
