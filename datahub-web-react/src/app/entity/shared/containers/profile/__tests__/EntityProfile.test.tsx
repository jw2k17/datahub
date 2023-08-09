import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TestPageContainer from '../../../../../../utils/test-utils/TestPageContainer';
import { mocks } from '../../../../../../Mocks';
import { EntityProfile } from '../EntityProfile';
import {
    useGetDatasetQuery,
    useUpdateDatasetMutation,
    GetDatasetQuery,
} from '../../../../../../graphql/dataset.generated';
import { EntityType } from '../../../../../../types.generated';
import QueriesTab from '../../../tabs/Dataset/Queries/QueriesTab';
import { SchemaTab } from '../../../tabs/Dataset/Schema/SchemaTab';
import StatsTab from '../../../tabs/Dataset/Stats/StatsTab';
import { DocumentationTab } from '../../../tabs/Documentation/DocumentationTab';
import { LineageTab } from '../../../tabs/Lineage/LineageTab';
import { PropertiesTab } from '../../../tabs/Properties/PropertiesTab';
import { SidebarStatsSection } from '../sidebar/Dataset/StatsSidebarSection';
import { SidebarOwnerSection } from '../sidebar/Ownership/sidebar/SidebarOwnerSection';
import { SidebarAboutSection } from '../sidebar/AboutSection/SidebarAboutSection';
import { SidebarTagsSection } from '../sidebar/SidebarTagsSection';

