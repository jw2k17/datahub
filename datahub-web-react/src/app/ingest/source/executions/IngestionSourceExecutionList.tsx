import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import styled from 'styled-components';
import {
    useGetIngestionSourceQuery,
    useCancelIngestionExecutionRequestMutation,
    useRollbackIngestionMutation,
} from '../../../../graphql/ingestion.generated';
import { Message } from '../../../shared/Message';
import { ExecutionDetailsModal } from './ExecutionRequestDetailsModal';
import IngestionExecutionTable from './IngestionExecutionTable';
import { ExecutionRequest } from '../../../../types.generated';
import { ROLLING_BACK, RUNNING } from '../utils';
import useRefreshIngestionData from './useRefreshIngestionData';

const ListContainer = styled.div`
    margin-left: 28px;
`;

export function isExecutionRequestActive(executionRequest: ExecutionRequest) {
    return executionRequest.result?.status === RUNNING || executionRequest.result?.status === ROLLING_BACK;
}

type Props = {
    urn: string;
    isExpanded: boolean;
    lastRefresh: number;
    onRefresh: () => void;
};

export const IngestionSourceExecutionList = ({ urn, isExpanded, lastRefresh, onRefresh }: Props) => {
    const [focusExecutionUrn, setFocusExecutionUrn] = useState<undefined | string>(undefined);

    const start = 0;
    const count = 10; // Load 10 items at a time.

    const { loading, data, error, refetch } = useGetIngestionSourceQuery({
        variables: {
            urn,
            runStart: start,
            runCount: count,
        },
    });

    function hasActiveExecution() {
        return !!data?.ingestionSource?.executions?.executionRequests.find((request) =>
            isExecutionRequestActive(request as ExecutionRequest),
        );
    }
    useRefreshIngestionData(refetch, hasActiveExecution);

    const [cancelExecutionRequestMutation] = useCancelIngestionExecutionRequestMutation();
    const [rollbackIngestion] = useRollbackIngestionMutation();

    useEffect(() => {
        if (isExpanded) {
            refetch();
        }
    }, [lastRefresh, isExpanded, refetch]);

    const handleViewDetails = (focusUrn: string) => {
        setFocusExecutionUrn(focusUrn);
    };

    const onCancelExecutionRequest = (executionUrn: string) => {
        cancelExecutionRequestMutation({
            variables: {
                input: {
                    ingestionSourceUrn: urn,
                    executionRequestUrn: executionUrn,
                },
            },
        })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `Failed to cancel execution!: \n ${e.message || ''}`,
                    duration: 3,
                });
            })
            .finally(() => {
                message.success({
                    content: `Successfully submitted cancellation request!`,
                    duration: 3,
                });
                // Refresh once a job was cancelled.
                setTimeout(() => onRefresh(), 2000);
            });
    };

    const handleCancelExecution = (executionUrn: string) => {
        Modal.confirm({
            title: `Confirm Cancel`,
            content:
                'Cancelling an running execution will NOT remove any data that has already been ingested. You can use the DataHub CLI to rollback this ingestion run.',
            onOk() {
                onCancelExecutionRequest(executionUrn);
            },
            onCancel() {},
            okText: 'Cancel',
            cancelText: 'Close',
            maskClosable: true,
            closable: true,
        });
    };

    function handleRollbackExecution(runId: string) {
        Modal.confirm({
            title: `Confirm Rollback`,
            content: (
                <div>
                    Rolling back this ingestion run will delete any data specifically associated with with this run. If
                    overlapping data has been ingested in previous runs, it may not be removed.
                    <br />
                    <br /> Are you sure you want to continue?
                </div>
            ),
            onOk() {
                message.loading('Requesting rollback...');
                rollbackIngestion({ variables: { input: { runId } } })
                    .then(() => {
                        setTimeout(() => {
                            message.destroy();
                            refetch();
                            onRefresh();
                            message.success('Successfully requested ingestion rollback');
                        }, 2000);
                    })
                    .catch(() => {
                        message.error('Error requesting ingestion rollback');
                    });
            },
            onCancel() {},
            okText: 'Rollback',
            cancelText: 'Close',
            maskClosable: true,
            closable: true,
        });
    }

    const executionRequests = (data?.ingestionSource?.executions?.executionRequests as ExecutionRequest[]) || [];

    return (
        <ListContainer>
            {!data && loading && <Message type="loading" content="Loading executions..." />}
            {error && message.error('Failed to load executions :(')}
            <IngestionExecutionTable
                executionRequests={executionRequests}
                setFocusExecutionUrn={setFocusExecutionUrn}
                handleCancelExecution={handleCancelExecution}
                handleViewDetails={handleViewDetails}
                handleRollbackExecution={handleRollbackExecution}
            />
            {focusExecutionUrn && (
                <ExecutionDetailsModal
                    urn={focusExecutionUrn}
                    visible={focusExecutionUrn !== undefined}
                    onClose={() => setFocusExecutionUrn(undefined)}
                />
            )}
        </ListContainer>
    );
};
