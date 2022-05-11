package com.linkedin.metadata.entity;

import com.linkedin.common.urn.Urn;
import com.linkedin.metadata.entity.aspect.EntityAspect;
import com.linkedin.metadata.entity.aspect.UniqueKey;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

public interface AspectDao {

    @Nullable
    EntityAspect getAspect(@Nonnull final String urn, @Nonnull final String aspectName, final long version);

    @Nullable
    EntityAspect getAspect(@Nonnull final UniqueKey key);

    @Nonnull
    Map<UniqueKey, EntityAspect> batchGet(@Nonnull final Set<UniqueKey> keys);

    @Nonnull
    List<EntityAspect> getAspectsInRange(@Nonnull Urn urn, Set<String> aspectNames, long startTimeMillis, long endTimeMillis);

    @Nullable
    EntityAspect getLatestAspect(@Nonnull final String urn, @Nonnull final String aspectName);

    void saveAspect(
        @Nonnull final String urn,
        @Nonnull final String aspectName,
        @Nonnull final String aspectMetadata,
        @Nonnull final String actor,
        @Nullable final String impersonator,
        @Nonnull final Timestamp timestamp,
        @Nonnull final String systemMetadata,
        final long version,
        final boolean insert);

    void saveAspect(@Nonnull final EntityAspect aspect, final boolean insert);

    long saveLatestAspect(
        @Nonnull final String urn,
        @Nonnull final String aspectName,
        @Nullable final String oldAspectMetadata,
        @Nullable final String oldActor,
        @Nullable final String oldImpersonator,
        @Nullable final Timestamp oldTime,
        @Nullable final String oldSystemMetadata,
        @Nonnull final String newAspectMetadata,
        @Nonnull final String newActor,
        @Nullable final String newImpersonator,
        @Nonnull final Timestamp newTime,
        @Nullable final String newSystemMetadata,
        final Long nextVersion);

    boolean deleteAspect(@Nonnull final EntityAspect aspect);

    @Nonnull
    ListResult<String> listUrns(
        @Nonnull final String entityName,
        @Nonnull final String aspectName,
        final int start,
        final int pageSize);

    int deleteUrn(@Nonnull final String urn);

    @Nonnull
    ListResult<String> listLatestAspectMetadata(
        @Nonnull final String entityName,
        @Nonnull final String aspectName,
        final int start,
        final int pageSize);

    @Nonnull
    ListResult<String> listAspectMetadata(
        @Nonnull final String entityName,
        @Nonnull final String aspectName,
        final long version,
        final int start,
        final int pageSize);

    long getNextVersion(@Nonnull final String urn, @Nonnull final String aspectName);

    Map<String, Long> getNextVersions(@Nonnull final String urn, @Nonnull final Set<String> aspectNames);

    long getMaxVersion(@Nonnull final String urn, @Nonnull final String aspectName);

    void setWritable(boolean canWrite);

    // TODO: probably remove. Only used in tests
    void setConnectionValidated(boolean validated);

    @Nonnull
    <T> T runInTransactionWithRetry(@Nonnull final Supplier<T> block, final int maxTransactionRetry);
}
