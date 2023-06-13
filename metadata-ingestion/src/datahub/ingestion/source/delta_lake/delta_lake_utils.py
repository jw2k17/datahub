import pathlib
from typing import Dict, Optional

from deltalake import DeltaTable

try:
    from deltalake.exceptions import TableNotFoundError
except ImportError:
    # For deltalake < 0.10.0.
    from deltalake import PyDeltaTableError as TableNotFoundError  # type: ignore

from datahub.ingestion.source.delta_lake.config import DeltaLakeSourceConfig


def read_delta_table(
    path: str, opts: Dict[str, str], delta_lake_config: DeltaLakeSourceConfig
) -> Optional[DeltaTable]:
    if not delta_lake_config.is_s3 and not pathlib.Path(path).exists():
        # The DeltaTable() constructor will create the path if it doesn't exist.
        # Hence we need an extra, manual check here.
        return None

    try:
        return DeltaTable(
            path,
            storage_options=opts,
            without_files=not delta_lake_config.require_files,
        )
    except TableNotFoundError as e:
        if "Not a Delta table" in str(e):
            pass
        else:
            raise e
    return None


def get_file_count(delta_table: DeltaTable) -> int:
    return len(delta_table.files())
