import React from 'react';
import { Button, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import TabToolbar from '../TabToolbar';
import { SearchBar } from '../../../../../search/SearchBar';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { AndFilterInput } from '../../../../../../types.generated';
import SearchExtendedMenu from './SearchExtendedMenu';
import { SearchSelectBar } from './SearchSelectBar';
import { EntityAndType } from '../../../types';
import { DownloadSearchResultsInput, DownloadSearchResults } from '../../../../../search/utils/types';
import { ViewSelect } from '../../../../view/select/ViewSelect';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 4px;
    padding-left: 4px;
`;

const SearchAndDownloadContainer = styled.div`
    display: flex;
    align-items: center;
`;

const SearchMenuContainer = styled.div`
    margin-left: 10px;
`;

const ViewSelectContainer = styled.span`
    margin-left: 14px;
`;

type Props = {
    onSearch: (q: string) => void;
    onToggleFilters: () => void;
    placeholderText?: string | null;
    downloadSearchResults: (input: DownloadSearchResultsInput) => Promise<DownloadSearchResults | null | undefined>;
    filters: AndFilterInput[];
    query: string;
    isSelectMode: boolean;
    isSelectAll: boolean;
    selectedEntities: EntityAndType[];
    setIsSelectMode: (showSelectMode: boolean) => any;
    setShowSelectViewMode: (showSelectViewMode: boolean) => any;
    onChangeSelectAll: (selected: boolean) => void;
    refetch?: () => void;
    searchBarStyle?: any;
    searchBarInputStyle?: any;
    applyView?: boolean;
    showSelectViewMode?: boolean;
};

export default function EmbeddedListSearchHeader({
    onSearch,
    onToggleFilters,
    placeholderText,
    downloadSearchResults,
    filters,
    query,
    isSelectMode,
    isSelectAll,
    selectedEntities,
    setIsSelectMode,
    setShowSelectViewMode,
    onChangeSelectAll,
    refetch,
    searchBarStyle,
    searchBarInputStyle,
    applyView,
    showSelectViewMode,
}: Props) {
    const entityRegistry = useEntityRegistry();

    return (
        <>
            <TabToolbar>
                <HeaderContainer>
                    <Button type="text" onClick={onToggleFilters}>
                        <FilterOutlined />
                        <Typography.Text>Filters</Typography.Text>
                    </Button>
                    <SearchAndDownloadContainer>
                        <SearchBar
                            data-testid="embedded-search-bar"
                            initialQuery=""
                            placeholderText={placeholderText || 'Search entities...'}
                            suggestions={[]}
                            style={
                                searchBarStyle || {
                                    maxWidth: 220,
                                    padding: 0,
                                }
                            }
                            inputStyle={
                                searchBarInputStyle || {
                                    height: 32,
                                    fontSize: 12,
                                }
                            }
                            onSearch={onSearch}
                            onQueryChange={onSearch}
                            entityRegistry={entityRegistry}
                            hideRecommendations
                        />
                        {applyView && showSelectViewMode && (
                            <ViewSelectContainer>
                                <ViewSelect />
                            </ViewSelectContainer>
                        )}
                        <SearchMenuContainer>
                            <SearchExtendedMenu
                                downloadSearchResults={downloadSearchResults}
                                filters={filters}
                                query={query}
                                setShowSelectMode={setIsSelectMode}
                                setShowSelectViewMode={setShowSelectViewMode}
                                showSelectViewMode={showSelectViewMode}
                                applyView={applyView}
                            />
                        </SearchMenuContainer>
                    </SearchAndDownloadContainer>
                </HeaderContainer>
            </TabToolbar>
            {isSelectMode && (
                <TabToolbar>
                    <SearchSelectBar
                        isSelectAll={isSelectAll}
                        onChangeSelectAll={onChangeSelectAll}
                        selectedEntities={selectedEntities}
                        onCancel={() => {
                            setIsSelectMode(false);
                        }}
                        refetch={refetch}
                    />
                </TabToolbar>
            )}
        </>
    );
}
