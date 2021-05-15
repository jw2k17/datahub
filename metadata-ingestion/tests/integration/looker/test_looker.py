import time
from datetime import datetime
from unittest import mock

from looker_sdk.sdk.api31.models import Dashboard, DashboardElement, Query

from datahub.ingestion.run.pipeline import Pipeline
from tests.test_helpers import mce_helpers


def test_looker_ingest(pytestconfig, tmp_path, mock_time):
    mocked_client = mock.MagicMock()
    with mock.patch(
        "datahub.ingestion.source.looker.LookerDashboardSource._get_looker_client",
        mocked_client,
    ):
        mocked_client.return_value.all_dashboards.return_value = [Dashboard(id="1")]
        mocked_client.return_value.dashboard.return_value = Dashboard(
            id="1",
            title="foo",
            created_at=datetime.utcfromtimestamp(time.time()),
            description="lorem ipsum",
            dashboard_elements=[
                DashboardElement(
                    id="2",
                    type="",
                    subtitle_text="Some text",
                    query=Query(
                        model="data",
                        view="my_view",
                        dynamic_fields='[{"table_calculation":"calc","label":"foobar","expression":"offset(${my_table.value},1)","value_format":null,"value_format_name":"eur","_kind_hint":"measure","_type_hint":"number"}',
                    ),
                )
            ],
        )

        test_resources_dir = pytestconfig.rootpath / "tests/integration/looker"

        pipeline = Pipeline.create(
            {
                "run_id": "looker-test",
                "source": {
                    "type": "looker",
                    "config": {
                        "base_url": "https://looker.company.com",
                        "client_id": "foo",
                        "client_secret": "bar",
                    },
                },
                "sink": {
                    "type": "file",
                    "config": {
                        "filename": f"{tmp_path}/looker_mces.json",
                    },
                },
            }
        )
        pipeline.run()
        pipeline.raise_from_status()

        output = mce_helpers.load_json_file(str(tmp_path / "looker_mces.json"))
        expected = mce_helpers.load_json_file(
            str(test_resources_dir / "expected_output.json")
        )
        mce_helpers.assert_mces_equal(output, expected)
