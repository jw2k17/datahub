package com.linkedin.gms.factory.usage;

import com.datahub.authentication.Authentication;
import com.linkedin.gms.factory.config.ConfigurationProvider;
import com.linkedin.metadata.spring.YamlPropertySourceFactory;
import com.linkedin.metadata.restli.DefaultRestliClientFactory;
import com.linkedin.parseq.retry.backoff.ExponentialBackoff;
import com.linkedin.restli.client.Client;
import com.linkedin.usage.UsageClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


@Configuration
@PropertySource(value = "classpath:/application.yml", factory = YamlPropertySourceFactory.class)
public class UsageClientFactory {

  @Value("${DATAHUB_GMS_HOST:localhost}")
  private String gmsHost;

  @Value("${DATAHUB_GMS_PORT:8080}")
  private int gmsPort;

  @Value("${DATAHUB_GMS_USE_SSL:false}")
  private boolean gmsUseSSL;

  @Value("${DATAHUB_GMS_SSL_PROTOCOL:#{null}}")
  private String gmsSslProtocol;

  @Value("${usageClient.retryInterval:2}")
  private int retryInterval;

  @Value("${usageClient.numRetries:3}")
  private int numRetries;

  @Autowired
  @Qualifier("configurationProvider")
  private ConfigurationProvider configurationProvider;

  @Bean("usageClient")
  public UsageClient getUsageClient(@Qualifier("systemAuthentication") final Authentication systemAuthentication) {
    Client restClient = DefaultRestliClientFactory.getRestLiClient(gmsHost, gmsPort, gmsUseSSL, gmsSslProtocol);
    return new UsageClient(restClient, new ExponentialBackoff(retryInterval), numRetries, systemAuthentication,
            configurationProvider.getCache().getClient().getUsageClient());
  }
}

