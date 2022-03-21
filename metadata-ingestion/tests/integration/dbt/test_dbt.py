from os import PathLike
from typing import Any, Dict, Optional, Union, cast
from unittest.mock import patch

import pytest
import requests_mock
from freezegun import freeze_time

from datahub.ingestion.run.pipeline import Pipeline
from datahub.ingestion.source.dbt import DBTSource
from datahub.ingestion.source.state.checkpoint import Checkpoint
from datahub.ingestion.source.state.sql_common_state import (
    BaseSQLAlchemyCheckpointState,
)
from tests.test_helpers.state_helpers import (
    run_and_get_pipeline,
    validate_all_providers_have_committed_successfully,
)

FROZEN_TIME = "2022-02-03 07:00:00"
GMS_PORT = 8080
GMS_SERVER = f"http://localhost:{GMS_PORT}"


class DbtTestConfig:
    def __init__(
        self,
        run_id: str,
        dbt_metadata_uri_prefix: str,
        test_resources_dir: Union[str, PathLike],
        tmp_path: Union[str, PathLike],
        output_file: Union[str, PathLike],
        golden_file: Union[str, PathLike],
        source_config_modifiers: Optional[Dict[str, Any]] = None,
        sink_config_modifiers: Optional[Dict[str, Any]] = None,
    ):

        if source_config_modifiers is None:
            source_config_modifiers = {}

        if sink_config_modifiers is None:
            sink_config_modifiers = {}

        self.run_id = run_id

        self.manifest_path = f"{dbt_metadata_uri_prefix}/dbt_manifest.json"
        self.catalog_path = f"{dbt_metadata_uri_prefix}/dbt_catalog.json"
        self.sources_path = f"{dbt_metadata_uri_prefix}/dbt_sources.json"
        self.target_platform = "postgres"

        self.output_path = f"{tmp_path}/{output_file}"

        self.golden_path = f"{test_resources_dir}/{golden_file}"
        self.source_config = dict(
            {
                "manifest_path": self.manifest_path,
                "catalog_path": self.catalog_path,
                "sources_path": self.sources_path,
                "target_platform": self.target_platform,
                "enable_meta_mapping": False,
                "write_semantics": "OVERRIDE",
                "meta_mapping": {
                    "business_owner": {
                        "match": ".*",
                        "operation": "add_owner",
                        "config": {"owner_type": "user"},
                    },
                    "has_pii": {
                        "match": True,
                        "operation": "add_tag",
                        "config": {"tag": "has_pii_test"},
                    },
                    "int_property": {
                        "match": 1,
                        "operation": "add_tag",
                        "config": {"tag": "int_meta_property"},
                    },
                    "double_property": {
                        "match": 2.5,
                        "operation": "add_term",
                        "config": {"term": "double_meta_property"},
                    },
                    "data_governance.team_owner": {
                        "match": "Finance",
                        "operation": "add_term",
                        "config": {"term": "Finance_test"},
                    },
                },
            },
            **source_config_modifiers,
        )

        self.sink_config = dict(
            {
                "filename": self.output_path,
            },
            **sink_config_modifiers,
        )


@pytest.mark.integration
@requests_mock.Mocker(kw="req_mock")
def test_dbt_ingest(pytestconfig, tmp_path, mock_time, **kwargs):
    tmp_path = "/tmp"
    test_resources_dir = pytestconfig.rootpath / "tests/integration/dbt"

    with open(test_resources_dir / "dbt_manifest.json", "r") as f:
        kwargs["req_mock"].get(
            "http://some-external-repo/dbt_manifest.json", text=f.read()
        )

    with open(test_resources_dir / "dbt_catalog.json", "r") as f:
        kwargs["req_mock"].get(
            "http://some-external-repo/dbt_catalog.json", text=f.read()
        )

    with open(test_resources_dir / "dbt_sources.json", "r") as f:
        kwargs["req_mock"].get(
            "http://some-external-repo/dbt_sources.json", text=f.read()
        )

    config_variants = [
        DbtTestConfig(
            "dbt-test-with-schemas",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_with_schemas_mces.json",
            "dbt_with_schemas_mces_golden.json",
            source_config_modifiers={
                "load_schemas": True,
                "disable_dbt_node_creation": True,
                "enable_meta_mapping": True,
            },
        ),
        DbtTestConfig(
            "dbt-test-with-external-metadata-files",
            "http://some-external-repo",
            test_resources_dir,
            tmp_path,
            "dbt_with_external_metadata_files_mces.json",
            "dbt_with_external_metadata_files_mces_golden.json",
            source_config_modifiers={
                "load_schemas": True,
                "disable_dbt_node_creation": True,
            },
        ),
        DbtTestConfig(
            "dbt-test-without-schemas",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_without_schemas_mces.json",
            "dbt_without_schemas_mces_golden.json",
            source_config_modifiers={
                "load_schemas": False,
                "disable_dbt_node_creation": True,
            },
        ),
        DbtTestConfig(
            "dbt-test-without-schemas-with-filter",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_without_schemas_with_filter_mces.json",
            "dbt_without_schemas_with_filter_mces_golden.json",
            source_config_modifiers={
                "load_schemas": False,
                "node_name_pattern": {
                    "deny": ["source.sample_dbt.pagila.payment_p2020_06"]
                },
                "disable_dbt_node_creation": True,
            },
        ),
        DbtTestConfig(
            "dbt-test-with-schemas-dbt-enabled",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_enabled_with_schemas_mces.json",
            "dbt_enabled_with_schemas_mces_golden.json",
            source_config_modifiers={"load_schemas": True, "enable_meta_mapping": True},
        ),
        DbtTestConfig(
            "dbt-test-without-schemas-dbt-enabled",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_enabled_without_schemas_mces.json",
            "dbt_enabled_without_schemas_mces_golden.json",
            source_config_modifiers={"load_schemas": False},
        ),
        DbtTestConfig(
            "dbt-test-without-schemas-with-filter-dbt-enabled",
            test_resources_dir,
            test_resources_dir,
            tmp_path,
            "dbt_enabled_without_schemas_with_filter_mces.json",
            "dbt_enabled_without_schemas_with_filter_mces_golden.json",
            source_config_modifiers={
                "load_schemas": False,
                "node_name_pattern": {
                    "deny": ["source.sample_dbt.pagila.payment_p2020_06"]
                },
            },
        ),
    ]

    for config in config_variants:
        # test manifest, catalog, sources are generated from https://github.com/kevinhu/sample-dbt
        pipeline = Pipeline.create(
            {
                "run_id": config.run_id,
                "source": {"type": "dbt", "config": config.source_config},
                "sink": {
                    "type": "file",
                    "config": config.sink_config,
                },
            }
        )
        pipeline.run()
        pipeline.raise_from_status()

        # mce_helpers.check_golden_file(
        #     pytestconfig,
        #     output_path=config.output_path,
        #     golden_path=config.golden_path,
        # )


