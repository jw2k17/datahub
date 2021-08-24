import React, { useState } from 'react';
import { Button, Col, Layout, List, message, Pagination, Row, Typography } from 'antd';
import styled from 'styled-components';

import { SearchablePage } from '../search/SearchablePage';
import PolicyBuilderModal from './PolicyBuilderModal';
import { Policy, PolicyInput, PolicyState, PolicyType } from '../../types.generated';
import PolicyListItem from './PolicyListItem';
import PolicyDetailsModal from './PolicyDetailsModal';
import {
    useCreatePolicyMutation,
    useDeletePolicyMutation,
    useListPoliciesQuery,
    useUpdatePolicyMutation,
} from '../../graphql/policy.generated';
import { Message } from '../shared/Message';

const PolicyList = styled(List)`
    &&& {
        width: 100%;
        border-color: ${(props) => props.theme.styles['border-color-base']};
        margin-top: 12px;
        padding: 16px 32px;
        box-shadow: ${(props) => props.theme.styles['box-shadow']};
    }
`;

const DEFAULT_PAGE_SIZE = 5;
const EMPTY_POLICY = {
    type: PolicyType.Metadata,
    name: '',
    description: '',
    state: PolicyState.Active,
    privileges: new Array<string>(),
    resources: {
        type: '',
        resources: new Array<string>(),
        allResources: false,
    },
    actors: {
        users: new Array<string>(),
        groups: new Array<string>(),
        allUsers: false,
        allGroups: false,
        resourceOwners: false,
    },
};

const toPolicyInput = (policy: Omit<Policy, 'urn'>): PolicyInput => {
    let policyInput: PolicyInput = {
        type: policy.type,
        name: policy.name,
        state: policy.state,
        description: policy.description,
        privileges: policy.privileges,
        actors: {
            users: policy.actors.users,
            groups: policy.actors.groups,
            allUsers: policy.actors.allUsers,
            allGroups: policy.actors.allGroups,
            resourceOwners: policy.actors.resourceOwners,
        },
    };
    if (policy.resources !== null && policy.resources !== undefined) {
        // Add the resource filters.
        policyInput = {
            ...policyInput,
            resources: {
                type: policy.resources.type,
                resources: policy.resources.resources,
                allResources: policy.resources.allResources,
            },
        };
    }
    return policyInput;
};

