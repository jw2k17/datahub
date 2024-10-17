import concurrent.futures
import json
import logging
import warnings
from collections import defaultdict
from enum import Enum
from itertools import product
from time import sleep, time
from typing import Any, Deque, Dict, List, Optional, Union
from urllib.parse import quote

import requests
from urllib3.exceptions import InsecureRequestWarning

from datahub.ingestion.source.dremio.dremio_config import DremioSourceConfig
from datahub.ingestion.source.dremio.dremio_datahub_source_mapping import (
    DremioToDataHubSourceTypeMapping,
)
from datahub.ingestion.source.dremio.dremio_sql_queries import DremioSQLQueries

logger = logging.getLogger(__name__)


class DremioAPIException(Exception):
    pass


class DremioEdition(Enum):
    CLOUD = "CLOUD"
    ENTERPRISE = "ENTERPRISE"
    COMMUNITY = "COMMUNITY"


class DremioAPIOperations:
    _retry_count: int = 5
    _timeout: int = 1800

    def __init__(self, connection_args: "DremioSourceConfig") -> None:
        self.dremio_to_datahub_source_mapper = DremioToDataHubSourceTypeMapping()
        self.allow_schema_pattern: List[str] = connection_args.schema_pattern.allow
        self.allow_dataset_pattern: List[str] = connection_args.dataset_pattern.allow
        self.deny_schema_pattern: List[str] = connection_args.schema_pattern.deny
        self.deny_dataset_pattern: List[str] = connection_args.dataset_pattern.deny
        self._password: Optional[str] = connection_args.password
        self._max_workers: int = connection_args.max_workers
        # Initialize headers after setting credentials
        self.headers: Dict[str, str] = {}

        if connection_args.is_dremio_cloud:
            self.is_dremio_cloud = True
            self._is_PAT = True
            self._verify = True
            self.edition = DremioEdition.CLOUD

            cloud_region = connection_args.dremio_cloud_region
            self.base_url = "https://api.dremio.cloud:443/v0"
            if cloud_region != "US":
                self.base_url = (
                    f"https://api.{cloud_region.lower()}.dremio.cloud:443/v0"
                )
        else:
            host = connection_args.hostname
            port = connection_args.port
            tls = connection_args.tls

            self.username: Optional[str] = connection_args.username

            if not host:
                raise ValueError(
                    "Hostname must be provided for on-premises Dremio instances."
                )

            protocol = "https" if tls else "http"
            self.base_url = f"{protocol}://{host}:{port}/api/v3"

            self.is_dremio_cloud = False
            self._is_PAT = connection_args.authentication_method == "PAT"

            self.set_connection_details(host=host, port=port, tls=tls)

            self._verify = tls and not connection_args.disable_certificate_verification

            if not self._verify:
                warnings.simplefilter("ignore", InsecureRequestWarning)

            self.set_credentials()

            if self.test_for_enterprise_edition():
                self.edition = DremioEdition.ENTERPRISE
            else:
                self.edition = DremioEdition.COMMUNITY

    def set_connection_details(self, host: str, port: int, tls: bool) -> None:
        protocol = "https" if tls else "http"
        self.dremio_url = f"{protocol}://{host}:{port}"

    def set_credentials(self) -> None:
        if self.is_dremio_cloud and self.base_url.endswith("dremio.cloud:443/v0"):
            # Cloud instances handle authentication differently, possibly via PAT
            return

        for retry in range(1, self._retry_count + 1):
            logger.info(f"Dremio login attempt #{retry}")
            try:
                if self.__get_sticky_headers():
                    logger.info("Dremio login successful.")
                    return

            except Exception as e:
                logger.error(f"Dremio login failed on attempt #{retry}: {e}")
                sleep(1)  # Optional: exponential backoff can be implemented here

        raise DremioAPIException(
            "Credentials cannot be refreshed. Please check your username and password."
        )

    def __get_sticky_headers(self) -> bool:
        """
        Get authentication token and set headers.
        Returns True if headers are set successfully, False otherwise.
        """
        if self._is_PAT:
            if not self._password:
                logger.error("Personal Access Token is missing.")
                return False
            self.headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self._password}",
            }
            return True
        else:
            if not self.username or not self._password:
                logger.error("Username and password are required for authentication.")
                return False
            try:
                response = self._login(
                    headers={"Content-Type": "application/json"},
                    data=json.dumps(
                        {"userName": self.username, "password": self._password}
                    ),
                )
                token = response.get("token")
                if not token:
                    logger.error("Authentication token not found in the response.")
                    return False
                self.headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"_dremio{token}",
                }
                return True
            except Exception as e:
                logger.error(f"Failed to obtain authentication headers: {e}")
                return False

    def get(self, url: str) -> Dict:
        """execute a get request on dremio"""
        response = requests.get(
            url=(self.base_url + url),
            headers=self.headers,
            verify=self._verify,
            timeout=self._timeout,
        )
        return response.json()

    def post(self, url: str, data: str) -> Dict:
        """execute a get request on dremio"""
        response = requests.post(
            url=(self.base_url + url),
            headers=self.headers,
            data=data,
            verify=self._verify,
            timeout=self._timeout,
        )
        return response.json()

    def _login(self, headers: Dict, data: str) -> Dict:
        """execute a get request on dremio"""
        response = requests.post(
            url=f"{self.dremio_url}/apiv2/login",
            headers=headers,
            data=data,
            verify=self._verify,
            timeout=self._timeout,
        )
        response.raise_for_status()
        return response.json()

    def execute_query(self, query: str, timeout: int = 300) -> List[Dict[str, Any]]:
        """Execute SQL query with timeout and error handling"""
        try:
            response = self.post(url="/sql", data=json.dumps({"sql": query}))

            if "errorMessage" in response:
                raise RuntimeError(f"SQL Error: {response['errorMessage']}")

            job_id = response["id"]

            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(self.fetch_results, job_id)
                try:
                    return future.result(timeout=timeout)
                except concurrent.futures.TimeoutError:
                    self.cancel_query(job_id)
                    raise TimeoutError(
                        f"Query execution timed out after {timeout} seconds"
                    )

        except requests.RequestException as e:
            raise RuntimeError(f"Error executing query: {str(e)}")

    def fetch_results(self, job_id: str) -> List[Dict]:
        """Fetch job results with status checking"""
        start_time = time()
        while True:
            status = self.get_job_status(job_id)
            if status["jobState"] == "COMPLETED":
                break
            elif status["jobState"] == "FAILED":
                error_message = status.get("errorMessage", "Unknown error")
                raise RuntimeError(f"Query failed: {error_message}")
            elif status["jobState"] == "CANCELED":
                raise RuntimeError("Query was canceled")

            if time() - start_time > self._timeout:
                self.cancel_query(job_id)
                raise TimeoutError("Query execution timed out while fetching results")

            sleep(3)

        return self._fetch_all_results(job_id)

    def _fetch_all_results(self, job_id: str) -> List[Dict]:
        """Fetch all results for a completed job"""
        limit = 500
        offset = 0
        rows = []

        while True:
            result = self.get_job_result(job_id, offset, limit)
            rows.extend(result["rows"])

            offset = offset + limit
            if offset >= result["rowCount"]:
                break

        return rows

    def cancel_query(self, job_id: str) -> None:
        """Cancel a running query"""
        try:
            self.post(url=f"/job/{job_id}/cancel", data=json.dumps({}))
        except Exception as e:
            logger.error(f"Failed to cancel query {job_id}: {str(e)}")

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """Check job status"""
        return self.get(
            url=f"/job/{job_id}/",
        )

    def get_job_result(
        self, job_id: str, offset: int = 0, limit: int = 500
    ) -> Dict[str, Any]:
        """Get job results in batches"""
        return self.get(
            url=f"/job/{job_id}/results?offset={offset}&limit={limit}",
        )

    def get_dataset_id(self, schema: str, dataset: str) -> Optional[str]:
        """Retrieve the dataset ID based on schema and dataset name."""
        schema_split = schema.split(".")
        schema_str = ""
        last_val = 0

        for increment_val in range(1, len(schema_split) + 1):
            current_path = ".".join(schema_split[last_val:increment_val])
            url_encoded = quote(current_path, safe="")
            response = self.get(url=f"/catalog/by-path/{schema_str}/{url_encoded}")

            if not response.get("errorMessage"):
                last_val = increment_val
                schema_str = (
                    f"{schema_str}/{url_encoded}" if schema_str else url_encoded
                )

        dataset_response = self.get(
            url=f"/catalog/by-path/{schema_str}/{quote(dataset, safe='')}",
        )
        dataset_id = dataset_response.get("id")
        if not dataset_id:
            logger.error(f"Dataset ID not found for {schema}.{dataset}")

        return dataset_id

    def community_get_formatted_tables(
        self, tables_and_columns: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        schema_list = []
        schema_dict_lookup = []
        dataset_list = []
        column_dictionary: Dict[str, List[Dict]] = defaultdict(list)

        ordinal_position = 0
        for record in tables_and_columns:
            if not record.get("COLUMN_NAME"):
                continue

            table_full_path = record.get("FULL_TABLE_PATH")
            if not table_full_path:
                continue

            column_dictionary[table_full_path].append(
                {
                    "name": record["COLUMN_NAME"],
                    "ordinal_position": record.get(
                        "ORDINAL_POSITION", ordinal_position
                    ),
                    "is_nullable": record["IS_NULLABLE"],
                    "data_type": record["DATA_TYPE"],
                    "column_size": record["COLUMN_SIZE"],
                }
            )

            ordinal_position += 1

            if record.get("TABLE_SCHEMA") not in schema_list:
                schema_list.append(record.get("TABLE_SCHEMA"))

        distinct_tables_list = list(
            {
                tuple(
                    dictionary[key]
                    for key in (
                        "TABLE_SCHEMA",
                        "TABLE_NAME",
                        "FULL_TABLE_PATH",
                        "VIEW_DEFINITION",
                    )
                    if key in dictionary
                ): dictionary
                for dictionary in tables_and_columns
            }.values()
        )

        for schema in schema_list:
            schema_dict_lookup.append(self.validate_schema_format(schema))

        for table, schemas in product(distinct_tables_list, schema_dict_lookup):
            if table.get("TABLE_SCHEMA") == schemas.get("original_path"):
                dataset_list.append(
                    {
                        "TABLE_SCHEMA": "["
                        + ", ".join(
                            schemas.get("formatted_path") + [table.get("TABLE_NAME")]
                        )
                        + "]",
                        "TABLE_NAME": table.get("TABLE_NAME"),
                        "COLUMNS": column_dictionary.get(
                            table.get("FULL_TABLE_PATH", "")
                        ),
                        "VIEW_DEFINITION": table.get("VIEW_DEFINITION"),
                        "RESOURCE_ID": self.get_dataset_id(
                            schema=".".join(schemas.get("formatted_path")),
                            dataset=table.get("TABLE_NAME", ""),
                        ),
                        "LOCATION_ID": self.get_dataset_id(
                            schema=".".join(schemas.get("formatted_path")),
                            dataset="",
                        ),
                    }
                )

        return dataset_list

    def get_all_tables_and_columns(self, containers: Deque) -> List[Dict]:
        if self.edition == DremioEdition.ENTERPRISE:
            query_template = DremioSQLQueries.QUERY_DATASETS_EE
        elif self.edition == DremioEdition.CLOUD:
            query_template = DremioSQLQueries.QUERY_DATASETS_CLOUD
        else:
            query_template = DremioSQLQueries.QUERY_DATASETS_CE

        def get_pattern_condition(
            patterns: Union[str, List[str]], field: str, allow: bool = True
        ) -> str:
            if not patterns:
                return ""

            if isinstance(patterns, str):
                patterns = [patterns.upper()]

            if ".*" in patterns and allow:
                return ""

            patterns = [p.upper() for p in patterns if p != ".*"]
            if not patterns:
                return ""

            operator = "REGEXP_LIKE" if allow else "NOT REGEXP_LIKE"
            pattern_str = "|".join(f"({p})" for p in patterns)
            return f"AND {operator}({field}, '{pattern_str}')"

        schema_field = "CONCAT(REPLACE(REPLACE(REPLACE(UPPER(TABLE_SCHEMA), ', ', '.'), '[', ''), ']', ''))"
        table_field = "UPPER(TABLE_NAME)"

        schema_condition = get_pattern_condition(
            self.allow_schema_pattern, schema_field
        )
        table_condition = get_pattern_condition(self.allow_dataset_pattern, table_field)
        deny_schema_condition = get_pattern_condition(
            self.deny_schema_pattern, schema_field, allow=False
        )
        deny_table_condition = get_pattern_condition(
            self.deny_dataset_pattern, table_field, allow=False
        )

        all_tables_and_columns = []

        for schema in containers:
            formatted_query = ""
            try:
                formatted_query = query_template.format(
                    schema_pattern=schema_condition,
                    table_pattern=table_condition,
                    deny_schema_pattern=deny_schema_condition,
                    deny_table_pattern=deny_table_condition,
                    container_name=schema.container_name.lower(),
                )

                all_tables_and_columns.extend(
                    self.execute_query(
                        query=formatted_query,
                    )
                )
            except Exception as exc:
                logger.warning(
                    f"{schema.subclass} {schema.container_name} had no tables or views {formatted_query}"
                )
                logger.debug(exc)

        tables = []

        if self.edition == DremioEdition.COMMUNITY:
            tables = self.community_get_formatted_tables(all_tables_and_columns)

        else:
            column_dictionary: Dict[str, List[Dict]] = defaultdict(list)

            for record in all_tables_and_columns:
                if not record.get("COLUMN_NAME"):
                    continue

                table_full_path = record.get("FULL_TABLE_PATH")
                if not table_full_path:
                    continue

                column_dictionary[table_full_path].append(
                    {
                        "name": record["COLUMN_NAME"],
                        "ordinal_position": record["ORDINAL_POSITION"],
                        "is_nullable": record["IS_NULLABLE"],
                        "data_type": record["DATA_TYPE"],
                        "column_size": record["COLUMN_SIZE"],
                    }
                )

            distinct_tables_list = list(
                {
                    tuple(
                        dictionary[key]
                        for key in (
                            "TABLE_SCHEMA",
                            "TABLE_NAME",
                            "FULL_TABLE_PATH",
                            "VIEW_DEFINITION",
                            "LOCATION_ID",
                            "OWNER",
                            "OWNER_TYPE",
                            "CREATED",
                            "FORMAT_TYPE",
                        )
                        if key in dictionary
                    ): dictionary
                    for dictionary in all_tables_and_columns
                }.values()
            )

            for table in distinct_tables_list:
                tables.append(
                    {
                        "TABLE_NAME": table.get("TABLE_NAME"),
                        "TABLE_SCHEMA": table.get("TABLE_SCHEMA"),
                        "COLUMNS": column_dictionary[table["FULL_TABLE_PATH"]],
                        "VIEW_DEFINITION": table.get("VIEW_DEFINITION"),
                        "RESOURCE_ID": table.get("RESOURCE_ID"),
                        "LOCATION_ID": table.get("LOCATION_ID"),
                        "OWNER": table.get("OWNER"),
                        "OWNER_TYPE": table.get("OWNER_TYPE"),
                        "CREATED": table.get("CREATED"),
                        "FORMAT_TYPE": table.get("FORMAT_TYPE"),
                    }
                )

        return tables

    def validate_schema_format(self, schema):

        if "." in schema:
            schema_path = self.get(
                url=f"/catalog/{self.get_dataset_id(schema=schema, dataset='')}"
            ).get("path")
            return {"original_path": schema, "formatted_path": schema_path}
        return {"original_path": schema, "formatted_path": [schema]}

    def test_for_enterprise_edition(self):
        response = requests.get(
            url=f"{self.base_url}/catalog/privileges",
            headers=self.headers,
            verify=self._verify,
            timeout=self._timeout,
        )

        if response.status_code == 200:
            return True

        return False

    def get_view_parents(self, dataset_id: str) -> List:
        parents_list = []

        if self.edition == DremioEdition.ENTERPRISE:
            parents = self.get(
                url=f"/catalog/{dataset_id}/graph",
            ).get("parents")

            if not parents:
                return []

            for parent in parents:
                parents_list.append(".".join(parent.get("path")))

        return parents_list

    def extract_all_queries(self) -> List[Dict[str, Any]]:
        if self.edition == DremioEdition.CLOUD:
            jobs_query = DremioSQLQueries.QUERY_ALL_JOBS_CLOUD
        else:
            jobs_query = DremioSQLQueries.QUERY_ALL_JOBS

        return self.execute_query(query=jobs_query)

    def get_source_by_id(self, source_id: str) -> Optional[Dict]:
        """
        Fetch source details by ID.
        """
        response = self.get(
            url=f"/source/{source_id}",
        )
        return response if response else None

    def get_source_for_dataset(self, schema: str, dataset: str) -> Optional[Dict]:
        """
        Get source information for a dataset given its schema and name.
        """
        dataset_id = self.get_dataset_id(schema, dataset)
        if not dataset_id:
            return None

        catalog_entry = self.get(
            url=f"/catalog/{dataset_id}",
        )
        if not catalog_entry or "path" not in catalog_entry:
            return None

        source_id = catalog_entry["path"][0]
        return self.get_source_by_id(source_id)

    def get_tags_for_resource(self, resource_id: str) -> Optional[List[str]]:
        """
        Get Dremio tags for a given resource_id.
        """

        try:
            tags = self.get(
                url=f"/catalog/{resource_id}/collaboration/tag",
            )
            return tags.get("tags")
        except Exception as exc:
            logging.info(
                "Resource ID {} has no tags: {}".format(
                    resource_id,
                    exc,
                )
            )
        return None

    def get_description_for_resource(self, resource_id: str) -> Optional[str]:
        """
        Get Dremio wiki entry for a given resource_id.
        """

        try:
            tags = self.get(
                url=f"/catalog/{resource_id}/collaboration/wiki",
            )
            return tags.get("text")
        except Exception as exc:
            logging.info(
                "Resource ID {} has no wiki entry: {}".format(
                    resource_id,
                    exc,
                )
            )
        return None

    def get_source_type(
        self,
        dremio_source_type: str,
        datahub_source_type: Optional[str],
    ) -> Optional[str]:
        """
        Get Dremio wiki entry for a given resource_id.
        """

        lookup_datahub_source_type = (
            self.dremio_to_datahub_source_mapper.get_datahub_source_type(
                dremio_source_type=dremio_source_type,
            )
        )

        if lookup_datahub_source_type:
            return lookup_datahub_source_type

        self.dremio_to_datahub_source_mapper.add_mapping(
            dremio_source_type=dremio_source_type,
            datahub_source_type=datahub_source_type,
        )
        return datahub_source_type

    def get_source_category(
        self,
        dremio_source_type: str,
    ) -> Optional[str]:
        """
        Get Dremio wiki entry for a given resource_id.
        """

        return self.dremio_to_datahub_source_mapper.get_category(
            source_type=dremio_source_type,
        )

    def get_containers_for_location(
        self, resource_id: str, path: List[str]
    ) -> List[Dict[str, str]]:
        containers = []

        def traverse_path(location_id: str, entity_path: List[str]) -> List:
            nonlocal containers
            try:
                response = self.get(url=f"/catalog/{location_id}")

                if response.get("entityType") == "folder":
                    containers.append(
                        {
                            "id": location_id,
                            "name": entity_path[-1],
                            "path": entity_path[:-1],
                            "container_type": "FOLDER",
                        }
                    )

                for container in response.get("children", []):
                    if container.get("type") == "CONTAINER":
                        traverse_path(container.get("id"), container.get("path"))

            except Exception as exc:
                logging.info(
                    "Location {} contains no tables or views. Skipping...".format(id)
                )
                logging.info("Error message: {}".format(exc))

            return containers

        return traverse_path(location_id=resource_id, entity_path=path)

    def get_all_containers(self):
        """
        Query the Dremio sources API and return source information.
        """
        containers = []

        response = self.get(url="/catalog")

        def process_source(source):
            if source.get("containerType") == "SOURCE":
                source_config = self.get(
                    url=f"/catalog/{source.get('id')}",
                )

                if source_config.get("config", {}).get("database"):
                    db = source_config.get("config", {}).get("database")
                else:
                    db = source_config.get("config", {}).get("databaseName", "")

                return {
                    "id": source.get("id"),
                    "name": source.get("path")[0],
                    "path": [],
                    "container_type": "SOURCE",
                    "source_type": source_config.get("type"),
                    "root_path": source_config.get("config", {}).get("rootPath"),
                    "database_name": db,
                }
            else:
                return {
                    "id": source.get("id"),
                    "name": source.get("path")[0],
                    "path": [],
                    "container_type": "SPACE",
                }

        def process_source_and_containers(source):
            container = process_source(source)
            sub_containers = self.get_containers_for_location(
                resource_id=container.get("id"),
                path=[container.get("name")],
            )
            return [container] + sub_containers

        # Use ThreadPoolExecutor to parallelize the processing of sources
        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self._max_workers
        ) as executor:
            future_to_source = {
                executor.submit(process_source_and_containers, source): source
                for source in response.get("data", [])
            }

            for future in concurrent.futures.as_completed(future_to_source):
                containers.extend(future.result())

        return containers
