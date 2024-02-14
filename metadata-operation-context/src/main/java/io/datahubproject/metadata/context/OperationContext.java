package io.datahubproject.metadata.context;

import com.datahub.authentication.Authentication;
import com.datahub.plugins.auth.authorization.Authorizer;
import com.google.common.collect.ImmutableSet;
import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.common.urn.UrnUtils;
import com.linkedin.metadata.models.registry.EntityRegistry;
import com.linkedin.metadata.query.SearchFlags;
import com.linkedin.metadata.utils.AuditStampUtils;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import java.util.Optional;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.Builder;
import lombok.Getter;

/**
 * These contexts define a read/write context which allows more flexibility when reading and writing
 * to various data stores. This context can be considered per **operation** and allows for
 * supporting database read replicas, mirroring or sharding across multiple databases/elasticsearch
 * instances, and separation of data at the storage level.
 *
 * <p>Different operations might also include different EntityRegistries
 *
 * <p>An integral part of the operation's context is additionally the user's identity and this
 * context encompasses the `Authentication` context.
 */
@Builder(toBuilder = true)
@Getter
public class OperationContext {

  /**
   * This should be the primary entry point when a request is made to Rest.li, OpenAPI, Graphql or
   * other service layers.
   *
   * <p>Copy the context from a system level context to a specific request/user context. Inheriting
   * all other contexts except for the sessionActor. Consider this a down leveling of the access.
   *
   * <p>This allows the context to contain system context such as elasticsearch and database
   * contexts which are inherited from the system.
   *
   * @param systemOperationContext the base operation context
   * @param sessionAuthentication the lower level authentication
   * @param allowSystemAuthentication whether the context is allowed to escalate as needed
   * @return the new context
   */
  public static OperationContext asSession(
      OperationContext systemOperationContext,
      @Nonnull Authorizer authorizer,
      @Nonnull Authentication sessionAuthentication,
      boolean allowSystemAuthentication) {
    return systemOperationContext.toBuilder()
        .operationContextConfig(
            // update allowed system authentication
            systemOperationContext.getOperationContextConfig().toBuilder()
                .allowSystemAuthentication(allowSystemAuthentication)
                .build())
        .build(
            systemOperationContext.getEntityRegistryContext().getEntityRegistry(),
            authorizer,
            sessionAuthentication);
  }

  public static OperationContext withSearchFlags(
      OperationContext opContext, @Nullable SearchFlags searchFlags) {
    return opContext.toBuilder()
        // update search flags for the request's session
        .searchContext(opContext.getSearchContext().toBuilder().searchFlags(searchFlags).build())
        .build(
            opContext.getEntityRegistryContext().getEntityRegistry(),
            opContext.getAuthorizerContext().getAuthorizer(),
            opContext.getSessionAuthentication());
  }

  /**
   * Set the system authentication object AND allow escalation of privilege for the session. This
   * OperationContext typically serves the default.
   *
   * <p>If you'd like to set the system authentication but not allow escalation, use the
   * systemActorContext() directly which does not reconfigure the escalation configuration.
   *
   * @param systemAuthentication the system authentication
   * @return builder
   */
  public static OperationContext asSystem(
      @Nonnull OperationContextConfig config,
      @Nonnull EntityRegistry entityRegistry,
      @Nonnull Authentication systemAuthentication,
      @Nonnull IndexConvention indexConvention) {

    ActorContext systemActorContext =
        ActorContext.builder()
            .systemAuthentication(true)
            .authentication(systemAuthentication)
            .build();
    OperationContextConfig systemConfig =
        config.toBuilder().allowSystemAuthentication(true).build();
    SearchContext systemSearchContext =
        SearchContext.builder().indexConvention(indexConvention).build();

    return OperationContext.builder()
        .operationContextConfig(systemConfig)
        .systemActorContext(systemActorContext)
        .searchContext(systemSearchContext)
        // Authorizer.EMPTY doesn't actually apply to system auth
        .build(entityRegistry, Authorizer.EMPTY, systemAuthentication);
  }

  @Nonnull private final OperationContextConfig operationContextConfig;
  @Nonnull private final ActorContext sessionActorContext;
  @Nullable private final ActorContext systemActorContext;
  @Nonnull private final SearchContext searchContext;
  @Nonnull private final AuthorizerContext authorizerContext;
  @Nonnull private final EntityRegistryContext entityRegistryContext;

  public OperationContext withSearchFlags(@Nonnull SearchFlags searchFlags) {
    return OperationContext.withSearchFlags(this, searchFlags);
  }

  public OperationContext asSession(
      @Nonnull Authorizer authorizer, @Nonnull Authentication sessionAuthentication) {
    return OperationContext.asSession(
        this,
        authorizer,
        sessionAuthentication,
        getOperationContextConfig().isAllowSystemAuthentication());
  }

  @Nonnull
  public EntityRegistry getEntityRegistry() {
    return getEntityRegistryContext().getEntityRegistry();
  }

  /**
   * Requests for a generic authentication should return the system first if allowed.
   *
   * @return an entity client
   */
  @Nonnull
  public ActorContext getActorContext() {
    if (operationContextConfig.isAllowSystemAuthentication() && systemActorContext != null) {
      return systemActorContext;
    } else {
      return sessionActorContext;
    }
  }

  /**
   * Requests for a generic authentication should return the system first if allowed.
   *
   * @return an entity client
   */
  public Authentication getAuthentication() {
    return getActorContext().getAuthentication();
  }

  public Authentication getSessionAuthentication() {
    return sessionActorContext.getAuthentication();
  }

  public Optional<Authentication> getSystemAuthentication() {
    return Optional.ofNullable(systemActorContext).map(ActorContext::getAuthentication);
  }

  /** AuditStamp prefer session authentication */
  public AuditStamp getAuditStamp(@Nullable Long currentTimeMs) {
    return AuditStampUtils.getAuditStamp(
        UrnUtils.getUrn(sessionActorContext.getAuthentication().getActor().toUrnStr()),
        currentTimeMs);
  }

  public AuditStamp getAuditStamp() {
    return getAuditStamp(null);
  }

  /**
   * Return a unique id for this context. Typically useful for building cache keys. We combine the
   * different context components to create a single string representation of the hashcode across
   * the contexts.
   *
   * @return id representing this context instance's unique identifier
   */
  public String getContextId() {
    return String.valueOf(
        ImmutableSet.of(getActorContext(), getSearchContext(), getEntityRegistryContext()).stream()
            .map(ContextInterface::getCacheKeyComponent)
            .filter(Optional::isPresent)
            .mapToInt(Optional::get)
            .sum());
  }

  public static class OperationContextBuilder {

    public OperationContext build(
        @Nonnull EntityRegistry entityRegistry,
        @Nonnull Authorizer authorizer,
        @Nonnull Authentication sessionAuthentication) {
      final Urn actorUrn = UrnUtils.getUrn(sessionAuthentication.getActor().toUrnStr());
      return new OperationContext(
          this.operationContextConfig,
          ActorContext.builder()
              .authentication(sessionAuthentication)
              .systemAuthentication(
                  this.systemActorContext != null
                      && this.systemActorContext.getAuthentication().equals(sessionAuthentication))
              .policyInfoSet(authorizer.getActorPolicies(actorUrn))
              .groupMembership(authorizer.getActorGroups(actorUrn))
              .build(),
          this.systemActorContext,
          this.searchContext,
          AuthorizerContext.builder().authorizer(authorizer).build(),
          EntityRegistryContext.builder().entityRegistry(entityRegistry).build());
    }

    private OperationContext build() {
      return null;
    }
  }
}
