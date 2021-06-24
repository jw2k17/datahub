import json

from botocore.stub import Stubber
from freezegun import freeze_time

from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.source.sagemaker import SagemakerSource, SagemakerSourceConfig
from tests.test_helpers import mce_helpers
from tests.unit.test_sagemaker_source_stubs import (
    describe_feature_group_response_1,
    describe_feature_group_response_2,
    list_feature_groups_response,
)

FROZEN_TIME = "2020-04-14 07:00:00"


def sagemaker_source() -> SagemakerSource:
    return SagemakerSource(
        ctx=PipelineContext(run_id="glue-source-test"),
        config=SagemakerSourceConfig(aws_region="us-west-2"),
    )


@freeze_time(FROZEN_TIME)
def test_sagemaker_ingest(tmp_path, pytestconfig):

    sagemaker_source_instance = sagemaker_source()

    with Stubber(sagemaker_source_instance.sagemaker_client) as sagemaker_stubber:

        sagemaker_stubber.add_response(
            "list_feature_groups",
            list_feature_groups_response,
            {},
        )
        sagemaker_stubber.add_response(
            "describe_feature_group",
            describe_feature_group_response_1,
            {
                "FeatureGroupName": "test",
            },
        )
        sagemaker_stubber.add_response(
            "describe_feature_group",
            describe_feature_group_response_2,
            {
                "FeatureGroupName": "test-1",
            },
        )

        mce_objects = [
            wu.mce.to_obj() for wu in sagemaker_source_instance.get_workunits()
        ]

        with open(str(tmp_path / "sagemaker_mces.json"), "w") as f:
            json.dump(mce_objects, f, indent=2)

    output = mce_helpers.load_json_file(str(tmp_path / "sagemaker_mces.json"))

    test_resources_dir = pytestconfig.rootpath / "tests/unit/sagemaker"
    golden = mce_helpers.load_json_file(
        str(test_resources_dir / "sagemaker_mces_golden.json")
    )
    mce_helpers.assert_mces_equal(output, golden)
