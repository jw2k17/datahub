import logging
from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Union

import requests
from pydantic import Field, SecretStr, validator

from datahub.configuration.common import ConfigModel
from datahub.configuration.source_common import DatasetLineageProviderConfigBase
from datahub.emitter.mce_builder import (
    make_chart_urn,
    make_container_urn,
    make_dashboard_urn,
    make_data_platform_urn,
    make_dataplatform_instance_urn,
    make_dataset_urn_with_platform_instance,
    make_schema_field_urn,
    make_tag_urn,
    make_user_urn,
)
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.emitter.mcp_builder import (
    ContainerKey,
    add_dataset_to_container,
    gen_containers,
)
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (
    SourceCapability,
    SupportStatus,
    capability,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.source import MetadataWorkUnitProcessor
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.state.stale_entity_removal_handler import (
    StaleEntityRemovalHandler,
    StaleEntityRemovalSourceReport,
    StatefulStaleMetadataRemovalConfig,
)
from datahub.ingestion.source.state.stateful_ingestion_base import (
    StatefulIngestionConfigBase,
    StatefulIngestionSourceBase,
)
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import (
    BooleanTypeClass,
    ChangeAuditStampsClass,
    ChartInfoClass,
    ChartSnapshotClass,
    ChartTypeClass,
    DashboardInfoClass,
    DashboardSnapshotClass,
    DataPlatformInstanceClass,
    DatasetLineageTypeClass,
    DatasetPropertiesClass,
    DatasetSnapshotClass,
    DateTypeClass,
    FineGrainedLineageClass,
    FineGrainedLineageDownstreamTypeClass,
    FineGrainedLineageUpstreamTypeClass,
    GlobalTagsClass,
    InputFieldClass,
    InputFieldsClass,
    NumberTypeClass,
    OtherSchemaClass,
    OwnerClass,
    OwnershipClass,
    OwnershipTypeClass,
    SchemaFieldClass,
    SchemaFieldDataTypeClass,
    SchemaMetadataClass,
    StatusClass,
    StringTypeClass,
    SubTypesClass,
    TagAssociationClass,
    TimeTypeClass,
    UpstreamClass,
    UpstreamLineageClass,
    ViewPropertiesClass,
)
from datahub.sql_parsing.sqlglot_lineage import (
    SqlParsingResult,
    create_lineage_sql_parsed_result,
)
from datahub.utilities import config_clean

logger = logging.getLogger(__name__)


class PlatformConnectionConfig(ConfigModel):
    platform: str = Field(description="Platform to connect to")
    database: Optional[str] = Field(default=None, description="Database name")
    platform_instance: Optional[str] = Field(
        default=None, description="Platform instance"
    )
    env: Optional[str] = Field(default=None, description="Environment")


class GrafanaSourceConfig(
    StatefulIngestionConfigBase, DatasetLineageProviderConfigBase
):
    platform: str = Field(default="grafana", hidden_from_docs=True)
    url: str = Field(
        description="URL of Grafana instance (e.g. https://grafana.company.com)"
    )
    service_account_token: SecretStr = Field(description="Grafana API token")
    platform_instance: Optional[str] = Field(
        default=None, description="Platform instance for DataHub"
    )
    auto_tag_dimensions: bool = Field(
        default=False,
        description="Automatically tag dimension fields in charts",
    )
    auto_tag_measures: bool = Field(
        default=False,
        description="Automatically tag measure fields in charts",
    )
    connection_to_platform_map: Dict[str, PlatformConnectionConfig] = Field(
        default={},
        description="Map of Grafana connection names to their upstream platform details",
    )
    stateful_ingestion: Optional[StatefulStaleMetadataRemovalConfig] = None

    @validator("url")
    def remove_trailing_slash(cls, v):
        return config_clean.remove_trailing_slashes(v)


class GrafanaTypeMapper:
    """Maps Grafana types to DataHub types"""

    _TYPE_MAPPINGS = {
        "string": SchemaFieldDataTypeClass(type=StringTypeClass()),
        "number": SchemaFieldDataTypeClass(type=NumberTypeClass()),
        "integer": SchemaFieldDataTypeClass(type=NumberTypeClass()),
        "float": SchemaFieldDataTypeClass(type=NumberTypeClass()),
        "boolean": SchemaFieldDataTypeClass(type=BooleanTypeClass()),
        "time": SchemaFieldDataTypeClass(type=TimeTypeClass()),
        "timestamp": SchemaFieldDataTypeClass(type=TimeTypeClass()),
        "timeseries": SchemaFieldDataTypeClass(type=TimeTypeClass()),
        "time_series": SchemaFieldDataTypeClass(type=TimeTypeClass()),
        "datetime": SchemaFieldDataTypeClass(type=TimeTypeClass()),
        "date": SchemaFieldDataTypeClass(type=DateTypeClass()),
    }

    @classmethod
    def get_field_type(
        cls, grafana_type: str, default_type: str = "string"
    ) -> SchemaFieldDataTypeClass:
        return cls._TYPE_MAPPINGS.get(
            grafana_type.lower(),
            cls._TYPE_MAPPINGS.get(default_type, cls._TYPE_MAPPINGS["string"]),
        )

    @classmethod
    def get_native_type(cls, grafana_type: str, default_type: str = "string") -> str:
        grafana_type = grafana_type.lower()
        if grafana_type in cls._TYPE_MAPPINGS:
            return grafana_type
        return default_type


class FolderKey(ContainerKey):
    folder_id: str


class DashboardContainerKey(ContainerKey):
    dashboard_id: str


@dataclass
class GrafanaSourceReport(StaleEntityRemovalSourceReport):
    dashboards_scanned: int = 0
    charts_scanned: int = 0
    folders_scanned: int = 0
    datasets_scanned: int = 0

    def report_dashboard_scanned(self) -> None:
        self.dashboards_scanned += 1

    def report_chart_scanned(self) -> None:
        self.charts_scanned += 1

    def report_folder_scanned(self) -> None:
        self.folders_scanned += 1

    def report_dataset_scanned(self) -> None:
        self.datasets_scanned += 1


@platform_name("Grafana")
@config_class(GrafanaSourceConfig)
@support_status(SupportStatus.CERTIFIED)
@capability(SourceCapability.PLATFORM_INSTANCE, "Enabled by default")
@capability(SourceCapability.DELETION_DETECTION, "Enabled by default")
@capability(SourceCapability.LINEAGE_COARSE, "Enabled by default")
@capability(SourceCapability.LINEAGE_FINE, "Enabled by default")
@capability(SourceCapability.OWNERSHIP, "Enabled by default")
@capability(SourceCapability.TAGS, "Enabled by default")
class GrafanaSource(StatefulIngestionSourceBase):
    """
    This source extracts the following:
    - Folders
    - Dashboards
    - Charts
    - Tags
    - Owners
    - Lineage information
    """

    config: GrafanaSourceConfig
    report: GrafanaSourceReport

    def __init__(self, config: GrafanaSourceConfig, ctx: PipelineContext):
        super().__init__(config, ctx)
        self.config = config
        self.ctx = ctx
        self.platform = config.platform
        self.platform_instance = self.config.platform_instance
        self.env = self.config.env
        self.report = GrafanaSourceReport()
        self.session = self.set_session()

    @classmethod
    def create(cls, config_dict: dict, ctx: PipelineContext) -> "GrafanaSource":
        config = GrafanaSourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def set_session(self) -> requests.Session:
        session = requests.Session()
        session.headers.update(
            {
                "Authorization": f"Bearer {self.config.service_account_token.get_secret_value()}",
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        )
        return session

    def get_workunit_processors(self) -> List[Optional[MetadataWorkUnitProcessor]]:
        return [
            *super().get_workunit_processors(),
            StaleEntityRemovalHandler.create(
                self, self.config, self.ctx
            ).workunit_processor,
        ]

    def get_workunits_internal(self) -> Iterable[MetadataWorkUnit]:
        # Emit folder containers first
        folders = self._get_folders()
        for folder in folders:
            self.report.report_folder_scanned()
            yield from self._emit_folder(folder)

        # Track charts by dashboard
        dashboard_chart_map: Dict[str, List[str]] = {}

        # First collect and emit all datasources to ensure they exist
        dashboards = self._get_dashboards()
        for dashboard in dashboards:
            dashboard_uid = dashboard.get("dashboard", {}).get("uid")
            if not dashboard_uid:
                continue

            for panel in self._get_panels(dashboard):
                yield from self._emit_datasource(panel, dashboard_uid)

        # Then emit dashboards and charts
        for dashboard in dashboards:
            self.report.report_dashboard_scanned()
            dashboard_uid = dashboard.get("dashboard", {}).get("uid")
            if not dashboard_uid:
                continue

            dashboard_chart_map[dashboard_uid] = []

            # Process all panels
            for panel in self._get_panels(dashboard):
                self.report.report_chart_scanned()

                if not panel.get("id"):
                    continue

                chart_urn = make_chart_urn(
                    self.platform,
                    f"{dashboard_uid}.{panel['id']}",
                    self.platform_instance,
                )
                dashboard_chart_map[dashboard_uid].append(chart_urn)

                # Emit any dataset-to-dataset lineage
                lineage_workunit = self._emit_lineage(panel)
                if lineage_workunit:
                    yield lineage_workunit

                # Emit chart metadata
                yield from self._emit_chart(panel, dashboard)

            # Finally emit dashboard with all chart URNs
            yield from self._emit_dashboard(
                dashboard, dashboard_chart_map[dashboard_uid]
            )

    def _get_folders(self) -> List[dict]:
        """Fetch folders from Grafana API"""
        try:
            response = self.session.get(f"{self.config.url}/api/folders")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.report.report_warning(
                message="Failed to fetch folders",
                exc=e,
            )
            return []

    def _get_dashboards(self) -> List[dict]:
        """Fetch dashboards from Grafana API"""
        try:
            response = self.session.get(f"{self.config.url}/api/search?type=dash-db")
            response.raise_for_status()

            dashboards = []
            for result in response.json():
                try:
                    dashboard_response = self.session.get(
                        f"{self.config.url}/api/dashboards/uid/{result['uid']}"
                    )
                    dashboard_response.raise_for_status()
                    dashboards.append(dashboard_response.json())
                except requests.exceptions.RequestException as e:
                    self.report.report_warning(
                        message="Failed to fetch dashboard",
                        context=result["uid"],
                        exc=e,
                    )

            return dashboards
        except requests.exceptions.RequestException as e:
            self.report.report_warning(
                message="Failed to fetch dashboards",
                exc=e,
            )
            return []

    def _get_panels(self, dashboard: dict) -> List[dict]:
        """Extract panels (charts) from dashboard"""
        panels = []
        dashboard_data = dashboard.get("dashboard", {})
        if "panels" in dashboard_data:
            for panel in dashboard_data["panels"]:
                if panel.get("type") not in ["row"]:
                    panels.append(panel)
                # Handle nested panels in rows
                if panel.get("type") == "row" and "panels" in panel:
                    panels.extend(
                        [p for p in panel["panels"] if p.get("type") != "row"]
                    )
        return panels

    def _emit_folder(self, folder: dict) -> Iterable[MetadataWorkUnit]:
        folder_key = FolderKey(
            platform=self.platform,
            instance=self.platform_instance,
            folder_id=folder["uid"],
        )

        container_urn = make_container_urn(
            guid=folder_key,
        )

        yield MetadataChangeProposalWrapper(
            entityUrn=container_urn,
            aspect=self._create_data_platform_instance(),
        ).as_workunit()

        yield from gen_containers(
            container_key=folder_key,
            name=folder["title"],
            sub_types=["Folder"],
            description=folder.get("description", ""),
        )

    def _emit_dashboard(
        self, dashboard: dict, chart_urns: List[str]
    ) -> Iterable[MetadataWorkUnit]:
        dashboard_data = dashboard.get("dashboard", {})
        dashboard_uid = dashboard_data.get("uid")
        if not dashboard_uid:
            return

        dashboard_urn = make_dashboard_urn(
            self.platform, dashboard_uid, self.platform_instance
        )

        yield from self._create_dashboard_container(
            dashboard_data, folder_id=dashboard.get("meta", {}).get("folderId")
        )

        # Add dashboard to container
        dashboard_key = DashboardContainerKey(
            platform=self.platform,
            instance=self.platform_instance,
            dashboard_id=dashboard_uid,
        )
        yield from add_dataset_to_container(
            container_key=dashboard_key,
            dataset_urn=dashboard_urn,
        )

        dashboard_snapshot = DashboardSnapshotClass(
            urn=dashboard_urn,
            aspects=[],
        )

        dashboard_snapshot.aspects.append(self._create_data_platform_instance())

        # Basic dashboard info
        title = dashboard_data.get("title", "")
        description = dashboard_data.get("description", "")

        # Last modified info
        last_modified = ChangeAuditStampsClass()

        dashboard_url = f"{self.config.url}/d/{dashboard_uid}"

        # Custom properties
        custom_props = {
            "version": str(dashboard_data.get("version", "")),
            "schemaVersion": str(dashboard_data.get("schemaVersion", "")),
            "timezone": dashboard_data.get("timezone", ""),
        }
        refresh = dashboard_data.get("refresh")
        if refresh:
            custom_props["refresh"] = str(refresh)

        dashboard_info = DashboardInfoClass(
            description=description,
            title=title,
            charts=chart_urns,
            lastModified=last_modified,
            dashboardUrl=dashboard_url,
            customProperties=custom_props,
        )
        dashboard_snapshot.aspects.append(dashboard_info)

        # Add ownership if available
        owner = self._get_owner(dashboard_data)
        if owner:
            dashboard_snapshot.aspects.append(owner)

        # Add tags if present
        if dashboard_data.get("tags"):
            tags = []
            for tag in dashboard_data["tags"]:
                if isinstance(tag, str):
                    tags.append(TagAssociationClass(tag=make_tag_urn(tag)))
            if tags:
                dashboard_snapshot.aspects.append(GlobalTagsClass(tags=tags))

        # Add status
        status = StatusClass(removed=False)
        dashboard_snapshot.aspects.append(status)

        yield MetadataWorkUnit(
            id=f"grafana-dashboard-{dashboard_uid}",
            mce=MetadataChangeEvent(proposedSnapshot=dashboard_snapshot),
        )

        # Handle folder containment
        folder_id = dashboard.get("meta", {}).get("folderId")
        if folder_id:
            folder_key = FolderKey(
                platform=self.platform,
                instance=self.platform_instance,
                folder_id=str(folder_id),
            )
            yield from add_dataset_to_container(
                container_key=folder_key,
                dataset_urn=dashboard_urn,
            )

    def _emit_chart(self, panel: dict, dashboard: dict) -> Iterable[MetadataWorkUnit]:
        dashboard_uid = dashboard.get("dashboard", {}).get("uid")
        if not dashboard_uid or not panel.get("id"):
            return

        chart_urn = make_chart_urn(
            self.platform, f"{dashboard_uid}.{panel['id']}", self.platform_instance
        )

        chart_snapshot = ChartSnapshotClass(
            urn=chart_urn,
            aspects=[
                self._create_data_platform_instance(),
                StatusClass(removed=False),
            ],
        )

        # Basic chart info - ensure title exists
        title = panel.get("title", "")
        if not title:
            # Use panel ID or type as fallback name
            title = (
                f"Panel {panel.get('id', '')}"
                if panel.get("id")
                else panel.get("type", "Unnamed Panel")
            )

        description = panel.get("description", "")
        chart_type = self._get_chart_type(panel)
        last_modified = ChangeAuditStampsClass()
        chart_url = f"{self.config.url}/d/{dashboard_uid}?viewPanel={panel['id']}"

        # Get input datasets
        input_datasets = []
        datasource = panel.get("datasource")
        if datasource and isinstance(datasource, dict):
            ds_type = datasource.get("type", "unknown")
            ds_uid = datasource.get("uid", "unknown")

            # Add Grafana dataset first - use full path for name
            dataset_name = f"{ds_type}.{ds_uid}.{panel['id']}"
            ds_urn = make_dataset_urn_with_platform_instance(
                platform=self.platform,
                name=dataset_name,
                platform_instance=self.platform_instance,
                env=self.env,
            )
            input_datasets.append(ds_urn)

            # Add upstream platform dataset if configured
            if (
                self.config.connection_to_platform_map
                and ds_uid in self.config.connection_to_platform_map
            ):
                platform_config = self.config.connection_to_platform_map[ds_uid]
                name = (
                    f"{platform_config.database}.{ds_uid}"
                    if platform_config.database
                    else ds_uid
                )
                upstream_urn = make_dataset_urn_with_platform_instance(
                    platform=platform_config.platform,
                    name=name,
                    platform_instance=platform_config.platform_instance,
                    env=platform_config.env or "PROD",
                )
                input_datasets.append(upstream_urn)

        # Extract custom properties
        custom_props = self._get_custom_properties(panel)

        chart_info = ChartInfoClass(
            type=chart_type,
            description=description,
            title=title,
            lastModified=last_modified,
            chartUrl=chart_url,
            inputs=input_datasets,
            customProperties=custom_props,
        )
        chart_snapshot.aspects.append(chart_info)

        # Add ownership from dashboard
        owner = self._get_owner(dashboard.get("dashboard", {}))
        if owner:
            chart_snapshot.aspects.append(owner)

        # Input fields - moved before MetadataWorkUnit yield
        input_fields = self._get_chart_fields(panel)
        if input_fields and input_datasets:
            # Always use Grafana dataset for input fields (the first in input_datasets)
            dataset_urn = input_datasets[0]
            yield from self._add_input_fields_to_chart(
                chart_urn=chart_urn,
                dataset_urn=dataset_urn,
                input_fields=input_fields,
            )

        yield MetadataWorkUnit(
            id=f"grafana-chart-{dashboard_uid}-{panel['id']}",
            mce=MetadataChangeEvent(proposedSnapshot=chart_snapshot),
        )

        # Add chart to dashboard container
        dashboard_key = DashboardContainerKey(
            platform=self.platform,
            instance=self.platform_instance,
            dashboard_id=dashboard_uid,
        )
        yield from add_dataset_to_container(
            container_key=dashboard_key,
            dataset_urn=chart_urn,
        )

    def _add_input_fields_to_chart(
        self, chart_urn: str, dataset_urn: str, input_fields: List[SchemaFieldClass]
    ) -> Iterable[MetadataWorkUnit]:
        """Add input fields aspect to chart"""
        if not input_fields:
            return

        yield MetadataChangeProposalWrapper(
            entityUrn=chart_urn,
            aspect=InputFieldsClass(
                fields=[
                    InputFieldClass(
                        schemaField=field,
                        schemaFieldUrn=make_schema_field_urn(
                            dataset_urn, field.fieldPath
                        ),
                    )
                    for field in input_fields
                ]
            ),
        ).as_workunit()

    def _emit_datasource(
        self, panel: dict, dashboard_uid: Optional[str] = None
    ) -> Iterable[MetadataWorkUnit]:
        source = panel.get("datasource")
        if not source or not isinstance(source, dict):
            return

        raw_sql = None

        for target in panel.get("targets", []):
            if target.get("rawSql"):
                raw_sql = target.get("rawSql")
                break

        ds_type = source.get("type", "unknown")
        ds_uid = source.get("uid", "unknown")

        # Full path for URN
        dataset_name = f"{ds_type}.{ds_uid}.{panel['id']}"

        dataset_urn = make_dataset_urn_with_platform_instance(
            platform=self.platform,
            name=dataset_name,  # Use full path for URN
            platform_instance=self.platform_instance,
            env=self.env,
        )

        if dashboard_uid:
            dashboard_key = DashboardContainerKey(
                platform=self.platform,
                instance=self.platform_instance,
                dashboard_id=dashboard_uid,
            )
            yield from add_dataset_to_container(
                container_key=dashboard_key,
                dataset_urn=dataset_urn,
            )

        dataset_title = panel.get("title", "") or panel["id"]

        dataset_snapshot = DatasetSnapshotClass(
            urn=dataset_urn,
            aspects=[
                self._create_data_platform_instance(),
                DatasetPropertiesClass(
                    name=f"{ds_uid} ({dataset_title})",
                    description="",
                    customProperties={
                        "type": ds_type,
                        "uid": ds_uid,
                        "full_path": dataset_name,
                    },
                ),
                StatusClass(removed=False),
            ],
        )

        # Create schema metadata
        schema_metadata = self._create_schema_metadata(panel, ds_uid, ds_type)
        if schema_metadata and schema_metadata.fields:
            dataset_snapshot.aspects.append(schema_metadata)

        self.report.report_dataset_scanned()
        yield MetadataWorkUnit(
            id=f"grafana-dataset-{ds_uid}-snapshot",
            mce=MetadataChangeEvent(proposedSnapshot=dataset_snapshot),
        )

        dataset_type = self._get_dataset_subtype(ds_type, raw_sql)
        if raw_sql:
            yield MetadataChangeProposalWrapper(
                entityUrn=dataset_urn,
                aspect=ViewPropertiesClass(
                    materialized=False,
                    viewLogic=raw_sql,
                    viewLanguage="SQL",
                ),
            ).as_workunit()

        yield MetadataChangeProposalWrapper(
            entityUrn=dataset_urn,
            aspect=SubTypesClass(typeNames=dataset_type),
        ).as_workunit()

    def _create_schema_metadata(
        self,
        panel: Dict,
        datasource_uid: str,
        datasource_type: str,
    ) -> SchemaMetadataClass:
        """Create schema metadata by aggregating fields from all panels using this datasource"""
        return SchemaMetadataClass(
            schemaName=f"{datasource_type}.{datasource_uid}.{panel}",  # Use full path
            platform=make_data_platform_urn(self.platform),
            version=0,
            fields=self._get_chart_fields(panel),
            hash="",
            platformSchema=OtherSchemaClass(rawSchema=""),
        )

    def _emit_lineage(self, panel: dict) -> Optional[MetadataWorkUnit]:
        source = panel.get("datasource")
        if not source or not isinstance(source, dict):
            return None

        ds_type = source.get("type", "unknown")
        ds_uid = source.get("uid", "unknown")

        # Get raw SQL from targets
        raw_sql = None
        for target in panel.get("targets", []):
            if target.get("rawSql"):
                raw_sql = target.get("rawSql")
                break

        # Use full path for dataset name
        dataset_name = f"{ds_type}.{ds_uid}.{panel['id']}"

        # Get Grafana dataset URN
        ds_urn = make_dataset_urn_with_platform_instance(
            platform=self.platform,
            name=dataset_name,
            platform_instance=self.platform_instance,
            env=self.env,
        )

        # Handle connection to platform mapping if configured
        if (
            self.config.connection_to_platform_map
            and ds_uid in self.config.connection_to_platform_map
        ):
            # Get upstream platform config
            platform_config = self.config.connection_to_platform_map[ds_uid]

            # If we have raw SQL, parse it for lineage
            if raw_sql:
                parsed_sql = self._parse_sql_for_lineage(
                    sql=raw_sql,
                    source_platform=platform_config.platform,
                    database=platform_config.database,
                    platform_instance=platform_config.platform_instance,
                    env=platform_config.env or "PROD",
                )

                if parsed_sql:
                    return self._create_column_lineage(
                        ds_urn, parsed_sql, platform_config
                    )

            # If no SQL or parsing failed, return basic lineage
            name = (
                f"{platform_config.database}.{ds_uid}"
                if platform_config.database
                else ds_uid
            )
            upstream_urn = make_dataset_urn_with_platform_instance(
                platform=platform_config.platform,
                name=name,
                platform_instance=platform_config.platform_instance,
                env=platform_config.env or "PROD",
            )

            return MetadataChangeProposalWrapper(
                entityUrn=ds_urn,
                aspect=UpstreamLineageClass(
                    upstreams=[
                        UpstreamClass(
                            dataset=upstream_urn,
                            type=DatasetLineageTypeClass.TRANSFORMED,
                        )
                    ]
                ),
            ).as_workunit()

        return None

    def _get_chart_type(self, panel: dict) -> Optional[str]:
        """Map Grafana panel types to DataHub chart types"""
        type_mapping = {
            "graph": ChartTypeClass.LINE,
            "timeseries": ChartTypeClass.LINE,
            "table": ChartTypeClass.TABLE,
            "stat": ChartTypeClass.TEXT,
            "gauge": ChartTypeClass.TEXT,
            "bargauge": ChartTypeClass.TEXT,
            "bar": ChartTypeClass.BAR,
            "pie": ChartTypeClass.PIE,
            "heatmap": ChartTypeClass.TABLE,
            "histogram": ChartTypeClass.BAR,
        }

        panel_type = panel.get("type", "")
        return type_mapping.get(panel_type)

    def _get_custom_properties(self, panel: dict) -> Dict[str, str]:
        """Extract custom properties from panel"""
        props = {}

        # Add panel type
        panel_type = panel.get("type")
        if panel_type:
            props["type"] = panel_type

        # Add data source info
        source = panel.get("datasource")
        if source:
            if isinstance(source, dict):
                props["datasourceType"] = source.get("type", "")
                props["datasourceUid"] = source.get("uid", "")

        # Add other relevant properties
        for key in [
            "description",
            "format",
            "pluginVersion",
            "repeatDirection",
            "maxDataPoints",
        ]:
            value = panel.get(key)
            if value:
                props[key] = str(value)

        targets = panel.get("targets", [])
        if targets:
            props["queryCount"] = str(len(targets))

        return props

    def _get_owner(self, dashboard_data: dict) -> Optional[OwnershipClass]:
        """Extract ownership information"""
        uid = dashboard_data.get("uid")
        if uid:
            owners = [
                OwnerClass(
                    owner=make_user_urn(uid), type=OwnershipTypeClass.TECHNICAL_OWNER
                )
            ]
            # Add dashboard UID as owner

            # Add creator if exists
            creator = dashboard_data.get("createdBy")
            if creator:
                owners.append(
                    OwnerClass(
                        owner=make_user_urn(creator), type=OwnershipTypeClass.DATAOWNER
                    )
                )

            return OwnershipClass(owners=owners)

        return None

    def _get_chart_fields(self, panel: dict) -> List[SchemaFieldClass]:
        """Extract fields that are actually used in the panel visualization"""
        fields = []

        # Extract fields from different sources
        fields.extend(self._get_fields_from_targets(panel.get("targets", [])))
        fields.extend(self._get_fields_from_field_config(panel.get("fieldConfig", {})))
        fields.extend(
            self._get_fields_from_transformations(panel.get("transformations", []))
        )

        return self._deduplicate_fields(fields)

    def _get_fields_from_targets(self, targets: List[dict]) -> List[SchemaFieldClass]:
        """Extract fields from panel targets"""
        fields = []
        for target in targets:
            fields.extend(self._get_sql_column_fields(target))
            fields.extend(self._get_prometheus_fields(target))
            fields.extend(self._get_raw_sql_fields(target))
            fields.extend(self._get_time_format_fields(target))
        return fields

    def _get_sql_column_fields(self, target: dict) -> List[SchemaFieldClass]:
        """Extract fields from SQL-style columns"""
        fields = []
        if target.get("sql", {}).get("columns"):
            for col in target["sql"]["columns"]:
                if col.get("parameters"):
                    for param in col["parameters"]:
                        if param.get("name") and param.get("type") == "column":
                            field_type: Union[
                                TimeTypeClass, NumberTypeClass, StringTypeClass
                            ]
                            if col["type"] == "time":
                                field_type = TimeTypeClass()
                            elif col["type"] == "number":
                                field_type = NumberTypeClass()
                            else:
                                field_type = StringTypeClass()

                            fields.append(
                                SchemaFieldClass(
                                    fieldPath=param["name"],
                                    type=SchemaFieldDataTypeClass(type=field_type),
                                    nativeDataType=col["type"],
                                )
                            )
        return fields

    def _get_prometheus_fields(self, target: dict) -> List[SchemaFieldClass]:
        """Extract fields from Prometheus expressions"""
        if target.get("expr"):
            return [
                SchemaFieldClass(
                    fieldPath=target.get("legendFormat", target["expr"]),
                    type=SchemaFieldDataTypeClass(type=NumberTypeClass()),
                    nativeDataType="prometheus_metric",
                )
            ]
        return []

    def _get_raw_sql_fields(self, target: dict) -> List[SchemaFieldClass]:
        """Extract fields from raw SQL"""
        fields = []
        if target.get("rawSql"):
            try:
                sql = target["rawSql"].lower()
                select_part = sql[sql.index("select") + 6 : sql.index("from")].strip()
                columns = [
                    col.strip().split()[-1].strip() for col in select_part.split(",")
                ]

                for col in columns:
                    clean_col = col.split(" as ")[-1].strip('"').strip("'")
                    fields.append(
                        SchemaFieldClass(
                            fieldPath=clean_col,
                            type=SchemaFieldDataTypeClass(type=StringTypeClass()),
                            nativeDataType="sql_column",
                        )
                    )
            except ValueError:
                pass
        return fields

    def _get_time_format_fields(self, target: dict) -> List[SchemaFieldClass]:
        """Extract fields from time series and table formats"""
        fields = []
        if target.get("format") == "time_series" or target.get("format") == "table":
            fields.append(
                SchemaFieldClass(
                    fieldPath="time",
                    type=SchemaFieldDataTypeClass(type=TimeTypeClass()),
                    nativeDataType="timestamp",
                )
            )
        return fields

    def _get_fields_from_field_config(
        self, field_config: dict
    ) -> List[SchemaFieldClass]:
        """Extract fields from field configuration"""
        fields = []

        # Extract from defaults
        defaults = field_config.get("defaults", {})
        if "unit" in defaults:
            fields.append(
                SchemaFieldClass(
                    fieldPath=f"value_{defaults.get('unit', 'unknown')}",
                    type=SchemaFieldDataTypeClass(type=NumberTypeClass()),
                    nativeDataType="value",
                )
            )

        # Extract from overrides
        for override in field_config.get("overrides", []):
            if "matcher" in override and override["matcher"].get("id") == "byName":
                field_name = override["matcher"].get("options")
                if field_name:
                    fields.append(
                        SchemaFieldClass(
                            fieldPath=field_name,
                            type=SchemaFieldDataTypeClass(type=NumberTypeClass()),
                            nativeDataType="metric",
                        )
                    )

        return fields

    def _get_fields_from_transformations(
        self, transformations: List[dict]
    ) -> List[SchemaFieldClass]:
        """Extract fields from transformations"""
        fields = []
        for transform in transformations:
            if transform.get("type") == "organize":
                for field_name in transform.get("options", {}).get("indexByName", {}):
                    fields.append(
                        SchemaFieldClass(
                            fieldPath=field_name,
                            type=SchemaFieldDataTypeClass(type=StringTypeClass()),
                            nativeDataType="transformed",
                        )
                    )
        return fields

    def _deduplicate_fields(
        self, fields: List[SchemaFieldClass]
    ) -> List[SchemaFieldClass]:
        """Deduplicate fields based on fieldPath"""
        seen_fields = set()
        unique_fields = []
        for field in fields:
            if field.fieldPath not in seen_fields:
                seen_fields.add(field.fieldPath)
                unique_fields.append(field)
        return unique_fields

    def _get_field_tags(self, field: SchemaFieldClass) -> List[str]:
        """Determine appropriate tags for fields based on type"""
        tags = []

        if self.config.auto_tag_dimensions and isinstance(
            field.type.type, (StringTypeClass, BooleanTypeClass)
        ):
            tags.append(make_tag_urn("Dimension"))

        if self.config.auto_tag_measures and isinstance(
            field.type.type, (NumberTypeClass, TimeTypeClass)
        ):
            tags.append(make_tag_urn("Measure"))

        return tags

    def _create_data_platform_instance(self) -> DataPlatformInstanceClass:
        return DataPlatformInstanceClass(
            platform=f"urn:li:dataPlatform:{self.platform}",
            instance=(
                make_dataplatform_instance_urn(self.platform, self.platform_instance)
                if self.platform_instance
                else None
            ),
        )

    def _create_dashboard_container(
        self, dashboard_data: dict, folder_id: Optional[str] = None
    ) -> Iterable[MetadataWorkUnit]:
        dashboard_uid = dashboard_data.get("uid")
        if not dashboard_uid:
            return

        dashboard_key = DashboardContainerKey(
            platform=self.platform,
            instance=self.platform_instance,
            dashboard_id=dashboard_uid,
        )

        parent_key = None
        if folder_id:
            parent_key = FolderKey(
                platform=self.platform,
                instance=self.platform_instance,
                folder_id=str(folder_id),
            )

        yield from gen_containers(
            container_key=dashboard_key,
            name=dashboard_data.get("title", ""),
            sub_types=["Dashboard"],
            description=dashboard_data.get("description", ""),
            parent_container_key=parent_key,
        )

    def _get_dataset_subtype(
        self, source_type: str, raw_sql: Optional[str]
    ) -> List[str]:
        """Get dataset subtype based on source type"""
        if source_type == "prometheus":
            return ["Metrics"]
        elif raw_sql:
            return ["View"]
        return ["Table"]

    def _parse_sql_for_lineage(
        self,
        sql: str,
        source_platform: str,
        database: Optional[str],
        platform_instance: Optional[str],
        env: Optional[str],
    ) -> Optional[SqlParsingResult]:
        """Parse SQL query to extract lineage information"""
        try:
            if self.ctx.graph:
                return create_lineage_sql_parsed_result(
                    query=sql,
                    platform=source_platform,
                    platform_instance=platform_instance,
                    env=env or "PROD",
                    default_db=database,
                    default_schema="public",
                    graph=self.ctx.graph,
                )
            else:
                self.report.report_warning(
                    message="No DataHub specified for graph",
                    context=sql,
                )
                return None
        except Exception as e:
            self.report.report_warning(
                message="Failed to parse SQL query",
                context=sql,
                exc=e,
            )
            return None

    def _create_column_lineage(
        self,
        dataset_urn: str,
        parsed_sql: SqlParsingResult,
        platform_config: PlatformConnectionConfig,
    ) -> Optional[MetadataWorkUnit]:
        """Create column-level lineage for dataset"""
        if not parsed_sql.column_lineage:
            return None

        upstream_lineages = []
        for col_lineage in parsed_sql.column_lineage:
            upstream_lineages.append(
                FineGrainedLineageClass(
                    downstreamType=FineGrainedLineageDownstreamTypeClass.FIELD,
                    downstreams=[
                        make_schema_field_urn(
                            dataset_urn, col_lineage.downstream.column
                        )
                    ],
                    upstreamType=FineGrainedLineageUpstreamTypeClass.FIELD_SET,
                    upstreams=[
                        make_schema_field_urn(upstream_dataset, col.column)
                        for col in col_lineage.upstreams
                        for upstream_dataset in parsed_sql.in_tables
                    ],
                )
            )

        # Use platform config for upstream dataset information
        return MetadataChangeProposalWrapper(
            entityUrn=dataset_urn,
            aspect=UpstreamLineageClass(
                upstreams=[
                    UpstreamClass(
                        dataset=table, type=DatasetLineageTypeClass.TRANSFORMED
                    )
                    for table in parsed_sql.in_tables
                ],
                fineGrainedLineages=upstream_lineages,
            ),
        ).as_workunit()

    def get_report(self) -> GrafanaSourceReport:
        return self.report