describe('EntityProfile', () => {

    it('renders dataset page', async () => {
        jest.setTimeout(30000)
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer initialEntries={['/dataset/urn:li:dataset:3']}>
                    <EntityProfile
                        urn="urn:li:dataset:3"
                        entityType={EntityType.Dataset}
                        useEntityQuery={useGetDatasetQuery}
                        useUpdateQuery={useUpdateDatasetMutation}
                        getOverrideProperties={() => ({})}
                        tabs={[
                            {
                                name: 'Schema',
                                component: SchemaTab,
                            },
                            {
                                name: 'Documentation',
                                component: DocumentationTab,
                            },
                            {
                                name: 'Properties',
                                component: PropertiesTab,
                            },
                            {
                                name: 'Lineage',
                                component: LineageTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) > 0 ||
                                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) > 0,
                                },
                            },
                            {
                                name: 'Queries',
                                component: QueriesTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) || false,
                                },
                            },
                            {
                                name: 'Stats',
                                component: StatsTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                        ]}
                        sidebarSections={[
                            {
                                component: SidebarAboutSection,
                            },
                            {
                                component: SidebarStatsSection,
                                display: {
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                            {
                                component: SidebarTagsSection,
                            },
                            {
                                component: SidebarOwnerSection,
                            },
                        ]}
                    />
                </TestPageContainer>
            </MockedProvider>
            );

        await waitFor(() => expect(getByText('Yet Another Dataset')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() =>
            expect(getByText('This and here we have yet another Dataset (YAN). Are there more?')).toBeInTheDocument(),
            {timeout:10000});
    });

    it('renders tab content', async () => {
        jest.setTimeout(30000)
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer initialEntries={['/dataset/urn:li:dataset:3']}>
                    <EntityProfile
                        urn="urn:li:dataset:3"
                        entityType={EntityType.Dataset}
                        useEntityQuery={useGetDatasetQuery}
                        useUpdateQuery={useUpdateDatasetMutation}
                        getOverrideProperties={() => ({})}
                        tabs={[
                            {
                                name: 'Schema',
                                component: SchemaTab,
                            },
                            {
                                name: 'Documentation',
                                component: DocumentationTab,
                            },
                            {
                                name: 'Properties',
                                component: PropertiesTab,
                            },
                            {
                                name: 'Lineage',
                                component: LineageTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) > 0 ||
                                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) > 0,
                                },
                            },
                            {
                                name: 'Queries',
                                component: QueriesTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) || false,
                                },
                            },
                            {
                                name: 'Stats',
                                component: StatsTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                        ]}
                        sidebarSections={[
                            {
                                component: SidebarAboutSection,
                            },
                            {
                                component: SidebarStatsSection,
                                display: {
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                            {
                                component: SidebarTagsSection,
                            },
                            {
                                component: SidebarOwnerSection,
                            },
                        ]}
                    />
                </TestPageContainer>
            </MockedProvider>,
        );

        // find the schema fields in the schema table
        await waitFor(() => expect(getByText('user_name')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() => expect(getByText('user_id')).toBeInTheDocument(),{timeout:10000});
    });

    it('switches tab content', async () => {
        jest.setTimeout(30000)
        const { getByText, queryByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer initialEntries={['/dataset/urn:li:dataset:3']}>
                    <EntityProfile
                        urn="urn:li:dataset:3"
                        entityType={EntityType.Dataset}
                        useEntityQuery={useGetDatasetQuery}
                        useUpdateQuery={useUpdateDatasetMutation}
                        getOverrideProperties={() => ({})}
                        tabs={[
                            {
                                name: 'Schema',
                                component: SchemaTab,
                            },
                            {
                                name: 'Documentation',
                                component: DocumentationTab,
                            },
                            {
                                name: 'Properties',
                                component: PropertiesTab,
                            },
                            {
                                name: 'Lineage',
                                component: LineageTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) > 0 ||
                                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) > 0,
                                },
                            },
                            {
                                name: 'Queries',
                                component: QueriesTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) || false,
                                },
                            },
                            {
                                name: 'Stats',
                                component: StatsTab,
                                display: {
                                    enabled: (_, _1) => true,
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                        ]}
                        sidebarSections={[
                            {
                                component: SidebarAboutSection,
                            },
                            {
                                component: SidebarStatsSection,
                                display: {
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                            {
                                component: SidebarTagsSection,
                            },
                            {
                                component: SidebarOwnerSection,
                            },
                        ]}
                    />
                </TestPageContainer>
            </MockedProvider>,
        );

        // find the schema fields in the schema table
        await waitFor(() => expect(getByText('user_name')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() => expect(getByText('user_id')).toBeInTheDocument(),{timeout:10000});
        expect(queryByText('propertyAKey')).not.toBeInTheDocument();

        fireEvent(
            getByText('Properties'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        );

        await waitFor(() => expect(getByText('propertyAKey')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() => expect(getByText('propertyAValue')).toBeInTheDocument(),{timeout:10000});
        expect(queryByText('user_name')).not.toBeInTheDocument();
    });

    it('renders sidebar content', async () => {
        jest.setTimeout(30000)
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer initialEntries={['/dataset/urn:li:dataset:3']}>
                    <EntityProfile
                        urn="urn:li:dataset:3"
                        entityType={EntityType.Dataset}
                        useEntityQuery={useGetDatasetQuery}
                        useUpdateQuery={useUpdateDatasetMutation}
                        getOverrideProperties={() => ({})}
                        tabs={[
                            {
                                name: 'Schema',
                                component: SchemaTab,
                            },
                            {
                                name: 'Documentation',
                                component: DocumentationTab,
                            },
                            {
                                name: 'Properties',
                                component: PropertiesTab,
                            },
                            {
                                name: 'Lineage',
                                component: LineageTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) > 0 ||
                                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) > 0,
                                },
                            },
                            {
                                name: 'Queries',
                                component: QueriesTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) || false,
                                },
                            },
                            {
                                name: 'Stats',
                                component: StatsTab,
                                display: {
                                    enabled: (_, _1) => true,
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                        ]}
                        sidebarSections={[
                            {
                                component: SidebarAboutSection,
                            },
                            {
                                component: SidebarStatsSection,
                                display: {
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                            {
                                component: SidebarTagsSection,
                            },
                            {
                                component: SidebarOwnerSection,
                            },
                        ]}
                    />
                </TestPageContainer>
            </MockedProvider>,
        );

        // find the tags
        await waitFor(() => expect(getByText('Tags')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() => expect(getByText('abc-sample-tag')).toBeInTheDocument(),{timeout:10000});
    });

    it('renders autorender aspects', async () => {
        jest.setTimeout(30000)
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <TestPageContainer initialEntries={['/dataset/urn:li:dataset:3']}>
                    <EntityProfile
                        urn="urn:li:dataset:3"
                        entityType={EntityType.Dataset}
                        useEntityQuery={useGetDatasetQuery}
                        useUpdateQuery={useUpdateDatasetMutation}
                        getOverrideProperties={() => ({})}
                        tabs={[
                            {
                                name: 'Schema',
                                component: SchemaTab,
                            },
                            {
                                name: 'Documentation',
                                component: DocumentationTab,
                            },
                            {
                                name: 'Properties',
                                component: PropertiesTab,
                            },
                            {
                                name: 'Lineage',
                                component: LineageTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) > 0 ||
                                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) > 0,
                                },
                            },
                            {
                                name: 'Queries',
                                component: QueriesTab,
                                display: {
                                    visible: (_, _1) => true,
                                    enabled: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) || false,
                                },
                            },
                            {
                                name: 'Stats',
                                component: StatsTab,
                                display: {
                                    enabled: (_, _1) => true,
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                        ]}
                        sidebarSections={[
                            {
                                component: SidebarAboutSection,
                            },
                            {
                                component: SidebarStatsSection,
                                display: {
                                    visible: (_, dataset: GetDatasetQuery) =>
                                        (dataset?.dataset?.datasetProfiles?.length && true) ||
                                        (dataset?.dataset?.usageStats?.buckets?.length && true) ||
                                        false,
                                },
                            },
                            {
                                component: SidebarTagsSection,
                            },
                            {
                                component: SidebarOwnerSection,
                            },
                        ]}
                    />
                </TestPageContainer>
            </MockedProvider>,
        );

        // find the tab name
        await waitFor(() => expect(getByText('Auto Render Aspect Custom Tab Name')).toBeInTheDocument(),{timeout:10000});

        // open the custom tab
        fireEvent(
            getByText('Auto Render Aspect Custom Tab Name'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        );

        // find the tab contents
        await waitFor(() => expect(getByText('autoField1')).toBeInTheDocument(),{timeout:10000});
        await waitFor(() => expect(getByText('autoValue1')).toBeInTheDocument(),{timeout:10000});
    });
});
