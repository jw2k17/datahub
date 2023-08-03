import logging
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Optional

from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.decorators import (
    SupportStatus,
    config_class,
    platform_name,
    support_status,
)
from datahub.ingestion.api.source import MetadataWorkUnitProcessor, SourceReport
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.ingestion.source.datahub.config import DataHubSourceConfig
from datahub.ingestion.source.datahub.datahub_kafka_reader import DataHubKafkaReader
from datahub.ingestion.source.datahub.datahub_mysql_reader import DataHubMySQLReader
from datahub.ingestion.source.datahub.report import DataHubSourceReport
from datahub.ingestion.source.datahub.state import StatefulDataHubIngestionHandler
from datahub.ingestion.source.state.stateful_ingestion_base import (
    StatefulIngestionSourceBase,
)

logger = logging.getLogger(__name__)


@platform_name("DataHub")
@config_class(DataHubSourceConfig)
@support_status(SupportStatus.TESTING)
class DataHubSource(StatefulIngestionSourceBase):
    platform: str = "datahub"

    def __init__(self, config: DataHubSourceConfig, ctx: PipelineContext):
        super().__init__(config, ctx)
        self.config = config
        self.report: DataHubSourceReport = DataHubSourceReport()
        self.stateful_ingestion_handler = StatefulDataHubIngestionHandler(self)

    @classmethod
    def create(cls, config_dict: Dict, ctx: PipelineContext) -> "DataHubSource":
        config: DataHubSourceConfig = DataHubSourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_report(self) -> SourceReport:
        return self.report

    def get_workunit_processors(self) -> List[Optional[MetadataWorkUnitProcessor]]:
        return []  # Exactly replicate data from DataHub source

    def get_workunits_internal(self) -> Iterable[MetadataWorkUnit]:
        state = self.stateful_ingestion_handler.get_last_run_state()
        yield from self._get_mysql_workunits(state.mysql_createdon_datetime)
        self._commit_progress()
        yield from self._get_kafka_workunits(state.kafka_offset)
        self._commit_progress()

    def _get_mysql_workunits(
        self, from_createdon: datetime
    ) -> Iterable[MetadataWorkUnit]:
        mcps = DataHubMySQLReader(self.config, self.report).get_aspects(from_createdon)
        for i, (mcp, createdon) in enumerate(mcps):
            yield mcp.as_workunit()

            self.stateful_ingestion_handler.update_checkpoint(last_createdon=createdon)
            self._commit_progress(i)

    def _get_kafka_workunits(self, from_offset: int) -> Iterable[MetadataWorkUnit]:
        stop_time = datetime.now(tz=timezone.utc)
        mcls = DataHubKafkaReader(self.config, self.report).get_mcls(
            from_offset=from_offset, stop_time=stop_time
        )
        for i, (mcl, offset) in enumerate(mcls):
            # TODO: Get rid of deserialization?
            mcp = MetadataChangeProposalWrapper.try_from_mcl(mcl)
            if isinstance(mcp, MetadataChangeProposalWrapper):
                yield mcp.as_workunit()
            else:
                yield MetadataWorkUnit(
                    id=f"{mcp.entityUrn}-{mcp.aspectName}-{i}", mcp_raw=mcp
                )

            self.stateful_ingestion_handler.update_checkpoint(last_offset=offset)
            self._commit_progress(i)

    def _commit_progress(self, i: Optional[int] = None) -> None:
        """Commit progress to stateful storage, if there have been no errors.

        If an index `i` is provided, only commit if we are at the appropriate interval
        as per `config.commit_state_interval`.
        """
        has_errors = (
            self.report.num_mysql_parse_errors or self.report.num_kafka_parse_errors
        )
        on_interval = (
            i
            and self.config.commit_state_interval
            and i % self.config.commit_state_interval == 0
        )

        if not has_errors and (i is None or on_interval):
            self.stateful_ingestion_handler.commit_checkpoint()
