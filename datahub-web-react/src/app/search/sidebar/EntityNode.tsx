import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { useEntityRegistry } from '../../useEntityRegistry';
import { IconStyleType } from '../../entity/Entity';
import { formatNumber } from '../../shared/formatNumber';
import ExpandableNode from './ExpandableNode';
import EnvironmentNode from './EnvironmentNode';
import useAggregationsQuery from './useAggregationsQuery';
import { ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME } from '../utils/constants';
import PlatformNode from './PlatformNode';
import SidebarLoadingError from './SidebarLoadingError';
import useToggle from '../../shared/useToggle';
import { BrowseProvider, useEntityAggregation, useEntityType, useIsEntitySelected } from './BrowseContext';

const Count = styled(Typography.Text)`
    font-size: 12px;
    color: ${(props) => props.color};
`;

const facets = [ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME];

const EntityNode = () => {
    const isSelected = useIsEntitySelected();
    const entityType = useEntityType();
    const entityAggregation = useEntityAggregation();
    const registry = useEntityRegistry();

    const { isOpen, isClosing, toggle } = useToggle(isSelected, { closeDelay: 250 });

    const { loaded, error, environmentAggregations, platformAggregations } = useAggregationsQuery({
        skip: !isOpen,
        facets,
    });

    const hasMultipleEnvironments = environmentAggregations.length > 1;
    const color = isOpen ? ANTD_GRAY[9] : ANTD_GRAY[7];

    return (
        <ExpandableNode
            isOpen={isOpen && !isClosing && loaded}
            header={
                <ExpandableNode.Header isOpen={isOpen} showBorder onClick={toggle} style={{ paddingTop: '16px' }}>
                    <ExpandableNode.HeaderLeft>
                        <ExpandableNode.StaticButton
                            icon={registry.getIcon(entityType, 16, IconStyleType.HIGHLIGHT, color)}
                        />
                        <ExpandableNode.Title color={color} size={16}>
                            {registry.getCollectionName(entityType)}
                        </ExpandableNode.Title>
                        <Count color={color}>{formatNumber(entityAggregation.count)}</Count>
                    </ExpandableNode.HeaderLeft>
                    <ExpandableNode.CircleButton isOpen={isOpen} />
                </ExpandableNode.Header>
            }
            body={
                <ExpandableNode.Body>
                    {hasMultipleEnvironments
                        ? environmentAggregations.map((environmentAggregation) => (
                              <BrowseProvider
                                  key={environmentAggregation.value}
                                  entityAggregation={entityAggregation}
                                  environmentAggregation={environmentAggregation}
                              >
                                  <EnvironmentNode />
                              </BrowseProvider>
                          ))
                        : platformAggregations.map((platformAggregation) => (
                              <BrowseProvider
                                  key={platformAggregation.value}
                                  entityAggregation={entityAggregation}
                                  platformAggregation={platformAggregation}
                              >
                                  <PlatformNode />
                              </BrowseProvider>
                          ))}
                    {error && <SidebarLoadingError />}
                </ExpandableNode.Body>
            }
        />
    );
};

export default EntityNode;
