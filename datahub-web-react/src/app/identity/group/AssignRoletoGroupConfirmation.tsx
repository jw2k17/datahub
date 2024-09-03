import React from 'react';
import { message, Popconfirm } from 'antd';
import { useBatchAssignRoleMutation } from '../../../graphql/mutations.generated';
import { DataHubRole } from '../../../types.generated';
import analytics, { EventType } from '../../analytics';
import { useTranslation } from 'react-i18next';

type Props = {
    open: boolean;
    roleToAssign: DataHubRole | undefined;
    groupName: string;
    groupUrn: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function AssignRoletoGroupConfirmation({
    open,
    roleToAssign,
    groupName,
    groupUrn,
    onClose,
    onConfirm,
}: Props) {
    const { t } = useTranslation();
    const [batchAssignRoleMutation] = useBatchAssignRoleMutation();
    // eslint-disable-next-line
    const batchAssignRole = () => {
        batchAssignRoleMutation({
            variables: {
                input: {
                    roleUrn: roleToAssign?.urn,
                    actors: [groupUrn],
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    analytics.event({
                        type: EventType.SelectGroupRoleEvent,
                        roleUrn: roleToAssign?.urn || 'undefined',
                        groupUrn,
                    });
                    message.success({
                        content: roleToAssign
                            ? t('group.assignRoleSuccess', { roleName: roleToAssign?.name, groupName: groupName})
                            : t('user.removeRoleSuccess', { username: groupName}),
                        duration: 2,
                    });
                    onConfirm();
                }
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: roleToAssign
                        ? `${t('group.assignRoleError', { roleName: roleToAssign?.name, groupName: groupName})}: \n ${e.message || ''}`
                        : `${t('user.removeRoleError', { username: groupName })}: \n ${e.message || ''}`,
                    duration: 3,
                });
            });
    };

    const assignRoleText = roleToAssign
        ? `${t('group.assignRoleTitle', { roleName: roleToAssign?.name, groupName: groupName})}?`
        : `${t('user.removeRoleTitle', { username: groupName})}?`;

    return <Popconfirm title={assignRoleText} open={open} onConfirm={batchAssignRole} onCancel={onClose} />;
}
