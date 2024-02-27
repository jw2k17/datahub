package com.linkedin.datahub.graphql.resolvers.load;

import static com.linkedin.datahub.graphql.resolvers.ResolverUtils.*;

import com.linkedin.common.urn.Urn;
import com.linkedin.common.urn.UrnUtils;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.authorization.AuthorizationUtils;
import com.linkedin.datahub.graphql.generated.Entity;
import com.linkedin.datahub.graphql.generated.EntityLineageResult;
import com.linkedin.datahub.graphql.generated.EntityType;
import com.linkedin.datahub.graphql.generated.LineageDirection;
import com.linkedin.datahub.graphql.generated.LineageInput;
import com.linkedin.datahub.graphql.generated.LineageRelationship;
import com.linkedin.datahub.graphql.generated.Restricted;
import com.linkedin.datahub.graphql.types.common.mappers.UrnToEntityMapper;
import com.linkedin.metadata.Constants;
import com.linkedin.metadata.graph.SiblingGraphService;
import com.linkedin.metadata.service.RestrictedService;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;

/**
 * GraphQL Resolver responsible for fetching lineage relationships between entities in the DataHub
 * graph. Lineage relationship denotes whether an entity is directly upstream or downstream of
 * another entity
 */
@Slf4j
public class EntityLineageResultResolver
    implements DataFetcher<CompletableFuture<EntityLineageResult>> {

  private final SiblingGraphService _siblingGraphService;
  private final RestrictedService _restrictedService;

  public EntityLineageResultResolver(final SiblingGraphService siblingGraphService, final RestrictedService restrictedService) {
    _siblingGraphService = siblingGraphService;
    _restrictedService = restrictedService;
  }

  @Override
  public CompletableFuture<EntityLineageResult> get(DataFetchingEnvironment environment) {
    final QueryContext context = environment.getContext();
    Urn urn = UrnUtils.getUrn(((Entity) environment.getSource()).getUrn());
    final LineageInput input = bindArgument(environment.getArgument("input"), LineageInput.class);

    if (urn.getEntityType().equals(Constants.RESTRICTED_ENTITY_NAME)) {
      urn = _restrictedService.decryptRestrictedUrn(urn);
    }

    final LineageDirection lineageDirection = input.getDirection();
    @Nullable final Integer start = input.getStart(); // Optional!
    @Nullable final Integer count = input.getCount(); // Optional!
    @Nullable final Boolean separateSiblings = input.getSeparateSiblings(); // Optional!
    @Nullable final Long startTimeMillis = input.getStartTimeMillis(); // Optional!
    @Nullable final Long endTimeMillis = input.getEndTimeMillis(); // Optional!

    com.linkedin.metadata.graph.LineageDirection resolvedDirection =
        com.linkedin.metadata.graph.LineageDirection.valueOf(lineageDirection.toString());

    final Urn finalUrn = urn;
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            com.linkedin.metadata.graph.EntityLineageResult entityLineageResult = _siblingGraphService.getLineage(
                finalUrn,
                resolvedDirection,
                start != null ? start : 0,
                count != null ? count : 100,
                1,
                separateSiblings != null ? input.getSeparateSiblings() : false,
                new HashSet<>(),
                startTimeMillis,
                endTimeMillis);

              Set<Urn> restrictedUrns = new HashSet<>();
              entityLineageResult.getRelationships().forEach(rel -> {
                // check flag here
                if (!AuthorizationUtils.canViewEntity(rel.getEntity(), context)) {
                  restrictedUrns.add(rel.getEntity());
                }
              });

              return mapEntityRelationships(entityLineageResult, restrictedUrns);
          } catch (Exception e) {
            log.error("Failed to fetch lineage for {}", finalUrn);
            throw new RuntimeException(String.format("Failed to fetch lineage for {}", finalUrn), e);
          }
        });
  }

  private EntityLineageResult mapEntityRelationships(
      final com.linkedin.metadata.graph.EntityLineageResult entityLineageResult, final Set<Urn> restrictedUrns) {
    final EntityLineageResult result = new EntityLineageResult();
    result.setStart(entityLineageResult.getStart());
    result.setCount(entityLineageResult.getCount());
    result.setTotal(entityLineageResult.getTotal());
    result.setFiltered(entityLineageResult.getFiltered());
    result.setRelationships(
        entityLineageResult.getRelationships().stream()
            .map(r -> mapEntityRelationship(r, restrictedUrns))
            .collect(Collectors.toList()));
    return result;
  }

  private LineageRelationship mapEntityRelationship(
      final com.linkedin.metadata.graph.LineageRelationship lineageRelationship, final Set<Urn> restrictedUrns) {
    final LineageRelationship result = new LineageRelationship();
    if (restrictedUrns.contains(lineageRelationship.getEntity())) {
      final Restricted restrictedEntity = new Restricted();
      restrictedEntity.setType(EntityType.RESTRICTED);
      String restrictedUrnString = _restrictedService.encryptRestrictedUrn(lineageRelationship.getEntity()).toString();

      restrictedEntity.setUrn(restrictedUrnString);
      result.setEntity(restrictedEntity);
    } else {
      final Entity partialEntity = UrnToEntityMapper.map(lineageRelationship.getEntity());
      if (partialEntity != null) {
        result.setEntity(partialEntity);
      }
    }
    result.setType(lineageRelationship.getType());
    result.setDegree(lineageRelationship.getDegree());
    if (lineageRelationship.hasCreatedOn()) {
      result.setCreatedOn(lineageRelationship.getCreatedOn());
    }
    if (lineageRelationship.hasCreatedActor()) {
      final Urn createdActor = lineageRelationship.getCreatedActor();
      result.setCreatedActor(UrnToEntityMapper.map(createdActor));
    }
    if (lineageRelationship.hasUpdatedOn()) {
      result.setUpdatedOn(lineageRelationship.getUpdatedOn());
    }
    if (lineageRelationship.hasUpdatedActor()) {
      final Urn updatedActor = lineageRelationship.getUpdatedActor();
      result.setUpdatedActor(UrnToEntityMapper.map(updatedActor));
    }
    result.setIsManual(lineageRelationship.hasIsManual() && lineageRelationship.isIsManual());

    return result;
  }
}
