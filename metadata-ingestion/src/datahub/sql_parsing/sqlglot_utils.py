import hashlib
from typing import Dict, Iterable, Optional, Union

import sqlglot

from datahub.sql_parsing.dialects.patched.tsql import TSQLv2

DialectOrStr = Union[sqlglot.Dialect, str]


def _get_dialect_str(platform: str) -> str:
    # TODO: convert datahub platform names to sqlglot dialect
    if platform == "presto-on-hive":
        return "hive"
    elif platform == "mssql":
        return "tsql"
    elif platform == "athena":
        return "trino"
    # TODO: define SalesForce SOQL dialect
    # Temporary workaround is to treat SOQL as databricks dialect
    # At least it allows to parse simple SQL queries and built linage for them
    elif platform == "salesforce":
        return "databricks"
    elif platform == "mysql":
        # In sqlglot v20+, MySQL is now case-sensitive by default, which is the
        # default behavior on Linux. However, MySQL's default case sensitivity
        # actually depends on the underlying OS.
        # For us, it's simpler to just assume that it's case-insensitive, and
        # let the fuzzy resolution logic handle it.
        return "mysql, normalization_strategy = lowercase"
    else:
        return platform


def get_dialect(platform: DialectOrStr) -> sqlglot.Dialect:
    if isinstance(platform, sqlglot.Dialect):
        return platform

    dialect_str = _get_dialect_str(platform)

    # Temporary workaround for TSQL until it's fixed atsqlglot library level
    # See definition of TSQLv2 for more comments and details
    if dialect_str == "tsql":
        return TSQLv2()
    else:
        return sqlglot.Dialect.get_or_raise(dialect_str)


def is_dialect_instance(
    dialect: sqlglot.Dialect, platforms: Union[str, Iterable[str]]
) -> bool:
    if isinstance(platforms, str):
        platforms = [platforms]
    else:
        platforms = list(platforms)

    dialects = [sqlglot.Dialect.get_or_raise(platform) for platform in platforms]

    if any(isinstance(dialect, dialect_class.__class__) for dialect_class in dialects):
        return True
    return False


def parse_statement(
    sql: sqlglot.exp.ExpOrStr, dialect: sqlglot.Dialect
) -> sqlglot.Expression:
    statement: sqlglot.Expression = sqlglot.maybe_parse(
        sql, dialect=dialect, error_level=sqlglot.ErrorLevel.RAISE
    )
    return statement


def generalize_query(expression: sqlglot.exp.ExpOrStr, dialect: DialectOrStr) -> str:
    """
    Generalize/normalize a SQL query.

    The generalized query will strip comments and normalize things like
    whitespace and keyword casing. It will also replace things like date
    literals with placeholders so that the generalized query can be used
    for query fingerprinting.

    Args:
        expression: The SQL query to generalize.
        dialect: The SQL dialect to use.

    Returns:
        The generalized SQL query.
    """

    # Similar to sql-metadata's query normalization.
    #   Implementation: https://github.com/macbre/sql-metadata/blob/master/sql_metadata/generalizator.py
    #   Tests: https://github.com/macbre/sql-metadata/blob/master/test/test_normalization.py
    #
    # Note that this is somewhat different from sqlglot's normalization
    # https://tobikodata.com/are_these_sql_queries_the_same.html
    # which is used to determine if queries are functionally equivalent.

    dialect = get_dialect(dialect)
    expression = sqlglot.maybe_parse(expression, dialect=dialect)

    def _simplify_node_expressions(node: sqlglot.exp.Expression) -> None:
        # Replace all literals in the expressions with a single placeholder.
        is_last_literal = True
        for i, expression in reversed(list(enumerate(node.expressions))):
            #
            # sqlglot has a bug related to T-SQL dialect
            # for example, this statement using double quotes
            #
            # INSERT INTO TBL
            # VALUES("str1", 'str2', 1)
            #
            # will be parsed like this:
            #
            # INSERT INTO TBL
            # VALUES(COLUMN, LITERAL, LITERAL)
            #
            # as result it will not be generalized as
            #
            # INSERT INTO TBL
            # VALUES(COLUMN, ?, ?)
            #
            # instead of
            #
            # INSERT INTO TBL
            # VALUES(?, ?, ?)
            #
            # adding sqlglot.exp.Column to the condition fixes it
            #
            if isinstance(expression, (sqlglot.exp.Literal, sqlglot.exp.Column)):
                if is_last_literal:
                    node.expressions[i] = sqlglot.exp.Placeholder()
                    is_last_literal = False
                else:
                    node.expressions.pop(i)

            elif isinstance(expression, sqlglot.exp.Tuple):
                _simplify_node_expressions(expression)

    def _strip_expression(
        node: sqlglot.exp.Expression,
    ) -> Optional[sqlglot.exp.Expression]:
        node.comments = None

        if isinstance(node, (sqlglot.exp.In, sqlglot.exp.Values)):
            _simplify_node_expressions(node)
        elif isinstance(node, sqlglot.exp.Literal):
            return sqlglot.exp.Placeholder()

        return node

    return expression.transform(_strip_expression, copy=True).sql(dialect=dialect)


