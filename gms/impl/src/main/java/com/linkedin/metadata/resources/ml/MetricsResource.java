package com.linkedin.metadata.resources.ml;

import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.schema.RecordDataSchema;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.ModelUtils;
import com.linkedin.metadata.restli.RestliUtils;
import com.linkedin.restli.common.HttpStatus;
import javax.annotation.Nonnull;

import com.linkedin.ml.metadata.Metrics;
import com.linkedin.parseq.Task;
import com.linkedin.restli.server.CreateResponse;
import com.linkedin.restli.server.annotations.RestLiCollection;
import com.linkedin.restli.server.annotations.RestMethod;

import lombok.extern.slf4j.Slf4j;

/**
 * Deprecated! Use {@link EntityResource} instead.
 *
 * Rest.li entry point: /mlModels/{mlModelKey}/metrics
 */
@Slf4j
@Deprecated
@RestLiCollection(name = "metrics", namespace = "com.linkedin.ml", parent = MLModels.class)
public class MetricsResource extends BaseMLModelsAspectResource<Metrics> {
    public MetricsResource() {
        super(Metrics.class);
    }

    @RestMethod.Get
    @Nonnull
    @Override
    public Task<Metrics> get(@Nonnull Long version) {
        return RestliUtils.toTask(() -> {
            final Urn urn = getUrn(getContext().getPathKeys());
            final RecordDataSchema aspectSchema = new Metrics().schema();

            final RecordTemplate maybeAspect = getEntityService().getAspectRecord(
                urn,
                ModelUtils.getAspectNameFromSchema(aspectSchema),
                version
            );
            if (maybeAspect != null) {
                return new Metrics(maybeAspect.data());
            }
            throw RestliUtils.resourceNotFoundException();
        });
    }

    @RestMethod.Create
    @Nonnull
    @Override
    public Task<CreateResponse> create(@Nonnull Metrics metrics) {
        return RestliUtils.toTask(() -> {
            final Urn urn = getUrn(getContext().getPathKeys());
            final AuditStamp auditStamp = getAuditor().requestAuditStamp(getContext().getRawRequestContext());
            getEntityService().ingestAspect(
                urn,
                ModelUtils.getAspectNameFromSchema(metrics.schema()),
                metrics,
                auditStamp);
            return new CreateResponse(HttpStatus.S_201_CREATED);
        });
    }
}