// TODO: Cleanup the styling.
export const PoliciesPage = () => {
    const [page, setPage] = useState(1);
    const [showPolicyBuilderModal, setShowPolicyBuilderModal] = useState(false);
    const [showViewPolicyModal, setShowViewPolicyModal] = useState(false);

    const [focusPolicyUrn, setFocusPolicyUrn] = useState<undefined | string>(undefined);
    const [focusPolicy, setFocusPolicy] = useState<Omit<Policy, 'urn'>>(EMPTY_POLICY);

    const pageSize = DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;

    const {
        loading: policiesLoading,
        error: policiesError,
        data: policiesData,
    } = useListPoliciesQuery({
        fetchPolicy: 'no-cache',
        variables: { input: { start, count: pageSize } },
    });

    const [createPolicy, { error: createPolicyError }] = useCreatePolicyMutation({
        refetchQueries: () => ['listPolicies'],
    });

    const [updatePolicy, { error: updatePolicyError }] = useUpdatePolicyMutation({
        refetchQueries: () => ['listPolicies'],
    });

    const [deletePolicy, { error: deletePolicyError }] = useDeletePolicyMutation({
        refetchQueries: () => ['listPolicies'],
    });

    const updateError = createPolicyError || updatePolicyError || deletePolicyError;

    const totalPolicies = policiesData?.listPolicies?.total || 0;
    const policies = policiesData?.listPolicies?.policies || [];

    const onChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const onClickNewPolicy = () => {
        setFocusPolicyUrn(undefined);
        setFocusPolicy(EMPTY_POLICY);
        setShowPolicyBuilderModal(true);
    };

    const onClosePolicyBuilder = () => {
        setFocusPolicyUrn(undefined);
        setFocusPolicy(EMPTY_POLICY);
        setShowPolicyBuilderModal(false);
    };

    const onViewPolicy = (policy: Policy) => {
        setShowViewPolicyModal(true);
        setFocusPolicyUrn(policy.urn);
        setFocusPolicy({ ...policy });
    };

    const onCancelViewPolicy = () => {
        setShowViewPolicyModal(false);
        setFocusPolicy(EMPTY_POLICY);
        setFocusPolicyUrn(undefined);
    };

    const onRemovePolicy = () => {
        // TODO: Add a warning modal.
        if (focusPolicyUrn) {
            deletePolicy({ variables: { urn: focusPolicyUrn } });
            onCancelViewPolicy();
        }
    };

    const onEditPolicy = () => {
        setShowViewPolicyModal(false);
        setShowPolicyBuilderModal(true);
    };

    const onToggleActive = () => {
        if (focusPolicyUrn) {
            const newPolicy = {
                ...focusPolicy,
                state: focusPolicy?.state === PolicyState.Active ? PolicyState.Inactive : PolicyState.Active,
            };
            updatePolicy({
                variables: {
                    urn: focusPolicyUrn,
                    input: toPolicyInput(newPolicy),
                },
            });
            setShowViewPolicyModal(false);
        }
    };

    const setPolicy = (policy: Omit<Policy, 'urn'>) => {
        setFocusPolicy({
            ...focusPolicy,
            ...policy,
        });
    };

    const onSavePolicy = (savePolicy: Omit<Policy, 'urn'>) => {
        if (focusPolicyUrn) {
            updatePolicy({ variables: { urn: focusPolicyUrn, input: toPolicyInput(savePolicy) } });
        } else {
            createPolicy({ variables: { input: toPolicyInput(savePolicy) } });
        }
        message.success('Successfully saved policy.');
        onClosePolicyBuilder();
    };

    return (
        <SearchablePage>
            <Layout style={{ padding: 40 }}>
                <Row justify="center">
                    <Col sm={24} md={24} lg={20} xl={20}>
                        <Typography.Title level={2} style={{ marginBottom: 24 }}>
                            Your Policies
                        </Typography.Title>
                        <Button onClick={onClickNewPolicy} style={{ marginBottom: 16 }} data-testid="add-policy-button">
                            + New Policy
                        </Button>
                        {policiesLoading && <Message type="loading" content="Loading..." />}
                        {policiesError && message.error('Failed to load your Policies :(')}
                        {updateError && message.error('Failed to successfully update the policy :(')}
                        <PolicyList
                            bordered
                            dataSource={policies}
                            renderItem={(item: unknown) => (
                                <PolicyListItem policy={item as Policy} onView={() => onViewPolicy(item as Policy)} />
                            )}
                        />
                        {showPolicyBuilderModal && (
                            <PolicyBuilderModal
                                policy={focusPolicy || EMPTY_POLICY}
                                setPolicy={setPolicy}
                                visible={showPolicyBuilderModal}
                                onClose={onClosePolicyBuilder}
                                onSave={onSavePolicy}
                            />
                        )}
                        {showViewPolicyModal && (
                            <PolicyDetailsModal
                                policy={focusPolicy}
                                visible={showViewPolicyModal}
                                onEdit={onEditPolicy}
                                onClose={onCancelViewPolicy}
                                onRemove={onRemovePolicy}
                                onToggleActive={onToggleActive}
                            />
                        )}
                        <div style={{ justifyContent: 'center', display: 'flex' }}>
                            <Pagination
                                style={{ margin: 40 }}
                                current={page}
                                pageSize={pageSize}
                                total={totalPolicies}
                                showLessItems
                                onChange={onChangePage}
                                showSizeChanger={false}
                            />
                        </div>
                    </Col>
                </Row>
            </Layout>
        </SearchablePage>
    );
};
