package com.datahub.auth.authorization;

import com.datahub.auth.authorization.fieldresolverprovider.EntityTypeFieldResolverProvider;
import com.datahub.auth.authorization.fieldresolverprovider.OwnerFieldResolverProvider;
import com.datahub.authentication.Authentication;
import com.datahub.auth.authorization.fieldresolverprovider.DomainFieldResolverProvider;
import com.datahub.auth.authorization.fieldresolverprovider.EntityUrnFieldResolverProvider;
import com.datahub.auth.authorization.fieldresolverprovider.ResourceFieldResolverProvider;
import com.datahub.authorization.FieldResolver;
import com.datahub.authorization.ResolvedResourceSpec;
import com.datahub.authorization.ResourceFieldType;
import com.datahub.authorization.ResourceSpec;
import com.datahub.authorization.ResourceSpecResolver;
import com.google.common.collect.ImmutableList;
import com.linkedin.entity.client.EntityClient;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class DefaultResourceSpecResolver implements ResourceSpecResolver {
  private final List<ResourceFieldResolverProvider> _resourceFieldResolverProviders;

  public DefaultResourceSpecResolver(Authentication systemAuthentication, EntityClient entityClient) {
    _resourceFieldResolverProviders =
        ImmutableList.of(new EntityTypeFieldResolverProvider(), new EntityUrnFieldResolverProvider(),
            new DomainFieldResolverProvider(entityClient, systemAuthentication),
            new OwnerFieldResolverProvider(entityClient, systemAuthentication));
  }

  @Override
  public ResolvedResourceSpec resolve(ResourceSpec resourceSpec) {
    return new ResolvedResourceSpec(resourceSpec, getFieldResolvers(resourceSpec));
  }

  private Map<ResourceFieldType, FieldResolver> getFieldResolvers(ResourceSpec resourceSpec) {
    return _resourceFieldResolverProviders.stream()
        .collect(Collectors.toMap(ResourceFieldResolverProvider::getFieldType,
            hydrator -> hydrator.getFieldResolver(resourceSpec)));
  }
}
