import json

from tests.test_helpers import mce_helpers
import pytest

basic_1 = json.loads(
    """[
    {
        "auditHeader": null,
        "proposedSnapshot": {
            "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
                "urn": "urn:li:dataset:(urn:li:dataPlatform:kafka,SampleKafkaDataset,PROD)",
                "aspects": [
                    {
                        "com.linkedin.pegasus2avro.common.Ownership": {
                            "owners": [
                                {
                                    "owner": "urn:li:corpuser:jdoe",
                                    "type": "DATAOWNER",
                                    "source": null
                                }
                            ],
                            "lastModified": {
                                "time": 1581407189000,
                                "actor": "urn:li:corpuser:jdoe",
                                "impersonator": null
                            }
                        }
                    },
                    {
                        "com.linkedin.pegasus2avro.common.InstitutionalMemory": {
                            "elements": [
                                {
                                    "url": "https://www.linkedin.com",
                                    "description": "Sample doc",
                                    "createStamp": {
                                        "time": 1581407189000,
                                        "actor": "urn:li:corpuser:jdoe",
                                        "impersonator": null
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        "proposedDelta": null
    }
]"""
)

# Timestamps changed from basic_1 but same otherwise.
basic_2 = json.loads(
    """[
    {
        "auditHeader": null,
        "proposedSnapshot": {
            "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
                "urn": "urn:li:dataset:(urn:li:dataPlatform:kafka,SampleKafkaDataset,PROD)",
                "aspects": [
                    {
                        "com.linkedin.pegasus2avro.common.Ownership": {
                            "owners": [
                                {
                                    "owner": "urn:li:corpuser:jdoe",
                                    "type": "DATAOWNER",
                                    "source": null
                                }
                            ],
                            "lastModified": {
                                "time": 1581407199000,
                                "actor": "urn:li:corpuser:jdoe",
                                "impersonator": null
                            }
                        }
                    },
                    {
                        "com.linkedin.pegasus2avro.common.InstitutionalMemory": {
                            "elements": [
                                {
                                    "url": "https://www.linkedin.com",
                                    "description": "Sample doc",
                                    "createStamp": {
                                        "time": 1581407389000,
                                        "actor": "urn:li:corpuser:jdoe",
                                        "impersonator": null
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        "proposedDelta": null
    }
]"""
)

# Dataset owner changed from basic_2.
basic_3 = json.loads(
    """[
    {
        "auditHeader": null,
        "proposedSnapshot": {
            "com.linkedin.pegasus2avro.metadata.snapshot.DatasetSnapshot": {
                "urn": "urn:li:dataset:(urn:li:dataPlatform:kafka,SampleKafkaDataset,PROD)",
                "aspects": [
                    {
                        "com.linkedin.pegasus2avro.common.Ownership": {
                            "owners": [
                                {
                                    "owner": "urn:li:corpuser:datahub",
                                    "type": "DATAOWNER",
                                    "source": null
                                }
                            ],
                            "lastModified": {
                                "time": 1581407199000,
                                "actor": "urn:li:corpuser:jdoe",
                                "impersonator": null
                            }
                        }
                    },
                    {
                        "com.linkedin.pegasus2avro.common.InstitutionalMemory": {
                            "elements": [
                                {
                                    "url": "https://www.linkedin.com",
                                    "description": "Sample doc",
                                    "createStamp": {
                                        "time": 1581407389000,
                                        "actor": "urn:li:corpuser:jdoe",
                                        "impersonator": null
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        "proposedDelta": null
    }
]"""
)


def test_basic_diff_same():
    mce_helpers.assert_mces_equal(basic_1, basic_2)


def test_basic_diff_only_owner_change():
    with pytest.raises(AssertionError):
        mce_helpers.assert_mces_equal(basic_2, basic_3)


def test_basic_diff_owner_change():
    with pytest.raises(AssertionError):
        mce_helpers.assert_mces_equal(basic_1, basic_3)
