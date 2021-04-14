package com.linkedin.datahub.graphql.resolvers.load;

import com.google.common.collect.Iterables;
import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.generated.Entity;
import com.linkedin.datahub.graphql.generated.EntityType;
import com.linkedin.datahub.graphql.types.LoadableType;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.dataloader.DataLoader;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * GraphQL resolver responsible for
 *
 *    1. Retrieving a single input urn.
 *    2. Resolving a single Entity
 *
 *  Note that this resolver expects that {@link DataLoader}s were registered
 *  for the all the {@link LoadableType}s that
 *
 */
public class EntityTypeResolver implements DataFetcher<CompletableFuture<Entity>> {

    private final List<com.linkedin.datahub.graphql.types.EntityType<?>> _entityTypes;
    private final Function<DataFetchingEnvironment, Entity> _entityProvider;

    public EntityTypeResolver(final List<com.linkedin.datahub.graphql.types.EntityType<?>> entityTypes, final Function<DataFetchingEnvironment, Entity> entity) {
        _entityTypes = entityTypes;
        _entityProvider = entity;
    }

    @Override
    public CompletableFuture get(DataFetchingEnvironment environment) {
        final String urn = _entityProvider.apply(environment).getUrn();
        final Object javaObject = _entityProvider.apply(environment);
        final com.linkedin.datahub.graphql.types.EntityType<?> filteredEntity = Iterables.getOnlyElement(_entityTypes.stream()
                .filter(entity -> javaObject.getClass().isAssignableFrom(entity.objectClass()))
                .collect(Collectors.toList()));
        final DataLoader<String, Entity> loader = environment.getDataLoaderRegistry().getDataLoader(filteredEntity.name());
        return loader.load(urn);
    }
}
