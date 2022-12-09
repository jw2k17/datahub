import { ListUsersDocument, ListUsersQuery } from '../../../graphql/user.generated';

export const DEFAULT_USER_LIST_PAGE_SIZE = 25;

export const removeUserFromListUsersCache = (urn, client) => {
    const currData: ListUsersQuery | null = client.readQuery({
        query: ListUsersDocument,
        variables: {
            input: {
                start: 0,
                count: DEFAULT_USER_LIST_PAGE_SIZE,
            },
        },
    });

    const newUsers = [...(currData?.listUsers?.users || []).filter((source) => source.urn !== urn)];

    // Write our data back to the cache.
    client.writeQuery({
        query: ListUsersDocument,
        variables: {
            input: {
                start: 0,
                count: DEFAULT_USER_LIST_PAGE_SIZE,
            },
        },
        data: {
            listUsers: {
                start: currData?.listUsers?.start || 0,
                count: (currData?.listUsers?.count || 1) - 1,
                total: (currData?.listUsers?.total || 1) - 1,
                users: newUsers,
            },
        },
    });
};

export const clearUserListCache = (client) => {
    // Remove any caching of 'listUsers'
    client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'listUsers' });
};
