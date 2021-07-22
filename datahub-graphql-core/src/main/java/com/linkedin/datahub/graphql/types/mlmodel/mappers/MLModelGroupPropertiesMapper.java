package com.linkedin.datahub.graphql.types.mlmodel.mappers;


import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.generated.MLModelGroupProperties;
import com.linkedin.datahub.graphql.types.mappers.ModelMapper;
import lombok.NonNull;

import java.util.stream.Collectors;

public class MLModelGroupPropertiesMapper implements ModelMapper<com.linkedin.ml.metadata.MLModelGroupProperties, MLModelGroupProperties> {

    public static final MLModelGroupPropertiesMapper INSTANCE = new MLModelGroupPropertiesMapper();

    public static MLModelGroupProperties map(@NonNull final com.linkedin.ml.metadata.MLModelGroupProperties mlModelGroupProperties) {
        return INSTANCE.apply(mlModelGroupProperties);
    }

    @Override
    public MLModelGroupProperties apply(@NonNull final com.linkedin.ml.metadata.MLModelGroupProperties mlModelGroupProperties) {
        final MLModelGroupProperties result = new MLModelGroupProperties();

        result.setDescription(mlModelGroupProperties.getDescription());
        if (mlModelGroupProperties.getVersion() != null) {
            result.setVersion(VersionTagMapper.map(mlModelGroupProperties.getVersion()));
        }
        result.setCreatedAt(mlModelGroupProperties.getCreatedAt());
        result.setModels(mlModelGroupProperties.getModels().stream().map(Urn::toString).collect(Collectors.toList()));

        return result;
    }
}
