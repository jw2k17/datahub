package com.linkedin.metadata.kafka.config;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;


public class MetadataAuditEventsProcessorCondition implements Condition {
  @Override
  public boolean matches(
      ConditionContext context,
      AnnotatedTypeMetadata metadata) {
    Environment env = context.getEnvironment();
    return env != null
        && "SINGLE_NODE".equals(env.getProperty("GMS_MODE"));
  }
}
