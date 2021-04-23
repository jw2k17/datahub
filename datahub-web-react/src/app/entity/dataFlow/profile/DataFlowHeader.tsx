import { Avatar, Button, Divider, Row, Space, Tooltip, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { DataFlow, EntityType } from '../../../../types.generated';
import { useEntityRegistry } from '../../../useEntityRegistry';
import defaultAvatar from '../../../../images/default_avatar.png';

export type Props = {
    dataFlow: DataFlow;
};

export default function DataFlowHeader({ dataFlow: { ownership, info, orchestrator } }: Props) {
    const entityRegistry = useEntityRegistry();
    const platformName = orchestrator.charAt(0).toUpperCase() + orchestrator.slice(1);

    return (
        <>
            <Space direction="vertical" size="middle">
                <Row justify="space-between">
                    <Space split={<Divider type="vertical" />}>
                        <Typography.Text>Data Pipeline</Typography.Text>
                        <Typography.Text strong>{platformName}</Typography.Text>
                    </Space>
                    {info?.externalUrl && <Button href={info?.externalUrl}>View in {platformName}</Button>}
                </Row>
                <Typography.Paragraph>{info?.description}</Typography.Paragraph>
                <Avatar.Group maxCount={6} size="large">
                    {ownership?.owners?.map((owner) => (
                        <Tooltip title={owner.owner.info?.fullName} key={owner.owner.urn}>
                            <Link to={`/${entityRegistry.getPathName(EntityType.CorpUser)}/${owner.owner.urn}`}>
                                <Avatar
                                    style={{
                                        color: '#f56a00',
                                        backgroundColor: '#fde3cf',
                                    }}
                                    src={
                                        (owner.owner.editableInfo && owner.owner.editableInfo.pictureLink) ||
                                        defaultAvatar
                                    }
                                />
                            </Link>
                        </Tooltip>
                    ))}
                </Avatar.Group>
            </Space>
        </>
    );
}
