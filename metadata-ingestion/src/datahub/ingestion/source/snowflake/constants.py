from enum import Enum


class SnowflakeCloudProvider(str, Enum):
    AWS = "aws"
    GCP = "gcp"
    AZURE = "azure"


SNOWFLAKE_DEFAULT_CLOUD = SnowflakeCloudProvider.AWS


class SnowflakeEdition(str, Enum):
    STANDARD = "Standard"

    # We use this to represent Enterprise Edition or higher
    ENTERPRISE = "Enterprise or above"


# See https://docs.snowflake.com/en/user-guide/admin-account-identifier.html#region-ids
# Includes only exceptions to format <provider>_<cloud region with hyphen replaced by _>
SNOWFLAKE_REGION_CLOUD_REGION_MAPPING = {
    "aws_us_east_1_gov": (SnowflakeCloudProvider.AWS, "us-east-1"),
    "azure_uksouth": (SnowflakeCloudProvider.AZURE, "uk-south"),
    "azure_centralindia": (SnowflakeCloudProvider.AZURE, "central-india.azure"),
}

# https://docs.snowflake.com/en/sql-reference/snowflake-db.html
SNOWFLAKE_DATABASE = "SNOWFLAKE"


# We will always compare with lowercase
# Complete list for objectDomain - https://docs.snowflake.com/en/sql-reference/account-usage/access_history.html
class SnowflakeObjectDomain(str, Enum):
    TABLE = "table"
    EXTERNAL_TABLE = "external table"
    VIEW = "view"
    MATERIALIZED_VIEW = "materialized view"
    DATABASE = "database"
    SCHEMA = "schema"
    COLUMN = "column"


GENERIC_PERMISSION_ERROR_KEY = "permission-error"
LINEAGE_PERMISSION_ERROR = "lineage-permission-error"


# Snowflake connection arguments
# https://docs.snowflake.com/en/user-guide/python-connector-api.html#connect
CLIENT_PREFETCH_THREADS = "client_prefetch_threads"
CLIENT_SESSION_KEEP_ALIVE = "client_session_keep_alive"
