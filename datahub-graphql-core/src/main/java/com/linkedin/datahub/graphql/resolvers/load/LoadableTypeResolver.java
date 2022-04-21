package com.linkedin.datahub.graphql.resolvers.load;

import com.linkedin.datahub.graphql.types.LoadableType;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.dataloader.DataLoader;

import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

/**
 * Generic GraphQL resolver responsible for
 *
 *    1. Retrieving a single input urn.
 *    2. Resolving a single {@link LoadableType}.
 *
 *  Note that this resolver expects that {@link DataLoader}s were registered
 *  for the provided {@link LoadableType} under the name provided by {@link LoadableType#name()}
 *
 * @param <T> the generated GraphQL POJO corresponding to the resolved type.
 */
public class LoadableTypeResolver<T, K> implements DataFetcher<CompletableFuture<T>> {

    private final LoadableType<T, K> _loadableType;
    private final Function<DataFetchingEnvironment, K> _keyProvider;

    public LoadableTypeResolver(final LoadableType<T, K> loadableType, final Function<DataFetchingEnvironment, K> keyProvider) {
        _loadableType = loadableType;
        _keyProvider = keyProvider;
    }

    @Override
    public CompletableFuture<T> get(DataFetchingEnvironment environment) {
        final K urn = _keyProvider.apply(environment);
        if (urn == null) {
            return null;
        }
        final DataLoader<K, T> loader = environment.getDataLoaderRegistry().getDataLoader(_loadableType.name());
        return loader.load(urn);
    }
}
