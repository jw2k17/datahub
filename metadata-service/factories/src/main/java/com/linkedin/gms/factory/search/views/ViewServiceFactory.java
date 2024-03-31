package com.linkedin.gms.factory.search.views;

import com.linkedin.entity.client.SystemEntityClient;
import com.linkedin.metadata.service.ViewService;
import com.linkedin.metadata.spring.YamlPropertySourceFactory;
import javax.annotation.Nonnull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;

@Configuration
@PropertySource(value = "classpath:/application.yml", factory = YamlPropertySourceFactory.class)
public class ViewServiceFactory {

  @Bean(name = "viewService")
  @Scope("singleton")
  @Nonnull
  protected ViewService getInstance(final SystemEntityClient entityClient) throws Exception {
    return new ViewService(entityClient);
  }
}
