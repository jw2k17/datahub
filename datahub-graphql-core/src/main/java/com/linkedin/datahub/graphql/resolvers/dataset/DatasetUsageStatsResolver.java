package com.linkedin.datahub.graphql.resolvers.dataset;

import static com.linkedin.datahub.graphql.authorization.AuthorizationUtils.isViewDatasetUsageAuthorized;

import com.linkedin.common.urn.Urn;
import com.linkedin.common.urn.UrnUtils;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.Entity;
import com.linkedin.datahub.graphql.generated.UsageQueryResult;
import com.linkedin.datahub.graphql.types.usage.UsageQueryResultMapper;
import com.linkedin.usage.UsageClient;
import com.linkedin.usage.UsageTimeRange;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.util.concurrent.CompletableFuture;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DatasetUsageStatsResolver implements DataFetcher<CompletableFuture<UsageQueryResult>> {

  private final UsageClient usageClient;

  public DatasetUsageStatsResolver(final UsageClient usageClient) {
    this.usageClient = usageClient;
  }

  @Override
  public CompletableFuture<UsageQueryResult> get(DataFetchingEnvironment environment)
      throws Exception {
    final QueryContext context = environment.getContext();
    final Urn resourceUrn = UrnUtils.getUrn(((Entity) environment.getSource()).getUrn());
    final UsageTimeRange range = UsageTimeRange.valueOf(environment.getArgument("range"));

    return CompletableFuture.supplyAsync(
        () -> {
          if (!isViewDatasetUsageAuthorized(resourceUrn, context)) {
            log.debug(
                "User {} is not authorized to view usage information for dataset {}",
                context.getActorUrn(),
                resourceUrn.toString());
            return null;
          }
          try {
            com.linkedin.usage.UsageQueryResult usageQueryResult =
                usageClient.getUsageStats(resourceUrn.toString(), range);
            return UsageQueryResultMapper.map(usageQueryResult);
          } catch (Exception e) {
            throw new RuntimeException(
                String.format("Failed to load Usage Stats for resource %s", resourceUrn), e);
          }
        });
  }
}
