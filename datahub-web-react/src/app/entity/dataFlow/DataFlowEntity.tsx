import * as React from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
import { DataFlow, EntityType, PlatformType, SearchResult } from '../../../types.generated';
import { Preview } from './preview/Preview';
import { Entity, IconStyleType, PreviewType } from '../Entity';
import { getLogoFromPlatform } from '../../shared/getLogoFromPlatform';
import { EntityProfile } from '../shared/containers/profile/EntityProfile';
import { GetDataFlowQuery, useGetDataFlowQuery, useUpdateDataFlowMutation } from '../../../graphql/dataFlow.generated';
import { DocumentationTab } from '../shared/tabs/Documentation/DocumentationTab';
import { PropertiesTab } from '../shared/tabs/Properties/PropertiesTab';
import { SidebarAboutSection } from '../shared/containers/profile/sidebar/SidebarAboutSection';
import { SidebarTagsSection } from '../shared/containers/profile/sidebar/SidebarTagsSection';
import { SidebarOwnerSection } from '../shared/containers/profile/sidebar/Ownership/SidebarOwnerSection';
import { GenericEntityProperties } from '../shared/types';
import { DataFlowJobs } from '../shared/tabs/Entity/DataFlowJobs';

/**
 * Definition of the DataHub DataFlow entity.
 */
export class DataFlowEntity implements Entity<DataFlow> {
    type: EntityType = EntityType.DataFlow;

    icon = (fontSize: number, styleType: IconStyleType) => {
        if (styleType === IconStyleType.TAB_VIEW) {
            return <ShareAltOutlined style={{ fontSize }} />;
        }

        if (styleType === IconStyleType.HIGHLIGHT) {
            return <ShareAltOutlined style={{ fontSize, color: '#d6246c' }} />;
        }

        return (
            <ShareAltOutlined
                style={{
                    fontSize,
                    color: '#BFBFBF',
                }}
            />
        );
    };

    isSearchEnabled = () => true;

    isBrowseEnabled = () => true;

    isLineageEnabled = () => false;

    getAutoCompleteFieldName = () => 'name';

    getPathName = () => 'pipelines';

    getSingularName = () => 'Pipeline';

    getCollectionName = () => 'Pipelines';

    renderProfile = (urn: string) => (
        <EntityProfile
            urn={urn}
            entityType={EntityType.DataFlow}
            useEntityQuery={useGetDataFlowQuery}
            useUpdateQuery={useUpdateDataFlowMutation}
            getOverrideProperties={this.getOverrideProperties}
            tabs={[
                {
                    name: 'Documentation',
                    component: DocumentationTab,
                },
                {
                    name: 'Properties',
                    component: PropertiesTab,
                },
                {
                    name: 'Tasks',
                    component: DataFlowJobs,
                },
            ]}
            sidebarSections={[
                {
                    component: SidebarAboutSection,
                },
                {
                    component: SidebarTagsSection,
                    properties: {
                        hasTags: true,
                        hasTerms: true,
                    },
                },
                {
                    component: SidebarOwnerSection,
                },
            ]}
        />
    );

    getOverrideProperties = (res: GetDataFlowQuery): GenericEntityProperties => {
        // TODO: Get rid of this once we have correctly formed platform coming back.
        const tool = res.dataFlow?.orchestrator || '';
        const name = res.dataFlow?.info?.name;
        const externalUrl = res.dataFlow?.info?.externalUrl;
        return {
            ...res,
            name,
            externalUrl,
            platform: {
                urn: `urn:li:dataPlatform:(${tool})`,
                type: EntityType.DataPlatform,
                name: tool,
                info: {
                    logoUrl: getLogoFromPlatform(tool),
                    type: PlatformType.Others,
                    datasetNameDelimiter: '.',
                },
            },
        };
    };

    renderPreview = (_: PreviewType, data: DataFlow) => {
        const platformName = data.orchestrator.charAt(0).toUpperCase() + data.orchestrator.slice(1);
        return (
            <Preview
                urn={data.urn}
                name={data.info?.name || ''}
                description={data.editableProperties?.description || data.info?.description}
                platformName={platformName}
                platformLogo={getLogoFromPlatform(data.orchestrator)}
                owners={data.ownership?.owners}
                globalTags={data.globalTags}
            />
        );
    };

    renderSearch = (result: SearchResult) => {
        const data = result.entity as DataFlow;
        const platformName = data.orchestrator.charAt(0).toUpperCase() + data.orchestrator.slice(1);
        return (
            <Preview
                urn={data.urn}
                name={data.info?.name || ''}
                description={data.editableProperties?.description || data.info?.description || ''}
                platformName={platformName}
                platformLogo={getLogoFromPlatform(data.orchestrator)}
                owners={data.ownership?.owners}
                globalTags={data.globalTags}
            />
        );
    };

    displayName = (data: DataFlow) => {
        return data.info?.name || data.urn;
    };
}
