import logging
import re
import urllib.parse
from typing import TYPE_CHECKING, Any, Dict, Iterable, List, Optional, Tuple, Union

import pydantic
import sqlalchemy.dialects.mssql
# This import verifies that the dependencies are available.
import sqlalchemy_pytds  # noqa: F401
from datahub.configuration.common import AllowDenyPattern
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (
    SourceCapability,
    SupportStatus,
    capability,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.sql.sql_common import (
    BasicSQLAlchemyConfig,
    SQLAlchemySource,
    SqlWorkUnit,
    make_sqlalchemy_uri,
    register_custom_type,
)
from datahub.metadata.schema_classes import (
    BooleanTypeClass,
    ChangeTypeClass,
    UnionTypeClass,
)
from pydantic.fields import Field
from sqlalchemy import create_engine, inspect
from sqlalchemy.engine.base import Connection
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.engine.result import ResultProxy, RowProxy
from sqlalchemy.exc import ProgrammingError, ResourceClosedError

from .domains import (
    JobStep,
    MSSQLDataFlow,
    MSSQLDataJob,
    MSSQLJob,
    MSSQLProceduresContainer,
    ProcedureDependency,
    ProcedureLineageStream,
    ProcedureParameter,
    StoredProcedure,
)

if TYPE_CHECKING:
    from datahub.ingestion.source.ge_data_profiler import GEProfilerRequest

logger: logging.Logger = logging.getLogger(__name__)

register_custom_type(sqlalchemy.dialects.mssql.BIT, BooleanTypeClass)
register_custom_type(sqlalchemy.dialects.mssql.SQL_VARIANT, UnionTypeClass)


class SQLServerConfig(BasicSQLAlchemyConfig):
    # defaults
    host_port: str = Field(default="localhost:1433", description="MSSQL host URL.")
    scheme: str = Field(default="mssql+pytds", description="", hidden_from_schema=True)
    include_code: bool = Field(
        default=False, description="Include information about object code"
    )
    include_stored_procedures: bool = Field(
        default=False, description="Include ingest of stored procedures."
    )
    include_jobs: bool = Field(
        default=False, description="Include ingest of MSSQL Jobs"
    )
    include_descriptions: bool = Field(
        default=False, description="Include table descriptions information."
    )
    use_odbc: bool = Field(
        default=False,
        description="See https://docs.sqlalchemy.org/en/14/dialects/mssql.html#module-sqlalchemy.dialects.mssql.pyodbc.",
    )
    uri_args: Dict[str, str] = Field(
        default={},
        desscription="Arguments to URL-encode when connecting. See https://docs.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver15.",
    )
    database_pattern: AllowDenyPattern = Field(
        default=AllowDenyPattern.allow_all(),
        description="Regex patterns for databases to filter in ingestion.",
    )
    database: Optional[str] = Field(
        default=None,
        description="database (catalog). If set to Null, all databases will be considered for ingestion.",
    )

    database_alias: Optional[str] = Field(
        default=None,
        description="Alias to apply to database when ingesting. Ignored when `database` is not set.",
    )

    @pydantic.validator("uri_args")
    def passwords_match(cls, v, values, **kwargs):
        if values["use_odbc"] and "driver" not in v:
            raise ValueError("uri_args must contain a 'driver' option")
        elif not values["use_odbc"] and v:
            raise ValueError("uri_args is not supported when ODBC is disabled")
        return v

    def get_sql_alchemy_url(
        self,
        uri_opts: Optional[Dict[str, Any]] = None,
        current_db: Optional[str] = None,
    ) -> str:
        if self.use_odbc:
            # Ensure that the import is available.
            import pyodbc  # noqa: F401

            self.scheme = "mssql+pyodbc"

        uri: str = self.sqlalchemy_uri or make_sqlalchemy_uri(
            self.scheme,
            self.username,
            self.password.get_secret_value() if self.password else None,
            self.host_port,
            current_db if current_db else self.database,
            uri_opts=uri_opts,
        )
        if self.use_odbc:
            uri = f"{uri}?{urllib.parse.urlencode(self.uri_args)}"
        return uri

    def get_identifier(self, schema: str, table: str) -> str:
        regular = f"{schema}.{table}"
        if self.database_alias:
            return f"{self.database_alias}.{regular}"
        if self.database:
            return f"{self.database}.{regular}"
        return regular

    @property
    def host(self):
        return self.platform_instance or self.host_port.split(":")[0]

    @property
    def db(self):
        return self.database_alias or self.database


@platform_name("Microsoft SQL Server", id="mssql")
@config_class(SQLServerConfig)
@support_status(SupportStatus.CERTIFIED)
@capability(SourceCapability.PLATFORM_INSTANCE, "Enabled by default")
@capability(SourceCapability.DOMAINS, "Supported via the `domain` config field")
@capability(SourceCapability.DATA_PROFILING, "Optionally enabled via configuration")
@capability(SourceCapability.DESCRIPTIONS, "Enabled by default")
@capability(
    SourceCapability.USAGE_STATS,
    "Not provided by this module, use `bigquery-usage` for that.",
    supported=False,
)
@capability(SourceCapability.DELETION_DETECTION, "Enabled via stateful ingestion")
class SQLServerSource(SQLAlchemySource):
    """
    This plugin extracts the following:
    - Metadata for databases, schemas, views and tables
    - Column types associated with each table/view
    - Table, row, and column statistics via optional SQL profiling
    We have two options for the underlying library used to connect to SQL Server: (1) [python-tds](https://github.com/denisenkom/pytds) and (2) [pyodbc](https://github.com/mkleehammer/pyodbc). The TDS library is pure Python and hence easier to install, but only PyODBC supports encrypted connections.
    """

    def __init__(self, config: SQLServerConfig, ctx: PipelineContext):
        super().__init__(config, ctx, "mssql")
        # Cache the table and column descriptions
        self.config: SQLServerConfig = config
        self.current_database = None
        self.table_descriptions: Dict[str, str] = {}
        self.column_descriptions: Dict[str, str] = {}
        if self.config.include_descriptions:
            for inspector in self.get_inspectors():
                db_name: str = self.get_db_name(inspector)
                with inspector.engine.connect() as conn:
                    self._populate_table_descriptions(conn, db_name)
                    self._populate_column_descriptions(conn, db_name)

    def _populate_table_descriptions(self, conn: Connection, db_name: str) -> None:
        # see https://stackoverflow.com/questions/5953330/how-do-i-map-the-id-in-sys-extended-properties-to-an-object-name
        # also see https://www.mssqltips.com/sqlservertip/5384/working-with-sql-server-extended-properties/
        table_metadata: ResultProxy = conn.execute(
            """
            SELECT
              SCHEMA_NAME(T.SCHEMA_ID) AS schema_name,
              T.NAME AS table_name,
              EP.VALUE AS table_description
            FROM sys.tables AS T
            INNER JOIN sys.extended_properties AS EP
              ON EP.MAJOR_ID = T.[OBJECT_ID]
              AND EP.MINOR_ID = 0
              AND EP.NAME = 'MS_Description'
              AND EP.CLASS = 1
            """
        )
        for row in table_metadata:  # type: RowProxy
            self.table_descriptions[
                f"{db_name}.{row['schema_name']}.{row['table_name']}"
            ] = row["table_description"]

    def _populate_column_descriptions(self, conn: Connection, db_name: str) -> None:
        column_metadata: RowProxy = conn.execute(
            """
            SELECT
              SCHEMA_NAME(T.SCHEMA_ID) AS schema_name,
              T.NAME AS table_name,
              C.NAME AS column_name ,
              EP.VALUE AS column_description
            FROM sys.tables AS T
            INNER JOIN sys.all_columns AS C
              ON C.OBJECT_ID = T.[OBJECT_ID]
            INNER JOIN sys.extended_properties AS EP
              ON EP.MAJOR_ID = T.[OBJECT_ID]
              AND EP.MINOR_ID = C.COLUMN_ID
              AND EP.NAME = 'MS_Description'
              AND EP.CLASS = 1
            """
        )
        for row in column_metadata:  # type: RowProxy
            self.column_descriptions[
                f"{db_name}.{row['schema_name']}.{row['table_name']}.{row['column_name']}"
            ] = row["column_description"]

    @classmethod
    def create(cls, config_dict: Dict, ctx: PipelineContext) -> "SQLServerSource":
        config = SQLServerConfig.parse_obj(config_dict)
        return cls(config, ctx)

    # override to get table descriptions
    def get_table_properties(
        self, inspector: Inspector, schema: str, table: str
    ) -> Tuple[Optional[str], Dict[str, str], Optional[str]]:
        description, properties, location_urn = super().get_table_properties(
            inspector, schema, table
        )  # type:Tuple[Optional[str], Dict[str, str], Optional[str]]
        # Update description if available.
        db_name: str = self.get_db_name(inspector)
        description = self.table_descriptions.get(
            f"{db_name}.{schema}.{table}", description
        )
        return description, properties, location_urn

    # override to get column descriptions
    def _get_columns(
        self, dataset_name: str, inspector: Inspector, schema: str, table: str
    ) -> List[Dict]:
        columns: List[Dict] = super()._get_columns(
            dataset_name, inspector, schema, table
        )
        # Update column description if available.
        db_name: str = self.get_db_name(inspector)
        for column in columns:
            description: Optional[str] = self.column_descriptions.get(
                f"{db_name}.{schema}.{table}.{column['name']}",
            )
            if description:
                column["comment"] = description
        return columns

    def get_workunits(self) -> Iterable[Union[MetadataWorkUnit, SqlWorkUnit]]:
        sql_config: SQLServerConfig = self.config
        if logger.isEnabledFor(logging.DEBUG):
            # If debug logging is enabled, we also want to echo each SQL query issued.
            sql_config.options.setdefault("echo", True)

        # Extra default SQLAlchemy option for better connection pooling and threading.
        # https://docs.sqlalchemy.org/en/14/core/pooling.html#sqlalchemy.pool.QueuePool.params.max_overflow
        if sql_config.profiling.enabled:
            sql_config.options.setdefault(
                "max_overflow", sql_config.profiling.max_workers
            )

        for inspector in self.get_inspectors():
            profiler = None
            profile_requests: List["GEProfilerRequest"] = []
            if sql_config.profiling.enabled:
                profiler = self._get_profiler_instance(inspector)

            db_name = self.get_db_name(inspector)
            yield from self.gen_database_containers(db_name)
            if sql_config.include_jobs:
                yield from self.loop_jobs(inspector, sql_config)
            for schema in self.get_schema_names(inspector):
                if not sql_config.schema_pattern.allowed(schema):
                    self.report.report_dropped(f"{schema}.*")
                    continue
                self.add_information_for_schema(inspector, schema)

                yield from self.gen_schema_containers(schema, db_name)

                if sql_config.include_tables:
                    yield from self.loop_tables(inspector, schema, sql_config)

                if sql_config.include_views:
                    yield from self.loop_views(inspector, schema, sql_config)

                if profiler:
                    profile_requests += list(
                        self.loop_profiler_requests(inspector, schema, sql_config)
                    )

                if sql_config.include_stored_procedures:
                    yield from self.loop_stored_procedures(
                        inspector, schema, sql_config
                    )

            if profiler and profile_requests:
                yield from self.loop_profiler(
                    profile_requests, profiler, platform=self.platform
                )

        # Clean up stale entities.
        yield from self.stale_entity_removal_handler.gen_removed_entity_workunits()

    def _get_jobs(self, conn: Connection, db_name: str) -> Dict[str, Dict[str, Any]]:
        jobs_data: RowProxy = conn.execute(
            f"""
            SELECT
                job.job_id,
                job.name,
                job.description,
                job.date_created,
                job.date_modified,
                steps.step_id,
                steps.step_name,
                steps.subsystem,
                steps.command,
                steps.database_name
            FROM
                msdb.dbo.sysjobs job
            INNER JOIN
                msdb.dbo.sysjobsteps steps
            ON
                job.job_id = steps.job_id
            where database_name = '{db_name}'
            """
        )
        jobs: Dict[str, Dict[str, Any]] = {}
        for row in jobs_data:  # type: RowProxy
            step_data = dict(
                job_id=row["job_id"],
                job_name=row["name"],
                description=row["description"],
                date_created=row["date_created"],
                date_modified=row["date_modified"],
                step_id=row["step_id"],
                step_name=row["step_name"],
                subsystem=row["subsystem"],
                command=row["command"],
            )
            if row["name"] in jobs:
                jobs[row["name"]][row["step_id"]] = step_data
            else:
                jobs[row["name"]] = {row["step_id"]: step_data}
        return jobs

    def loop_jobs(
        self,
        inspector: Inspector,
        sql_config: SQLServerConfig,
    ) -> Iterable[MetadataWorkUnit]:
        """
        Loop MS SQL jobs as dataFlow-s.
        :return:
        """
        db_name = self.get_db_name(inspector)
        with inspector.engine.connect() as conn:
            jobs = self._get_jobs(conn, db_name)
            for job_name, job_steps in jobs.items():
                job = MSSQLJob(
                    name=job_name,
                    env=sql_config.env,
                    db=db_name,
                    platform_instance=sql_config.host,
                )
                data_flow = MSSQLDataFlow(entity=job)
                yield from self.construct_flow_workunits(data_flow=data_flow)
                yield from self.loop_job_steps(job, job_steps)

    def loop_job_steps(self, job: MSSQLJob, job_steps: Dict[str, Any]):
        for step_id, step_data in job_steps.items():
            step = JobStep(
                job_name=job.formatted_name,
                step_name=step_data["step_name"].lower().replace(" ", "_"),
                flow=job,
            )
            data_job = MSSQLDataJob(entity=step)
            for data_name, data_value in step_data.items():
                data_job.add_property(name=data_name, value=str(data_value))
            yield from self.construct_job_workunits(data_job)

    def loop_stored_procedures(  # noqa: C901
        self,
        inspector: Inspector,
        schema: str,
        sql_config: SQLServerConfig,
    ) -> Iterable[MetadataWorkUnit]:
        """
        Loop schema data for get stored procedures as dataJob-s.
        """
        db_name = self.get_db_name(inspector)
        procedure_flow_name = f"{db_name}.{schema}.stored_procedures"
        mssql_default_job = MSSQLProceduresContainer(
            name=procedure_flow_name,
            env=sql_config.env,
            db=db_name,
            platform_instance=sql_config.host,
        )
        data_flow = MSSQLDataFlow(entity=mssql_default_job)
        with inspector.engine.connect() as conn:
            procedures_data_list = self._get_stored_procedures(conn, db_name, schema)
            procedures = [
                StoredProcedure(flow=mssql_default_job, **procedure_data)
                for procedure_data in procedures_data_list
            ]
            if procedures:
                yield from self.construct_flow_workunits(data_flow=data_flow)
            for procedure in procedures:
                upstream = self._get_procedure_upstream(conn, procedure)
                downstream = self._get_procedure_downstream(conn, procedure)
                data_job = MSSQLDataJob(
                    entity=procedure,
                )
                data_job.add_property("procedure_depends_on", str(upstream.as_property))
                data_job.add_property(
                    "depending_on_procedure", str(downstream.as_property)
                )
                procedure_definition, procedure_code = self._get_procedure_code(
                    conn, procedure
                )
                if procedure_definition:
                    data_job.add_property("definition", procedure_definition)
                if sql_config.include_code and procedure_code:
                    data_job.add_property("code", procedure_code)
                procedure_inputs = self._get_procedure_inputs(conn, procedure)
                properties = self._get_procedure_properties(conn, procedure)
                data_job.add_property(
                    "input parameters", str([param.name for param in procedure_inputs])
                )
                for param in procedure_inputs:
                    data_job.add_property(
                        f"parameter {param.name}", str(param.properties)
                    )
                for property_name, property_value in properties.items():
                    data_job.add_property(property_name, str(property_value))
                yield from self.construct_job_workunits(data_job)

    @staticmethod
    def _get_procedure_downstream(
        conn: Connection, procedure: StoredProcedure
    ) -> ProcedureLineageStream:
        downstream_data: RowProxy = conn.execute(
            f"""
            SELECT DISTINCT OBJECT_SCHEMA_NAME ( referencing_id ) AS [schema],
                OBJECT_NAME(referencing_id) AS [name],
                o.type_desc AS [type]
            FROM sys.sql_expression_dependencies AS sed
            INNER JOIN sys.objects AS o ON sed.referencing_id = o.object_id
            left join sys.objects o1 on sed.referenced_id = o1.object_id
            WHERE referenced_id = OBJECT_ID(N'{procedure.escape_full_name}')
                AND o.type_desc in ('TABLE_TYPE', 'VIEW', 'USER_TABLE')
            """
        )
        downstream_dependencies = []
        for row in downstream_data:  # type: RowProxy
            downstream_dependencies.append(
                ProcedureDependency(
                    db=procedure.db,
                    schema=row["schema"],
                    name=row["name"],
                    type=row["type"],
                    env=procedure.flow.env,
                    server=procedure.flow.platform_instance,
                )
            )
        return ProcedureLineageStream(dependencies=downstream_dependencies)

    @staticmethod
    def _get_procedure_upstream(
        conn: Connection, procedure: StoredProcedure
    ) -> ProcedureLineageStream:
        upstream_data: RowProxy = conn.execute(
            f"""
            SELECT DISTINCT
                coalesce(lower(referenced_database_name), db_name()) AS db,
                referenced_schema_name AS [schema],
                referenced_entity_name AS [name],
                o1.type_desc AS [type]
            FROM sys.sql_expression_dependencies AS sed
            INNER JOIN sys.objects AS o ON sed.referencing_id = o.object_id
            left join sys.objects o1 on sed.referenced_id = o1.object_id
            WHERE referencing_id = OBJECT_ID(N'{procedure.escape_full_name}')
                AND referenced_schema_name is not null
                AND o1.type_desc in ('TABLE_TYPE', 'VIEW', 'SQL_STORED_PROCEDURE', 'USER_TABLE')
            """
        )
        upstream_dependencies = []
        for row in upstream_data:  # type: RowProxy
            upstream_dependencies.append(
                ProcedureDependency(
                    db=row["db"],
                    schema=row["schema"],
                    name=row["name"],
                    type=row["type"],
                    env=procedure.flow.env,
                    server=procedure.flow.platform_instance,
                )
            )
        return ProcedureLineageStream(dependencies=upstream_dependencies)

    @staticmethod
    def _get_procedure_inputs(
        conn: Connection, procedure: StoredProcedure
    ) -> List[ProcedureParameter]:
        inputs_data: RowProxy = conn.execute(
            f"""
            SELECT
                name,
                type_name(user_type_id) AS 'type'
            FROM sys.parameters
            WHERE object_id = object_id('{procedure.escape_full_name}')
            """
        )
        inputs_list = []
        for row in inputs_data:  # type: RowProxy
            inputs_list.append(ProcedureParameter(name=row["name"], type=row["type"]))
        return inputs_list

    @staticmethod
    def _get_procedure_code(
        conn: Connection, procedure: StoredProcedure
    ) -> Tuple[Optional[str], Optional[str]]:
        query = f"EXEC [{procedure.db}].dbo.sp_helptext '{procedure.full_name}'"
        try:
            code_data: RowProxy = conn.execute(query)
        except ProgrammingError:
            logger.warning(
                "Denied permission for read text from procedure '%s'",
                procedure.full_name,
            )
            return None, None
        code_list = []
        code_slice_index = 0
        code_slice_text = "create procedure"
        try:
            for index, row in enumerate(code_data):  # type: RowProxy
                code_list.append(row["Text"])
                if code_slice_text in re.sub(" +", " ", row["Text"].lower()).strip():
                    code_slice_index = index
            definition = "\n".join(code_list[:code_slice_index])
            code = "\n".join(code_list[code_slice_index:])
        except ResourceClosedError:
            logger.warning(
                "Connection was closed from procedure '%s'",
                procedure.full_name,
            )
            return None, None
        return definition, code

    @staticmethod
    def _get_procedure_properties(
        conn: Connection, procedure: StoredProcedure
    ) -> Dict[str, Any]:
        properties_data: RowProxy = conn.execute(
            f"""
            SELECT
                create_date,
                modify_date
            FROM sys.procedures
            WHERE object_id = object_id('{procedure.full_name}')
            """
        )
        properties = {}
        for row in properties_data:  # type: RowProxy
            properties = dict(
                create_date=row["create_date"], modify_date=row["modify_date"]
            )
        return properties

    @staticmethod
    def _get_stored_procedures(
        conn: Connection, db_name: str, schema: str
    ) -> List[Dict[str, str]]:
        stored_procedures_data: RowProxy = conn.execute(
            f"""
            SELECT
                pr.name as procedure_name,
                s.name as schema_name
            FROM
                [{db_name}].[sys].[procedures] pr
            INNER JOIN
                [{db_name}].[sys].[schemas] s ON pr.schema_id = s.schema_id
            where s.name = '{schema}'
            """
        )
        procedures_list = []
        for row in stored_procedures_data:  # type: RowProxy
            procedures_list.append(
                dict(db=db_name, schema=row["schema_name"], name=row["procedure_name"])
            )
        return procedures_list

    def construct_job_workunits(
        self,
        data_job: MSSQLDataJob,
    ) -> Iterable[MetadataWorkUnit]:
        mcp = MetadataChangeProposalWrapper(
            entityType=data_job.type,
            entityUrn=data_job.full_server_urn,
            changeType=ChangeTypeClass.UPSERT,
            **data_job.as_datajob_info_aspect_data,
        )
        wu = MetadataWorkUnit(
            id=f"{data_job.source}.{data_job.entity.full_name}.{mcp.aspectName}",
            mcp=mcp,
        )
        self.report.report_workunit(wu)
        yield wu

        mcp = MetadataChangeProposalWrapper(
            entityType=data_job.type,
            entityUrn=data_job.full_server_urn,
            changeType=ChangeTypeClass.UPSERT,
            **data_job.as_datajob_input_output_aspect_data,
        )
        wu = MetadataWorkUnit(
            id=f"{data_job.source}.{data_job.entity.full_name}.{mcp.aspectName}",
            mcp=mcp,
        )
        self.report.report_workunit(wu)
        yield wu

    def construct_flow_workunits(
        self,
        data_flow: MSSQLDataFlow,
    ) -> Iterable[MetadataWorkUnit]:
        mcp = MetadataChangeProposalWrapper(
            entityType=data_flow.type,
            entityUrn=data_flow.full_server_urn,
            changeType=ChangeTypeClass.UPSERT,
            **data_flow.as_dataflow_info_aspect_data,
        )
        for proposal in [mcp]:
            wu = MetadataWorkUnit(
                id=f"{data_flow.source}.{data_flow.entity.formatted_name}.{proposal.aspectName}",
                mcp=proposal,
            )
            self.report.report_workunit(wu)
            yield wu

    def get_inspectors(self) -> Iterable[Inspector]:
        # This method can be overridden in the case that you want to dynamically
        # run on multiple databases.
        url = self.config.get_sql_alchemy_url()
        logger.debug(f"sql_alchemy_url={url}")
        engine = create_engine(url, **self.config.options)
        with engine.connect() as conn:
            if self.config.database and self.config.database != "":
                inspector = inspect(conn)
                yield inspector
            else:
                databases = conn.execute(
                    "SELECT name FROM master.sys.databases WHERE name NOT IN \
                  ('master', 'model', 'msdb', 'tempdb', 'Resource', \
                       'distribution' , 'reportserver', 'reportservertempdb'); "
                )
                for db in databases:
                    if self.config.database_pattern.allowed(db["name"]):
                        url = self.config.get_sql_alchemy_url(current_db=db["name"])
                        inspector = inspect(
                            create_engine(url, **self.config.options).connect()
                        )
                        self.current_database = db["name"]
                        yield inspector

    def get_identifier(
        self, *, schema: str, entity: str, inspector: Inspector, **kwargs: Any
    ) -> str:
        regular = f"{schema}.{entity}"
        if self.config.database:
            if self.config.database_alias:
                return f"{self.config.database_alias}.{regular}"
            return f"{self.config.database}.{regular}"
        if self.current_database:
            return f"{self.current_database}.{regular}"
        return regular
