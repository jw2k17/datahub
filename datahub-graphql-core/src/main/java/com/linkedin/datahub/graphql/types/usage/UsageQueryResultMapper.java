package com.linkedin.datahub.graphql.types.usage;

import com.linkedin.datahub.graphql.generated.UsageQueryResult;
import com.linkedin.datahub.graphql.types.mappers.ModelMapper;
import javax.annotation.Nonnull;


public class UsageQueryResultMapper implements ModelMapper<com.linkedin.usage.UsageQueryResult, UsageQueryResult> {

  public static final UsageQueryResultMapper INSTANCE = new UsageQueryResultMapper();

  public static UsageQueryResult map(@Nonnull final com.linkedin.usage.UsageQueryResult pdlUsageResult) {
    return INSTANCE.apply(pdlUsageResult);
  }

  @Override
  public UsageQueryResult apply(@Nonnull final com.linkedin.usage.UsageQueryResult pdlUsageResult) {
    UsageQueryResult result = new UsageQueryResult();
    result.setAggregations(pdlUsageResult.getAggregations());
    result.setBuckets(pdlUsageResult.getBuckets());
  }
}
