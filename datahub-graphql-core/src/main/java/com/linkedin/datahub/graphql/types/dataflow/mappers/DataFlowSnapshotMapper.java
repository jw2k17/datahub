package com.linkedin.datahub.graphql.types.dataflow.mappers;

import com.linkedin.common.GlobalTags;
import com.linkedin.common.Ownership;
import com.linkedin.common.Status;
import com.linkedin.datahub.graphql.generated.DataFlow;
import com.linkedin.datahub.graphql.generated.DataFlowEditableProperties;
import com.linkedin.datahub.graphql.generated.DataFlowInfo;
import com.linkedin.datahub.graphql.generated.EntityType;
import com.linkedin.datahub.graphql.types.common.mappers.OwnershipMapper;
import com.linkedin.datahub.graphql.types.common.mappers.StatusMapper;
import com.linkedin.datahub.graphql.types.common.mappers.StringMapMapper;
import com.linkedin.datahub.graphql.types.mappers.ModelMapper;
import com.linkedin.datahub.graphql.types.tag.mappers.GlobalTagsMapper;
import com.linkedin.datajob.EditableDataflowProperties;
import com.linkedin.metadata.dao.utils.ModelUtils;
import com.linkedin.metadata.snapshot.DataFlowSnapshot;
import javax.annotation.Nonnull;


public class DataFlowSnapshotMapper implements ModelMapper<DataFlowSnapshot, DataFlow> {

    public static final DataFlowSnapshotMapper INSTANCE = new DataFlowSnapshotMapper();

    public static DataFlow map(@Nonnull final DataFlowSnapshot dataflow) {
        return INSTANCE.apply(dataflow);
    }

    @Override
    public DataFlow apply(@Nonnull final DataFlowSnapshot dataflow) {
        final DataFlow result = new DataFlow();
        result.setUrn(dataflow.getUrn().toString());
        result.setType(EntityType.DATA_FLOW);
        result.setOrchestrator(dataflow.getUrn().getOrchestratorEntity());
        result.setFlowId(dataflow.getUrn().getFlowIdEntity());
        result.setCluster(dataflow.getUrn().getClusterEntity());

        ModelUtils.getAspectsFromSnapshot(dataflow).forEach(aspect -> {
            if (aspect instanceof com.linkedin.datajob.DataFlowInfo) {
                com.linkedin.datajob.DataFlowInfo info = com.linkedin.datajob.DataFlowInfo.class.cast(aspect);
                result.setInfo(mapDataFlowInfo(info));
            } else if (aspect instanceof Ownership) {
                Ownership ownership = Ownership.class.cast(aspect);
                result.setOwnership(OwnershipMapper.map(ownership));
            } else if (aspect instanceof Status) {
                Status status = Status.class.cast(aspect);
                result.setStatus(StatusMapper.map(status));
            } else if (aspect instanceof GlobalTags) {
                result.setGlobalTags(GlobalTagsMapper.map(GlobalTags.class.cast(aspect)));
            } else if (aspect instanceof EditableDataflowProperties) {
                final DataFlowEditableProperties dataFlowEditableProperties = new DataFlowEditableProperties();
                dataFlowEditableProperties.setDescription(((EditableDataflowProperties) aspect).getDescription());
                result.setEditableProperties(dataFlowEditableProperties);
            }
        });
        return result;
    }

    private DataFlowInfo mapDataFlowInfo(final com.linkedin.datajob.DataFlowInfo info) {
        final DataFlowInfo result = new DataFlowInfo();
        result.setName(info.getName());
        result.setDescription(info.getDescription());
        result.setProject(info.getProject());
        if (info.hasExternalUrl()) {
            result.setExternalUrl(info.getExternalUrl().toString());
        }
        if (info.hasCustomProperties()) {
            result.setCustomProperties(StringMapMapper.map(info.getCustomProperties()));
        }
        return result;
    }
}
