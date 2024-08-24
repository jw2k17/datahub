import { RocketOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ANTD_GRAY_V2 } from '../entity/shared/constants';
import { navigateToSearchUrl } from './utils/navigateToSearchUrl';
import analytics, { EventType } from '../analytics';
import { SuggestedText } from './suggestions/SearchQuerySugggester';
import useGetSearchQueryInputs from './useGetSearchQueryInputs';
import { FacetFilterInput, SearchSuggestion } from '../../types.generated';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../context/useUserContext';

const NoDataContainer = styled.div`
    margin: 40px auto;
    font-size: 16px;
    color: ${ANTD_GRAY_V2[8]};
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

function getRefineSearchText(filters: FacetFilterInput[], viewUrn?: string | null) {
    let text = '';
    if (filters.length && viewUrn) {
        text = 'clearing all filters and selected view';
    } else if (filters.length) {
        text = 'limpando todos os filtros';
    } else if (viewUrn) {
        text = 'clearing the selected view';
    }

    return text;
}

interface Props {
    suggestions: SearchSuggestion[];
}

export default function EmptySearchResults({ suggestions }: Props) {
    const { t } = useTranslation();
    const { query, filters, viewUrn } = useGetSearchQueryInputs();
    const history = useHistory();
    const userContext = useUserContext();
    const suggestText = suggestions.length > 0 ? suggestions[0].text : '';
    const refineSearchText = getRefineSearchText(filters, viewUrn);

    const onClickExploreAll = useCallback(() => {
        analytics.event({ type: EventType.SearchResultsExploreAllClickEvent });
        navigateToSearchUrl({ query: '*', history });
    }, [history]);

    const searchForSuggestion = () => {
        navigateToSearchUrl({ query: suggestText, history });
    };

    const clearFiltersAndView = () => {
        navigateToSearchUrl({ query, history });
        userContext.updateLocalState({
            ...userContext.localState,
            selectedViewUrn: undefined,
        });
    };

    return (
        <NoDataContainer>
            <Section>{t('search.noResultsFoundFor')} &quot;{query}&quot;</Section>
            {refineSearchText && (
                <>
                    {t('common.try')} <SuggestedText onClick={clearFiltersAndView}>{refineSearchText}</SuggestedText>{' '}
                    {suggestText && (
                        <>
                            {t('search.orSearchingFor_component')} <SuggestedText onClick={searchForSuggestion}>{suggestText}</SuggestedText>
                        </>
                    )}
                </>
            )}
            {!refineSearchText && suggestText && (
                <>
                    {t('search.didYouMean_component',{suggestText:suggestText})} 
                </>
            )}
            {!refineSearchText && !suggestText && (
                <Button onClick={onClickExploreAll}>
                    <RocketOutlined /> {t('search.exploreAll')}
                </Button>
            )}
        </NoDataContainer>
    );
}
