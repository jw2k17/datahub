import { Typography, Button } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ExpandedOwner } from '../../../../components/styled/ExpandedOwner';
import { EMPTY_MESSAGES } from '../../../../constants';
import { useEntityData, useRefetch } from '../../../../EntityContext';
import { SidebarHeader } from '../SidebarHeader';
import { AddOwnerModal } from './AddOwnerModal';

export const SidebarOwnerSection = () => {
    const { urn, entityData } = useEntityData();
    const refetch = useRefetch();
    const [showAddModal, setShowAddModal] = useState(false);
    const ownersEmpty = !entityData?.ownership?.owners?.length;

    return (
        <div>
            <SidebarHeader title="Owners" />
            <div>
                {!ownersEmpty && (
                    <Typography.Paragraph type="secondary">
                        Top tip: hover over the team to see the ownership type
                    </Typography.Paragraph>
                )}
                {entityData?.ownership?.owners?.map((owner) => (
                    <ExpandedOwner entityUrn={urn} owner={owner} refetch={refetch} />
                ))}
                {ownersEmpty && (
                    <Typography.Paragraph type="secondary">
                        {EMPTY_MESSAGES.owners.title}. {EMPTY_MESSAGES.owners.description}
                    </Typography.Paragraph>
                )}

                <Button type={ownersEmpty ? 'default' : 'text'} onClick={() => setShowAddModal(true)}>
                    <PlusOutlined /> Add Owner
                </Button>
            </div>
            <AddOwnerModal
                visible={showAddModal}
                refetch={refetch}
                onClose={() => {
                    setShowAddModal(false);
                }}
            />
        </div>
    );
};
