import datahub.emitter.mcp_builder as builder
from datahub.emitter.mce_builder import datahub_guid


def test_guid_generator():
    key = builder.SchemaKey(
        database="test", schema="Test", platform="mysql", instance="PROD"
    )

    guid = key.guid()
    assert guid == "06a1f87f99e1d82efa3da13637913c87"


def test_guid_generator_with_empty_instance():
    key = builder.SchemaKey(
        database="test", schema="Test", platform="mysql", instance=None
    )

    guid = key.guid()
    assert guid == "0ce13865e9e414406a895612787d9ae6"


def test_guid_generators():
    key = builder.SchemaKey(
        database="test", schema="Test", platform="mysql", instance="PROD"
    )
    guid_datahub = datahub_guid(key.__dict__)

    guid = key.guid()
    assert guid == guid_datahub