def generate_hash(text: str) -> str:
    # Once we move to Python 3.9+, we can set `usedforsecurity=False`.
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_query_fingerprint(
    expression: sqlglot.exp.ExpOrStr, dialect: DialectOrStr
) -> str:
    """Get a fingerprint for a SQL query.

    The fingerprint is a SHA-256 hash of the generalized query.

    If two queries have the same fingerprint, they should have the same table
    and column lineage. The only exception is if the query uses an indirection
    function like Snowflake's `IDENTIFIER`.

    Queries that are functionally equivalent equivalent may not have the same
    same fingerprint. For example, `SELECT 1+1` and `SELECT 2` have different
    fingerprints.

    Args:
        expression: The SQL query to fingerprint.
        dialect: The SQL dialect to use.

    Returns:
        The fingerprint for the SQL query.
    """

    dialect = get_dialect(dialect)
    expression_sql = generalize_query(expression, dialect=dialect)
    fingerprint = generate_hash(expression_sql)

    return fingerprint


def detach_ctes(
    sql: sqlglot.exp.ExpOrStr, platform: str, cte_mapping: Dict[str, str]
) -> sqlglot.exp.Expression:
    """Replace CTE references with table references.

    For example, with cte_mapping = {"__cte_0": "_my_cte_table"}, the following SQL

    WITH __cte_0 AS (SELECT * FROM table1) SELECT * FROM table2 JOIN __cte_0 ON table2.id = __cte_0.id

    is transformed into

    WITH __cte_0 AS (SELECT * FROM table1) SELECT * FROM table2 JOIN _my_cte_table ON table2.id = _my_cte_table.id

    Note that the original __cte_0 definition remains in the query, but is simply not referenced.
    The query optimizer should be able to remove it.

    This method makes a major assumption: that no other table/column has the same name as a
    key in the cte_mapping.
    """

    dialect = get_dialect(platform)
    statement = parse_statement(sql, dialect=dialect)

    def replace_cte_refs(node: sqlglot.exp.Expression) -> sqlglot.exp.Expression:
        if (
            isinstance(node, sqlglot.exp.Identifier)
            and node.parent
            and not isinstance(node.parent.parent, sqlglot.exp.CTE)
            and node.name in cte_mapping
        ):
            full_new_name = cte_mapping[node.name]
            table_expr = sqlglot.maybe_parse(
                full_new_name, dialect=dialect, into=sqlglot.exp.Table
            )

            parent = node.parent

            # We expect node.parent to be a Table or Column, both of which support catalog/db/name.
            # However, we check the parent's arg_types to be safe.
            if "catalog" in parent.arg_types and table_expr.catalog:
                parent.set("catalog", table_expr.catalog)
            if "db" in parent.arg_types and table_expr.db:
                parent.set("db", table_expr.db)

            new_node = sqlglot.exp.Identifier(this=table_expr.name)

            return new_node
        else:
            return node

    return statement.transform(replace_cte_refs, copy=False)
