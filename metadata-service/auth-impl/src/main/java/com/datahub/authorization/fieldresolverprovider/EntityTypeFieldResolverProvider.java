package com.datahub.authorization.fieldresolverprovider;

import com.datahub.authorization.FieldResolver;
import com.datahub.authorization.EntityFieldType;
import com.datahub.authorization.EntitySpec;
import com.datastax.oss.driver.shaded.guava.common.collect.ImmutableList;
import java.util.Collections;
import java.util.List;


/**
 * Provides field resolver for entity type given entitySpec
 */
public class EntityTypeFieldResolverProvider implements EntityFieldResolverProvider {
  @Override
  public EntityFieldType getFieldType() {
    return getFieldTypes().get(0);
  }

  @Override
  public List<EntityFieldType> getFieldTypes() {
    return ImmutableList.of(EntityFieldType.RESOURCE_TYPE, EntityFieldType.TYPE);
  }

  @Override
  public FieldResolver getFieldResolver(EntitySpec entitySpec) {
    return FieldResolver.getResolverFromValues(Collections.singleton(entitySpec.getType()));
  }
}
