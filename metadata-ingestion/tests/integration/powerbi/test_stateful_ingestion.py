from typing import Optional, cast
from unittest import mock

from freezegun import freeze_time

from datahub.ingestion.run.pipeline import Pipeline
from datahub.ingestion.source.powerbi.powerbi import PowerBiDashboardSource
from datahub.ingestion.source.state.checkpoint import Checkpoint
from datahub.ingestion.source.state.entity_removal_state import GenericCheckpointState
from tests.test_helpers.state_helpers import (
    validate_all_providers_have_committed_successfully,
)

FROZEN_TIME = "2022-02-03 07:00:00"


def register_mock_api_state1(request_mock):
    api_vs_response = {
        "https://api.powerbi.com/v1.0/myorg/groups": {
            "method": "GET",
            "status_code": 200,
            "json": {
                "value": [
                    {
                        "id": "64ED5CAD-7C10-4684-8180-826122881108",
                        "isReadOnly": True,
                        "name": "Workspace 1",
                        "type": "Workspace",
                    },
                ]
            },
        },
        "https://api.powerbi.com/v1.0/myorg/groups/64ED5CAD-7C10-4684-8180-826122881108/dashboards": {
            "method": "GET",
            "status_code": 200,
            "json": {
                "value": [
                    {
                        "id": "7D668CAD-7FFC-4505-9215-655BCA5BEBAE",
                        "isReadOnly": True,
                        "displayName": "marketing",
                        "embedUrl": "https://localhost/dashboards/embed/1",
                        "webUrl": "https://localhost/dashboards/web/1",
                    },
                    {
                        "id": "e41cbfe7-9f54-40ad-8d6a-043ab97cf303",
                        "isReadOnly": True,
                        "displayName": "sales",
                        "embedUrl": "https://localhost/dashboards/embed/1",
                        "webUrl": "https://localhost/dashboards/web/1",
                    },
                ]
            },
        },
        "https://api.powerbi.com/v1.0/myorg/groups/64ED5CAD-7C10-4684-8180-826122881108/dashboards/7D668CAD-7FFC-4505-9215-655BCA5BEBAE/tiles": {
            "method": "GET",
            "status_code": 200,
            "json": {"value": []},
        },
        "https://api.powerbi.com/v1.0/myorg/groups/64ED5CAD-7C10-4684-8180-826122881108/dashboards/e41cbfe7-9f54-40ad-8d6a-043ab97cf303/tiles": {
            "method": "GET",
            "status_code": 200,
            "json": {"value": []},
        },
    }

    for url in api_vs_response.keys():
        request_mock.register_uri(
            api_vs_response[url]["method"],
            url,
            json=api_vs_response[url]["json"],
            status_code=api_vs_response[url]["status_code"],
        )


def register_mock_api_state2(request_mock):
    api_vs_response = {
        "https://api.powerbi.com/v1.0/myorg/groups": {
            "method": "GET",
            "status_code": 200,
            "json": {
                "value": [
                    {
                        "id": "64ED5CAD-7C10-4684-8180-826122881108",
                        "isReadOnly": True,
                        "name": "Workspace 1",
                        "type": "Workspace",
                    },
                ]
            },
        },
        "https://api.powerbi.com/v1.0/myorg/groups/64ED5CAD-7C10-4684-8180-826122881108/dashboards": {
            "method": "GET",
            "status_code": 200,
            "json": {
                "value": [
                    {
                        "id": "7D668CAD-7FFC-4505-9215-655BCA5BEBAE",
                        "isReadOnly": True,
                        "displayName": "marketing",
                        "embedUrl": "https://localhost/dashboards/embed/1",
                        "webUrl": "https://localhost/dashboards/web/1",
                    }
                ]
            },
        },
        "https://api.powerbi.com/v1.0/myorg/groups/64ED5CAD-7C10-4684-8180-826122881108/dashboards/7D668CAD-7FFC-4505-9215-655BCA5BEBAE/tiles": {
            "method": "GET",
            "status_code": 200,
            "json": {"value": []},
        },
    }

    for url in api_vs_response.keys():
        request_mock.register_uri(
            api_vs_response[url]["method"],
            url,
            json=api_vs_response[url]["json"],
            status_code=api_vs_response[url]["status_code"],
        )


def default_source_config():
    return {
        "client_id": "foo",
        "client_secret": "bar",
        "tenant_id": "0B0C960B-FCDF-4D0F-8C45-2E03BB59DDEB",
        "workspace_id": "64ED5CAD-7C10-4684-8180-826122881108",
        "extract_lineage": False,
        "extract_reports": False,
        "enable_admin_api": False,
        "extract_ownership": False,
        "stateful_ingestion": {
            "enabled": True,
        },
        "convert_lineage_urns_to_lowercase": False,
        "workspace_id_pattern": {"allow": ["64ED5CAD-7C10-4684-8180-826122881108"]},
        "dataset_type_mapping": {
            "PostgreSql": "postgres",
            "Oracle": "oracle",
        },
        "env": "DEV",
    }


def mock_msal_cca(*args, **kwargs):
    class MsalClient:
        def acquire_token_for_client(self, *args, **kwargs):
            return {
                "access_token": "dummy",
            }

    return MsalClient()


def get_current_checkpoint_from_pipeline(
    pipeline: Pipeline,
) -> Optional[Checkpoint[GenericCheckpointState]]:
    powerbi_source = cast(PowerBiDashboardSource, pipeline.source)
    return powerbi_source.get_current_checkpoint(
        powerbi_source.stale_entity_removal_handler.job_id
    )


def ingest(pipeline_name, tmp_path):
    config_dict = {
        "pipeline_name": pipeline_name,
        "source": {
            "type": "powerbi",
            "config": {
                **default_source_config(),
            },
        },
        "sink": {
            "type": "file",
            "config": {
                "filename": f"{tmp_path}/powerbi_mces.json",
            },
        },
    }

    pipeline = Pipeline.create(config_dict)
    pipeline.run()
    pipeline.raise_from_status()

    return pipeline


@freeze_time(FROZEN_TIME)
@mock.patch("msal.ConfidentialClientApplication", side_effect=mock_msal_cca)
def test_powerbi_stateful_ingestion(
    mock_msal, pytestconfig, tmp_path, mock_time, requests_mock
):

    register_mock_api_state1(request_mock=requests_mock)
    pipeline1 = ingest("run1", tmp_path)
    checkpoint1 = get_current_checkpoint_from_pipeline(pipeline1)
    assert checkpoint1
    assert checkpoint1.state

    register_mock_api_state2(request_mock=requests_mock)
    pipeline2 = ingest("run2", tmp_path)
    checkpoint2 = get_current_checkpoint_from_pipeline(pipeline2)
    assert checkpoint2
    assert checkpoint2.state

    # Validate that all providers have committed successfully.
    validate_all_providers_have_committed_successfully(
        pipeline=pipeline1, expected_providers=1
    )
    validate_all_providers_have_committed_successfully(
        pipeline=pipeline2, expected_providers=1
    )

    # Perform all assertions on the states. The deleted Dashboard should not be
    # part of the second state
    state1 = checkpoint1.state
    state2 = checkpoint2.state

    difference_dashboard_urns = list(
        state1.get_urns_not_in(type="dashboard", other_checkpoint_state=state2)
    )

    print(difference_dashboard_urns)
