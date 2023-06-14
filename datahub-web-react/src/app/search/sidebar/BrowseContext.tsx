import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import {
    AggregationMetadata,
    BrowseResultGroupV2,
    EntityType,
    FacetFilterInput,
    FilterOperator,
} from '../../../types.generated';
import { createBrowseV2SearchFilter } from '../filters/utils';
import {
    BROWSE_PATH_V2_FILTER_NAME,
    ENTITY_SUB_TYPE_FILTER_NAME,
    ORIGIN_FILTER_NAME,
    PLATFORM_FILTER_NAME,
} from '../utils/constants';
import { useHasFilterValue, useOnChangeFilters, useSelectedFilters } from './SidebarContext';
import { applyFacetFilterOverrides } from '../utils/applyFilterOverrides';
import { getEntitySubtypeFiltersForEntity } from './browseContextUtils';
import { useEntityRegistry } from '../../useEntityRegistry';

type BrowseContextValue = {
    entityAggregation?: AggregationMetadata;
    environmentAggregation?: AggregationMetadata;
    platformAggregation?: AggregationMetadata;
    browseResultGroup?: BrowseResultGroupV2;
    path: Array<string>;
};

const BrowseContext = createContext<BrowseContextValue | null>(null);

type Props = {
    children: ReactNode;
    entityAggregation?: AggregationMetadata;
    environmentAggregation?: AggregationMetadata;
    platformAggregation?: AggregationMetadata;
    browseResultGroup?: BrowseResultGroupV2;
    parentPath?: Array<string>;
};

export const BrowseProvider = ({
    children,
    entityAggregation,
    environmentAggregation,
    platformAggregation,
    browseResultGroup,
    parentPath,
}: Props) => {
    const path = useMemo(() => {
        const basePath = parentPath ? [...parentPath] : [];
        return browseResultGroup ? [...basePath, browseResultGroup.name] : basePath;
    }, [browseResultGroup, parentPath]);

    return (
        <BrowseContext.Provider
            value={{
                entityAggregation,
                environmentAggregation,
                platformAggregation,
                browseResultGroup,
                path,
            }}
        >
            {children}
        </BrowseContext.Provider>
    );
};

const useBrowseContext = () => {
    const context = useContext(BrowseContext);
    if (context === null) throw new Error(`${useBrowseContext.name} must be used under a ${BrowseProvider.name}`);
    return context;
};

export const useMaybeEntityAggregation = () => {
    return useBrowseContext().entityAggregation;
};

export const useMaybeEntityType = () => {
    const entityAggregation = useMaybeEntityAggregation();
    return entityAggregation ? (entityAggregation.value as EntityType) : null;
};

export const useEntityAggregation = () => {
    const entityAggregation = useMaybeEntityAggregation();
    if (!entityAggregation) throw new Error('entityAggregation is missing in context');
    return entityAggregation;
};

export const useEntityType = () => {
    return useEntityAggregation().value as EntityType;
};

export const useMaybeEnvironmentAggregation = () => {
    return useBrowseContext().environmentAggregation;
};

export const useEnvironmentAggregation = () => {
    const environmentAggregation = useMaybeEnvironmentAggregation();
    if (!environmentAggregation) throw new Error('environmentAggregation is missing in context');
    return environmentAggregation;
};

export const useMaybePlatformAggregation = () => {
    return useBrowseContext().platformAggregation;
};

export const usePlatformAggregation = () => {
    const platformAggregation = useMaybePlatformAggregation();
    if (!platformAggregation) throw new Error('platformAggregation is missing in context');
    return platformAggregation;
};

export const useMaybeBrowseResultGroup = () => {
    return useBrowseContext().browseResultGroup;
};

export const useBrowseResultGroup = () => {
    const browseResultGroup = useMaybeBrowseResultGroup();
    if (!browseResultGroup) throw new Error('browseResultGroup is missing in context');
    return browseResultGroup;
};

export const useBrowseDisplayName = () => {
    const entityRegistry = useEntityRegistry();
    const browseResultGroup = useBrowseResultGroup();
    const { entity } = browseResultGroup;
    return entity ? entityRegistry.getDisplayName(entity.type, entity) : browseResultGroup.name;
};

