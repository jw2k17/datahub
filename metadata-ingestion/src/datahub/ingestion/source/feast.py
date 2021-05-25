import json
import tempfile
from dataclasses import dataclass, field
from typing import Dict, Iterable, List

import docker

from datahub.configuration.common import ConfigModel
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.source import Source, SourceReport
from datahub.ingestion.source.metadata_common import MetadataWorkUnit
from datahub.metadata.com.linkedin.pegasus2avro.common import MLFeatureDataType
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import (
    MLEntitySnapshot,
    MLFeatureSetSnapshot,
    MLFeatureSnapshot,
)
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import (
    MLEntityPropertiesClass,
    MLFeaturePropertiesClass,
    MLFeatureSetPropertiesClass,
)

# map Feast types to DataHub classes
_field_type_mapping: Dict[str, str] = {
    "BYTES": MLFeatureDataType.BYTE,
    "STRING": MLFeatureDataType.TEXT,
    "INT32": MLFeatureDataType.ORDINAL,
    "INT64": MLFeatureDataType.ORDINAL,
    "DOUBLE": MLFeatureDataType.CONTINUOUS,
    "FLOAT": MLFeatureDataType.CONTINUOUS,
    "BOOL": MLFeatureDataType.BINARY,
    "UNIX_TIMESTAMP": MLFeatureDataType.TIME,
    "BYTES_LIST": MLFeatureDataType.SEQUENCE,
    "STRING_LIST": MLFeatureDataType.SEQUENCE,
    "INT32_LIST": MLFeatureDataType.SEQUENCE,
    "INT64_LIST": MLFeatureDataType.SEQUENCE,
    "DOUBLE_LIST": MLFeatureDataType.SEQUENCE,
    "FLOAT_LIST": MLFeatureDataType.SEQUENCE,
    "BOOL_LIST": MLFeatureDataType.SEQUENCE,
    "UNIX_TIMESTAMP_LIST": MLFeatureDataType.SEQUENCE,
}

DEFAULT_ENV = "PROD"


class FeastConfig(ConfigModel):
    # See the MongoDB authentication docs for details and examples.
    # https://pymongo.readthedocs.io/en/stable/examples/authentication.html
    core_url: str = "localhost:6565"
    env: str = DEFAULT_ENV


@dataclass
class FeastSourceReport(SourceReport):
    filtered: List[str] = field(default_factory=list)

    def report_dropped(self, name: str) -> None:
        self.filtered.append(name)


@dataclass
class FeastSource(Source):
    config: FeastConfig
    report: FeastSourceReport

    def __init__(self, ctx: PipelineContext, config: FeastConfig):
        super().__init__(ctx)
        self.config = config
        self.report = FeastSourceReport()

    @classmethod
    def create(cls, config_dict: dict, ctx: PipelineContext) -> "FeastSource":
        config = FeastConfig.parse_obj(config_dict)
        return cls(ctx, config)

    def get_field_type(self, field_type: str, parent_name: str) -> str:
        """
        Maps types encountered in Feast to corresponding schema types.

        Parameters
        ----------
            field_type:
                type of a Feast object
            parent_name:
                name of table (for logging)
        """
        TypeClass = _field_type_mapping.get(field_type)

        if TypeClass is None:
            self.report.report_warning(
                parent_name, f"unable to map type {field_type} to metadata schema"
            )
            TypeClass = MLFeatureDataType.USELESS

        return TypeClass

    def get_workunits(self) -> Iterable[MetadataWorkUnit]:
        with tempfile.NamedTemporaryFile(suffix=".json") as tf:

            docker_client = docker.from_env()
            docker_client.containers.run(
                "feast-ingest",
                f'python3 ingest.py --core_url="{self.config.core_url}" --output_path=/out.json',
                # allow the image to access the core URL if on host
                network_mode="host",
                # mount the tempfile so the Docker image has access
                volumes={
                    tf.name: {"bind": "/out.json", "mode": "rw"},
                },
            )

            ingest = json.load(tf)

            platform = "feast"

            get_feature_urn = (
                lambda feature_name: f"urn:li:mlFeature:(urn:li:dataPlatform:{platform},{feature_name},{self.config.env}))"
            )
            # ingest features
            for feature in ingest["features"]:

                # create snapshot instance for the feature
                feature_snapshot = MLFeatureSnapshot(
                    urn=get_feature_urn(feature["name"]),
                    aspects=[],
                )

                # append feature name and type
                feature_snapshot.aspects.append(
                    MLFeaturePropertiesClass(
                        name=feature["name"],
                        dataType=self.get_field_type(feature["type"], feature["name"]),
                    )
                )

                # make the MCE and workunit
                mce = MetadataChangeEvent(proposedSnapshot=feature_snapshot)
                wu = MetadataWorkUnit(id=feature["name"], mce=mce)
                self.report.report_workunit(wu)
                yield wu

            get_entity_urn = (
                lambda entity_name: f"urn:li:mlEntity:(urn:li:dataPlatform:{platform},{entity_name},{self.config.env}))"
            )
            # ingest entities
            for entity in ingest["entities"]:

                # create snapshot instance for the entity
                entity_snapshot = MLEntitySnapshot(
                    urn=get_entity_urn(entity["name"]),
                    aspects=[],
                )

                # append entity name and type
                entity_snapshot.aspects.append(
                    MLEntityPropertiesClass(
                        name=entity["name"],
                        description=entity["description"],
                        dataType=self.get_field_type(entity["type"], entity["name"]),
                    )
                )

                # make the MCE and workunit
                mce = MetadataChangeEvent(proposedSnapshot=entity_snapshot)
                wu = MetadataWorkUnit(id=entity["name"], mce=mce)
                self.report.report_workunit(wu)
                yield wu

            # ingest tables
            for table in ingest["tables"]:

                # create snapshot instance for the featureset
                featureset_snapshot = MLFeatureSetSnapshot(
                    urn=f"urn:li:mlFeatureSet:(urn:li:dataPlatform:{platform},{table['name']},{self.config.env}))",
                    aspects=[],
                )
                featureset_snapshot.aspects.append(
                    MLFeatureSetPropertiesClass(
                        name=table["name"],
                        mlFeatures=[get_feature_urn(x) for x in table["features"]],
                        mlEntities=[get_entity_urn(x) for x in table["entities"]],
                        batchSource=table.get("batch_source"),
                        streamSource=table.get("stream_source"),
                        batchSourceConfig=table.get("batch_source_config"),
                        streamSourceConfig=table.get("stream_source_config"),
                    )
                )

                # make the MCE and workunit
                mce = MetadataChangeEvent(proposedSnapshot=featureset_snapshot)
                wu = MetadataWorkUnit(id=table["name"], mce=mce)
                self.report.report_workunit(wu)
                yield wu

    def get_report(self) -> FeastSourceReport:
        return self.report

    def close(self):
        return
