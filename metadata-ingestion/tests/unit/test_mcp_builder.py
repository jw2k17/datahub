import datahub.emitter.mcp_builder as builder
from datahub.emitter.mce_builder import datahub_guid


def test_guid_generator():
    key = builder.SchemaKey(
        database="test", schema="Test", platform="mysql", instance="PROD"
    )

    guid = key.guid()
    assert guid == "f5268c71373b9100d50c1299861cfb3f"


def test_guid_generator_with_empty_instance():
    key = builder.SchemaKey(
        database="test",
        schema="Test",
        platform="mysql",
        instance=None,
        environment="PROD",
    )

    guid = key.guid()
    assert guid == "ff0c29715ad619bf7cf94641920470a9"


def test_guid_generator_with_instance_and_env():
    key = builder.SchemaKey(
        database="test",
        schema="Test",
        platform="mysql",
        instance="TestInstance",
        environment="PROD",
    )

    guid = key.guid()
    assert guid == "f096b3799fc86a3e5d5d0c083eb1f2a4"


def test_guid_generators():
    key = builder.SchemaKey(
        database="test", schema="Test", platform="mysql", instance="PROD"
    )
    guid_datahub = datahub_guid(key.dict(by_alias=True))

    guid = key.guid()
    assert guid == guid_datahub
