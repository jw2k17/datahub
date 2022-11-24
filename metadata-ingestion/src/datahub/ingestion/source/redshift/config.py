from enum import Enum
from typing import Any, Dict, List, Optional

import pydantic
from pydantic import root_validator
from pydantic.fields import Field

from datahub.configuration import ConfigModel
from datahub.configuration.source_common import DatasetLineageProviderConfigBase
from datahub.ingestion.source.aws.path_spec import PathSpec
from datahub.ingestion.source.sql.postgres import PostgresConfig
from datahub.ingestion.source.usage.usage_common import BaseUsageConfig


class LineageMode(Enum):
    SQL_BASED = "sql_based"
    STL_SCAN_BASED = "stl_scan_based"
    MIXED = "mixed"


class LineageCollectorType(Enum):
    QUERY_SCAN = "query_scan"
    QUERY_SQL_PARSER = "query_sql_parser"
    VIEW = "view"
    NON_BINDING_VIEW = "non-binding-view"
    COPY = "copy"
    UNLOAD = "unload"


class S3LineageProviderConfig(ConfigModel):
    """
    Any source that produces s3 lineage from/to Datasets should inherit this class.
    """

    path_specs: List[PathSpec] = Field(
        description="List of PathSpec. See below the details about PathSpec"
    )

    strip_urls: bool = Field(
        default=True,
        description="Strip filename from s3 url. It only applies if path_specs are not specified.",
    )


class DatasetS3LineageProviderConfigBase(ConfigModel):
    """
    Any source that produces s3 lineage from/to Datasets should inherit this class.
    """

    s3_lineage_config: Optional[S3LineageProviderConfig] = Field(
        default=None, description="Common config for S3 lineage generation"
    )


class RedshiftUsageConfig(BaseUsageConfig):
    email_domain: Optional[str] = Field(
        default=None,
        description="Email domain of your organisation so users can be displayed on UI appropriately.",
    )


class RedshiftConfig(
    PostgresConfig,
    DatasetLineageProviderConfigBase,
    DatasetS3LineageProviderConfigBase,
    RedshiftUsageConfig,
):
    # Although Amazon Redshift is compatible with Postgres's wire format,
    # we actually want to use the sqlalchemy-redshift package and dialect
    # because it has better caching behavior. In particular, it queries
    # the full table, column, and constraint information in a single larger
    # query, and then simply pulls out the relevant information as needed.
    # Because of this behavior, it uses dramatically fewer round trips for
    # large Redshift warehouses. As an example, see this query for the columns:
    # https://github.com/sqlalchemy-redshift/sqlalchemy-redshift/blob/60b4db04c1d26071c291aeea52f1dcb5dd8b0eb0/sqlalchemy_redshift/dialect.py#L745.
    scheme = Field(
        default="redshift+psycopg2",
        description="",
        hidden_from_schema=True,
    )

    default_schema: str = Field(
        default="public",
        description="The default schema to use if the sql parser fails to parse the schema with `sql_based` lineage collector",
    )

    include_table_lineage: Optional[bool] = Field(
        default=True, description="Whether table lineage should be ingested."
    )
    include_copy_lineage: Optional[bool] = Field(
        default=True,
        description="Whether lineage should be collected from copy commands",
    )

    include_usage_statistics: bool = Field(
        default=False,
        description="Generate usage statistic. email_domain config parameter needs to be set if enabled",
    )

    capture_lineage_query_parser_failures: Optional[bool] = Field(
        default=False,
        description="Whether to capture lineage query parser errors with dataset properties for debuggings",
    )

    table_lineage_mode: Optional[LineageMode] = Field(
        default=LineageMode.STL_SCAN_BASED,
        description="Which table lineage collector mode to use. Available modes are: [stl_scan_based, sql_based, mixed]",
    )
    extra_client_options: Dict[str, Any] = {}

    @pydantic.validator("platform")
    def platform_is_always_redshift(cls, v):
        return "redshift"

    @root_validator(pre=True)
    def check_email_is_set_on_usage(cls, values):
        if values["include_usage_statistics"]:
            assert (
                "email_domain" in values
            ), "email_domain needs to be set if usage is enabled"
        return values
