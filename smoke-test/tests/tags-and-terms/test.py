import time

import pytest
import requests
import urllib
from datahub.cli.docker import check_local_docker_containers
from datahub.ingestion.run.pipeline import Pipeline

GMS_ENDPOINT = "http://localhost:8080"
FRONTEND_ENDPOINT = "http://localhost:9002"
KAFKA_BROKER = "localhost:9092"

bootstrap_sample_data = "../metadata-ingestion/examples/mce_files/bootstrap_mce.json"
usage_sample_data = (
    "../metadata-ingestion/tests/integration/bigquery-usage/bigquery_usages_golden.json"
)
bq_sample_data = "./sample_bq_data.json"
restli_default_headers = {
    "X-RestLi-Protocol-Version": "2.0.0",
}
kafka_post_ingestion_wait_sec = 60


@pytest.fixture(scope="session")

@pytest.mark.dependency(depends=["test_healthchecks", "test_run_ingestion"])
def test_add_tag(frontend_session):
    platform = "urn:li:dataPlatform:kafka"
    dataset_name = (
        "SampleKafkaDataset"
    )
    env = "PROD"
    dataset_urn = f"urn:li:dataset:({platform},{dataset_name},{env})"

    dataset_json = {
        "query": """query getDataset($urn: String!) {\n
            dataset(urn: $urn) {\n
                globalTags {\n
                    tags {\n
                        tag {\n
                            urn\n
                            name\n
                            description\n
                        }\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": dataset_urn
        }
    }

    # Fetch tags
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["globalTags"] == None

    add_json = {
        "query": """mutation addTag($input: TagAssociationInput!) {\n
            addTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": dataset_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=add_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["addTag"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["globalTags"] == {'tags': [{'tag': {'description': 'Indicates the dataset is no longer supported', 'name': 'Legacy', 'urn': 'urn:li:tag:Legacy'}}]}

    remove_json = {
        "query": """mutation removeTag($input: TagAssociationInput!) {\n
            removeTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": dataset_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=remove_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["removeTag"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["globalTags"] == {'tags': [] }


@pytest.mark.dependency(depends=["test_healthchecks", "test_run_ingestion"])
def test_add_tag_to_chart(frontend_session):
    chart_urn = "urn:li:chart:(looker,baz2)"

    chart_json = {
        "query": """query getChart($urn: String!) {\n
            chart(urn: $urn) {\n
                globalTags {\n
                    tags {\n
                        tag {\n
                            urn\n
                            name\n
                            description\n
                        }\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": chart_urn
        }
    }

    # Fetch tags
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=chart_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["chart"]
    assert res_data["data"]["chart"]["globalTags"] == None

    add_json = {
        "query": """mutation addTag($input: TagAssociationInput!) {\n
            addTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": chart_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=add_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["addTag"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=chart_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["chart"]
    assert res_data["data"]["chart"]["globalTags"] == {'tags': [{'tag': {'description': 'Indicates the dataset is no longer supported', 'name': 'Legacy', 'urn': 'urn:li:tag:Legacy'}}]}

    remove_json = {
        "query": """mutation removeTag($input: TagAssociationInput!) {\n
            removeTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": chart_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=remove_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["removeTag"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=chart_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["chart"]
    assert res_data["data"]["chart"]["globalTags"] == {'tags': [] }

@pytest.mark.dependency(depends=["test_healthchecks", "test_run_ingestion"])
def test_add_term(frontend_session):
    platform = "urn:li:dataPlatform:kafka"
    dataset_name = (
        "SampleKafkaDataset"
    )
    env = "PROD"
    dataset_urn = f"urn:li:dataset:({platform},{dataset_name},{env})"

    dataset_json = {
        "query": """query getDataset($urn: String!) {\n
            dataset(urn: $urn) {\n
                glossaryTerms {\n
                    terms {\n
                        term {\n
                            urn\n
                            name\n
                        }\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": dataset_urn
        }
    }


    # Fetch the terms
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["glossaryTerms"] == None

    add_json = {
        "query": """mutation addTerm($input: TermAssociationInput!) {\n
            addTerm(input: $input)
        }""",
        "variables": {
            "input": {
              "termUrn": "urn:li:glossaryTerm:SavingAccount",
              "resourceUrn": dataset_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=add_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["addTerm"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["glossaryTerms"] == {'terms': [{'term': {'name': 'SavingAccount', 'urn': 'urn:li:glossaryTerm:SavingAccount'}}]}

    remove_json = {
        "query": """mutation removeTerm($input: TermAssociationInput!) {\n
            removeTerm(input: $input)
        }""",
        "variables": {
            "input": {
              "termUrn": "urn:li:glossaryTerm:SavingAccount",
              "resourceUrn": dataset_urn,
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=remove_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["removeTerm"] is True
    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["glossaryTerms"] == {'terms': []}


@pytest.mark.dependency(depends=["test_healthchecks", "test_run_ingestion"])
def test_update_schemafield(frontend_session):
    platform = "urn:li:dataPlatform:kafka"
    dataset_name = (
        "SampleKafkaDataset"
    )
    env = "PROD"
    dataset_urn = f"urn:li:dataset:({platform},{dataset_name},{env})"

    dataset_schema_json_terms = {
        "query": """query getDataset($urn: String!) {\n
            dataset(urn: $urn) {\n
                urn\n
                name\n
                description\n
                platform {\n
                    urn\n
                }\n
                editableSchemaMetadata {\n
                    editableSchemaFieldInfo {\n
                        glossaryTerms {\n
                            terms {\n
                                term {\n
                                    urn\n
                                    name\n
                                }\n
                            }\n
                        }\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": dataset_urn
        }
    }

    dataset_schema_json_tags  = {
        "query": """query getDataset($urn: String!) {\n
            dataset(urn: $urn) {\n
                urn\n
                name\n
                description\n
                platform {\n
                    urn\n
                }\n
                editableSchemaMetadata {\n
                    editableSchemaFieldInfo {\n
                        globalTags {\n
                            tags {\n
                                tag {\n
                                    urn\n
                                    name\n
                                    description\n
                                }\n
                            }\n
                        }\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": dataset_urn
        }
    }

    dataset_schema_json_description  = {
        "query": """query getDataset($urn: String!) {\n
            dataset(urn: $urn) {\n
                urn\n
                name\n
                description\n
                platform {\n
                    urn\n
                }\n
                editableSchemaMetadata {\n
                    editableSchemaFieldInfo {\n
                      description\n
                    }\n
                }\n
            }\n
        }""",
        "variables": {
            "urn": dataset_urn
        }
    }

    # dataset schema tags
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_tags
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == None

    add_json = {
        "query": """mutation addTag($input: TagAssociationInput!) {\n
            addTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": dataset_urn,
              "subResource": "[version=2.0].[type=boolean].field_bar",
              "subResourceType": "DATASET_FIELD"
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=add_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["addTag"] is True

    # Refetch the dataset schema
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_tags
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{'globalTags': {'tags': [{'tag': {'description': 'Indicates the dataset is no longer supported', 'name': 'Legacy', 'urn': 'urn:li:tag:Legacy'}}]}}]}

    remove_json = {
        "query": """mutation removeTag($input: TagAssociationInput!) {\n
            removeTag(input: $input)
        }""",
        "variables": {
            "input": {
              "tagUrn": "urn:li:tag:Legacy",
              "resourceUrn": dataset_urn,
              "subResource": "[version=2.0].[type=boolean].field_bar",
              "subResourceType": "DATASET_FIELD"
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=remove_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["removeTag"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_tags
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{'globalTags': {'tags': []}}]}

    add_json = {
        "query": """mutation addTerm($input: TermAssociationInput!) {\n
            addTerm(input: $input)
        }""",
        "variables": {
            "input": {
              "termUrn": "urn:li:glossaryTerm:SavingAccount",
              "resourceUrn": dataset_urn,
              "subResource": "[version=2.0].[type=boolean].field_bar",
              "subResourceType": "DATASET_FIELD"
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=add_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["addTerm"] is True

    # Refetch the dataset schema
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_terms
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{'glossaryTerms': {'terms': [{'term': {'name': 'SavingAccount', 'urn': 'urn:li:glossaryTerm:SavingAccount'}}]}}]}

    remove_json = {
        "query": """mutation removeTerm($input: TermAssociationInput!) {\n
            removeTerm(input: $input)
        }""",
        "variables": {
            "input": {
              "termUrn": "urn:li:glossaryTerm:SavingAccount",
              "resourceUrn": dataset_urn,
              "subResource": "[version=2.0].[type=boolean].field_bar",
              "subResourceType": "DATASET_FIELD"
            }
        }
    }

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=remove_json
    )
    response.raise_for_status()
    res_data = response.json()

    print(res_data)

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["removeTerm"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_terms
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{'glossaryTerms': {'terms': []}}]}

    # dataset schema tags
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_tags
    )
    response.raise_for_status()
    res_data = response.json()

    update_description_json = {
        "query": """mutation updateDescription($input: DescriptionUpdateInput!) {\n
            updateDescription(input: $input)
        }""",
        "variables": {
            "input": {
              "description": "new description",
              "resourceUrn": dataset_urn,
              "subResource": "[version=2.0].[type=boolean].field_bar",
              "subResourceType": "DATASET_FIELD"
            }
        }
    }

    # fetch no description
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_description
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{ 'description': None }]}

    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=update_description_json
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["updateDescription"] is True

    # Refetch the dataset
    response = frontend_session.post(
        f"{FRONTEND_ENDPOINT}/api/v2/graphql", json=dataset_schema_json_description
    )
    response.raise_for_status()
    res_data = response.json()

    assert res_data
    assert res_data["data"]
    assert res_data["data"]["dataset"]
    assert res_data["data"]["dataset"]["editableSchemaMetadata"] == {'editableSchemaFieldInfo': [{'description': 'new description'}]}