export const useBrowsePath = () => {
    const context = useBrowseContext();
    if (!context.path) throw new Error('path is missing in context');
    return context.path;
};

export const useBrowsePathLength = () => {
    return useBrowsePath().length;
};

export const useBrowseSearchFilter = () => {
    return createBrowseV2SearchFilter(useBrowsePath());
};

export const useIsEntitySelected = () => {
    return useHasFilterValue(ENTITY_SUB_TYPE_FILTER_NAME, useEntityAggregation().value, { prefix: true });
};

export const useIsEnvironmentSelected = () => {
    const environmentAggregation = useMaybeEnvironmentAggregation();
    const isEntitySelected = useIsEntitySelected();
    const isEnvironmentSelected = useHasFilterValue(ORIGIN_FILTER_NAME, environmentAggregation?.value);
    return isEntitySelected && (!environmentAggregation || isEnvironmentSelected);
};

export const useIsPlatformSelected = () => {
    const isEntitySelected = useIsEntitySelected();
    const isEnvironmentSelected = useIsEnvironmentSelected();
    const isPlatformSelected = useHasFilterValue(PLATFORM_FILTER_NAME, usePlatformAggregation().value);
    return isEntitySelected && isEnvironmentSelected && isPlatformSelected;
};

export const useIsBrowsePathPrefix = () => {
    const isEntitySelected = useIsEntitySelected();
    const isEnvironmentSelected = useIsEnvironmentSelected();
    const isPlatformSelected = useIsPlatformSelected();
    const isBrowsePathPrefix = useHasFilterValue(BROWSE_PATH_V2_FILTER_NAME, useBrowseSearchFilter(), {
        prefix: true,
    });
    return isEntitySelected && isEnvironmentSelected && isPlatformSelected && isBrowsePathPrefix;
};

export const useIsBrowsePathSelected = () => {
    const isEntitySelected = useIsEntitySelected();
    const isEnvironmentSelected = useIsEnvironmentSelected();
    const isPlatformSelected = useIsPlatformSelected();
    const isBrowsePathSelected = useHasFilterValue(BROWSE_PATH_V2_FILTER_NAME, useBrowseSearchFilter());
    return isEntitySelected && isEnvironmentSelected && isPlatformSelected && isBrowsePathSelected;
};

export const useOnSelectBrowsePath = () => {
    const entityAggregation = useEntityAggregation();
    const environmentAggregation = useMaybeEnvironmentAggregation();
    const platformAggregation = usePlatformAggregation();
    const browseSearchFilter = useBrowseSearchFilter();
    const selectedFilters = useSelectedFilters();
    const onChangeFilters = useOnChangeFilters();

    return (isSelected: boolean) => {
        const overrides: Array<FacetFilterInput> = [];

        // keep entity and subType filters for this given entity only if they exist, otherwise apply this entity filter
        const entitySubtypeFilters = getEntitySubtypeFiltersForEntity(entityAggregation.value, selectedFilters);
        overrides.push({
            field: ENTITY_SUB_TYPE_FILTER_NAME,
            condition: FilterOperator.Equal,
            values: entitySubtypeFilters || [entityAggregation.value],
        });

        if (environmentAggregation)
            overrides.push({
                field: ORIGIN_FILTER_NAME,
                condition: FilterOperator.Equal,
                values: [environmentAggregation.value],
            });

        overrides.push({
            field: PLATFORM_FILTER_NAME,
            condition: FilterOperator.Equal,
            values: [platformAggregation.value],
        });

        overrides.push({
            field: BROWSE_PATH_V2_FILTER_NAME,
            condition: FilterOperator.Equal,
            values: [browseSearchFilter],
        });

        // todo - a cypress test for this flow would be great

        const filtersWithOverrides = applyFacetFilterOverrides(selectedFilters, overrides).filter(
            (filter) => isSelected || filter.field !== BROWSE_PATH_V2_FILTER_NAME,
        );

        onChangeFilters(filtersWithOverrides);
    };
};
