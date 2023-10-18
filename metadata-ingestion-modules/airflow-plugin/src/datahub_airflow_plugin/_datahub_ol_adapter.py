import logging

import datahub.emitter.mce_builder as builder
from openlineage.client.run import Dataset as OpenLineageDataset

logger = logging.getLogger(__name__)


OL_SCHEME_TWEAKS = {
    "sqlserver": "mssql",
    "trino": "presto",
    "awsathena": "athena",
}


def translate_ol_to_datahub_urn(ol_uri: OpenLineageDataset) -> str:
    namespace = ol_uri.namespace
    name = ol_uri.name

    scheme, *rest = namespace.split("://", maxsplit=1)

    platform = OL_SCHEME_TWEAKS.get(scheme, scheme)
    return builder.make_dataset_urn(platform=platform, name=name)
