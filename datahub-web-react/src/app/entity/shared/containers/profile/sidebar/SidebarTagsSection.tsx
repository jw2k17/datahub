import React from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';

import TagTermGroup from '../../../../../shared/tags/TagTermGroup';
import { SidebarHeader } from './SidebarHeader';
import { useEntityData, useMutationUrn, useRefetch } from '../../../EntityContext';
import {
    ENTITY_PROFILE_GLOSSARY_TERMS_ID,
    ENTITY_PROFILE_TAGS_ID,
} from '../../../../../onboarding/config/EntityProfileOnboardingConfig';

const StyledDivider = styled(Divider)`
    margin: 16px 0;
`;

interface Props {
    properties?: any;
    readOnly?: boolean;
}

export const SidebarTagsSection = ({ properties, readOnly }: Props) => {
    const canAddTag = properties?.hasTags;
    const canAddTerm = properties?.hasTerms;

    const mutationUrn = useMutationUrn();

    const { entityType, entityData } = useEntityData();

    const refetch = useRefetch();

    return (
        <div>
            <span id={ENTITY_PROFILE_TAGS_ID}>
                <SidebarHeader title="Tags" />
                <TagTermGroup
                    editableTags={entityData?.globalTags}
                    canAddTag={canAddTag}
                    canRemove
                    showEmptyMessage
                    entityUrn={mutationUrn}
                    entityType={entityType}
                    refetch={refetch}
                    readOnly={readOnly}
                />
            </span>
            <StyledDivider />
            <span id={ENTITY_PROFILE_GLOSSARY_TERMS_ID}>
                <SidebarHeader title="Glossary Terms" />
                <TagTermGroup
                    editableGlossaryTerms={entityData?.glossaryTerms}
                    canAddTerm={canAddTerm}
                    canRemove
                    showEmptyMessage
                    entityUrn={mutationUrn}
                    entityType={entityType}
                    refetch={refetch}
                    readOnly={readOnly}
                />
            </span>
        </div>
    );
};
