# This import verifies that the dependencies are available.
import psycopg2  # noqa: F401
import sqlalchemy.dialects.postgresql as custom_types

# GeoAlchemy adds support for PostGIS extensions in SQLAlchemy. In order to
# activate it, we must import it so that it can hook into SQLAlchemy. While
# we don't use the Geometry type that we import, we do care about the side
# effects of the import. For more details, see here:
# https://geoalchemy-2.readthedocs.io/en/latest/core_tutorial.html#reflecting-tables.
from geoalchemy2 import Geometry  # noqa: F401

from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    ArrayTypeClass,
    BytesTypeClass,
    MapTypeClass,
)

from .sql_common import BasicSQLAlchemyConfig, SQLAlchemySource, register_custom_type

register_custom_type(custom_types.ARRAY, ArrayTypeClass)
register_custom_type(custom_types.JSON, BytesTypeClass)
register_custom_type(custom_types.JSONB, BytesTypeClass)
register_custom_type(custom_types.HSTORE, MapTypeClass)


class PostgresConfig(BasicSQLAlchemyConfig):
    # defaults
    scheme = "postgresql+psycopg2"

    def get_identifier(self, schema: str, table: str) -> str:
        regular = f"{schema}.{table}"
        if self.database_alias:
            return f"{self.database_alias}.{regular}"
        if self.database:
            return f"{self.database}.{regular}"
        return regular


class PostgresSource(SQLAlchemySource):
    def __init__(self, config, ctx):
        super().__init__(config, ctx, "postgres")

    @classmethod
    def create(cls, config_dict, ctx):
        config = PostgresConfig.parse_obj(config_dict)
        return cls(config, ctx)
