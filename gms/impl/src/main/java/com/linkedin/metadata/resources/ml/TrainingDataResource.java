package com.linkedin.metadata.resources.ml;

import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.schema.RecordDataSchema;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.ModelUtils;
import com.linkedin.metadata.restli.RestliUtils;
import com.linkedin.restli.common.HttpStatus;
import javax.annotation.Nonnull;

import com.linkedin.ml.metadata.TrainingData;
import com.linkedin.parseq.Task;
import com.linkedin.restli.server.CreateResponse;
import com.linkedin.restli.server.annotations.RestLiCollection;
import com.linkedin.restli.server.annotations.RestMethod;

import lombok.extern.slf4j.Slf4j;

/**
 * Deprecated! Use {@link EntityResource} instead.
 *
 * Rest.li entry point: /mlModels/{mlModelKey}/trainingData
 */
@Slf4j
@Deprecated
@RestLiCollection(name = "trainingData", namespace = "com.linkedin.ml", parent = MLModels.class)
public class TrainingDataResource extends BaseMLModelsAspectResource<TrainingData> {
    public TrainingDataResource() {
        super(TrainingData.class);
    }

    @RestMethod.Get
    @Nonnull
    @Override
    public Task<TrainingData> get(@Nonnull Long version) {
        return RestliUtils.toTask(() -> {
            final Urn urn = getUrn(getContext().getPathKeys());
            final RecordDataSchema aspectSchema = new TrainingData().schema();

            final RecordTemplate maybeAspect = getEntityService().getAspectRecord(
                urn,
                ModelUtils.getAspectNameFromSchema(aspectSchema),
                version
            );
            if (maybeAspect != null) {
                return new TrainingData(maybeAspect.data());
            }
            throw RestliUtils.resourceNotFoundException();
        });
    }

    @RestMethod.Create
    @Nonnull
    @Override
    public Task<CreateResponse> create(@Nonnull TrainingData trainingData) {
        return RestliUtils.toTask(() -> {
            final Urn urn = getUrn(getContext().getPathKeys());
            final AuditStamp auditStamp = getAuditor().requestAuditStamp(getContext().getRawRequestContext());
            getEntityService().ingestAspect(
                urn,
                ModelUtils.getAspectNameFromSchema(trainingData.schema()),
                trainingData,
                auditStamp);
            return new CreateResponse(HttpStatus.S_201_CREATED);
        });
    }
}