from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import config_class, platform_name
from datahub.ingestion.source.ib.dataset.ib_dataset import IBRedashDatasetSource
from datahub.ingestion.source.ib.ib_common import IBRedashSourceConfig
from datahub.ingestion.source.state.stateful_ingestion_base import JobId


class IBMSSQLTablesSourceConfig(IBRedashSourceConfig):
    pass


@platform_name("IBMSSQL")
@config_class(IBMSSQLTablesSourceConfig)
class IBMSSQLTablesSource(IBRedashDatasetSource):
    platform = "mssql"
    object_subtype = "Table"

    def __init__(self, config: IBMSSQLTablesSourceConfig, ctx: PipelineContext):
        super().__init__(config, ctx)
        self.config: IBMSSQLTablesSourceConfig = config

    def get_default_ingestion_job_id_prefix(self) -> JobId:
        return JobId("ingest_mssql_tables_from_redash_source_")
