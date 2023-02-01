package com.linkedin.datahub.graphql.resolvers.search;

import com.linkedin.common.urn.UrnUtils;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.EntityType;
import com.linkedin.datahub.graphql.generated.ScrollAcrossEntitiesInput;
import com.linkedin.datahub.graphql.generated.ScrollResults;
import com.linkedin.datahub.graphql.resolvers.EntityTypeMapper;
import com.linkedin.datahub.graphql.resolvers.ResolverUtils;
import com.linkedin.datahub.graphql.types.mappers.UrnScrollResultsMapper;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.metadata.query.filter.Filter;
import com.linkedin.metadata.service.ViewService;
import com.linkedin.view.DataHubViewInfo;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.linkedin.datahub.graphql.resolvers.ResolverUtils.bindArgument;
import static com.linkedin.datahub.graphql.resolvers.search.SearchUtils.*;


/**
 * Resolver responsible for resolving 'searchAcrossEntities' field of the Query type
 */
@Slf4j
@RequiredArgsConstructor
public class ScrollAcrossEntitiesResolver implements DataFetcher<CompletableFuture<ScrollResults>> {

  private static final int DEFAULT_START = 0;
  private static final int DEFAULT_COUNT = 10;

  private final EntityClient _entityClient;
  private final ViewService _viewService;

  @Override
  public CompletableFuture<ScrollResults> get(DataFetchingEnvironment environment) {
    final QueryContext context = environment.getContext();
    final ScrollAcrossEntitiesInput input =
        bindArgument(environment.getArgument("input"), ScrollAcrossEntitiesInput.class);

    final List<EntityType> entityTypes =
        (input.getTypes() == null || input.getTypes().isEmpty()) ? SEARCHABLE_ENTITY_TYPES : input.getTypes();
    final List<String> entityNames = entityTypes.stream().map(EntityTypeMapper::getName).collect(Collectors.toList());

    // escape forward slash since it is a reserved character in Elasticsearch
    final String sanitizedQuery = ResolverUtils.escapeForwardSlash(input.getQuery());

    @Nullable
    final String scrollId = input.getScrollId();
    final int count = input.getCount() != null ? input.getCount() : DEFAULT_COUNT;

    return CompletableFuture.supplyAsync(() -> {

      final DataHubViewInfo maybeResolvedView = (input.getViewUrn() != null)
          ? resolveView(_viewService, UrnUtils.getUrn(input.getViewUrn()), context.getAuthentication())
          : null;

      final Filter baseFilter = ResolverUtils.buildFilter(null, input.getOrFilters());

      try {
        log.debug(
            "Executing search for multiple entities: entity types {}, query {}, filters: {}, scrollId: {}, count: {}",
            input.getTypes(), input.getQuery(), input.getOrFilters(), scrollId, count);
        String keepAlive = input.getKeepAlive() != null ? input.getKeepAlive() : "5m";

        return UrnScrollResultsMapper.map(_entityClient.scrollAcrossEntities(
            maybeResolvedView != null
                ? SearchUtils.intersectEntityTypes(entityNames, maybeResolvedView.getDefinition().getEntityTypes())
                : entityNames,
            sanitizedQuery,
            maybeResolvedView != null
                ? SearchUtils.combineFilters(baseFilter, maybeResolvedView.getDefinition().getFilter())
                : baseFilter,
            scrollId,
            keepAlive,
            count,
            ResolverUtils.getAuthentication(environment)));
      } catch (Exception e) {
        log.error(
            "Failed to execute search for multiple entities: entity types {}, query {}, filters: {}, searchAfter: {}, count: {}",
            input.getTypes(), input.getQuery(), input.getOrFilters(), scrollId, count);
        throw new RuntimeException(
            "Failed to execute search: " + String.format("entity types %s, query %s, filters: %s, start: %s, count: %s",
                input.getTypes(), input.getQuery(), input.getOrFilters(), scrollId, count), e);
      }
    });
  }
}
