import json
import subprocess
import time
from typing import Optional

import pytest
from freezegun import freeze_time

from tests.test_helpers import mce_helpers
from tests.test_helpers.click_helpers import run_datahub_cmd
from tests.test_helpers.docker_helpers import wait_for_port

FROZEN_TIME = "2020-04-14 07:00:00"

# pytestmark = pytest.mark.skip(
#     reason="Vertica tests are disabled due to a dependency conflict with SQLAlchemy 1.3.24"
# )


def generalization(tmp_path):
    with open(tmp_path / "vertica.json", "r+") as file:
        jsonObject = json.load(file)
        file.close()

    with open(tmp_path / "vertica.json", "w+") as file:
        for object in jsonObject:
            recursionObj(object)
        json.dump(jsonObject, file, indent=4)
        file.close()


def recursionObj(object):
    for key, value in object.items():
        if key == "create_time":
            object[key] = "0"
        elif type(value) == dict:
            recursionObj(value)
        elif type(value) == list:
            recursionList(value)


def recursionList(arr):
    for i in arr:
        if type(i) == dict:
            recursionObj(i)


@pytest.fixture(scope="module")
def test_resources_dir(pytestconfig):
    return pytestconfig.rootpath / "tests/integration/vertica"


def is_vertica_responsive(
    container_name: str, port: int, hostname: Optional[str]
) -> bool:
    if hostname:
        cmd = f"docker logs {container_name} 2>&1 | grep 'Vertica is now running' "
    ret = subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL)

    return ret.returncode == 0


@pytest.fixture(scope="module")
def vertica_runner(docker_compose_runner, test_resources_dir):
    with docker_compose_runner(
        test_resources_dir / "docker-compose.yml", "vertica"
    ) as docker_services:
        wait_for_port(
            docker_services,
            "vertica-ce",
            5433,
            timeout=120,
            checker=lambda: is_vertica_responsive(
                "vertica-ce", 5433, hostname="vertica-ce"
            ),
        )

        commands = """
                    docker cp tests/integration/vertica/ddl.sql vertica-ce:/home/dbadmin/ &&
                    docker exec vertica-ce sh -c "/opt/vertica/bin/vsql -w abc123 -f /home/dbadmin/ddl.sql &&
                    sudo yum install git -y &&
                    cd /opt && sudo git clone https://github.com/vertica/Machine-Learning-Examples &&
                    sudo chmod -R a+rwx /opt/Machine-Learning-Examples &&
                    cd /opt/Machine-Learning-Examples/data && /opt/vertica/bin/vsql -w abc123 -f load_ml_data.sql &&
                    cd .. &&
                    /opt/vertica/bin/vsql -w abc123 -f naive_bayes/naive_bayes_data_preparation.sql &&
                    /opt/vertica/bin/vsql -w abc123 -f naive_bayes/naivebayes_examples.sql &&
                """

        ret = subprocess.run(commands, shell=True, stdout=subprocess.DEVNULL)
        # waiting for vertica to create default table and system table and ml models
        time.sleep(60)

        assert ret.returncode == 1

        yield docker_services


# Test needs more work to be done , currently it is working fine.
@freeze_time(FROZEN_TIME)
@pytest.mark.integration
def test_vertica_ingest_with_db(vertica_runner, pytestconfig, tmp_path):
    test_resources_dir = pytestconfig.rootpath / "tests/integration/vertica"

    # Run the metadata ingestion pipeline.
    config_file = (test_resources_dir / "vertica_to_file.yml").resolve()
    run_datahub_cmd(
        ["ingest", "--strict-warnings", "-c", f"{config_file}"], tmp_path=tmp_path
    )

    # using recursion to read vertica.json and replace value of create_time to 0
    # while using --update-golden-files please change value of create_time to 0 in golden file .
    generalization(tmp_path)

    # Verify the output.
    mce_helpers.check_golden_file(
        pytestconfig,
        output_path=tmp_path / "vertica.json",
        golden_path=test_resources_dir / "vertica_mces_with_db_golden.json",
    )
