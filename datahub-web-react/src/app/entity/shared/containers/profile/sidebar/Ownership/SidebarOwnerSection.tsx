import { Typography, Button } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ExpandedOwner } from '../../../../components/styled/ExpandedOwner';
import { EMPTY_MESSAGES } from '../../../../constants';
import { useEntityData } from '../../../../EntityContext';
import { SidebarHeader } from '../SidebarHeader';
import { AddOwnerModal } from './AddOwnerModal';

export const SidebarOwnerSection = () => {
    const { urn, entityData } = useEntityData();
    const [showAddModal, setShowAddModal] = useState(false);
    const ownersEmpty = !entityData?.ownership?.owners?.length;

    return (
        <div>
            <SidebarHeader title="Owners" />
            <div>
                {entityData?.ownership?.owners?.map((owner) => (
                    <ExpandedOwner entityUrn={urn} owner={owner} />
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
                onClose={() => {
                    setShowAddModal(false);
                }}
            />
        </div>
    );
};
