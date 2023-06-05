import styled from 'styled-components';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useEntityRegistry } from '../useEntityRegistry';
import { PageRoutes } from '../../conf/Global';
import { IconStyleType } from '../entity/Entity';
import { EntityType } from '../../types.generated';
import { LogoCountCard } from '../shared/LogoCountCard';
import { EventType } from '../analytics/event';
import analytics from '../analytics';
import { useAppConfig } from '../useAppConfig';
import { navigateToSearchUrl } from './utils/navigateToSearchUrl';
import { ENTITY_FILTER_NAME } from './utils/constants';

const BrowseEntityCardWrapper = styled.div``;

export const BrowseEntityCard = ({ entityType, count }: { entityType: EntityType; count: number }) => {
    const appConfig = useAppConfig();
    const history = useHistory();
    const entityRegistry = useEntityRegistry();
    const { showBrowseV2 } = appConfig.config.featureFlags;
    const isGlossaryEntityCard = entityType === EntityType.GlossaryTerm;
    const entityPathName = entityRegistry.getPathName(entityType);
    const url = isGlossaryEntityCard ? PageRoutes.GLOSSARY : `${PageRoutes.BROWSE}/${entityPathName}`;
    const onBrowseEntityCardClick = () => {
        analytics.event({
            type: EventType.HomePageBrowseResultClickEvent,
            entityType,
        });
    };

    function browse() {
        if (showBrowseV2 && !isGlossaryEntityCard) {
            navigateToSearchUrl({
                query: '*',
                filters: [{ field: ENTITY_FILTER_NAME, values: [entityType] }],
                history,
            });
        } else {
            history.push(url);
        }
    }

    return (
        <BrowseEntityCardWrapper onClick={browse} data-testid={`entity-type-browse-card-${entityType}`}>
            <LogoCountCard
                logoComponent={entityRegistry.getIcon(entityType, 18, IconStyleType.HIGHLIGHT)}
                name={entityRegistry.getCollectionName(entityType)}
                count={count}
                onClick={onBrowseEntityCardClick}
            />
        </BrowseEntityCardWrapper>
    );
};
