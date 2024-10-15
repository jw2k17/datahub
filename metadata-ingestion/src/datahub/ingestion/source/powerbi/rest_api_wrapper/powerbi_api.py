import json
import logging
import sys
from typing import Any, Dict, Iterable, List, Optional, cast

import requests

from datahub.ingestion.source.powerbi.config import (
    Constant,
    PowerBiDashboardSourceConfig,
    PowerBiDashboardSourceReport,
)
from datahub.ingestion.source.powerbi.rest_api_wrapper import data_resolver
from datahub.ingestion.source.powerbi.rest_api_wrapper.data_classes import (
    FIELD_TYPE_MAPPING,
    App,
    AppDashboard,
    AppReport,
    Column,
    Dashboard,
    Measure,
    PowerBIDataset,
    Report,
    Table,
    User,
    Workspace,
)
from datahub.ingestion.source.powerbi.rest_api_wrapper.data_resolver import (
    AdminAPIResolver,
    RegularAPIResolver,
)

# Logger instance
logger = logging.getLogger(__name__)


class PowerBiAPI:
    def __init__(
        self,
        config: PowerBiDashboardSourceConfig,
        reporter: PowerBiDashboardSourceReport,
    ) -> None:
        self.__config: PowerBiDashboardSourceConfig = config
        self.__reporter = reporter

        self.__regular_api_resolver = RegularAPIResolver(
            client_id=self.__config.client_id,
            client_secret=self.__config.client_secret,
            tenant_id=self.__config.tenant_id,
        )

        self.__admin_api_resolver = AdminAPIResolver(
            client_id=self.__config.client_id,
            client_secret=self.__config.client_secret,
            tenant_id=self.__config.tenant_id,
        )

    def log_http_error(self, message: str) -> Any:
        logger.warning(message)
        _, e, _ = sys.exc_info()
        if isinstance(e, requests.exceptions.HTTPError):
            logger.warning(f"HTTP status-code = {e.response.status_code}")

        logger.debug(msg=message, exc_info=e)

        return e

    def _get_dashboard_endorsements(
        self, scan_result: Optional[dict]
    ) -> Dict[str, List[str]]:
        """
        Store saved dashboard endorsements into a dict with dashboard id as key and
        endorsements or tags as list of strings
        """
        results: Dict[str, List[str]] = {}
        if scan_result is None:
            return results

        for scanned_dashboard in scan_result.get(Constant.DASHBOARDS, []):
            # Iterate through response and create a list of PowerBiAPI.Dashboard
            dashboard_id = scanned_dashboard.get("id")
            tags = self._parse_endorsement(
                scanned_dashboard.get(Constant.ENDORSEMENT_DETAIL, None)
            )
            results[dashboard_id] = tags

        return results

    def _get_report_endorsements(
        self, scan_result: Optional[dict]
    ) -> Dict[str, List[str]]:
        results: Dict[str, List[str]] = {}

        if scan_result is None:
            return results

        reports: List[dict] = scan_result.get(Constant.REPORTS, [])

        for report in reports:
            report_id = report.get(Constant.ID, None)
            if report_id is None:
                logger.warning(
                    f"Report id is none. Skipping endorsement tag for report instance {report}"
                )
                continue
            endorsements = self._parse_endorsement(
                report.get(Constant.ENDORSEMENT_DETAIL, None)
            )
            results[report_id] = endorsements

        return results

    def _get_resolver(self):
        if self.__config.admin_apis_only:
            return self.__admin_api_resolver
        return self.__regular_api_resolver

    def _get_entity_users(
        self, workspace_id: str, entity_name: str, entity_id: str
    ) -> List[User]:
        """
        Return list of dashboard users
        """
        users: List[User] = []
        if self.__config.extract_ownership is False:
            logger.info(
                "Extract ownership capabilities is disabled from configuration and hence returning empty users list"
            )
            return users

        try:
            users = self.__admin_api_resolver.get_users(
                workspace_id=workspace_id,
                entity=entity_name,
                entity_id=entity_id,
            )
        except:  # It will catch all type of exception
            e = self.log_http_error(
                message=f"Unable to fetch users for {entity_name}({entity_id})."
            )
            if data_resolver.is_permission_error(cast(Exception, e)):
                logger.warning(
                    f"{entity_name} users would not get ingested as admin permission is not enabled on "
                    "configured Azure AD Application",
                )

        return users

    def get_dashboard_users(self, dashboard: Dashboard) -> List[User]:
        return self._get_entity_users(
            dashboard.workspace_id, Constant.DASHBOARDS, dashboard.id
        )

    def get_report_users(self, workspace_id: str, report_id: str) -> List[User]:
        return self._get_entity_users(workspace_id, Constant.REPORTS, report_id)

    def get_reports(self, workspace: Workspace) -> List[Report]:
        """
        Fetch the report from PowerBi for the given Workspace
        """
        reports: List[Report] = []
        try:
            reports = self._get_resolver().get_reports(workspace)
        except:
            self.log_http_error(
                message=f"Unable to fetch reports for workspace {workspace.name}"
            )

        def fill_ownership() -> None:
            if self.__config.extract_ownership is False:
                logger.info(
                    "Skipping user retrieval for report as extract_ownership is set to false"
                )
                return

            for report in reports:
                report.users = self.get_report_users(
                    workspace_id=workspace.id, report_id=report.id
                )

        def fill_tags() -> None:
            if self.__config.extract_endorsements_to_tags is False:
                logger.info(
                    "Skipping endorsements tags retrieval for report as extract_endorsements_to_tags is set to false"
                )
                return

            for report in reports:
                report.tags = workspace.report_endorsements.get(report.id, [])

        fill_ownership()
        fill_tags()
        return reports

    def get_workspaces(self) -> List[Workspace]:
        modified_workspace_ids: List[str] = []

        if self.__config.modified_since:
            modified_workspace_ids = self.get_modified_workspaces()

        groups: List[dict] = []
        filter_: Dict[str, str] = {}
        try:
            if modified_workspace_ids:
                id_filter: List[str] = []

                for id_ in modified_workspace_ids:
                    id_filter.append(f"id eq {id_}")

                filter_["$filter"] = " or ".join(id_filter)

            groups = self._get_resolver().get_groups(filter_=filter_)

        except:
            self.log_http_error(message="Unable to fetch list of workspaces")
            raise  # we want this exception to bubble up

        workspaces = [
            Workspace(
                id=workspace[Constant.ID],
                name=workspace[Constant.NAME],
                type=workspace[Constant.TYPE],
                datasets={},
                dashboards=[],
                reports=[],
                report_endorsements={},
                dashboard_endorsements={},
                scan_result={},
                independent_datasets=[],
                app=None,  # It is getting set later from scan-result
            )
            for workspace in groups
        ]
        return workspaces

    def get_modified_workspaces(self) -> List[str]:
        modified_workspace_ids: List[str] = []

        if self.__config.modified_since is None:
            return modified_workspace_ids

        try:
            modified_workspace_ids = self.__admin_api_resolver.get_modified_workspaces(
                self.__config.modified_since
            )
        except:
            self.log_http_error(message="Unable to fetch list of modified workspaces.")

        return modified_workspace_ids

    def _get_scan_result(self, workspace_ids: List[str]) -> Any:
        scan_id: Optional[str] = None
        try:
            scan_id = self.__admin_api_resolver.create_scan_job(
                workspace_ids=workspace_ids
            )
        except:
            e = self.log_http_error(message=f"Unable to fetch get scan result.")
            if data_resolver.is_permission_error(cast(Exception, e)):
                logger.warning(
                    "Dataset lineage can not be ingestion because this user does not have access to the PowerBI Admin "
                    "API. "
                )
            return None

        logger.info("Waiting for scan to complete")
        if (
            self.__admin_api_resolver.wait_for_scan_to_complete(
                scan_id=scan_id, timeout=self.__config.scan_timeout
            )
            is False
        ):
            raise ValueError(
                "Workspace detail is not available. Please increase the scan_timeout configuration value to wait "
                "longer for the scan job to complete."
            )

        # Scan is complete lets take the result
        scan_result = self.__admin_api_resolver.get_scan_result(scan_id=scan_id)
        pretty_json: str = json.dumps(scan_result, indent=1)
        logger.debug(f"scan result = {pretty_json}")

        return scan_result

    @staticmethod
    def _parse_endorsement(endorsements: Optional[dict]) -> List[str]:
        if not endorsements:
            return []

        endorsement = endorsements.get(Constant.ENDORSEMENT, None)
        if not endorsement:
            return []

        return [endorsement]

    def _get_workspace_datasets(self, workspace: Workspace) -> dict:
        """
        Filter out "dataset" from scan_result and return Dataset instance set
        """
        dataset_map: dict = {}
        scan_result = workspace.scan_result

        if scan_result is None:
            return dataset_map

        datasets: Optional[Any] = scan_result.get(Constant.DATASETS)
        if datasets is None or len(datasets) == 0:
            logger.warning(
                f"Workspace {scan_result[Constant.NAME]}({scan_result[Constant.ID]}) does not have datasets"
            )

            logger.info("Returning empty datasets")
            return dataset_map

        logger.debug("Processing scan result for datasets")

        for dataset_dict in datasets:
            dataset_instance: PowerBIDataset = self._get_resolver().get_dataset(
                workspace_id=scan_result[Constant.ID],
                dataset_id=dataset_dict[Constant.ID],
            )

            # fetch + set dataset parameters
            try:
                dataset_parameters = self._get_resolver().get_dataset_parameters(
                    workspace_id=scan_result[Constant.ID],
                    dataset_id=dataset_dict[Constant.ID],
                )
                dataset_instance.parameters = dataset_parameters
            except Exception as e:
                logger.info(
                    f"Unable to fetch dataset parameters for {dataset_dict[Constant.ID]}: {e}"
                )

            if self.__config.extract_endorsements_to_tags:
                dataset_instance.tags = self._parse_endorsement(
                    dataset_dict.get(Constant.ENDORSEMENT_DETAIL, None)
                )

            dataset_map[dataset_instance.id] = dataset_instance
            # set dataset-name
            dataset_name: str = (
                dataset_instance.name
                if dataset_instance.name is not None
                else dataset_instance.id
            )
            logger.debug(f"dataset_dict = {dataset_dict}")
            for table in dataset_dict.get(Constant.TABLES, []):
                expression: Optional[str] = (
                    table[Constant.SOURCE][0][Constant.EXPRESSION]
                    if table.get(Constant.SOURCE) is not None
                    and len(table[Constant.SOURCE]) > 0
                    else None
                )
                table = Table(
                    name=table[Constant.NAME],
                    full_name="{}.{}".format(
                        dataset_name.replace(" ", "_"),
                        table[Constant.NAME].replace(" ", "_"),
                    ),
                    expression=expression,
                    columns=[
                        Column(
                            **column,
                            datahubDataType=FIELD_TYPE_MAPPING.get(
                                column["dataType"], FIELD_TYPE_MAPPING["Null"]
                            ),
                        )
                        for column in table.get("columns", [])
                    ],
                    measures=[
                        Measure(**measure) for measure in table.get("measures", [])
                    ],
                    dataset=dataset_instance,
                    row_count=None,
                    column_count=None,
                )
                if self.__config.profiling.enabled:
                    self._get_resolver().profile_dataset(
                        dataset_instance,
                        table,
                        workspace.name,
                        self.__config.profile_pattern,
                    )
                dataset_instance.tables.append(table)
        return dataset_map

    def get_app(
        self,
        app_id: str,
    ) -> Optional[App]:
        return self._get_resolver().get_app(
            app_id=app_id,
        )

    def _set_app(self, workspace: Workspace, workspace_metadata: Dict) -> None:
        # App_id is not present at the root level of workspace_metadata.
        # It can be found in the workspace_metadata.dashboards or workspace_metadata.reports lists.

        # Workspace_metadata contains duplicate entries for all dashboards and reports that we have included
        # in the app.
        # The duplicate entries for a report contain key `originalReportObjectId` referencing to
        # an actual report id of workspace. The duplicate entries for a dashboard contain `displayName` where
        # displayName is generated from displayName of original dashboard with prefix "App"

        app_id: Optional[str] = None
        app_reports: List[AppReport] = []
        # Filter app reports
        for report in workspace_metadata.get(Constant.REPORTS) or []:
            if report.get(Constant.APP_ID):
                app_reports.append(
                    AppReport(
                        id=report[Constant.ID],
                        original_report_id=report[Constant.ORIGINAL_REPORT_OBJECT_ID],
                    )
                )
                if app_id is None:  # In PowerBI one workspace can have one app
                    app_id = report.get(Constant.APP_ID)

        raw_app_dashboards: List[Dict] = []
        # Filter app dashboards
        for dashboard in workspace_metadata.get(Constant.DASHBOARDS) or []:
            if dashboard.get(Constant.APP_ID):
                raw_app_dashboards.append(dashboard)
                if app_id is None:  # In PowerBI, one workspace contains one app
                    app_id = report[Constant.APP_ID]

        # workspace doesn't have an App. Above two loops can be avoided
        # if app_id is available at root level in workspace_metadata
        if app_id is None:
            logger.debug(f"Workspace {workspace.name} does not contain an app.")
            return

        app: Optional[App] = self.get_app(app_id=app_id)
        if app is None:
            self.__reporter.info(
                title="App Not Found",
                message="The workspace includes an app, but its metadata is missing from the API response.",
                context=f"workspace_name={workspace.name}",
            )
            return

        # Map to find out which dashboards belongs to the App
        dashboard_map: Dict[str, Dict] = {
            raw_dashboard[Constant.DISPLAY_NAME]: raw_dashboard
            for raw_dashboard in raw_app_dashboards
        }

        app_dashboards: List[AppDashboard] = []
        for dashboard in workspace_metadata.get(Constant.DASHBOARDS) or []:
            app_dashboard_display_name = f"[App] {dashboard[Constant.DISPLAY_NAME]}"  # A Dashboard is considered part of an App if the workspace_metadata contains a Dashboard with a label formatted as "[App] <DashboardName>".
            if (
                app_dashboard_display_name in dashboard_map
            ):  # This dashboard is part of the App
                app_dashboards.append(
                    AppDashboard(
                        id=dashboard_map[app_dashboard_display_name][Constant.ID],
                        original_dashboard_id=dashboard[Constant.ID],
                    )
                )

        app.reports = app_reports
        app.dashboards = app_dashboards
        workspace.app = app

    def _fill_metadata_from_scan_result(
        self, workspaces: List[Workspace]
    ) -> List[Workspace]:
        workspace_ids = [workspace.id for workspace in workspaces]
        scan_result = self._get_scan_result(workspace_ids)
        if not scan_result:
            return workspaces

        workspaces = []
        for workspace_metadata in scan_result["workspaces"]:
            if (
                workspace_metadata.get(Constant.STATE) != Constant.ACTIVE
                or workspace_metadata.get(Constant.TYPE)
                not in self.__config.workspace_type_filter
            ):
                # if the state is not "Active" then in some state like Not Found, "name" attribute is not present
                wrk_identifier: str = (
                    workspace_metadata[Constant.NAME]
                    if workspace_metadata.get(Constant.NAME)
                    else workspace_metadata.get(Constant.ID)
                )
                self.__reporter.info(
                    title="Skipped Workspace",
                    message="Workspace was skipped due to the workspace_type_filter",
                    context=f"workspace={wrk_identifier}",
                )
                continue

            cur_workspace = Workspace(
                id=workspace_metadata[Constant.ID],
                name=workspace_metadata[Constant.NAME],
                type=workspace_metadata[Constant.TYPE],
                datasets={},
                dashboards=[],
                reports=[],
                report_endorsements={},
                dashboard_endorsements={},
                scan_result={},
                independent_datasets=[],
                app=None,  # It is getting set from scan-result
            )
            cur_workspace.scan_result = workspace_metadata
            cur_workspace.datasets = self._get_workspace_datasets(cur_workspace)

            # Fetch endorsement tag if it is enabled from configuration
            if self.__config.extract_endorsements_to_tags:
                cur_workspace.dashboard_endorsements = self._get_dashboard_endorsements(
                    cur_workspace.scan_result
                )
                cur_workspace.report_endorsements = self._get_report_endorsements(
                    cur_workspace.scan_result
                )
            else:
                logger.info(
                    "Skipping endorsements tag as extract_endorsements_to_tags is set to "
                    "false "
                )

            self._set_app(
                workspace=cur_workspace,
                workspace_metadata=workspace_metadata,
            )
            workspaces.append(cur_workspace)

        return workspaces

    def _fill_independent_datasets(self, workspace: Workspace) -> None:

        reachable_datasets: List[str] = []
        # Find out reachable datasets
        for dashboard in workspace.dashboards:
            for tile in dashboard.tiles:
                if tile.dataset is not None:
                    reachable_datasets.append(tile.dataset.id)

        for report in workspace.reports:
            if report.dataset is not None:
                reachable_datasets.append(report.dataset.id)

        # Set datasets not present in reachable_datasets
        for dataset in workspace.datasets.values():
            if dataset.id not in reachable_datasets:
                workspace.independent_datasets.append(dataset)

    def _fill_regular_metadata_detail(self, workspace: Workspace) -> None:
        def fill_dashboards() -> None:
            workspace.dashboards = self._get_resolver().get_dashboards(workspace)
            # set tiles of Dashboard
            for dashboard in workspace.dashboards:
                dashboard.tiles = self._get_resolver().get_tiles(
                    workspace, dashboard=dashboard
                )

        def fill_reports() -> None:
            if self.__config.extract_reports is False:
                logger.info(
                    "Skipping report retrieval as extract_reports is set to false"
                )
                return
            workspace.reports = self.get_reports(workspace)

        def fill_dashboard_tags() -> None:
            if self.__config.extract_endorsements_to_tags is False:
                logger.info(
                    "Skipping tag retrieval for dashboard as extract_endorsements_to_tags is set to false"
                )
                return
            for dashboard in workspace.dashboards:
                dashboard.tags = workspace.dashboard_endorsements.get(dashboard.id, [])

        if self.__config.extract_dashboards:
            fill_dashboards()

        fill_reports()
        fill_dashboard_tags()
        self._fill_independent_datasets(workspace=workspace)

    def _set_app_reference(self, workspace: Workspace) -> None:
        if workspace.app is None:
            return

        included_app_dashboards: List[str] = [
            dashboard.original_dashboard_id for dashboard in workspace.app.dashboards
        ]
        included_app_reports: List[str] = [
            report.original_report_id for report in workspace.app.reports
        ]

        for dashboard in workspace.dashboards:
            if dashboard.id in included_app_dashboards:
                dashboard.app_reference = workspace.app

        for report in workspace.reports:
            if report.id in included_app_reports:
                report.app_reference = workspace.app

    # flake8: noqa: C901
    def fill_workspaces(
        self, workspaces: List[Workspace], reporter: PowerBiDashboardSourceReport
    ) -> Iterable[Workspace]:
        workspaces = self._fill_metadata_from_scan_result(workspaces=workspaces)
        # First try to fill the admin detail as some regular metadata contains lineage to admin metadata
        for workspace in workspaces:
            self._fill_regular_metadata_detail(workspace=workspace)
            self._set_app_reference(workspace=workspace)
        return workspaces
