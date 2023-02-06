import functools
import json
import logging
import os
import tempfile
import urllib.request
from dataclasses import dataclass
from os.path import basename, dirname
from pathlib import Path
from typing import Any, Iterable, Optional, Union

import jsonref
from pydantic import AnyHttpUrl, DirectoryPath, FilePath, validator
from pydantic.fields import Field

import datahub.metadata.schema_classes as models
from datahub.configuration.common import ConfigModel
from datahub.emitter.mce_builder import (
    make_dataplatform_instance_urn,
    make_dataset_urn_with_platform_instance,
)
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (  # SourceCapability,; capability,
    SupportStatus,
    capability,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.source import SourceCapability
from datahub.ingestion.api.workunit import MetadataWorkUnit, UsageStatsWorkUnit
from datahub.ingestion.extractor.json_schema_util import (
    JsonSchemaTranslator,
    get_schema_metadata,
)
from datahub.ingestion.source.state.entity_removal_state import GenericCheckpointState
from datahub.ingestion.source.state.stale_entity_removal_handler import (
    StaleEntityRemovalHandler,
    StaleEntityRemovalSourceReport,
    StatefulStaleMetadataRemovalConfig,
)
from datahub.ingestion.source.state.stateful_ingestion_base import (
    StatefulIngestionConfigBase,
    StatefulIngestionSourceBase,
)
from datahub.utilities.urns.data_platform_urn import DataPlatformUrn

logger = logging.getLogger(__name__)


class URIReplacePattern(ConfigModel):
    match: str = Field(
        description="Pattern to match on uri-s as part of reference resolution. See replace field",
    )
    replace: str = Field(
        description="Pattern to replace with as part of reference resolution. See match field",
    )


class JsonSchemaSourceConfig(StatefulIngestionConfigBase):
    path: Union[FilePath, DirectoryPath, AnyHttpUrl] = Field(
        description="Set this to a single file-path or a directory-path (for recursive traversal) or a remote url. e.g. https://json.schemastore.org/petstore-v1.0.json"
    )
    platform: str = Field(
        description="Set this to a platform that you want all schemas to live under. e.g. schemaregistry / schemarepo etc."
    )
    stateful_ingestion: Optional[StatefulStaleMetadataRemovalConfig] = None
    use_id_as_base_uri: bool = Field(
        default=False,
        description="When enabled, uses the `$id` field in the json schema as the base uri for following references.",
    )
    uri_replace_pattern: Optional[URIReplacePattern] = Field(
        default=None,
        description="Use this if URI-s need to be modified during reference resolution. Simple string match - replace capabilities are supported.",
    )

    @validator("path")
    def download_http_url_to_temp_file(v):
        if isinstance(v, AnyHttpUrl):
            with urllib.request.urlopen(v) as response:
                schema_dict = json.load(response)
                if not JsonSchemaTranslator._get_id_from_any_schema(schema_dict):
                    schema_dict["$id"] = str(v)
                with tempfile.NamedTemporaryFile(mode="w", delete=False) as tmp_file:
                    tmp_file.write(json.dumps(schema_dict))
                    tmp_file.flush()
                    return tmp_file.name
        return v


class JsonSchemaCheckpointState(GenericCheckpointState):
    def __init__(self, **data: Any):
        super().__init__(**data)


@platform_name(platform_name="JSON Schemas", id="json-schema")
@config_class(JsonSchemaSourceConfig)
@support_status(SupportStatus.INCUBATING)
@capability(
    capability_name=SourceCapability.SCHEMA_METADATA,
    description="Extracts schemas, following references",
)
@capability(
    capability_name=SourceCapability.PLATFORM_INSTANCE,
    description="Supports platform instance via config",
)
@capability(
    capability_name=SourceCapability.DESCRIPTIONS,
    description="Extracts descriptions at top level and field level",
)
@capability(
    capability_name=SourceCapability.DELETION_DETECTION,
    description="With stateful ingestion enabled, will remove entities from DataHub if they are no longer present in the source",
)
@capability(
    capability_name=SourceCapability.TAGS,
    description="Does not currently support extracting tags",
    supported=False,
)
@capability(
    capability_name=SourceCapability.OWNERSHIP,
    description="Does not currently support extracting ownership",
    supported=False,
)
@dataclass
class JsonSchemaSource(StatefulIngestionSourceBase):
    """
    This source extracts metadata from a single JSON Schema or multiple JSON Schemas rooted at a particular path.
    It performs reference resolution based on the `$ref` keyword.

    Metadata mapping:
    - Schemas are mapped to Datasets with sub-type Schema
    - The name of the Schema (Dataset) is inferred from the `$id` property and if that is missing, the file name.
    - Browse paths are minted based on the path
    """

    @staticmethod
    def _pull_up_reference(schema_dict):
        """Transforms a schema that is of the form
        {
         "$ref": "#definitions/MyDefinition",
         "definitions": {
            "MyDefinition": {
                ... definition
            },
            "OtherDefinition": {
                ... other definition
            }
         }
        }
        to
        {
            ... definition

            "definitions": {
            "OtherDefinition": {
                ... other definition
            }
         }
        """

        if "$ref" in schema_dict:
            reference = schema_dict["$ref"]
            if reference.startswith("#/"):
                parts = reference[2:].split("/")
                referred = schema_dict
                for p in parts:
                    referred = referred[p]
                for k, v in referred.items():
                    schema_dict[k] = v
                deletable = schema_dict
                for p in parts[:-1]:
                    deletable = deletable[p]
                deletable.pop(parts[-1])
                schema_dict.pop("$ref")
                if "title" not in schema_dict:
                    schema_dict["title"] = parts[-1]
        return schema_dict

    @staticmethod
    def _load_json_schema(filename, loader, use_id_as_base_uri):
        """Loads the given schema file"""
        path = Path(filename).resolve()
        base_path = dirname(str(path))
        base_uri = "file://{}/".format(base_path)

        with open(path) as schema_file:
            logger.info(f"Opening file {path}")
            schema_dict = json.load(schema_file)
            try:
                schema_dict = JsonSchemaSource._pull_up_reference(schema_dict)
                jsonref_dict = jsonref.loads(
                    json.dumps(schema_dict),
                    base_uri=base_uri,
                    jsonschema=use_id_as_base_uri,
                    loader=loader,
                    lazy_load=False,
                )
                resolved_dict = jsonref_dict
            except Exception:
                resolved_dict = schema_dict
            return (resolved_dict, json.dumps(schema_dict))

    @staticmethod
    def stringreplaceloader(match_string, replace_string, uri, **kwargs):
        """
        Provides a callable which takes a URI, and returns the loaded JSON referred
        to by that URI. Uses :mod:`requests` if available for HTTP URIs, and falls
        back to :mod:`urllib`.
        """
        uri = uri.replace(match_string, replace_string)
        # logger.info(f"Resolving ref to file {uri}")
        return jsonref.jsonloader(uri, **kwargs)

    def __init__(self, ctx: PipelineContext, config: JsonSchemaSourceConfig):
        super(JsonSchemaSource, self).__init__(ctx=ctx, config=config)
        self.config = config
        self.stale_entity_removal_handler = StaleEntityRemovalHandler(
            source=self,
            config=self.config,
            state_type_class=JsonSchemaCheckpointState,
            pipeline_name=self.ctx.pipeline_name,
            run_id=self.ctx.run_id,
        )
        self.report = StaleEntityRemovalSourceReport()

    def _report_and_return(self, wu: MetadataWorkUnit) -> MetadataWorkUnit:
        self.report.report_workunit(wu)
        return wu

    def _load_one_file(
        self, ref_loader: Any, browse_prefix: str, root_dir: Path, file_name: str
    ) -> Iterable[MetadataWorkUnit]:
        (schema_dict, schema_string) = self._load_json_schema(
            os.path.join(root_dir, file_name),
            loader=ref_loader,
            use_id_as_base_uri=self.config.use_id_as_base_uri,
        )
        logger.debug(f"Loaded file {file_name} as {schema_dict}")
        if not JsonSchemaTranslator._get_id_from_any_schema(schema_dict):
            schema_type = os.path.basename(file_name)[: -len(".json")]
        else:
            schema_id = JsonSchemaTranslator._get_id_from_any_schema(schema_dict)
            assert schema_id
            schema_type = schema_id.replace("https:/", "")

        if schema_type.endswith(".json"):
            schema_type = schema_type[: -len(".json")]

        browse_path = browse_prefix + dirname(schema_type)
        dataset_simple_name = basename(schema_type)

        dataset_name = schema_type

        meta: models.SchemaMetadataClass = get_schema_metadata(
            platform=self.config.platform,
            name=dataset_name,
            json_schema=schema_dict,
            raw_schema_string=schema_string,
        )
        dataset_urn = make_dataset_urn_with_platform_instance(
            platform=self.config.platform,
            name=dataset_name,
            platform_instance=self.config.platform_instance,
        )
        yield self._report_and_return(
            MetadataChangeProposalWrapper(
                entityUrn=dataset_urn, aspect=meta
            ).as_workunit()
        )

        # status
        yield self._report_and_return(
            MetadataChangeProposalWrapper(
                entityUrn=dataset_urn, aspect=models.StatusClass(removed=False)
            ).as_workunit()
        )

        # datasetProperties
        yield self._report_and_return(
            MetadataChangeProposalWrapper(
                entityUrn=dataset_urn,
                aspect=models.DatasetPropertiesClass(
                    externalUrl=JsonSchemaTranslator._get_id_from_any_schema(
                        schema_dict
                    ),
                    name=dataset_simple_name,
                    description=JsonSchemaTranslator._get_description_from_any_schema(
                        schema_dict
                    ),
                ),
            ).as_workunit()
        )

        # subTypes
        yield self._report_and_return(
            MetadataChangeProposalWrapper(
                entityUrn=dataset_urn, aspect=models.SubTypesClass(typeNames=["schema"])
            ).as_workunit()
        )

        browse_path = browse_prefix + dirname(schema_type)
        yield self._report_and_return(
            MetadataChangeProposalWrapper(
                entityUrn=dataset_urn,
                aspect=models.BrowsePathsClass(paths=[browse_path]),
            ).as_workunit()
        )

        if self.config.platform_instance:
            yield self._report_and_return(
                MetadataChangeProposalWrapper(
                    entityUrn=dataset_urn,
                    aspect=models.DataPlatformInstanceClass(
                        platform=str(
                            DataPlatformUrn.create_from_id(self.config.platform)
                        ),
                        instance=make_dataplatform_instance_urn(
                            platform=self.config.platform,
                            instance=self.config.platform_instance,
                        ),
                    ),
                ).as_workunit()
            )

        self.stale_entity_removal_handler.add_entity_to_state(type="_", urn=dataset_urn)

    def get_workunits(self) -> Iterable[Union[MetadataWorkUnit, UsageStatsWorkUnit]]:
        if self.config.uri_replace_pattern:
            ref_loader = functools.partial(
                self.stringreplaceloader,
                self.config.uri_replace_pattern.match,
                self.config.uri_replace_pattern.replace,
            )
        else:
            ref_loader = jsonref.jsonloader
        browse_prefix = f"/{self.config.env.lower()}/{self.config.platform}"
        if self.config.platform_instance:
            browse_prefix = f"/{self.config.env.lower()}/{self.config.platform}/{self.config.platform_instance}"

        if os.path.isdir(self.config.path):
            for root, dirs, files in os.walk(self.config.path, topdown=False):
                for file_name in [f for f in files if f.endswith(".json")]:
                    yield from self._load_one_file(
                        ref_loader,
                        browse_prefix=browse_prefix,
                        root_dir=Path(root),
                        file_name=file_name,
                    )

        else:
            yield from self._load_one_file(
                ref_loader,
                browse_prefix=browse_prefix,
                root_dir=Path(os.path.dirname(Path(self.config.path))),
                file_name=str(self.config.path),
            )

        # Clean up stale entities at the end
        yield from self.stale_entity_removal_handler.gen_removed_entity_workunits()

    def get_report(self):
        return self.report
