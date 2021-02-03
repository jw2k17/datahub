import React from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router';
import * as QueryString from 'query-string';
import { Affix } from 'antd';
import { BrowseCfg } from '../../conf';
import { BrowseResults } from './BrowseResults';
import { SearchablePage } from '../search/SearchablePage';
import { useGetBrowseResultsQuery } from '../../graphql/browse.generated';
import { BrowsePath } from './BrowsePath';
import { PageRoutes } from '../../conf/Global';
import { useEntityRegistry } from '../useEntityRegistry';

type BrowseResultsPageParams = {
    type: string;
};

export const BrowseResultsPage = () => {
    const location = useLocation();
    const history = useHistory();
    const { type } = useParams<BrowseResultsPageParams>();

    const entityRegistry = useEntityRegistry();

    const rootPath = location.pathname;
    const params = QueryString.parse(location.search);
    const entityType = entityRegistry.getTypeFromPathName(type);
    const path = rootPath.split('/').slice(3);
    const page = Number(params.page) || 1;

    const { data, loading, error } = useGetBrowseResultsQuery({
        variables: {
            input: {
                type: entityType,
                path,
                start: (page - 1) * BrowseCfg.RESULTS_PER_PAGE,
                count: BrowseCfg.RESULTS_PER_PAGE,
                filters: null,
            },
        },
    });

    const onChangePage = (newPage: number) => {
        history.push({
            pathname: rootPath,
            search: `&page=${newPage}`,
        });
    };

    if (page < 0 || page === undefined || Number.isNaN(page)) {
        return <Redirect to={`${PageRoutes.BROWSE}`} />;
    }

    return (
        <SearchablePage>
            <Affix offsetTop={64}>
                <BrowsePath type={entityType} path={path} />
            </Affix>
            {error && <p>Error fetching browse results!</p>}
            {loading && <p>Loading browse results...</p>}
            {data && data.browse && (
                <BrowseResults
                    type={entityType}
                    rootPath={rootPath}
                    title={path.length > 0 ? path[path.length - 1] : entityRegistry.getCollectionName(entityType)}
                    pageSize={BrowseCfg.RESULTS_PER_PAGE}
                    pageStart={page * BrowseCfg.RESULTS_PER_PAGE}
                    groups={data.browse.metadata.groups}
                    entities={data.browse.entities}
                    totalResults={data.browse.total}
                    onChangePage={onChangePage}
                />
            )}
        </SearchablePage>
    );
};
