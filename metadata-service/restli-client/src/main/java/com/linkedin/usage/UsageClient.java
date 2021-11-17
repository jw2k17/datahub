package com.linkedin.usage;

import com.linkedin.common.EntityRelationships;

import com.linkedin.common.WindowDuration;
import com.linkedin.common.client.BaseClient;
import com.linkedin.r2.RemoteInvocationException;
import com.linkedin.restli.client.Client;
import java.net.URISyntaxException;
import javax.annotation.Nonnull;


public class UsageClient extends BaseClient {

    private static final UsageStatsRequestBuilders USAGE_STATS_REQUEST_BUILDERS =
        new UsageStatsRequestBuilders();


    public UsageClient(@Nonnull final Client restliClient) {
        this(restliClient, null, null);
    }

    public UsageClient(@Nonnull final Client restliClient, String systemClientId, String systemSecret) {
        super(restliClient, systemClientId, systemSecret);
    }

    /**
     * Gets a specific version of downstream {@link EntityRelationships} for the given dataset.
     */
    @Nonnull
    public UsageQueryResult getUsageStats(
        @Nonnull String resource,
        @Nonnull UsageTimeRange range,
        @Nonnull String actor
    ) throws RemoteInvocationException, URISyntaxException {
        final UsageStatsDoQueryRangeRequestBuilder requestBuilder = USAGE_STATS_REQUEST_BUILDERS.actionQueryRange()
            .resourceParam(resource)
            .durationParam(WindowDuration.DAY)
            .rangeFromEndParam(range);
        return sendClientRequest(requestBuilder, actor).getEntity();
    }
}
