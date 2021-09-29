import sys

from datahub.ingestion.source.sql.sql_common import (
    BasicSQLAlchemyConfig,
    SQLAlchemySource,
)

if sys.version_info >= (3, 7):
    # This import verifies that the dependencies are available.
    import sqlalchemy_trino  # noqa: F401
else:
    raise ModuleNotFoundError("The trino plugin requires Python 3.7 or newer.")


class TrinoConfig(BasicSQLAlchemyConfig):
    # defaults
    scheme = "trino"

    def get_identifier(self: BasicSQLAlchemyConfig, schema: str, table: str) -> str:
        regular = f"{schema}.{table}"
        if self.database_alias:
            return f"{self.database_alias}.{regular}"
        if self.database:
            return f"{self.database}.{regular}"
        return regular


class TrinoSource(SQLAlchemySource):
    def __init__(self, config, ctx):
        super().__init__(config, ctx, "trino")

    @classmethod
    def create(cls, config_dict, ctx):
        config = TrinoConfig.parse_obj(config_dict)
        return cls(config, ctx)
