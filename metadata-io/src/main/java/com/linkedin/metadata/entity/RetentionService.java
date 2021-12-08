package com.linkedin.metadata.entity;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.Constants;
import com.linkedin.metadata.key.DataHubRetentionKey;
import com.linkedin.metadata.utils.EntityKeyUtils;
import com.linkedin.retention.DataHubRetentionInfo;
import com.linkedin.retention.Retention;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.Value;


/**
 * Service coupled with an entity service to handle retention
 */
public abstract class RetentionService {
  private static final String ALL = "*";

  protected abstract EntityService getEntityService();

  /**
   * Fetch retention policies given the entityName and aspectName
   * Uses the entity service to fetch the latest retention policies set for the input entity and aspect
   *
   * @param entityName Name of the entity
   * @param aspectName Name of the aspect
   * @return retention policies to apply to the input entity and aspect
   */
  public List<Retention> getRetention(@Nonnull String entityName, @Nonnull String aspectName) {
    // Prioritized list of retention keys to fetch
    List<Urn> retentionUrns =
        ImmutableList.of(new DataHubRetentionKey().setEntityName(entityName).setAspectName(aspectName),
            new DataHubRetentionKey().setEntityName(entityName).setAspectName(ALL),
            new DataHubRetentionKey().setEntityName(ALL).setAspectName(aspectName),
            new DataHubRetentionKey().setEntityName(ALL).setAspectName(ALL))
            .stream()
            .map(key -> EntityKeyUtils.convertEntityKeyToUrn(key, "dataHubRetention"))
            .collect(Collectors.toList());
    Map<Urn, List<RecordTemplate>> fetchedAspects =
        getEntityService().getLatestAspects(new HashSet<>(retentionUrns), ImmutableSet.of("dataHubRetentionInfo"));
    // Find the first retention info that is set among the prioritized list of retention keys above
    Optional<DataHubRetentionInfo> retentionInfo = retentionUrns.stream()
        .flatMap(urn -> fetchedAspects.getOrDefault(urn, Collections.emptyList())
            .stream()
            .filter(aspect -> aspect instanceof DataHubRetentionInfo))
        .map(retention -> (DataHubRetentionInfo) retention)
        .findFirst();
    return retentionInfo.<List<Retention>>map(DataHubRetentionInfo::getRetentionPolicies).orElse(
        Collections.emptyList());
  }

  /**
   * Set retention policy for given entity and aspect. If entity or aspect names are null, the policy is set as default
   *
   * @param entityName Entity name to apply policy to. If empty, set as "*",
   *                   meaning it will be the default for any entities without specified policy
   * @param aspectName Aspect name to apply policy to. If empty, set as "*",
   *                   meaning it will be the default for any aspects without specified policy
   * @param retentionInfo Retention policy
   */
  public void setRetention(@Nullable String entityName, @Nullable String aspectName,
      @Nonnull DataHubRetentionInfo retentionInfo) {
    DataHubRetentionKey retentionKey = new DataHubRetentionKey();
    retentionKey.setEntityName(entityName != null ? entityName : ALL);
    retentionKey.setAspectName(aspectName != null ? aspectName : ALL);
    Urn retentionUrn = EntityKeyUtils.convertEntityKeyToUrn(retentionKey, "dataHubRetention");
    try {
      getEntityService().ingestAspect(retentionUrn, "dataHubRetentionInfo", retentionInfo,
          new AuditStamp().setActor(Urn.createFromString(Constants.SYSTEM_ACTOR)).setTime(System.currentTimeMillis()));
    } catch (URISyntaxException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * Apply retention policies given the urn and aspect name asynchronously
   *
   * @param urn Urn of the entity
   * @param aspectName Name of the aspect
   * @param context Additional context that could be used to apply retention
   */
  public void applyRetentionAsync(@Nonnull Urn urn, @Nonnull String aspectName, Optional<RetentionContext> context) {
    CompletableFuture.runAsync(() -> applyRetention(urn, aspectName, context));
  }

  /**
   * Apply retention policies given the urn and aspect name
   *
   * @param urn Urn of the entity
   * @param aspectName Name of the aspect
   * @param context Additional context that could be used to apply retention
   */
  public abstract void applyRetention(@Nonnull Urn urn, @Nonnull String aspectName, Optional<RetentionContext> context);

  @Value
  public static class RetentionContext {
    Optional<Long> maxVersion;
  }
}
