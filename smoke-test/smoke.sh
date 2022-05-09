#!/bin/bash
set -euxo pipefail

# Runs a basic e2e test. It is not meant to be fully comprehensive,
# but rather should catch obvious bugs before they make it into prod.
#
# Script assumptions:
#   - The gradle build has already been run.
#   - Python 3.6+ is installed and in the PATH.

docker images | grep datahub-
docker images | grep elastic
docker images | grep kafka

exit 0

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip wheel setuptools
pip install -r requirements.txt

# --build-locally \
echo "DATAHUB_VERSION = $DATAHUB_VERSION"
datahub docker quickstart \
	--quickstart-compose-file ../docker/docker-compose-without-neo4j.yml \
	--quickstart-compose-file ../docker/docker-compose-without-neo4j.override.yml \
	--quickstart-compose-file ../docker/docker-compose.dev.yml \
	--dump-logs-on-failure

(cd tests/cypress ; yarn install)

pytest -vv --continue-on-collection-errors --junit-xml=junit.smoke.xml
