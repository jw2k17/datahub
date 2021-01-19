package com.linkedin.datahub.graphql.mappers;

import com.linkedin.datahub.graphql.generated.Dataset;
import com.linkedin.datahub.graphql.generated.FabricType;
import com.linkedin.datahub.graphql.generated.PlatformNativeType;

import javax.annotation.Nonnull;

/**
 * Maps Pegasus {@link RecordTemplate} objects to objects conforming to the GQL schema.
 *
 * Note that it is our intention to eventually auto-generate these types of boilerplate mappers.
 */
public class DatasetMapper implements ModelMapper<com.linkedin.dataset.Dataset, Dataset> {

    public static final DatasetMapper INSTANCE = new DatasetMapper();

    public static Dataset map(@Nonnull final com.linkedin.dataset.Dataset dataset) {
        return INSTANCE.apply(dataset);
    }

    @Override
    public Dataset apply(@Nonnull final com.linkedin.dataset.Dataset dataset) {
        com.linkedin.datahub.graphql.generated.Dataset result = new com.linkedin.datahub.graphql.generated.Dataset();
        result.setUrn(dataset.getUrn().toString());
        result.setName(dataset.getName());
        result.setDescription(dataset.getDescription());
        result.setPlatform(dataset.getPlatform().toString());
        result.setOrigin(Enum.valueOf(FabricType.class, dataset.getOrigin().name()));
        result.setTags(dataset.getTags());

        // TODO: Modify GMS to return created, lastModified at the top level as contract requires.
        if (dataset.hasSchemaMetadata()) {
            result.setCreated(AuditStampMapper.map(dataset.getSchemaMetadata().getCreated()));
            result.setLastModified(AuditStampMapper.map(dataset.getSchemaMetadata().getLastModified()));
            if (dataset.getSchemaMetadata().hasDeleted()) {
                result.setDeleted(AuditStampMapper.map(dataset.getSchemaMetadata().getDeleted()));
            }
        }
        if (dataset.hasPlatformNativeType()) {
            result.setPlatformNativeType(Enum.valueOf(PlatformNativeType.class, dataset.getPlatformNativeType().name()));
        }
        if (dataset.hasUri()) {
            result.setUri(dataset.getUri().toString());
        }
        if (dataset.hasProperties()) {
            result.setProperties(StringMapMapper.map(dataset.getProperties()));
        }
        if (dataset.hasOwnership()) {
            result.setOwnership(OwnershipMapper.map(dataset.getOwnership()));
        }
        return result;
    }
}
