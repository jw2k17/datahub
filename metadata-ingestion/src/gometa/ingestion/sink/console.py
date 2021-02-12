import dataclasses
import logging

from gometa.ingestion.api.common import RecordEnvelope
from gometa.ingestion.api.sink import Sink, SinkReport, WriteCallback

logger = logging.getLogger(__name__)


@dataclasses.dataclass
class ConsoleSink(Sink):
    report: SinkReport = dataclasses.field(default_factory=SinkReport)

    @classmethod
    def create(cls, config_dict, ctx):
        return cls(ctx)

    def handle_work_unit_start(self, wu):
        pass

    def handle_work_unit_end(self, wu):
        pass

    def write_record_async(
        self, record_envelope: RecordEnvelope, write_callback: WriteCallback
    ):
        print(f'{self.ctx.run_id}:{record_envelope}')
        if write_callback:
            self.report.report_record_written(record_envelope)
            write_callback.on_success(record_envelope, {})

    def get_report(self):
        return self.report

    def close(self):
        pass
