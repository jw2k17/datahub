import textwrap

import sqlglot

from datahub.sql_parsing.sqlglot_lineage import (
    _UPDATE_ARGS_NOT_SUPPORTED_BY_SELECT,
    QueryType,
    _get_dialect,
    _is_dialect_instance,
    generalize_query,
    get_query_type_of_sql,
)


def test_update_from_select():
    assert _UPDATE_ARGS_NOT_SUPPORTED_BY_SELECT == {"returning", "this"}


def test_is_dialect_instance():
    snowflake = _get_dialect("snowflake")

    assert _is_dialect_instance(snowflake, "snowflake")
    assert not _is_dialect_instance(snowflake, "bigquery")

    redshift = _get_dialect("redshift")
    assert _is_dialect_instance(redshift, ["redshift", "snowflake"])
    assert _is_dialect_instance(redshift, ["postgres", "snowflake"])


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


def test_query_generalization():
    # Basic keyword normalization.
    assert (
        generalize_query("select * from foo", dialect="redshift") == "SELECT * FROM foo"
    )

    # Comment removal and whitespace normalization.
    assert (
        generalize_query(
            "/* query system = foo, id = asdf */\nselect /* inline comment */ *\nfrom foo",
            dialect="redshift",
        )
        == "SELECT * FROM foo"
    )

    # Parameter normalization.
    assert (
        generalize_query(
            "UPDATE  \"books\" SET page_count = page_count + 1, author_count = author_count + 1 WHERE book_title = 'My New Book'",
            dialect="redshift",
        )
        == 'UPDATE "books" SET page_count = page_count + ?, author_count = author_count + ? WHERE book_title = ?'
    )
    assert (
        generalize_query(
            "select * from foo where date = '2021-01-01'", dialect="redshift"
        )
        == "SELECT * FROM foo WHERE date = ?"
    )
    assert (
        generalize_query(
            "select * from books where category in ('fiction', 'biography', 'fantasy')",
            dialect="redshift",
        )
        == "SELECT * FROM books WHERE category IN (?)"
    )
    assert (
        generalize_query(
            textwrap.dedent(
                """\
                /* Copied from https://stackoverflow.com/a/452934/5004662 */
                INSERT INTO MyTable
                ( Column1, Column2, Column3 )
                VALUES
                /* multiple value rows */
                ('John', 123, 'Lloyds Office'),
                ('Jane', 124, 'Lloyds Office'),
                ('Billy', 125, 'London Office'),
                ('Miranda', 126, 'Bristol Office');
                """
            ),
            dialect="mssql",
        )
        == "INSERT INTO MyTable (Column1, Column2, Column3) VALUES (?), (?), (?), (?)"
    )
