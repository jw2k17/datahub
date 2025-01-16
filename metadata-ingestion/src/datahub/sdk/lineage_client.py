from typing import Optional

import datahub.metadata.schema_classes as models
from datahub.errors import SdkUsageError
from datahub.ingestion.graph.client import DataHubGraph
from datahub.metadata.urns import DatasetUrn
from datahub.sdk._shared import DatajobUrnOrStr, DatasetUrnOrStr
from datahub.sdk.dataset import ColumnLineageMapping, _parse_cll_mapping
from datahub.sdk.sdk_graph import SDKGraph
from datahub.specific.dataset import DatasetPatchBuilder


class LineageClient:
    def __init__(self, graph: DataHubGraph):
        self._graph = graph

    def add_dataset_lineage(
        self,
        *,
        upstream: DatasetUrnOrStr,
        downstream: DatasetUrnOrStr,
        column_lineage: Optional[ColumnLineageMapping] = None,
    ) -> None:
        upstream = DatasetUrn.from_string(upstream)
        downstream = DatasetUrn.from_string(downstream)

        cll = None
        if column_lineage is not None:
            cll = _parse_cll_mapping(
                upstream=upstream,
                downstream=downstream,
                cll_mapping=column_lineage,
            )

        if not self._graph.exists(str(downstream)):
            # TODO: add a force mechanism here
            raise SdkUsageError(
                f"Dataset {downstream} does not exist. Cannot add lineage."
            )

        updater = DatasetPatchBuilder(str(downstream))
        updater.add_upstream_lineage(
            models.UpstreamClass(
                dataset=str(upstream),
                type=models.DatasetLineageTypeClass.TRANSFORMED,
            )
        )
        for cl in cll or []:
            updater.add_fine_grained_upstream_lineage(cl)

        # TODO: instead of doing the check above, should we just rely on the update method to do it?
        SDKGraph(self._graph).update(updater, check_exists=False)

    def add_datajob_lineage(
        self,
        *,
        job: DatajobUrnOrStr,
        upstream: Optional[DatasetUrnOrStr],
        downstream: Optional[DatasetUrnOrStr],
        column_lineage: ColumnLineageMapping,
    ) -> None:
        upstream = DatasetUrn.from_string(upstream) if upstream else None
        downstream = DatasetUrn.from_string(downstream) if downstream else None

        if not upstream and not downstream:
            raise SdkUsageError(
                "upstream or downstream is required for datajob lineage"
            )

        cll = None
        if column_lineage is not None:
            # upstream and downstream are required
            if not upstream or not downstream:
                raise SdkUsageError(
                    "upstream and downstream are required for column lineage"
                )
            cll = _parse_cll_mapping(
                upstream=upstream,
                downstream=downstream,
                cll_mapping=column_lineage,
            )

        raise NotImplementedError("TODO")
