import { AutoComplete, Button, Form, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
    CorpGroup,
    CorpUser,
    EntityType,
    Owner,
    OwnershipSourceType,
    OwnershipType,
    OwnershipUpdate,
} from '../../../types.generated';
import CustomAvatar from '../../shared/avatar/CustomAvatar';
import { useGetAutoCompleteResultsLazyQuery } from '../../../graphql/search.generated';
import { useEntityRegistry } from '../../useEntityRegistry';

const OWNER_SEARCH_PLACEHOLDER = 'Search an LDAP';
const NUMBER_OWNERS_REQUIRED = 2;

interface Props {
    owners: Array<Owner>;
    lastModifiedAt: number;
    updateOwnership: (update: OwnershipUpdate) => void;
}

/**
 * Displays an array of owners! Work-in-progress.
 *
 * TODO: Add mutations to change ownership on explicit save.
 */
export const Ownership: React.FC<Props> = ({ owners, lastModifiedAt, updateOwnership }: Props): JSX.Element => {
    const entityRegistry = useEntityRegistry();

    const [form] = Form.useForm();
    const [editingIndex, setEditingIndex] = useState(-1);
    const [stagedOwners, setStagedOwners] = useState(owners);
    const [ownerQuery, setOwnerQuery] = useState('');
    const [getOwnerAutoCompleteResults, { data: searchOwnerSuggestionsData }] = useGetAutoCompleteResultsLazyQuery();

    useEffect(() => {
        setStagedOwners(owners);
    }, [owners]);

    const ownerTableData = useMemo(
        () =>
            stagedOwners.map((owner, index) =>
                owner.owner.type === EntityType.CorpUser
                    ? {
                          key: index,
                          urn: (owner.owner as CorpUser).urn,
                          ldap: (owner.owner as CorpUser).username,
                          fullName: (owner.owner as CorpUser).info?.fullName || (owner.owner as CorpUser).username,
                          role: owner.type,
                          pictureLink: (owner.owner as CorpUser).editableInfo?.pictureLink,
                          type: EntityType.CorpUser,
                      }
                    : {
                          key: index,
                          urn: (owner.owner as CorpGroup).urn,
                          ldap: (owner.owner as CorpGroup).name,
                          fullName: (owner.owner as CorpGroup).name,
                          role: owner.type,
                          type: EntityType.CorpGroup,
                      },
            ),
        [stagedOwners],
    );

    const isEditing = (record: any) => record.key === editingIndex;

    const onAdd = () => {
        setEditingIndex(stagedOwners.length);

        form.setFieldsValue({
            ldap: '',
            role: OwnershipType.Stakeholder,
            type: EntityType.CorpUser,
        });

        const newOwner = {
            owner: {
                type: EntityType.CorpUser,
                urn: '',
                username: '',
            },
            type: OwnershipType.Stakeholder,
            source: {
                type: OwnershipSourceType.Manual,
            },
        };

        const newStagedOwners = [...stagedOwners, newOwner];
        setStagedOwners(newStagedOwners);
    };

    const onDelete = (urn: string) => {
        const updatedOwners = owners
            .filter((owner) => !(owner.owner.urn === urn))
            .map((owner) => ({
                owner: owner.owner.urn,
                type: owner.type,
            }));
        updateOwnership({ owners: updatedOwners });
    };

    const onChangeOwnerQuery = async (query: string) => {
        if (query && query !== '') {
            const row = await form.validateFields();
            getOwnerAutoCompleteResults({
                variables: {
                    input: {
                        type: row.type,
                        query,
                        // field: 'ldap',
                    },
                },
            });
        }
        setOwnerQuery(query);
    };

    const onSave = async (record: any) => {
        const row = await form.validateFields();
        const updatedOwners = stagedOwners.map((owner, index) => {
            if (record.key === index) {
                return {
                    owner: `urn:li:${row.type === EntityType.CorpGroup ? 'corpGroup' : 'corpuser'}:${row.ldap}`,
                    type: row.role,
                };
            }
            return {
                owner: owner.owner.urn,
                type: owner.type,
            };
        });
        updateOwnership({ owners: updatedOwners });
        setEditingIndex(-1);
    };

    const onCancel = () => {
        const newStagedOwners = stagedOwners.filter((_, index) => index !== editingIndex);
        setStagedOwners(newStagedOwners);
        setEditingIndex(-1);
    };

    const onSelectSuggestion = (ldap: string) => {
        setOwnerQuery(ldap);
    };

    const ownerTableColumns = [
        {
            title: 'LDAP',
            dataIndex: 'ldap',
            render: (text: string, record: any) => {
                return isEditing(record) ? (
                    <Form.Item
                        name="ldap"
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                type: 'string',
                                message: `Please provide a valid LDAP!`,
                            },
                        ]}
                    >
                        <AutoComplete
                            options={
                                (searchOwnerSuggestionsData &&
                                    searchOwnerSuggestionsData.autoComplete &&
                                    searchOwnerSuggestionsData.autoComplete.suggestions.map((suggestion: string) => ({
                                        value: suggestion,
                                    }))) ||
                                []
                            }
                            value={ownerQuery}
                            onSelect={onSelectSuggestion}
                            onSearch={onChangeOwnerQuery}
                            placeholder={OWNER_SEARCH_PLACEHOLDER}
                        />
                    </Form.Item>
                ) : (
                    <CustomAvatar
                        key={record.urn}
                        placement="left"
                        name={record.fullName}
                        url={`/${entityRegistry.getPathName(record.type)}/${record.urn}`}
                        photoUrl={record.pictureLink}
                        style={{ marginRight: '15px' }}
                        isGroup={record.type === EntityType.CorpGroup}
                    />
                );
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (role: OwnershipType, record: any) => {
                return isEditing(record) ? (
                    <Form.Item
                        name="role"
                        style={{
                            margin: 0,
                            width: '50%',
                        }}
                        rules={[
                            {
                                required: true,
                                type: 'string',
                                message: `Please select a role!`,
                            },
                        ]}
                    >
                        <Select placeholder="Select a role">
                            {Object.values(OwnershipType).map((value) => (
                                <Select.Option value={value} key={value}>
                                    {value}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    <Tag>{role}</Tag>
                );
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (type: EntityType, record: any) => {
                return isEditing(record) ? (
                    <Form.Item
                        name="type"
                        style={{
                            margin: 0,
                            width: '50%',
                        }}
                        rules={[
                            {
                                required: true,
                                type: 'string',
                                message: `Please select a type!`,
                            },
                        ]}
                    >
                        <Select placeholder="Select a type" defaultValue={EntityType.CorpUser}>
                            <Select.Option value={EntityType.CorpUser} key={EntityType.CorpUser}>
                                {EntityType.CorpUser}
                            </Select.Option>
                            <Select.Option value={EntityType.CorpGroup} key={EntityType.CorpGroup}>
                                {EntityType.CorpGroup}
                            </Select.Option>
                        </Select>
                    </Form.Item>
                ) : (
                    <Tag>{type}</Tag>
                );
            },
        },
        {
            title: '',
            key: 'action',
            render: (_: string, record: any) => {
                return (
                    <Space direction="horizontal">
                        {isEditing(record) ? (
                            <>
                                <Button type="link" onClick={() => onSave(record)}>
                                    Save
                                </Button>
                                <Button type="link" style={{ color: 'grey' }} onClick={onCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button type="link" style={{ color: 'red' }} onClick={() => onDelete(record.urn)}>
                                Remove
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Typography.Text style={{ float: 'right' }}>
                Last updated <b>{new Date(lastModifiedAt).toLocaleDateString('en-US')}</b>
            </Typography.Text>
            <Typography.Title level={3}>Ownership</Typography.Title>
            <Typography.Paragraph>
                Please maintain at least <b>{NUMBER_OWNERS_REQUIRED}</b> owners.
            </Typography.Paragraph>
            <Form form={form} component={false}>
                <Table pagination={false} columns={ownerTableColumns} dataSource={ownerTableData} />
            </Form>
            {editingIndex < 0 && (
                <Button type="link" onClick={onAdd}>
                    <b> + </b> Add an owner
                </Button>
            )}
        </Space>
    );
};
