import logging
from contextlib import AbstractContextManager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from datahub.utilities.perf_timer import PerfTimer
from datahub.utilities.stats_collections import TopKDict

logger: logging.Logger = logging.getLogger(__name__)


METADATA_EXTRACTION = "Metadata Extraction"
LINEAGE_EXTRACTION = "Lineage Extraction"
USAGE_EXTRACTION_INGESTION = "Usage Extraction Ingestion"
USAGE_EXTRACTION_OPERATIONAL_STATS = "Usage Extraction Operational Stats"
USAGE_EXTRACTION_USAGE_AGGREGATION = "Usage Extraction Usage Aggregation"
EXTERNAL_TABLE_DDL_LINEAGE = "External table DDL Lineage"
VIEW_PARSING = "View Parsing"
QUERIES_EXTRACTION = "Queries Extraction"
PROFILING = "Profiling"


@dataclass
class IngestionStageReport:
    ingestion_stage: Optional[str] = None
    ingestion_stage_durations: TopKDict[str, float] = field(default_factory=TopKDict)

    _timer: Optional[PerfTimer] = field(
        default=None, init=False, repr=False, compare=False
    )

    def report_ingestion_stage_start(self, stage: str) -> None:
        if self._timer:
            elapsed = round(self._timer.elapsed_seconds(), 2)
            logger.info(
                f"Time spent in stage <{self.ingestion_stage}>: {elapsed} seconds",
                stacklevel=2,
            )
            if self.ingestion_stage:
                self.ingestion_stage_durations[self.ingestion_stage] = elapsed
        else:
            self._timer = PerfTimer()

        self.ingestion_stage = f"{stage} at {datetime.now(timezone.utc)}"
        logger.info(f"Stage started: {self.ingestion_stage}")
        self._timer.start()


@dataclass
class IngestionStageContextReport:
    ingestion_stage_durations: TopKDict[str, float] = field(default_factory=TopKDict)

    def new_stage(self, stage: str) -> "IngestionStageContext":
        return IngestionStageContext(stage, self)


@dataclass
class IngestionStageContext(AbstractContextManager):
    def __init__(self, stage: str, report: IngestionStageContextReport):
        self._ingestion_stage = f"{stage} at {datetime.now(timezone.utc)}"
        self._timer: PerfTimer = PerfTimer()
        self._report = report

    def __enter__(self) -> "IngestionStageContext":
        logger.info(f"Stage started: {self._ingestion_stage}")
        self._timer.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = self._timer.elapsed_seconds(digits=2)
        logger.info(
            f"Time spent in stage <{self._ingestion_stage}>: {elapsed} seconds",
            stacklevel=2,
        )
        self._report.ingestion_stage_durations[self._ingestion_stage] = elapsed
        return None
