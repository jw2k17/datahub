#!/bin/sh

# Add default URI (http) scheme if needed
if ! echo $NEO4J_HOST | grep -q "://" ; then
    NEO4J_HOST="http://$NEO4J_HOST"
fi

if [[ -z $ELASTICSEARCH_USERNAME ]]; then
    ELASTICSEARCH_HOST_URL=$ELASTICSEARCH_HOST
else
  if [[ -z $ELASTICSEARCH_AUTH_HEADER ]]; then
    ELASTICSEARCH_HOST_URL=$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD@$ELASTICSEARCH_HOST
  else
    ELASTICSEARCH_HOST_URL=$ELASTICSEARCH_HOST
  fi
fi

# Add default header if needed
if [[ -z $ELASTICSEARCH_AUTH_HEADER ]]; then
    ELASTICSEARCH_AUTH_HEADER="Accept: */*"
fi

if [[ $ELASTICSEARCH_USE_SSL == true ]]; then
    ELASTICSEARCH_PROTOCOL=https
else
    ELASTICSEARCH_PROTOCOL=http
fi

if [[ $GRAPH_SERVICE_IMPL != elasticsearch ]]; then
    dockerize \
      -wait tcp://$(echo $KAFKA_BOOTSTRAP_SERVER | sed 's/,/ -wait tcp:\/\//g') \
      -wait $ELASTICSEARCH_PROTOCOL://$ELASTICSEARCH_HOST_URL:$ELASTICSEARCH_PORT -wait-http-header "$ELASTICSEARCH_AUTH_HEADER" \
      -wait $NEO4J_HOST \
      -timeout 240s \
      java $JAVA_OPTS $JMX_OPTS -jar /datahub/datahub-mae-consumer/bin/mae-consumer-job.jar
else
    dockerize \
      -wait tcp://$(echo $KAFKA_BOOTSTRAP_SERVER | sed 's/,/ -wait tcp:\/\//g') \
      -wait $ELASTICSEARCH_PROTOCOL://$ELASTICSEARCH_HOST_URL:$ELASTICSEARCH_PORT -wait-http-header "$ELASTICSEARCH_AUTH_HEADER" \
      -timeout 240s \
      java $JAVA_OPTS $JMX_OPTS -jar /datahub/datahub-mae-consumer/bin/mae-consumer-job.jar
fi
