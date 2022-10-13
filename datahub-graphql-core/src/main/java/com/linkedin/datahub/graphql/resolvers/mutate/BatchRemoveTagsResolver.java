package com.linkedin.datahub.graphql.resolvers.mutate;

import com.linkedin.common.urn.Urn;
import com.linkedin.common.urn.UrnUtils;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.exception.AuthorizationException;
import com.linkedin.datahub.graphql.generated.BatchRemoveTagsInput;
import com.linkedin.datahub.graphql.generated.ResourceRefInput;
import com.linkedin.datahub.graphql.resolvers.mutate.util.LabelUtils;
import com.linkedin.metadata.entity.EntityService;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import static com.linkedin.datahub.graphql.resolvers.ResolverUtils.*;


@Slf4j
@RequiredArgsConstructor
public class BatchRemoveTagsResolver implements DataFetcher<CompletableFuture<Boolean>> {

  private final EntityService _entityService;

  @Override
  public CompletableFuture<Boolean> get(DataFetchingEnvironment environment) throws Exception {
    // ETAG Comment: Client should send the eTag as part of the Variables. Here we received it for GraphQL implementation.
    final String eTag = environment.getVariables().containsKey("eTag") ? environment.getVariables().get("eTag").toString() : null;
    final QueryContext context = environment.getContext();
    final BatchRemoveTagsInput input = bindArgument(environment.getArgument("input"), BatchRemoveTagsInput.class);
    final List<Urn> tagUrns = input.getTagUrns().stream()
      .map(UrnUtils::getUrn)
      .collect(Collectors.toList());
    final List<ResourceRefInput> resources = input.getResources();

    return CompletableFuture.supplyAsync(() -> {

      // First, validate the batch
      validateInputResources(resources, context);

      try {
        // Then execute the bulk add
        batchRemoveTags(tagUrns, resources, context, eTag); // ETAG Comment: eTag is sent to one of the Utils class. (Still not implemented for the other Utils classes)
        return true;
      } catch (Exception e) {
        log.error("Failed to perform update against input {}, {}", input.toString(), e.getMessage());
        throw new RuntimeException(String.format("Failed to perform update against input %s", input.toString()), e);
      }
    });
  }

  private void validateInputResources(List<ResourceRefInput> resources, QueryContext context) {
    for (ResourceRefInput resource : resources) {
      validateInputResource(resource, context);
    }
  }

  private void validateInputResource(ResourceRefInput resource, QueryContext context) {
    final Urn resourceUrn = UrnUtils.getUrn(resource.getResourceUrn());
    if (!LabelUtils.isAuthorizedToUpdateTags(context, resourceUrn, resource.getSubResource())) {
      throw new AuthorizationException("Unauthorized to perform this action. Please contact your DataHub administrator.");
    }
    LabelUtils.validateResource(resourceUrn, resource.getSubResource(), resource.getSubResourceType(), _entityService);
  }

  private void batchRemoveTags(List<Urn> tagUrns, List<ResourceRefInput> resources, QueryContext context, String eTag) {
    log.debug("Batch removing Tags. tags: {}, resources: {}", resources, tagUrns);
    try {
      // ETAG Comment: Transfer the parameter deeper.
      LabelUtils.removeTagsFromResources(tagUrns, resources, UrnUtils.getUrn(context.getActorUrn()), _entityService, eTag);
    } catch (Exception e) {
      throw new RuntimeException(String.format("Failed to remove Tags %s to resources with urns %s!",
          tagUrns,
          resources.stream().map(ResourceRefInput::getResourceUrn).collect(Collectors.toList())),
          e);
    }
  }
}