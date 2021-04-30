import { Divider, Alert } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import UserHeader from '../user/UserHeader';
import UserDetails from '../user/UserDetails';
import useUserParams from '../user/routingUtils/useUserParams';
import { useGetUserGroupQuery } from '../../../graphql/user.generated';
import { useGetAllEntitySearchResults } from '../../../utils/customGraphQL/useGetAllEntitySearchResults';
import { Message } from '../../shared/Message';

const PageContainer = styled.div`
    padding: 32px 100px;
`;

const messageStyle = { marginTop: '10%' };

/**
 * Responsible for reading & writing users.
 */
export default function UserGroupProfile() {
    const { urn, subview, item } = useUserParams();
    const { loading, error, data } = useGetUserGroupQuery({ variables: { urn } });

    const name = data?.corpGroup?.name;

    const ownershipResult = useGetAllEntitySearchResults({
        query: `owners:${name}`,
    });

    const contentLoading =
        Object.keys(ownershipResult).some((type) => {
            return ownershipResult[type].loading;
        }) || loading;

    const ownershipForDetails = useMemo(() => {
        Object.keys(ownershipResult).forEach((type) => {
            const entities = ownershipResult[type].data?.search?.searchResults;

            if (!entities || entities.length === 0) {
                delete ownershipResult[type];
            } else {
                ownershipResult[type] = ownershipResult[type].data?.search?.searchResults;
            }
        });
        return ownershipResult;
    }, [ownershipResult]);

    if (error || (!loading && !error && !data)) {
        return <Alert type="error" message={error?.message || 'Entity failed to load'} />;
    }

    return (
        <PageContainer>
            {contentLoading && <Message type="loading" content="Loading..." style={messageStyle} />}
            <UserHeader
                name={data?.corpGroup?.name}
                title={data?.corpGroup?.name}
                email={data?.corpGroup?.info?.email}
                teams={data?.corpGroup?.info?.groups}
            />
            <Divider />
            <UserDetails urn={urn} subview={subview} item={item} ownerships={ownershipForDetails} />
        </PageContainer>
    );
}
