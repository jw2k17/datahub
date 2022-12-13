package com.linkedin.metadata.kafka;

import com.linkedin.entity.client.RestliEntityClient;
import com.linkedin.metadata.entity.EntityService;
import com.linkedin.metadata.graph.SiblingGraphService;
import com.linkedin.metadata.models.registry.ConfigEntityRegistry;
import com.linkedin.metadata.models.registry.EntityRegistry;
import com.linkedin.metadata.restli.DefaultRestliClientFactory;
import com.linkedin.metadata.timeseries.elastic.ElasticSearchTimeseriesAspectService;
import com.linkedin.restli.client.Client;
import io.ebean.EbeanServer;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.net.URI;

@TestConfiguration
public class MceConsumerApplicationTestConfiguration {

    @Autowired
    private TestRestTemplate restTemplate;

    @Bean("entityService")
    @Primary
    public EntityService entityService() {
        return Mockito.mock(EntityService.class);
    }

    @Bean("restliEntityClient")
    @Primary
    public RestliEntityClient restliEntityClient() {
        String selfUri = restTemplate.getRootUri();
        final Client restClient = DefaultRestliClientFactory.getRestLiClient(URI.create(selfUri), null);
        return new RestliEntityClient(restClient);
    }

    @Bean
    @Primary
    public EbeanServer ebeanServer() {
        return Mockito.mock(EbeanServer.class);
    }

    @Bean(name = "elasticSearchTimeseriesAspectService")
    @Primary
    protected ElasticSearchTimeseriesAspectService elasticSearchTimeseriesAspectService() {
        return Mockito.mock(ElasticSearchTimeseriesAspectService.class);
    }

    @Bean("entityRegistry")
    @Primary
    protected EntityRegistry entityRegistry() {
        return Mockito.mock(EntityRegistry.class);
    }

    @Bean("configEntityRegistry")
    protected ConfigEntityRegistry configEntityRegistry() {
        return Mockito.mock(ConfigEntityRegistry.class);
    }

    @Bean("siblingGraphService")
    @Primary
    protected SiblingGraphService siblingGraphService() {
        return Mockito.mock(SiblingGraphService.class);
    }
}
