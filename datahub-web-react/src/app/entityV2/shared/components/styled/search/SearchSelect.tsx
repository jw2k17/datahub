import { FilterOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDebounce } from 'react-use';

import useSortInput from '@src/app/searchV2/sorting/useSortInput';
import SearchSortSelect from '@src/app/searchV2/sorting/SearchSortSelect';
import { SearchCfg } from '../../../../../../conf';
import { useGetSearchResultsForMultipleQuery } from '../../../../../../graphql/search.generated';
import { EntityType, FacetFilterInput, FilterOperator } from '../../../../../../types.generated';
import { EntityAndType } from '../../../../../entity/shared/types';
import { SearchBar } from '../../../../../search/SearchBar';
import { ENTITY_FILTER_NAME, UnionType } from '../../../../../search/utils/constants';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { ANTD_GRAY } from '../../../constants';
import { isListSubset } from '../../../utils';
import TabToolbar from '../TabToolbar';
import { EmbeddedListSearchResults } from './EmbeddedListSearchResults';
import { SearchSelectBar } from './SearchSelectBar';

const Container = styled.span`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const SearchBarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid ${ANTD_GRAY[4]};
`;

const SEARCH_BAR_STYLE = {
    maxWidth: 680,
    padding: 0,
};

const SEARCH_INPUT_STYLE = {
    height: 40,
    fontSize: 12,
};

type Props = {
    fixedEntityTypes?: Array<EntityType> | null;
    placeholderText?: string | null;
    selectedEntities: EntityAndType[];
    setSelectedEntities: (Entities: EntityAndType[]) => void;
    limit?: number;
};

/**
 * An embeddable component that can be used for searching & selecting a subset of the entities on the Metadata Graph
 * in order to perform some action.
 *
 * This component provides easy ways to filter for a specific set of entity types, and provides a set of entity urns
 * when the selection is complete.
 */
export const SearchSelect = ({
    fixedEntityTypes,
    placeholderText,
    selectedEntities,
    setSelectedEntities,
    limit,
}: Props) => {
    const entityRegistry = useEntityRegistry();

    // Component state
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Array<FacetFilterInput>>([]);
    const [unionType, setUnionType] = useState(UnionType.AND);
    const [showFilters, setShowFilters] = useState(false);
    const [numResultsPerPage, setNumResultsPerPage] = useState(SearchCfg.RESULTS_PER_PAGE);
    const [sortOption, setSortOption] = useState<string | undefined>();
    const sortInput = useSortInput(sortOption);

    useDebounce(() => setSearchQuery(query), 300, [query]);

    // Compute search filters
    const filtersWithoutEntities: Array<FacetFilterInput> = filters.filter(
        (filter) => filter.field !== ENTITY_FILTER_NAME,
    );
    const entityFilters: Array<EntityType> = filters
        .filter((filter) => filter.field === ENTITY_FILTER_NAME)
        .flatMap((filter) => filter.values?.map((value) => value.toUpperCase() as EntityType) || []);
    const finalEntityTypes = (entityFilters.length > 0 && entityFilters) || fixedEntityTypes || [];

    const finalEntityFilter: FacetFilterInput = {
        field: ENTITY_FILTER_NAME,
        condition: FilterOperator.Equal,
        values: finalEntityTypes,
        negated: false,
    };

    // Execute search
    const { data, loading, error, refetch } = useGetSearchResultsForMultipleQuery({
        variables: {
            input: {
                types: finalEntityTypes,
                query: searchQuery,
                start: (page - 1) * numResultsPerPage,
                count: numResultsPerPage,
                filters: [...filtersWithoutEntities, finalEntityFilter],
                sortInput,
            },
        },
    });

    const searchAcrossEntities = data?.searchAcrossEntities;
    const searchResultEntities =
        searchAcrossEntities?.searchResults?.map((result) => ({ urn: result.entity.urn, type: result.entity.type })) ||
        [];
    const searchResultUrns = searchResultEntities.map((entity) => entity.urn);
    const selectedEntityUrns = selectedEntities.map((entity) => entity.urn);
    const facets = searchAcrossEntities?.facets || [];

    const onSearch = (q: string) => {
        setQuery(q);
    };

    const onChangeFilters = (newFilters: Array<FacetFilterInput>) => {
        setPage(1);
        setFilters(newFilters);
    };

    const onChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const onToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    /**
     * Invoked when the "select all" checkbox is clicked.
     *
     * This method either adds the entire current page of search results to
     * the list of selected entities, or removes the current page from the set of selected entities.
     */
    const onChangeSelectAll = (selected: boolean) => {
        if (selected) {
            // Add current page of urns to the master selected entity list
            const entitiesToAdd = searchResultEntities.filter(
                (entity) =>
                    selectedEntities.findIndex(
                        (element) => element.urn === entity.urn && element.type === entity.type,
                    ) < 0,
            );
            setSelectedEntities(Array.from(new Set(selectedEntities.concat(entitiesToAdd))));
        } else {
            // Filter out the current page of entity urns from the list
            setSelectedEntities(selectedEntities.filter((entity) => searchResultUrns.indexOf(entity.urn) === -1));
        }
    };

    return (
        <Container>
            {error && message.error(`Failed to complete search: ${error && error.message}`)}
            <SearchBarContainer>
                <Button type="text" onClick={onToggleFilters}>
                    <FilterOutlined />
                    <Typography.Text>Filters</Typography.Text>
                </Button>
                <SearchBar
                    initialQuery=""
                    placeholderText={placeholderText || 'Search entities...'}
                    suggestions={[]}
                    style={SEARCH_BAR_STYLE}
                    inputStyle={SEARCH_INPUT_STYLE}
                    onSearch={onSearch}
                    onQueryChange={onSearch}
                    entityRegistry={entityRegistry}
                />
                <SearchSortSelect selectedSortOption={sortOption} setSelectedSortOption={setSortOption} />
            </SearchBarContainer>
            <TabToolbar>
                <SearchSelectBar
                    isSelectAll={selectedEntities.length > 0 && isListSubset(searchResultUrns, selectedEntityUrns)}
                    onChangeSelectAll={onChangeSelectAll}
                    showCancel={false}
                    showActions={false}
                    refetch={refetch}
                    selectedEntities={selectedEntities}
                    setSelectedEntities={setSelectedEntities}
                    limit={limit}
                />
            </TabToolbar>
            <EmbeddedListSearchResults
                loading={loading}
                searchResponse={searchAcrossEntities}
                filters={facets}
                unionType={unionType}
                selectedFilters={filters}
                onChangeFilters={onChangeFilters}
                onChangePage={onChangePage}
                onChangeUnionType={setUnionType}
                page={page}
                showFilters={showFilters}
                numResultsPerPage={numResultsPerPage}
                setNumResultsPerPage={setNumResultsPerPage}
                isSelectMode
                selectedEntities={selectedEntities}
                setSelectedEntities={setSelectedEntities}
                selectLimit={limit}
            />
        </Container>
    );
};
