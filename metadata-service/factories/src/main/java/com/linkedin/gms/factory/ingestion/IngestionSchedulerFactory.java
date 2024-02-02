package com.linkedin.gms.factory.ingestion;

import com.datahub.metadata.ingestion.IngestionScheduler;
import com.linkedin.entity.client.SystemEntityClient;
import com.linkedin.gms.factory.auth.SystemAuthenticationFactory;
import com.linkedin.gms.factory.config.ConfigurationProvider;
import com.linkedin.metadata.spring.YamlPropertySourceFactory;
import javax.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;

@Import({SystemAuthenticationFactory.class})
@PropertySource(value = "classpath:/application.yml", factory = YamlPropertySourceFactory.class)
public class IngestionSchedulerFactory {

  @Autowired
  @Qualifier("configurationProvider")
  private ConfigurationProvider _configProvider;

  @Value("${ingestion.scheduler.delayIntervalSeconds:45}") // Boot up ingestion source cache after
  // waiting 45 seconds for startup.
  private Integer _delayIntervalSeconds;

  @Value("${ingestion.scheduler.refreshIntervalSeconds:43200}") // By default, refresh ingestion
  // sources 2 times per day.
  private Integer _refreshIntervalSeconds;

  @Bean(name = "ingestionScheduler")
  @Scope("singleton")
  @Nonnull
  protected IngestionScheduler getInstance(final SystemEntityClient entityClient) {
    return new IngestionScheduler(
        entityClient.getSystemAuthentication(),
        entityClient,
        _configProvider.getIngestion(),
        _delayIntervalSeconds,
        _refreshIntervalSeconds);
  }
}
