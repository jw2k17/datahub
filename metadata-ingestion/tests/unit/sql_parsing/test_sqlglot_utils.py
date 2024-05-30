import textwrap
from enum import Enum

import pytest
import sqlglot

from datahub.sql_parsing.sql_parsing_common import QueryType
from datahub.sql_parsing.sqlglot_lineage import (
    _UPDATE_ARGS_NOT_SUPPORTED_BY_SELECT,
    get_query_type_of_sql,
)
from datahub.sql_parsing.sqlglot_utils import (
    generalize_query,
    generalize_query_fast,
    get_dialect,
    get_query_fingerprint,
    is_dialect_instance,
)


def test_update_from_select():
    assert _UPDATE_ARGS_NOT_SUPPORTED_BY_SELECT == {"returning", "this"}


def test_is_dialect_instance():
    snowflake = get_dialect("snowflake")

    assert is_dialect_instance(snowflake, "snowflake")
    assert not is_dialect_instance(snowflake, "bigquery")

    redshift = get_dialect("redshift")
    assert is_dialect_instance(redshift, ["redshift", "snowflake"])
    assert is_dialect_instance(redshift, ["postgres", "snowflake"])


def test_query_types():
    assert get_query_type_of_sql(
        sqlglot.parse_one(
            "create temp table foo as select * from bar", dialect="redshift"
        ),
        dialect="redshift",
    ) == (QueryType.CREATE_TABLE_AS_SELECT, {"kind": "TABLE", "temporary": True})

    assert get_query_type_of_sql(
        sqlglot.parse_one("create table #foo as select * from bar", dialect="redshift"),
        dialect="redshift",
    ) == (QueryType.CREATE_TABLE_AS_SELECT, {"kind": "TABLE", "temporary": True})

    assert get_query_type_of_sql(
        sqlglot.parse_one("create view foo as select * from bar", dialect="redshift"),
        dialect="redshift",
    ) == (QueryType.CREATE_VIEW, {"kind": "VIEW"})


class QueryNormalizationMode(Enum):
    FULL = "full"
    FAST = "fast"
    BOTH = "both"


@pytest.mark.parametrize(
    "query, dialect, expected, mode",
    [
        # Basic keyword normalization.
        (
            "select * from foo",
            "redshift",
            "SELECT * FROM foo",
            QueryNormalizationMode.FULL,
        ),
        # Comment removal and whitespace normalization.
        (
            "/* query system = foo, id = asdf */\nSELECT /* inline comment */ *\nFROM foo",
            "redshift",
            "SELECT * FROM foo",
            QueryNormalizationMode.BOTH,
        ),
        # Parameter normalization.
        (
            "UPDATE  \"books\" SET page_count = page_count + 1, author_count = author_count + 1 WHERE book_title = 'My New Book'",
            "redshift",
            'UPDATE "books" SET page_count = page_count + ?, author_count = author_count + ? WHERE book_title = ?',
            QueryNormalizationMode.BOTH,
        ),
        (
            "SELECT * FROM foo WHERE date = '2021-01-01'",
            "redshift",
            "SELECT * FROM foo WHERE date = ?",
            QueryNormalizationMode.BOTH,
        ),
        (
            "SELECT * FROM books WHERE category IN ('fiction', 'biography', 'fantasy')",
            "redshift",
            "SELECT * FROM books WHERE category IN (?)",
            QueryNormalizationMode.BOTH,
        ),
        (
            textwrap.dedent(
                """\
                /* Copied from https://stackoverflow.com/a/452934/5004662 */
                INSERT INTO MyTable
                (Column1, Column2, Column3)
                VALUES
                /* multiple value rows */
                ('John', 123, 'Lloyds Office'),
                ('Jane', 124, 'Lloyds Office'),
                ('Billy', 125, 'London Office'),
                ('Miranda', 126, 'Bristol Office');
                """
            ),
            "mssql",
            "INSERT INTO MyTable (Column1, Column2, Column3) VALUES (?), (?), (?), (?)",
            QueryNormalizationMode.BOTH,
        ),
        # Test table name normalization.
        # These are only supported with fast normalization.
        (
            "SELECT * FROM datahub_community.fivetran_interval_unconstitutional_staging.datahub_slack_mess-staging-480fd5a7-58f4-4cc9-b6fb-87358788efe6",
            "bigquery",
            "SELECT * FROM datahub_community.fivetran_interval_unconstitutional_staging.datahub_slack_mess-staging-00000000-0000-0000-0000-000000000000",
            QueryNormalizationMode.FAST,
        ),
        (
            "SELECT * FROM datahub_community.maggie.commonroom_slack_members_20240315",
            "bigquery",
            "SELECT * FROM datahub_community.maggie.commonroom_slack_members_YYYYMMDD",
            QueryNormalizationMode.FAST,
        ),
        (
            "SELECT COUNT(*) FROM ge_temp_aa91f1fd",
            "bigquery",
            "SELECT COUNT(*) FROM ge_temp_abcdefgh",
            QueryNormalizationMode.FAST,
        ),
    ],
)
def test_query_generalization(
    query: str, dialect: str, expected: str, mode: QueryNormalizationMode
) -> None:
    if mode in {QueryNormalizationMode.FULL, QueryNormalizationMode.BOTH}:
        assert generalize_query(query, dialect=dialect) == expected
    if mode in {QueryNormalizationMode.FAST, QueryNormalizationMode.BOTH}:
        assert (
            generalize_query_fast(query, dialect=dialect, change_table_names=True)
            == expected
        )


def test_query_fingerprint():
    assert get_query_fingerprint(
        "select * /* everything */ from foo where ts = 34", platform="redshift"
    ) == get_query_fingerprint("SELECT * FROM foo where ts = 38", platform="redshift")

    assert get_query_fingerprint(
        "select 1 + 1", platform="postgres"
    ) != get_query_fingerprint("select 2", platform="postgres")
