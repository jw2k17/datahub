from datetime import datetime
from typing import List

redshift_datetime_format = "%Y-%m-%d %H:%M:%S"


class RedshiftQuery:
    CREATE_TEMP_TABLE_CLAUSE = "create temp table"
    CREATE_TEMPORARY_TABLE_CLAUSE = "create temporary table"
    CREATE_TABLE_CLAUSE = "create table"

    list_databases: str = """SELECT datname FROM pg_database
        WHERE (datname <> ('padb_harvest')::name)
        AND (datname <> ('template0')::name)
        AND (datname <> ('template1')::name)
        """

    list_schemas: str = """SELECT distinct n.nspname AS "schema_name",
        'local' as schema_type,
        null as schema_owner_name,
        '' as schema_option,
        null as external_database
        FROM pg_catalog.pg_class c
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        JOIN pg_catalog.pg_user u ON u.usesysid = c.relowner
        WHERE c.relkind IN ('r','v','m','S','f')
        AND   n.nspname !~ '^pg_'
        AND   n.nspname != 'information_schema'
UNION ALL
SELECT  schemaname as schema_name,
        CASE s.eskind
            WHEN '1' THEN 'GLUE'
            WHEN '2' THEN 'HIVE'
            WHEN '3' THEN 'POSTGRES'
            WHEN '4' THEN 'REDSHIFT'
            ELSE 'OTHER'
        END as schema_type,
        -- setting user_name to null as we don't use it now now and it breaks backward compatibility due to additional permission need
        -- usename as schema_owner_name,
        null as schema_owner_name,
        esoptions as schema_option,
        databasename as external_database
        FROM SVV_EXTERNAL_SCHEMAS as s
        -- inner join pg_catalog.pg_user_info as i on i.usesysid = s.esowner
        ORDER BY SCHEMA_NAME;
        """

    list_tables: str = """
 SELECT  CASE c.relkind
                WHEN 'r' THEN 'TABLE'
                WHEN 'v' THEN 'VIEW'
                WHEN 'm' THEN 'MATERIALIZED VIEW'
                WHEN 'f' THEN 'FOREIGN TABLE'
            END AS tabletype,
            n.oid AS "schema_oid",
            n.nspname AS "schema",
            c.oid AS "rel_oid",
            c.relname,
            ci.relcreationtime as creation_time,
            CASE c.reldiststyle
                WHEN 0 THEN 'EVEN'
                WHEN 1 THEN 'KEY'
                WHEN 8 THEN 'ALL'
            END AS "diststyle",
            c.relowner AS "owner_id",
            -- setting user_name to null as we don't use it now now and it breaks backward compatibility due to additional permission need
            -- u.usename AS "owner_name",
            null as "owner_name",
            TRIM(TRAILING ';' FROM pg_catalog.pg_get_viewdef (c.oid,TRUE)) AS "view_definition",
            pg_catalog.array_to_string(c.relacl,'\n') AS "privileges",
            NULL as "location",
            NULL as parameters,
            NULL as input_format,
            NULL As output_format,
            NULL as serde_parameters,
            pgd.description as table_description
        FROM pg_catalog.pg_class c
        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_class_info as ci on c.oid = ci.reloid
        LEFT JOIN pg_catalog.pg_description pgd ON pgd.objsubid = 0 AND pgd.objoid = c.oid
        -- JOIN pg_catalog.pg_user u ON u.usesysid = c.relowner
        WHERE c.relkind IN ('r','v','m','S','f')
        AND   n.nspname !~ '^pg_'
        AND   n.nspname != 'information_schema'
        UNION
        SELECT 'EXTERNAL_TABLE' as tabletype,
            NULL AS "schema_oid",
            schemaname AS "schema",
            NULL AS "rel_oid",
            tablename AS "relname",
            NULL as "creation_time",
            NULL AS "diststyle",
            NULL AS "owner_id",
            NULL AS "owner_name",
            NULL AS "view_definition",
            NULL AS "privileges",
            "location",
            parameters,
            input_format,
            output_format,
            serde_parameters,
            NULL as table_description
        FROM pg_catalog.svv_external_tables
        ORDER BY "schema",
                "relname"
"""
    list_columns: str = """
            SELECT
              n.nspname as "schema",
              c.relname as "table_name",
              att.attname as "name",
              format_encoding(att.attencodingtype::integer) as "encode",
              format_type(att.atttypid, att.atttypmod) as "type",
              att.attisdistkey as "distkey",
              att.attsortkeyord as "sortkey",
              att.attnotnull as "notnull",
              pg_catalog.col_description(att.attrelid, att.attnum)
                as "comment",
              adsrc,
              attnum,
              pg_catalog.format_type(att.atttypid, att.atttypmod),
              pg_catalog.pg_get_expr(ad.adbin, ad.adrelid) as default,
              n.oid as "schema_oid",
              c.oid as "table_oid"
            FROM pg_catalog.pg_class c
            LEFT JOIN pg_catalog.pg_namespace n
              ON n.oid = c.relnamespace
            JOIN pg_catalog.pg_attribute att
              ON att.attrelid = c.oid
            LEFT JOIN pg_catalog.pg_attrdef ad
              ON (att.attrelid, att.attnum) = (ad.adrelid, ad.adnum)
            WHERE n.nspname !~ '^pg_'
              AND   n.nspname != 'information_schema'
              AND att.attnum > 0
              AND NOT att.attisdropped
              and schema = '{schema_name}'
            UNION
            SELECT
              view_schema as "schema",
              view_name as "table_name",
              col_name as "name",
              null as "encode",
              col_type as "type",
              null as "distkey",
              0 as "sortkey",
              null as "notnull",
              null as "comment",
              null as "adsrc",
              null as "attnum",
              col_type as "format_type",
              null as "default",
              null as "schema_oid",
              null as "table_oid"
            FROM pg_get_late_binding_view_cols() cols(
              view_schema name,
              view_name name,
              col_name name,
              col_type varchar,
              col_num int)
            WHERE 1 and schema = '{schema_name}'
            UNION
            SELECT
              schemaname as "schema",
              tablename as "table_name",
              columnname as "name",
              null as "encode",
              -- Spectrum represents data types differently.
              -- Standardize, so we can infer types.
              external_type AS "type",
              null as "distkey",
              0 as "sortkey",
              null as "notnull",
              null as "comment",
              null as "adsrc",
              null as "attnum",
              external_type AS "format_type",
              null as "default",
              null as "schema_oid",
              null as "table_oid"
            FROM SVV_EXTERNAL_COLUMNS
            WHERE 1 and schema = '{schema_name}'
            ORDER BY "schema", "table_name", "attnum"
"""

    # stl_insert -> SYS_QUERY_DETAIL - showing less accesses
    # stv_mv_info -> SVV_MV_INFO - not tested, seems to be fine
    additional_table_metadata: str = """
        select
            ti.database,
            ti.schema,
            "table",
            size,
            tbl_rows,
            estimated_visible_rows,
            skew_rows,
            last_accessed,
            case
                when smi.name is not null then 1
                else 0
            end as is_materialized
        from
            pg_catalog.svv_table_info as ti
        left join (
            SELECT
                table_id as tbl,
                max(end_time) as last_accessed
            FROM
                SYS_QUERY_DETAIL
            GROUP BY
                table_id) as la on
            (la.tbl = ti.table_id)
        left join SVV_MV_INFO smi on
            smi.database_name = ti.database
            and smi.schema_name = ti.schema
            and smi.name = ti.table
            ;
"""

    @staticmethod
    def stl_scan_based_lineage_query(
        db_name: str, start_time: datetime, end_time: datetime
    ) -> str:
        return """
            SELECT
                distinct cluster,
                target_schema,
                target_table,
                username,
                source_schema,
                source_table,
                query_text AS ddl, -- TODO: this querytxt is truncated to 4000 characters
                start_time AS timestamp
            FROM
            (
                SELECT
                    sti.schema AS target_schema,
                    sti.table AS target_table,
                    sti.database AS cluster,
                    qi.table_id AS target_table_id,
                    qi.query_id AS query_id,
                    qi.start_time AS start_time
                FROM
                    SYS_QUERY_DETAIL qi
                    JOIN
                    SVV_TABLE_INFO sti on sti.table_id = qi.table_id
                WHERE
                    start_time >= '{start_time}' and
                    start_time < '{end_time}' and
                    cluster = '{db_name}' and
                    step_name = 'insert'
            ) AS target_tables
            JOIN
            (
                SELECT
                    sti.schema AS source_schema,
                    sti.table AS source_table,
                    qs.table_id AS source_table_id,
                    qs.query_id AS query_id,
                    sui.user_name AS username,
                    qt."text" AS query_text
                FROM
                    SYS_QUERY_DETAIL qs
                    JOIN
                    SVV_TABLE_INFO sti ON sti.table_id = qs.table_id
                    LEFT JOIN
                    SYS_QUERY_TEXT qt ON qt.query_id = qs.query_id
                    LEFT JOIN
                    SVV_USER_INFO sui ON qs.user_id = sui.user_id
                WHERE
                    qs.step_name = 'scan' AND
                    qs.source = 'Redshift(local)' AND
                    sti.database = '{db_name}' AND -- this was required to not retrieve some internal redshift tables, try removing to see what happens
                    sui.user_name <> 'rdsdb' -- not entirely sure about this filter
            ) AS source_tables ON target_tables.query_id = source_tables.query_id
            WHERE source_tables.source_table_id <> target_tables.target_table_id
            ORDER BY cluster, target_schema, target_table, start_time ASC
                    """.format(
            # We need the original database name for filtering
            db_name=db_name,
            start_time=start_time.strftime(redshift_datetime_format),
            end_time=end_time.strftime(redshift_datetime_format),
        )

    @staticmethod
    def view_lineage_query() -> str:
        return """
                        select
                            distinct
                            srcnsp.nspname as source_schema
                            ,
                            srcobj.relname as source_table
                            ,
                            tgtnsp.nspname as target_schema
                            ,
                            tgtobj.relname as target_table
                        from
                            pg_catalog.pg_class as srcobj
                        inner join
                            pg_catalog.pg_depend as srcdep
                                on
                            srcobj.oid = srcdep.refobjid
                        inner join
                            pg_catalog.pg_depend as tgtdep
                                on
                            srcdep.objid = tgtdep.objid
                        join
                            pg_catalog.pg_class as tgtobj
                                on
                            tgtdep.refobjid = tgtobj.oid
                            and srcobj.oid <> tgtobj.oid
                        left outer join
                            pg_catalog.pg_namespace as srcnsp
                                on
                            srcobj.relnamespace = srcnsp.oid
                        left outer join
                            pg_catalog.pg_namespace tgtnsp
                                on
                            tgtobj.relnamespace = tgtnsp.oid
                        where
                            tgtdep.deptype = 'i'
                            --dependency_internal
                            and tgtobj.relkind = 'v'
                            --i=index, v=view, s=sequence
                            and tgtnsp.nspname not in ('pg_catalog', 'information_schema')
                            order by target_schema, target_table asc
                    """

    @staticmethod
    def list_late_view_ddls_query() -> str:
        return """
                SELECT
                    n.nspname AS target_schema
                    ,c.relname AS target_table
                    , COALESCE(pg_get_viewdef(c.oid, TRUE), '') AS ddl
                FROM
                    pg_catalog.pg_class AS c
                INNER JOIN
                    pg_catalog.pg_namespace AS n
                    ON c.relnamespace = n.oid
                WHERE relkind = 'v'
                and
                n.nspname not in ('pg_catalog', 'information_schema')
                """

    @staticmethod
    def list_unload_commands_sql(
        db_name: str, start_time: datetime, end_time: datetime
    ) -> str:
        return """
            SELECT
                DISTINCT
                sti.database as cluster,
                sti.schema as source_schema,
                sti."table" as source_table,
                unl.file_name as filename
            FROM SYS_UNLOAD_DETAIL unl
            JOIN SYS_QUERY_DETAIL qd ON
                unl.query_id = qd.query_id
            JOIN SVV_TABLE_INFO sti ON
                sti.table_id = qd.table_id
            WHERE
                qd.step_name = 'scan' AND
                unl.start_time >= '{start_time}' AND
                unl.start_time < '{end_time}' AND
                sti.database = '{db_name}'
            ORDER BY cluster, source_schema, source_table, filename, unl.start_time ASC
            """.format(
            # We need the original database name for filtering
            db_name=db_name,
            start_time=start_time.strftime(redshift_datetime_format),
            end_time=end_time.strftime(redshift_datetime_format),
        )

    # the differences vs old query are:
    # * we additionally get queries like "insert into <table> values (...)" (to be confirmed it is not a problem)
    # * querytxt do not contain newlines (to be confirmed it is not a problem)
    @staticmethod
    def list_insert_create_queries_sql(
        db_name: str, start_time: datetime, end_time: datetime
    ) -> str:
        return """
            SELECT
                DISTINCT
                cluster,
                target_schema,
                target_table,
                username,
                query_id,
                LISTAGG(CASE WHEN LEN(RTRIM(querytxt)) = 0 THEN querytxt ELSE RTRIM(querytxt) END) WITHIN GROUP (ORDER BY sequence) AS ddl,
                ANY_VALUE(session_id) AS session_id,
                starttime AS timestamp
            FROM
            (
                SELECT
                    DISTINCT
                    qd.table_id AS target_table_id,
                    sti.schema AS target_schema,
                    sti.table AS target_table,
                    sti.database AS cluster,
                    sui.user_name AS username,
                    qt."text" AS querytxt,
                    qd.query_id AS query_id,
                    qd.start_time AS starttime,
                    qt.sequence AS sequence,
                    qt.session_id AS session_id
                FROM
                    SYS_QUERY_DETAIL qd
                    JOIN SVV_TABLE_INFO sti ON sti.table_id = qd.table_id
                    LEFT JOIN SVV_USER_INFO sui ON sui.user_id = qd.user_id
                    LEFT JOIN SYS_QUERY_TEXT qt ON qt.query_id = qd.query_id
                    LEFT JOIN SYS_LOAD_DETAIL ld ON ld.query_id = qd.query_id
                WHERE
                    qd.step_name = 'insert' AND
                    sui.user_name <> 'rdsdb' AND
                    cluster = '{db_name}' AND
                    qd.start_time >= '{start_time}' AND
                    qd.start_time < '{end_time}' AND
                    qt.sequence < 320 AND -- See https://stackoverflow.com/questions/72770890/redshift-result-size-exceeds-listagg-limit-on-svl-statementtext
                    ld.query_id IS NULL -- filter out queries which are also stored in SYS_LOAD_DETAIL
                ORDER BY target_table ASC
            )
            GROUP BY cluster, query_id, target_schema, target_table, username, starttime
            ORDER BY cluster, query_id, target_schema, target_table, starttime ASC
            ;
                """.format(
            # We need the original database name for filtering
            db_name=db_name,
            start_time=start_time.strftime(redshift_datetime_format),
            end_time=end_time.strftime(redshift_datetime_format),
        )

    # when loading from s3 using prefix with a single file it produces 2 lines (for file and just directory) - also
    # behaves like this when run in the old way
    @staticmethod
    def list_copy_commands_sql(
        db_name: str, start_time: datetime, end_time: datetime
    ) -> str:
        return """
                select
                    distinct
                        "schema" as target_schema,
                        "table" as target_table,
                        c.file_name
                from
                    SYS_QUERY_DETAIL as si
                join SYS_LOAD_DETAIL as c on
                    si.query_id = c.query_id
                join SVV_TABLE_INFO sti on
                    sti.table_id = si.table_id
                where
                    database = '{db_name}'
                    and si.start_time >= '{start_time}'
                    and si.start_time < '{end_time}'
                order by target_schema, target_table, si.start_time asc
                """.format(
            # We need the original database name for filtering
            db_name=db_name,
            start_time=start_time.strftime(redshift_datetime_format),
            end_time=end_time.strftime(redshift_datetime_format),
        )

    @staticmethod
    def get_temp_table_clause(table_name: str) -> List[str]:
        return [
            f"{RedshiftQuery.CREATE_TABLE_CLAUSE} {table_name}",
            f"{RedshiftQuery.CREATE_TEMP_TABLE_CLAUSE} {table_name}",
            f"{RedshiftQuery.CREATE_TEMPORARY_TABLE_CLAUSE} {table_name}",
        ]

    # handles "create table IF ..." statements wrong probably - "create command" field contains only "create table if" in such cases
    # also similar happens if for example table name contains special characters quoted with " i.e. "test-table1"
    # it is also worth noting that "query_type" field from SYS_QUERY_HISTORY could be probably used to improve many
    # of complicated queries in this file
    @staticmethod
    def temp_table_ddl_query(start_time: datetime, end_time: datetime) -> str:
        start_time_str: str = start_time.strftime(redshift_datetime_format)

        end_time_str: str = end_time.strftime(redshift_datetime_format)

        return rf"""-- DataHub Redshift Source temp table DDL query
                    SELECT
                        *
                    FROM
                    (
                        SELECT
                            session_id,
                            transaction_id,
                            start_time,
                            query_type AS "type",
                            user_id AS userid,
                            query_text, -- truncated to 4k characters, join with SYS_QUERY_TEXT to build full query using "sequence" number field, probably no reason to do so, since we are interested in the begining of the statement anyway
                            REGEXP_REPLACE(REGEXP_SUBSTR(REGEXP_REPLACE(query_text,'\\\\n','\\n'), '(CREATE(?:[\\n\\s\\t]+(?:temp|temporary))?(?:[\\n\\s\\t]+)table(?:[\\n\\s\\t]+)[^\\n\\s\\t()-]+)', 0, 1, 'ipe'),'[\\n\\s\\t]+',' ',1,'p') as create_command,
                            ROW_NUMBER() OVER (
                                PARTITION BY TRIM(query_text)
                                ORDER BY start_time DESC
                            ) rn
                        FROM
                            SYS_QUERY_HISTORY
                        WHERE
                            query_type IN ('DDL', 'CTAS', 'OTHER', 'COMMAND')
                            AND start_time >= '{start_time_str}'
                            AND start_time < '{end_time_str}'
                        GROUP BY start_time, session_id, transaction_id, type, userid, query_text
                        ORDER BY start_time, session_id, transaction_id, type, userid ASC
                    )
                    WHERE
                        (
                            create_command ILIKE '%create temp table %'
                            OR create_command ILIKE '%create temporary table %'
                            -- we want to get all the create table statements and not just temp tables if non temp table is created and dropped in the same transaction
                            OR create_command ILIKE '%create table %'
                        )
                        -- Redshift creates temp tables with the following names: volt_tt_%. We need to filter them out.
                        AND query_text NOT ILIKE '%CREATE TEMP TABLE volt_tt_%'
                        AND create_command NOT ILIKE '%CREATE TEMP TABLE volt_tt_%'
                        AND rn = 1
                    ;
            """

    @staticmethod
    def alter_table_rename_query(
        db_name: str, start_time: datetime, end_time: datetime
    ) -> str:
        start_time_str: str = start_time.strftime(redshift_datetime_format)
        end_time_str: str = end_time.strftime(redshift_datetime_format)

        return f"""
            SELECT  transaction_id,
                    session_id,
                    start_time,
                    query_text
            FROM       sys_query_history SYS
            WHERE      SYS.status = 'success'
            AND        SYS.query_type = 'DDL'
            AND        SYS.database_name = '{db_name}'
            AND        SYS.start_time >= '{start_time_str}'
            AND        SYS.end_time < '{end_time_str}'
            AND        SYS.query_text ILIKE '%alter table % rename to %'
        """
