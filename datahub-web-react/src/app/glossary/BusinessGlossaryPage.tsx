import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useGetRootGlossaryNodesQuery, useGetRootGlossaryTermsQuery } from '../../graphql/glossary.generated';
import TabToolbar from '../entity/shared/components/styled/TabToolbar';
import GlossaryEntitiesList from './GlossaryEntitiesList';
import EmptyGlossarySection from './EmptyGlossarySection';
import CreateGlossaryEntityModal from '../entity/shared/EntityDropdown/CreateGlossaryEntityModal';
import { EntityType } from '../../types.generated';
import { Message } from '../shared/Message';
import { sortGlossaryTerms } from '../entity/glossaryTerm/utils';
import { useEntityRegistry } from '../useEntityRegistry';
import { sortGlossaryNodes } from '../entity/glossaryNode/utils';
import {
    BUSINESS_GLOSSARY_INTRO_ID,
    BUSINESS_GLOSSARY_CREATE_TERM_ID,
    BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID,
} from '../onboarding/config/BusinessGlossaryOnboardingConfig';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import { useGlossaryEntityData } from '../entity/shared/GlossaryEntityContext';
import { useUserContext } from '../context/useUserContext';

export const HeaderWrapper = styled(TabToolbar)`
    padding: 15px 45px 10px 24px;
    height: auto;
`;

const GlossaryWrapper = styled.div`
    display: flex;
    flex: 1;
    max-height: inherit;
`;

const MainContentWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

export const BrowserWrapper = styled.div<{ width: number }>`
    max-height: 100%;
    width: ${(props) => props.width}px;
    min-width: ${(props) => props.width}px;
`;

export const MAX_BROWSER_WIDTH = 500;
export const MIN_BROWSWER_WIDTH = 200;

function BusinessGlossaryPage() {
    const {
        data: termsData,
        refetch: refetchForTerms,
        loading: termsLoading,
        error: termsError,
    } = useGetRootGlossaryTermsQuery();
    const {
        data: nodesData,
        refetch: refetchForNodes,
        loading: nodesLoading,
        error: nodesError,
    } = useGetRootGlossaryNodesQuery();
    const entityRegistry = useEntityRegistry();
    const { setEntityData } = useGlossaryEntityData();

    useEffect(() => {
        setEntityData(null);
    }, [setEntityData]);

    const terms = termsData?.getRootGlossaryTerms?.terms.sort((termA, termB) =>
        sortGlossaryTerms(entityRegistry, termA, termB),
    );
    const nodes = nodesData?.getRootGlossaryNodes?.nodes.sort((nodeA, nodeB) =>
        sortGlossaryNodes(entityRegistry, nodeA, nodeB),
    );

    const hasTermsOrNodes = !!nodes?.length || !!terms?.length;

    const [isCreateTermModalVisible, setIsCreateTermModalVisible] = useState(false);
    const [isCreateNodeModalVisible, setIsCreateNodeModalVisible] = useState(false);

    const user = useUserContext();
    const canManageGlossaries = user?.platformPrivileges?.manageGlossaries;

    return (
        <>
            <OnboardingTour
                stepIds={[
                    BUSINESS_GLOSSARY_INTRO_ID,
                    BUSINESS_GLOSSARY_CREATE_TERM_ID,
                    BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID,
                ]}
            />
            <GlossaryWrapper>
                {(termsLoading || nodesLoading) && (
                    <Message type="loading" content="加载数据字典..." style={{ marginTop: '10%' }} />
                )}
                {(termsError || nodesError) && (
                    <Message type="error" content="数据字典加载失败! 发生未知错误." />
                )}
                <MainContentWrapper>
                    <HeaderWrapper>
                        <Typography.Title level={3}>数据字典</Typography.Title>
                        <div>
                            <Button
                                id={BUSINESS_GLOSSARY_CREATE_TERM_ID}
                                disabled={!canManageGlossaries}
                                type="text"
                                onClick={() => setIsCreateTermModalVisible(true)}
                            >
                                <PlusOutlined /> 新建术语
                            </Button>
                            <Button
                                id={BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID}
                                disabled={!canManageGlossaries}
                                type="text"
                                onClick={() => setIsCreateNodeModalVisible(true)}
                            >
                                <PlusOutlined /> 新建术语组
                            </Button>
                        </div>
                    </HeaderWrapper>
                    {hasTermsOrNodes && <GlossaryEntitiesList nodes={nodes || []} terms={terms || []} />}
                    {!(termsLoading || nodesLoading) && !hasTermsOrNodes && (
                        <EmptyGlossarySection
                            title="空的数据字典"
                            description="为您的组织创建可共享的术语和术语组吧."
                            refetchForTerms={refetchForTerms}
                            refetchForNodes={refetchForNodes}
                        />
                    )}
                </MainContentWrapper>
            </GlossaryWrapper>
            {isCreateTermModalVisible && (
                <CreateGlossaryEntityModal
                    entityType={EntityType.GlossaryTerm}
                    onClose={() => setIsCreateTermModalVisible(false)}
                    refetchData={refetchForTerms}
                />
            )}
            {isCreateNodeModalVisible && (
                <CreateGlossaryEntityModal
                    entityType={EntityType.GlossaryNode}
                    onClose={() => setIsCreateNodeModalVisible(false)}
                    refetchData={refetchForNodes}
                />
            )}
        </>
    );
}

export default BusinessGlossaryPage;
