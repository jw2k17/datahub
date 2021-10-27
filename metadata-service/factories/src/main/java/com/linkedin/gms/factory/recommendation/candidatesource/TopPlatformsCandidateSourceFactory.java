package com.linkedin.gms.factory.recommendation.candidatesource;

import com.linkedin.gms.factory.entity.EntityServiceFactory;
import com.linkedin.gms.factory.entityregistry.EntityRegistryFactory;
import com.linkedin.gms.factory.search.EntitySearchServiceFactory;
import com.linkedin.metadata.entity.EntityService;
import com.linkedin.metadata.models.registry.EntityRegistry;
import com.linkedin.metadata.recommendation.candidatesource.TopPlatformsSource;
import com.linkedin.metadata.search.EntitySearchService;
import javax.annotation.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;


@Configuration
@Import({EntityServiceFactory.class, EntitySearchServiceFactory.class, EntityRegistryFactory.class})
public class TopPlatformsCandidateSourceFactory {

  @Autowired
  @Qualifier("entityService")
  private EntityService entityService;

  @Autowired
  @Qualifier("entitySearchService")
  private EntitySearchService entitySearchService;

  @Autowired
  @Qualifier("entityRegistry")
  private EntityRegistry entityRegistry;

  @Autowired
  private CacheManager cacheManager;

  @Bean(name = "topPlatformsCandidateSource")
  @Nonnull
  protected TopPlatformsSource getInstance() {
    return new TopPlatformsSource(entityService, entitySearchService, entityRegistry, cacheManager);
  }
}
