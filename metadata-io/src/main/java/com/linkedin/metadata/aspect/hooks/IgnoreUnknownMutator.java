package com.linkedin.metadata.aspect.hooks;

import com.datahub.util.exception.ModelConversionException;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.data.transform.filter.request.MaskTree;
import com.linkedin.metadata.aspect.RetrieverContext;
import com.linkedin.metadata.aspect.batch.MCPItem;
import com.linkedin.metadata.aspect.plugins.config.AspectPluginConfig;
import com.linkedin.metadata.aspect.plugins.hooks.MutationHook;
import com.linkedin.metadata.entity.validation.ValidationApiUtils;
import com.linkedin.metadata.entity.validation.ValidationException;
import com.linkedin.metadata.models.AspectSpec;
import com.linkedin.metadata.utils.GenericRecordUtils;
import com.linkedin.mxe.GenericAspect;
import com.linkedin.restli.internal.server.util.RestUtils;
import java.util.Collection;
import java.util.stream.Stream;
import javax.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

/** This mutator will log and drop unknown aspects. It will also log and drop unknown fields. */
@Slf4j
@Setter
@Getter
@Accessors(chain = true)
public class IgnoreUnknownMutator extends MutationHook {
  @Nonnull private AspectPluginConfig config;

  @Override
  protected Stream<MCPItem> proposalMutation(
      @Nonnull Collection<MCPItem> mcpItems, @Nonnull RetrieverContext retrieverContext) {
    return mcpItems.stream()
        .filter(
            item -> {
              if (item.getEntitySpec().getAspectSpec(item.getAspectName()) == null) {
                log.warn(
                    "Dropping unknown aspect {} on entity {}",
                    item.getAspectName(),
                    item.getAspectSpec().getName());
                return false;
              }
              if (!"application/json"
                  .equals(item.getMetadataChangeProposal().getAspect().getContentType())) {
                log.warn(
                    "Dropping unknown content type {} for aspect {} on entity {}",
                    item.getMetadataChangeProposal().getAspect().getContentType(),
                    item.getAspectName(),
                    item.getEntitySpec().getName());
                return false;
              }
              return true;
            })
        .peek(
            item -> {
              try {
                AspectSpec aspectSpec = item.getEntitySpec().getAspectSpec(item.getAspectName());
                GenericAspect aspect = item.getMetadataChangeProposal().getAspect();
                RecordTemplate recordTemplate =
                    GenericRecordUtils.deserializeAspect(
                        aspect.getValue(), aspect.getContentType(), aspectSpec);
                try {
                  ValidationApiUtils.validateOrThrow(recordTemplate);
                } catch (ValidationException | ModelConversionException e) {
                  log.warn(
                      "Failed to validate aspect. Coercing aspect {} on entity {}",
                      item.getAspectName(),
                      item.getEntitySpec().getName());
                  RestUtils.trimRecordTemplate(recordTemplate, new MaskTree(), false);
                  item.getMetadataChangeProposal()
                      .setAspect(GenericRecordUtils.serializeAspect(recordTemplate));
                }
              } catch (Exception e) {
                throw new RuntimeException(e);
              }
            });
  }
}