def get_current_checkpoint_from_pipeline(
    pipeline: Pipeline,
) -> Optional[Checkpoint]:
    dbt_source = cast(DBTSource, pipeline.source)
    return dbt_source.get_current_checkpoint(dbt_source.get_default_ingestion_job_id())


@pytest.mark.integration
@freeze_time(FROZEN_TIME)
def test_dbt_stateful(pytestconfig, tmp_path, mock_time, mock_datahub_graph):
    test_resources_dir = pytestconfig.rootpath / "tests/integration/dbt"

    manifest_path = "{}/dbt_manifest.json".format(test_resources_dir)
    catalog_path = "{}/dbt_catalog.json".format(test_resources_dir)
    sources_path = "{}/dbt_sources.json".format(test_resources_dir)

    manifest_path_deleted_actor = "{}/dbt_manifest_deleted_actor.json".format(
        test_resources_dir
    )
    catalog_path_deleted_actor = "{}/dbt_catalog_deleted_actor.json".format(
        test_resources_dir
    )
    sources_path_deleted_actor = "{}/dbt_sources_deleted_actor.json".format(
        test_resources_dir
    )

    stateful_config = {
        "stateful_ingestion": {
            "enabled": True,
            "remove_stale_metadata": True,
            "state_provider": {
                "type": "datahub",
                "config": {"datahub_api": {"server": GMS_SERVER}},
            },
        },
    }

    scd_before_deletion: Dict[str, Any] = {
        "manifest_path": manifest_path,
        "catalog_path": catalog_path,
        "sources_path": sources_path,
        "target_platform": "postgres",
        "load_schemas": True,
        # enable stateful ingestion
        **stateful_config,
    }

    scd_after_deletion: Dict[str, Any] = {
        "manifest_path": manifest_path_deleted_actor,
        "catalog_path": catalog_path_deleted_actor,
        "sources_path": sources_path_deleted_actor,
        "target_platform": "postgres",
        "load_schemas": True,
        # enable stateful ingestion
        **stateful_config,
    }

    pipeline_config_dict: Dict[str, Any] = {
        "source": {
            "type": "dbt",
            "config": scd_before_deletion,
        },
        "sink": {
            # we are not really interested in the resulting events for this test
            "type": "console"
        },
        "pipeline_name": "statefulpipeline",
    }

    with patch(
        "datahub.ingestion.source.state_provider.datahub_ingestion_checkpointing_provider.DataHubGraph",
        mock_datahub_graph,
    ) as mock_checkpoint:

        mock_checkpoint.return_value = mock_datahub_graph

        # Do the first run of the pipeline and get the default job's checkpoint.
        pipeline_run1 = run_and_get_pipeline(pipeline_config_dict)
        checkpoint1 = get_current_checkpoint_from_pipeline(pipeline_run1)

        assert checkpoint1
        assert checkpoint1.state

        # Set dbt config where actor table is deleted.
        pipeline_config_dict["source"]["config"] = scd_after_deletion
        # Do the second run of the pipeline.
        pipeline_run2 = run_and_get_pipeline(pipeline_config_dict)
        checkpoint2 = get_current_checkpoint_from_pipeline(pipeline_run2)

        assert checkpoint2
        assert checkpoint2.state

        # Perform all assertions on the states. The deleted table should not be
        # part of the second state
        state1 = cast(BaseSQLAlchemyCheckpointState, checkpoint1.state)
        state2 = cast(BaseSQLAlchemyCheckpointState, checkpoint2.state)
        difference_urns = list(state1.get_table_urns_not_in(state2))

        assert len(difference_urns) == 2

        urn1 = "urn:li:dataset:(urn:li:dataPlatform:dbt,pagila.public.actor,PROD)"
        urn2 = "urn:li:dataset:(urn:li:dataPlatform:postgres,pagila.public.actor,PROD)"

        assert urn1 in difference_urns
        assert urn2 in difference_urns

        # Validate that all providers have committed successfully.
        validate_all_providers_have_committed_successfully(
            pipeline=pipeline_run1, expected_providers=1
        )
        validate_all_providers_have_committed_successfully(
            pipeline=pipeline_run2, expected_providers=1
        )
