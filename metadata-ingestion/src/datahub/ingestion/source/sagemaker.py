from dataclasses import dataclass
from dataclasses import field as dataclass_field
from typing import Any, Dict, Iterable, List

import datahub.emitter.mce_builder as builder
from datahub.configuration.common import ConfigModel
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.source import Source, SourceReport
from datahub.ingestion.source.aws_common import AwsSourceConfig
from datahub.ingestion.source.metadata_common import MetadataWorkUnit
from datahub.metadata.com.linkedin.pegasus2avro.common import MLFeatureDataType
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import (
    MLFeatureSnapshot,
    MLFeatureTableSnapshot,
    MLPrimaryKeySnapshot,
)
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import (
    MLFeaturePropertiesClass,
    MLFeatureTablePropertiesClass,
    MLPrimaryKeyPropertiesClass,
)


class SagemakerSourceConfig(AwsSourceConfig):
    @property
    def sagemaker_client(self):
        return self.get_client("sagemaker")


@dataclass
class SagemakerSourceReport(SourceReport):
    tables_scanned = 0
    filtered: List[str] = dataclass_field(default_factory=list)

    def report_table_scanned(self) -> None:
        self.tables_scanned += 1

    def report_table_dropped(self, table: str) -> None:
        self.filtered.append(table)


class SagemakerSource(Source):
    source_config: SagemakerSourceConfig
    report = SagemakerSourceReport()

    def __init__(self, config: SagemakerSourceConfig, ctx: PipelineContext):
        super().__init__(ctx)
        self.source_config = config
        self.report = SagemakerSourceReport()
        self.sagemaker_client = config.sagemaker_client
        self.env = config.env

    @classmethod
    def create(cls, config_dict, ctx):
        config = SagemakerSourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_all_feature_groups(self) -> List[Dict[str, Any]]:
        """
        List all feature groups in SageMaker.
        """

        feature_groups = []

        # see https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sagemaker.html#SageMaker.Client.list_feature_groups
        paginator = self.sagemaker_client.get_paginator("list_feature_groups")
        for page in paginator.paginate():
            feature_groups += page["FeatureGroupSummaries"]

        return feature_groups

    def get_feature_group_details(self, feature_group_name: str) -> Dict[str, Any]:
        """
        Get details of a feature group (including list of component features).
        """

        feature_group = self.sagemaker_client.describe_feature_group(
            FeatureGroupName=feature_group_name
        )

        next_token = feature_group.get("NextToken")

        # paginate over feature group features
        while next_token is not None:
            next_features = self.sagemaker_client.describe_feature_group(
                FeatureGroupName=feature_group_name, NextToken=next_token
            )
            feature_group["FeatureDefinitions"].append(
                next_features["FeatureDefinitions"]
            )
            next_token = feature_group.get("NextToken")

        return feature_group

    def get_feature_group_wu(
        self, feature_group_details: Dict[str, Any]
    ) -> MetadataWorkUnit:
        """
        Generate an MLFeatureTable workunit for a SageMaker feature group.

        Parameters
        ----------
            feature_group_details:
                ingested SageMaker feature group from get_feature_group_details()
        """

        feature_group_name = feature_group_details["FeatureGroupName"]

        feature_group_snapshot = MLFeatureTableSnapshot(
            urn=builder.make_ml_feature_table_urn("sagemaker", feature_group_name),
            aspects=[],
        )

        feature_group_snapshot.aspects.append(
            MLFeatureTablePropertiesClass(
                mlFeatures=[
                    builder.make_ml_feature_urn(
                        feature_group_name,
                        feature["FeatureName"],
                    )
                    for feature in feature_group_details["FeatureDefinitions"]
                ],
                mlPrimaryKeys=[
                    builder.make_ml_primary_key_urn(
                        feature_group_name,
                        feature_group_details["RecordIdentifierFeatureName"],
                    )
                ],
            )
        )

        # make the MCE and workunit
        mce = MetadataChangeEvent(proposedSnapshot=feature_group_snapshot)
        return MetadataWorkUnit(id=feature_group_name, mce=mce)

    def get_feature_type(self, aws_type: str, feature_name: str) -> str:

        mapped_type = {
            "String": MLFeatureDataType.TEXT,
            "Integral": MLFeatureDataType.ORDINAL,
            "Fractional": MLFeatureDataType.CONTINUOUS,
        }.get(aws_type)

        if mapped_type is None:
            self.report.report_warning(
                feature_name, f"unable to map type {aws_type} to metadata schema"
            )
            mapped_type = MLFeatureDataType.UNKNOWN

        return mapped_type

    def get_feature_wu(
        self, feature_group_details: Dict[str, Any], feature: Dict[str, Any]
    ) -> MetadataWorkUnit:
        """
        Generate an MLFeature workunit for a SageMaker feature.

        Parameters
        ----------
            feature_group_details:
                ingested SageMaker feature group from get_feature_group_details()
            feature:
                ingested SageMaker feature
        """

        # create snapshot instance for the feature
        feature_snapshot = MLFeatureSnapshot(
            urn=builder.make_ml_feature_urn(
                feature_group_details["FeatureGroupName"],
                feature["FeatureName"],
            ),
            aspects=[],
        )

        feature_sources = []

        if "OfflineStoreConfig" in feature_group_details:

            # remove S3 prefix (s3://)
            s3_name = feature_group_details["OfflineStoreConfig"]["S3StorageConfig"][
                "S3Uri"
            ][5:]

            if s3_name.endswith("/"):
                s3_name = s3_name[:-1]

            feature_sources.append(
                builder.make_dataset_urn(
                    "s3",
                    s3_name,
                    self.source_config.env,
                )
            )

            glue_database = feature_group_details["OfflineStoreConfig"][
                "DataCatalogConfig"
            ]["Database"]
            glue_table = feature_group_details["OfflineStoreConfig"][
                "DataCatalogConfig"
            ]["TableName"]

            full_table_name = f"{glue_database}.{glue_table}"

            self.report.report_warning(
                full_table_name,
                f"""Note: table {full_table_name} is an AWS Glue object.
                    To view full table metadata, run Glue ingestion
                    (see https://datahubproject.io/docs/metadata-ingestion/#aws-glue-glue)""",
            )

            feature_sources.append(
                f"urn:li:dataset:(urn:li:dataPlatform:glue,{full_table_name},{self.source_config.env})"
            )

        # note that there's also an OnlineStoreConfig field, but this
        # lack enough metadata to create a dataset
        # (only specifies the security config and whether it's enabled at all)

        # append feature name and type
        feature_snapshot.aspects.append(
            MLFeaturePropertiesClass(
                dataType=self.get_feature_type(
                    feature["FeatureType"], feature["FeatureName"]
                ),
                sources=feature_sources,
            )
        )

        # make the MCE and workunit
        mce = MetadataChangeEvent(proposedSnapshot=feature_snapshot)
        return MetadataWorkUnit(
            id=f'{feature_group_details["FeatureGroupName"]}-{feature["FeatureName"]}',
            mce=mce,
        )

    def get_workunits(self) -> Iterable[MetadataWorkUnit]:

        feature_groups = self.get_all_feature_groups()

        for feature_group in feature_groups:

            feature_group_details = self.get_feature_group_details(
                feature_group["FeatureGroupName"]
            )

            for feature in feature_group_details["FeatureDefinitions"]:
                yield self.get_feature_wu(feature_group_details, feature)

            yield self.get_feature_group_wu(feature_group_details)

    def get_report(self):
        return self.report

    def close(self):
        pass
