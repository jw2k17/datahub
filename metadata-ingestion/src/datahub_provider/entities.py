from abc import abstractmethod

import attr

import datahub.emitter.mce_builder as builder
from datahub.api.datajob import Entity


class _Entity(Entity):
    @property
    def urn(self) -> str:
        raise NotImplementedError("urn method needs to be implemented")

    def set_context(self, context):
        # Required for compat with Airflow 1.10.x
        pass

    def as_dict(self):
        # Required for compat with Airflow 1.10.x
        return attr.asdict(self)


@attr.s(auto_attribs=True, str=True)
class Dataset(_Entity):
    platform: str
    name: str
    env: str = builder.DEFAULT_ENV

    @property
    def urn(self):
        return builder.make_dataset_urn(self.platform, self.name, self.env)
