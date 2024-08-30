package com.linkedin.datahub.upgrade.config;

import com.linkedin.datahub.upgrade.system.NonBlockingSystemUpgrade;
import com.linkedin.datahub.upgrade.system.dataprocessinstances.BackfillDataProcessInstances;
import com.linkedin.metadata.entity.EntityService;
import com.linkedin.metadata.search.elasticsearch.ElasticSearchService;
import io.datahubproject.metadata.context.OperationContext;
import org.opensearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
@Conditional(SystemUpdateCondition.NonBlockingSystemUpdateCondition.class)
public class BackfillDataProcessInstancesConfig {

  @Bean
  public NonBlockingSystemUpgrade backfillProcessInstancesHasRunEvents(
      final OperationContext opContext,
      EntityService<?> entityService,
      ElasticSearchService elasticSearchService,
      RestHighLevelClient restHighLevelClient,
      @Value("${systemUpdate.processInstanceHasRunEvents.enabled}") final boolean enabled,
      @Value("${systemUpdate.processInstanceHasRunEvents.batchSize}") final Integer batchSize) {
    return new BackfillDataProcessInstances(
        opContext, entityService, elasticSearchService, restHighLevelClient, enabled, batchSize);
  }
}
