import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useState } from 'react';
import useGetSearchQueryInputs from '../useGetSearchQueryInputs';
import { BROWSE_PATH_V2_FILTER_NAME, ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME } from '../utils/constants';
import { useMaybeEntityType, useMaybeEnvironmentAggregation, useMaybePlatformAggregation } from './BrowseContext';
import { applyOrFilterOverrides } from '../utils/applyFilterOverrides';
import { SidebarFilters } from './types';

export const useSidebarFilters = (): SidebarFilters => {
    const entityType = useMaybeEntityType();
    const environment = useMaybeEnvironmentAggregation()?.value;
    const platform = useMaybePlatformAggregation()?.value;

    const filterOverrides = useMemo(
        () => [
            ...(environment ? [{ field: ORIGIN_FILTER_NAME, value: environment }] : []),
            ...(platform ? [{ field: PLATFORM_FILTER_NAME, value: platform }] : []),
        ],
        [environment, platform],
    );

    const excludedFilterFields = useMemo(
        () => filterOverrides.map((filter) => filter.field).concat(BROWSE_PATH_V2_FILTER_NAME),
        [filterOverrides],
    );

    const {
        entityFilters: latestEntityFilters,
        query: latestQuery,
        orFilters: latestOrFilters,
        viewUrn: latestViewUrn,
    } = useGetSearchQueryInputs(excludedFilterFields);

    const latestSidebarFilters = useMemo(
        () => ({
            // todo(josh): remove this and move it to a normal filterOverride when _entityType is fully wired up on the backend
            entityFilters: entityType ? [entityType] : latestEntityFilters,
            query: latestQuery,
            orFilters: applyOrFilterOverrides(latestOrFilters, filterOverrides),
            viewUrn: latestViewUrn,
        }),
        [entityType, filterOverrides, latestEntityFilters, latestOrFilters, latestQuery, latestViewUrn],
    );

    const [sidebarFilters, setSidebarFilters] = useState(latestSidebarFilters);

    // Ensures we only trigger filter updates in the sidebar if they truly changed (clicking browse could trigger this when we don't want)
    useEffect(() => {
        // todo - consider hardening this equality check some more
        if (!isEqual(sidebarFilters, latestSidebarFilters)) setSidebarFilters(latestSidebarFilters);
    }, [latestSidebarFilters, sidebarFilters]);

    return sidebarFilters;
};
