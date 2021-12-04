import React, { useEffect, useState } from 'react';
import { Button, Empty, message, Modal, Tooltip, Typography } from 'antd';
import styled from 'styled-components';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import {
    useGetIngestionSourceQuery,
    useCancelIngestionExecutionRequestMutation,
} from '../../graphql/ingestion.generated';
import { Message } from '../shared/Message';
import { StyledTable } from '../entity/shared/components/styled/StyledTable';
import { REDESIGN_COLORS } from '../entity/shared/constants';
import { ExecutionDetailsModal } from './ExecutionDetailsModal';

const ListContainer = styled.div`
    margin-left: 28px;
`;

type Props = {
    urn: string;
    lastRefresh: number;
    onRefresh: () => void;
};

export const IngestionSourceExecutionList = ({ urn, lastRefresh, onRefresh }: Props) => {
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

    const [cancelExecutionRequestMutation] = useCancelIngestionExecutionRequestMutation();

    useEffect(() => {
        refetch();
    }, [lastRefresh, refetch]);

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
                setTimeout(() => onRefresh(), 3000);
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
            maskClosable: true,
            closable: true,
        });
    };

    const tableColumns = [
        {
            title: 'Started At',
            dataIndex: 'executedAt',
            key: 'executedAt',
            render: (time: string) => {
                const executionDate = new Date(time);
                const localTime = `${executionDate.toLocaleDateString()} at ${executionDate.toLocaleTimeString()}`;
                return <Typography.Text>{localTime || 'N/A'}</Typography.Text>;
            },
        },
        {
            title: 'Duration (s)',
            dataIndex: 'duration',
            key: 'duration',
            render: (durationMs: number) => {
                const seconds = (durationMs && `${durationMs / 1000}s`) || 'N/A';
                return seconds;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: any) => {
                const Icon =
                    (status === 'RUNNING' && LoadingOutlined) ||
                    (status === 'SUCCESS' && CheckCircleOutlined) ||
                    (status === 'FAILURE' && CloseCircleOutlined) ||
                    (status === 'TIMEOUT' && ExclamationCircleFilled);
                const text =
                    (status === 'RUNNING' && 'Running') ||
                    (status === 'SUCCESS' && 'Succeeded') ||
                    (status === 'FAILURE' && 'Failed') ||
                    (status === 'TIMEOUT' && 'Timed Out') ||
                    'Requested';
                const tip =
                    status === 'RUNNING' &&
                    'If your execution has been running for a while, there may be something wrong with the Executor.';
                const color =
                    (status === 'RUNNING' && REDESIGN_COLORS.BLUE) ||
                    (status === 'SUCCESS' && 'green') ||
                    (status === 'FAILURE' && 'red') ||
                    (status === 'TIMEOUT' && 'yellow') ||
                    REDESIGN_COLORS.GREY;
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                            <Tooltip overlay={<Typography.Text>{tip}</Typography.Text>}>
                                {Icon && <Icon style={{ color }} />}
                                <Typography.Text strong style={{ color, marginLeft: 8 }}>
                                    {text || 'N/A'}
                                </Typography.Text>
                            </Tooltip>
                        </div>
                    </>
                );
            },
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (source: string) => {
                return (
                    (source === 'MANUAL_INGESTION_SOURCE' && 'Manual Execution') ||
                    (source === 'SCHEDULED_INGESTION_SOURCE' && 'Scheduled Execution') ||
                    'N/A'
                );
            },
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (_, record: any) => (
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    {record.duration && (
                        <Button style={{ marginRight: 16 }} onClick={() => handleViewDetails(record.urn)}>
                            DETAILS
                        </Button>
                    )}
                    {record.status === 'RUNNING' && (
                        <Button style={{ marginRight: 16 }} onClick={() => handleCancelExecution(record.urn)}>
                            CANCEL
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const executions = data?.ingestionSource?.executions?.executionRequests;
    const tableData = executions?.map((execution) => ({
        urn: execution.urn,
        source: execution.input.source.type,
        executedAt: execution.result?.startTimeMs,
        duration: execution.result?.durationMs,
        status: execution.result?.status,
    }));

    return (
        <ListContainer>
            {!data && loading && <Message type="loading" content="Loading executions..." />}
            {error && message.error('Failed to load executions :(')}
            <StyledTable
                columns={tableColumns}
                dataSource={tableData}
                rowKey="id"
                locale={{
                    emptyText: <Empty description="No Executions found!" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                }}
                pagination={false}
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
