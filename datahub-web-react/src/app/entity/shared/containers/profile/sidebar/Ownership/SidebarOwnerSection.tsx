import { Typography, Button } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ExpandedOwner } from '../../../../components/styled/ExpandedOwner';
import { EMPTY_MESSAGES } from '../../../../constants';
import { useEntityData, useRefetch } from '../../../../EntityContext';
import { useEntityCommonPrivileges } from '../../../../EntityAuthorizationContext';
import { SidebarHeader } from '../SidebarHeader';
import { AddOwnersModal } from './AddOwnersModal';

export const SidebarOwnerSection = ({ properties }: { properties?: any }) => {
    const { urn, entityType, entityData } = useEntityData();
    const refetch = useRefetch();
    const [showAddModal, setShowAddModal] = useState(false);
    const ownersEmpty = !entityData?.ownership?.owners?.length;
    // Privileges
    const { editOwners } = useEntityCommonPrivileges();

    return (
        <div>
            <SidebarHeader title="Owners" />
            <div>
                {entityData?.ownership?.owners?.map((owner) => (
                    <ExpandedOwner
                        key={owner.owner.urn}
                        entityUrn={urn}
                        owner={owner}
                        refetch={refetch}
                        isEditOwner={editOwners}
                    />
                ))}
                {ownersEmpty && (
                    <Typography.Paragraph type="secondary">
                        {EMPTY_MESSAGES.owners.title}. {EMPTY_MESSAGES.owners.description}
                    </Typography.Paragraph>
                )}

                {editOwners && (
                    <Button type={ownersEmpty ? 'default' : 'text'} onClick={() => setShowAddModal(true)}>
                        <PlusOutlined /> Add Owner
                    </Button>
                )}
            </div>
            <AddOwnersModal
                urn={urn}
                defaultOwnerType={properties?.defaultOwnerType}
                hideOwnerType={properties?.hideOwnerType || false}
                type={entityType}
                visible={showAddModal}
                refetch={refetch}
                onCloseModal={() => {
                    setShowAddModal(false);
                }}
            />
        </div>
    );
};
