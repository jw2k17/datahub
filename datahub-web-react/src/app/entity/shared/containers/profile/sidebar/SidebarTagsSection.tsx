import React from 'react';
import styled from 'styled-components';

import TagTermGroup from '../../../../../shared/tags/TagTermGroup';
import { SidebarHeader } from './SidebarHeader';
import { useBaseEntity, useEntityData, useRefetch } from '../../../EntityContext';
import { findTopLevelProposals } from '../../../../../shared/tags/utils/proposalUtils';

const TermSection = styled.div`
    margin-top: 20px;
`;

export const SidebarTagsSection = ({ properties }: { properties?: any }) => {
    const canAddTag = properties?.hasTags;
    const canAddTerm = properties?.hasTerms;

    const { urn, entityType, entityData } = useEntityData();
    const baseEntity = useBaseEntity();

    const refetch = useRefetch();

    return (
        <div>
            <SidebarHeader title="Tags" />
            <TagTermGroup
                editableTags={entityData?.globalTags}
                canAddTag={canAddTag}
                canRemove
                showEmptyMessage
                entityUrn={urn}
                entityType={entityType}
                refetch={refetch}
                // eslint-disable-next-line
                // @ts-ignore
                // eslint-disable-next-line
                proposedTags={findTopLevelProposals(baseEntity?.['dataset']?.['tagProposals'] || [])}
            />
            <TermSection>
                <SidebarHeader title="Glossary Terms" />
                <TagTermGroup
                    editableGlossaryTerms={entityData?.glossaryTerms}
                    canAddTerm={canAddTerm}
                    canRemove
                    showEmptyMessage
                    entityUrn={urn}
                    entityType={entityType}
                    refetch={refetch}
                    // eslint-disable-next-line
                    // @ts-ignore
                    // eslint-disable-next-line
                    proposedGlossaryTerms={findTopLevelProposals(baseEntity?.['dataset']?.['termProposals'] || [])}
                />
            </TermSection>
        </div>
    );
};
