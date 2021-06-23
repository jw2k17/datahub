package com.linkedin.datahub.graphql.resolvers.load;

import com.linkedin.datahub.graphql.UsageStatsKey;

import com.linkedin.datahub.graphql.generated.WindowDuration;
import com.linkedin.datahub.graphql.types.LoadableType;
import com.linkedin.pegasus2avro.usage.UsageQueryResult;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.util.concurrent.CompletableFuture;
import org.dataloader.DataLoader;


/**
 * Generic GraphQL resolver responsible for
 *
 *    1. Retrieving a single input urn.
 *    2. Resolving a single {@link LoadableType}.
 *
 *  Note that this resolver expects that {@link DataLoader}s were registered
 *  for the provided {@link LoadableType} under the name provided by {@link LoadableType#name()}
 *
 */
public class UsageTypeResolver implements DataFetcher<CompletableFuture<UsageQueryResult>> {

    @Override
    public CompletableFuture<UsageQueryResult> get(DataFetchingEnvironment environment) {
        final DataLoader<UsageStatsKey, UsageQueryResult> loader = environment.getDataLoaderRegistry().getDataLoader("UsageQueryResult");

        String resource = environment.getArgument("resource");
        WindowDuration duration = WindowDuration.valueOf(environment.getArgument("duration"));
        Long endTime = environment.getArgument("endTime");
        Long startTime = environment.getArgument("startTime");
        Integer maxBuckets = environment.getArgument("maxBuckets");

        UsageStatsKey key = new UsageStatsKey(resource, duration, endTime, startTime, maxBuckets);

        return loader.load(key);
    }
}
