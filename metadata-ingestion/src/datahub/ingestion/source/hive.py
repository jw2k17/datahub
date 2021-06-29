# This import verifies that the dependencies are available.
from pyhive import hive  # noqa: F401
from pyhive.sqlalchemy_hive import HiveDate, HiveDecimal, HiveTimestamp

from datahub.ingestion.source.sql_common import (
    BasicSQLAlchemyConfig,
    SQLAlchemySource,
    register_custom_type,
)
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    DateTypeClass,
    NumberTypeClass,
    TimeTypeClass,
)

register_custom_type(HiveDate, DateTypeClass)
register_custom_type(HiveTimestamp, TimeTypeClass)
register_custom_type(HiveDecimal, NumberTypeClass)


class HiveConfig(BasicSQLAlchemyConfig):
    # defaults
    scheme = "hive"

    def get_identifier(self, schema: str, table: str) -> str:
        regular = f"{schema}.{table}"
        if self.database:
            return f"{self.database}.{regular}"
        return regular


class HiveSource(SQLAlchemySource):
    def __init__(self, config, ctx):
        super().__init__(config, ctx, "hive")

    @classmethod
    def create(cls, config_dict, ctx):
        config = HiveConfig.parse_obj(config_dict)
        return cls(config, ctx)
