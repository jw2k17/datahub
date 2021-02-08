from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, TypeVar, Type, Dict
from pydantic import BaseModel, Field, ValidationError, validator
from enum import Enum
from pathlib import Path
import requests
from gometa.ingestion.api.sink import Sink, WriteCallback
from gometa.ingestion.api.common import RecordEnvelope
import json
from gometa.metadata import json_converter
from gometa.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from gometa.metadata import CorpUserSnapshotClass, DatasetSnapshotClass
from collections import OrderedDict

import logging
logger = logging.getLogger(__name__)

resource_locator: Dict[Type[object], str] = {
    # TODO: add the rest
    CorpUserSnapshotClass: 'corpUsers',
    DatasetSnapshotClass: 'datasets',
}

def _rest_li_ify(obj):
    if isinstance(obj, (dict, OrderedDict)):
        if len(obj.keys()) == 1:
            key = list(obj.keys())[0]
            value = obj[key]
            if key.find('com.linkedin.pegasus2avro.') >= 0:
                new_key = key.replace('com.linkedin.pegasus2avro.', 'com.linkedin.')
                return {new_key: _rest_li_ify(value)}
            elif key == 'string':
                return value

        new_obj = {}
        for key, value in obj.items():
            if value is not None:
                new_obj[key] = _rest_li_ify(value)
        return new_obj
    elif isinstance(obj, list):
        new_obj = [_rest_li_ify(item) for item in obj]
        return new_obj
    return obj

class DatahubRestSinkConfig(BaseModel):
    """Configuration class for holding connectivity to datahub gms"""

    server: str = "http://localhost:8080"


@dataclass
class DatahubRestSink(Sink):
    config: DatahubRestSinkConfig

    @classmethod
    def create(cls, config_dict, ctx):
        config = DatahubRestSinkConfig.parse_obj(config_dict)
        # TODO verify that config points to a valid server
        #response = requests.get(f"http://{config.server}/")
        #assert response.status_code == 200
        return cls(ctx, config)

    def get_ingest_endpoint(self, mce: MetadataChangeEvent):
        snapshot_type = type(mce.proposedSnapshot)
        snapshot_resource = resource_locator.get(snapshot_type, None)
        if not snapshot_resource:
            raise ValueError("Failed to locate a snapshot resource for {snapshot_type}")

        return f'{self.config.server}/{snapshot_resource}?action=ingest'

    def write_record_async(self, record_envelope: RecordEnvelope[MetadataChangeEvent], write_callback: WriteCallback):
        headers = {'X-RestLi-Protocol-Version' : '2.0.0'}

        mce = record_envelope.record
        url = self.get_ingest_endpoint(mce)
        logger.debug(f'{url!r}')

        raw_mce_obj = json_converter.to_json_object(mce.proposedSnapshot)
        logger.debug(f'{raw_mce_obj!r}')

        mce_obj = _rest_li_ify(raw_mce_obj)
        snapshot = {'snapshot': mce_obj}
        try:
            response = requests.post(url, headers=headers, json=snapshot)
            # with open('data.json', 'w') as outfile:
            #     json.dump(serialized_snapshot, outfile)
            response.raise_for_status()
            write_callback.on_success(record_envelope, {})
        except Exception as e:
            write_callback.on_failure(record_envelope, e, {})

    def close(self):
        pass
