import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Divider, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ChartGroup } from './ChartGroup';
import { useGetAnalyticsChartsQuery, useGetMetadataAnalyticsChartsQuery } from '../../../graphql/analytics.generated';
import { useGetHighlightsQuery } from '../../../graphql/highlights.generated';
import { Highlight } from './Highlight';
import { Message } from '../../shared/Message';
import { useListDomainsQuery } from '../../../graphql/domain.generated';
import filterSearchQuery from '../../search/utils/filterSearchQuery';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { useUserContext } from '../../context/useUserContext';
import { useTranslation } from 'react-i18next';


const HighlightGroup = styled.div`
    display: flex;
    align-items: space-between;
    justify-content: center;
    padding-top: 20px;
    margin-bottom: 10px;
`;

const MetadataAnalyticsInput = styled.div`
    display: flex;
`;

const MetadataAnalyticsPlaceholder = styled.span`
    margin: 25px;
    margin-bottom: 50px;
    font-size: 18px;
    color: ${ANTD_GRAY[7]};
`;

const DomainSelect = styled(Select)`
    margin-left: 25px;
    width: 200px;
    display: inline-block;
`;

const StyledSearchBar = styled(Input)`
    &&& {
        margin-left: 10px;
        border-radius: 70px;
        color: ${ANTD_GRAY[7]};
        width: 250px;
    }
`;

export const AnalyticsPage = () => {
    const { t } = useTranslation();
    const me = useUserContext();
    const canManageDomains = me?.platformPrivileges?.createDomains;
    const { data: chartData, loading: chartLoading, error: chartError } = useGetAnalyticsChartsQuery();
    const { data: highlightData, loading: highlightLoading, error: highlightError } = useGetHighlightsQuery();
    const {
        loading: domainLoading,
        error: domainError,
        data: domainData,
    } = useListDomainsQuery({
        skip: !canManageDomains,
        variables: {
            input: {
                start: 0,
                count: 1000,
            },
        },
        fetchPolicy: 'no-cache',
    });
    const [domain, setDomain] = useState('');
    const [stagedQuery, setStagedQuery] = useState('');
    const [query, setQuery] = useState('');

    const onDomainChange = (inputDomain) => setDomain(inputDomain);
    const onStagedQueryChange = (inputQuery) => setStagedQuery(inputQuery);
    const {
        loading: metadataAnalyticsLoading,
        error: metadataAnalyticsError,
        data: metadataAnalyticsData,
    } = useGetMetadataAnalyticsChartsQuery({
        variables: {
            input: {
                entityType: null,
                domain,
                query,
            },
        },
        skip: domain === '' && query === '',
    });

    const isLoading = highlightLoading || chartLoading || domainLoading || metadataAnalyticsLoading;
    return (
        <>
            {isLoading && <Message type="loading" content="Loading..." style={{ marginTop: '10%' }} />}
            <HighlightGroup>
                {highlightError && (
                    <Alert type="error" message={highlightError?.message || t('analytics.highlightsFailedToLoad')} />
                )}
                {highlightData?.getHighlights?.map((highlight) => (
                    <Highlight highlight={highlight} shortenValue />
                ))}
            </HighlightGroup>
            <>
                {chartError && (
                    <Alert type="error" message={metadataAnalyticsError?.message || t('analytics.chartsFailedToLoad')} />
                )}
                {chartData?.getAnalyticsCharts
                    ?.filter((chartGroup) => chartGroup.groupId === 'GlobalMetadataAnalytics')
                    .map((chartGroup) => (
                        <ChartGroup chartGroup={chartGroup} />
                    ))}
            </>
            <>
                {domainError && (
                    <Alert type="error" message={metadataAnalyticsError?.message || t('analytics.domainsFailedToLoad')} />
                )}
                {!chartLoading && (
                    <>
                        <Divider />
                        <MetadataAnalyticsInput>
                            <DomainSelect
                                showSearch
                                placeholder={t('analytics.selectADomain')}
                                onChange={onDomainChange}
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Select.Option value="ALL">{t('common.all')}</Select.Option>
                                {domainData?.listDomains?.domains.map((domainChoice) => (
                                    <Select.Option value={domainChoice.urn}>
                                        {domainChoice?.properties?.name}
                                    </Select.Option>
                                ))}
                            </DomainSelect>
                            <StyledSearchBar
                                placeholder={t('common.search')}
                                onPressEnter={(e) => {
                                    e.stopPropagation();
                                    setQuery(filterSearchQuery(stagedQuery || ''));
                                }}
                                value={stagedQuery}
                                onChange={(e) => onStagedQueryChange(e.target.value)}
                                data-testid="analytics-search-input"
                                prefix={
                                    <SearchOutlined onClick={() => setQuery(filterSearchQuery(stagedQuery || ''))} />
                                }
                            />
                        </MetadataAnalyticsInput>
                    </>
                )}
            </>
            <>
                {metadataAnalyticsError && (
                    <Alert type="error" message={metadataAnalyticsError?.message || t('analytics.chartsFailedToLoad')} />
                )}
                {domain === '' && query === ''
                    ? !chartLoading && (
                          <MetadataAnalyticsPlaceholder>
                              {t('analytics.specifyDomainOrQueryToGetGranularResults')}
                          </MetadataAnalyticsPlaceholder>
                      )
                    : metadataAnalyticsData?.getMetadataAnalyticsCharts?.map((chartGroup) => (
                          <ChartGroup chartGroup={chartGroup} />
                      ))}
            </>
            <>
                {chartError && <Alert type="error" message={chartError?.message || t('analytics.chartsFailedToLoad')} />}
                {!chartLoading &&
                    chartData?.getAnalyticsCharts
                        ?.filter((chartGroup) => chartGroup.groupId === 'DataHubUsageAnalytics')
                        .map((chartGroup) => (
                            <>
                                <Divider />
                                <ChartGroup chartGroup={chartGroup} />
                            </>
                        ))}
            </>
        </>
    );
};
