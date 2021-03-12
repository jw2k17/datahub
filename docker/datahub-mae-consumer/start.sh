#!/bin/sh

# Add default URI (http) scheme if needed
if ! echo $NEO4J_HOST | grep -q "://" ; then
    NEO4J_HOST="http://$NEO4J_HOST"
fi

dockerize \
  -wait tcp://$(echo $KAFKA_BOOTSTRAP_SERVER | sed 's/,/ -wait tcp:\/\//g') \
  -wait http://$ELASTICSEARCH_HOST:$ELASTICSEARCH_PORT \
  -wait $NEO4J_HOST \
  -timeout 240s \
  java -jar /datahub/datahub-mae-consumer/bin/mae-consumer-job.jar