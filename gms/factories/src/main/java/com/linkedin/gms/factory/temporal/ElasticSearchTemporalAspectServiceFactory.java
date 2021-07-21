package com.linkedin.gms.factory.temporal;

import com.linkedin.gms.factory.common.IndexConventionFactory;
import com.linkedin.gms.factory.common.RestHighLevelClientFactory;
import com.linkedin.gms.factory.entityregistry.EntityRegistryFactory;
import com.linkedin.metadata.models.registry.EntityRegistry;
import com.linkedin.metadata.temporal.elastic.ElasticSearchTemporalAspectService;
import com.linkedin.metadata.temporal.elastic.indexbuilder.TemporalAspectIndexBuilders;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import javax.annotation.Nonnull;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;


@Configuration
@Import({RestHighLevelClientFactory.class, IndexConventionFactory.class, EntityRegistryFactory.class})
public class ElasticSearchTemporalAspectServiceFactory {
  @Autowired
  @Qualifier("elasticSearchRestHighLevelClient")
  private RestHighLevelClient searchClient;

  @Autowired
  @Qualifier(IndexConventionFactory.INDEX_CONVENTION_BEAN)
  private IndexConvention indexConvention;

  @Autowired
  @Qualifier("entityRegistry")
  private EntityRegistry entityRegistry;

  @Value("${ES_BULK_REQUESTS_LIMIT:1}")
  private Integer bulkRequestsLimit;

  @Value("${ES_BULK_FLUSH_PERIOD:1}")
  private Integer bulkFlushPeriod;

  @Value("${ES_BULK_NUM_RETRIES:3}")
  private Integer numRetries;

  @Value("${ES_BULK_RETRY_INTERVAL:1}")
  private Long retryInterval;

  @Bean(name = "elasticSearchTemporalAspectService")
  @Nonnull
  protected ElasticSearchTemporalAspectService getInstance() {
    return new ElasticSearchTemporalAspectService(searchClient, indexConvention,
        new TemporalAspectIndexBuilders(entityRegistry, searchClient, indexConvention), bulkRequestsLimit,
        bulkFlushPeriod, numRetries, retryInterval);
  }
}