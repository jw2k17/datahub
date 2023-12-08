import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EntityNode from './EntityNode';
import { BrowseProvider } from './BrowseContext';
import SidebarLoadingError from './SidebarLoadingError';
import { SEARCH_RESULTS_BROWSE_SIDEBAR_ID } from '../../onboarding/config/SearchOnboardingConfig';
import useSidebarEntities from './useSidebarEntities';
import { ANTD_GRAY_V2 } from '../../entity/shared/constants';
import { ProfileSidebarResizer } from '../../entity/shared/containers/profile/sidebar/ProfileSidebarResizer';


export const MAX_BROWSER_WIDTH = 500;
export const MIN_BROWSWER_WIDTH = 200;

export const SidebarWrapper = styled.div<{ visible: boolean; width: number }>`
    height: 100%;
    width: ${(props) => (props.visible ? `${props.width}px` : '0')};
    min-width: ${(props) => (props.visible ? `${props.width}px` : '0')};
    transition: width 250ms ease-in-out;
    border-right: 1px solid ${(props) => props.theme.styles['border-color-base']};
    background-color: ${ANTD_GRAY_V2[1]};
    background: white;
`;

const SidebarHeader = styled.div`
    display: flex;
    align-items: center;
    padding-left: 24px;
    height: 47px;
    border-bottom: 1px solid ${(props) => props.theme.styles['border-color-base']};
    white-space: nowrap;
`;

const SidebarBody = styled.div<{ visible: boolean }>`
    height: calc(100% - 47px);
    padding-left: 16px;
    padding-right: 12px;
    padding-bottom: 200px;
    overflow: ${(props) => (props.visible ? 'auto' : 'hidden')};
    white-space: nowrap;
`;

type Props = {
    visible: boolean;
};

const EntityAggregationsDraggableList = ({entityAggregations}: any) =>{
    const [updateEntityAggregations, setupdateEntityAggregations] = useState(entityAggregations)

    useEffect(()=>{
        setupdateEntityAggregations(entityAggregations)
    },[entityAggregations]);

    function handleOnDragEnd(result) {
        if (!result.destination) return;
    
        const items = Array.from(updateEntityAggregations);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        setupdateEntityAggregations(items);
      }
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="entity">
                {(provided) => (
                <div className="entity" {...provided.droppableProps} ref={provided.innerRef}>
                    {updateEntityAggregations?.map((entityAggregation, index)=> {
                    return (
                        <Draggable key={entityAggregation.value} draggableId={entityAggregation.value} index={index}>
                        {(dropProvided) => (
                            <div 
                                ref={dropProvided.innerRef} 
                                {...dropProvided.draggableProps} 
                                {...dropProvided.dragHandleProps}
                             >
                            <BrowseProvider key={entityAggregation.value} entityAggregation={entityAggregation}>
                                <EntityNode />
                            </BrowseProvider>
                            </div>
                        )}
                        </Draggable>
                    );
                    })}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

const BrowseSidebar = ({ visible }: Props) => {
    const { error, entityAggregations, retry } = useSidebarEntities({
        skip: !visible,
    });
    const [browserWidth, setBrowserWith] = useState(window.innerWidth * 0.2);

    return (
        <>
            <SidebarWrapper visible={visible} width={browserWidth} id={SEARCH_RESULTS_BROWSE_SIDEBAR_ID} data-testid="browse-v2">
                <SidebarHeader>
                    <Typography.Text strong>Navigate</Typography.Text>
                </SidebarHeader>
                <SidebarBody visible={visible}>
                    {entityAggregations && !entityAggregations.length && <div>No results found</div>}
                    <EntityAggregationsDraggableList entityAggregations={entityAggregations}/>
                    {error && <SidebarLoadingError onClickRetry={retry} />}
                </SidebarBody>
            </SidebarWrapper>
            <ProfileSidebarResizer
                setSidePanelWidth={(widthProp) =>
                    setBrowserWith(Math.min(Math.max(widthProp, MIN_BROWSWER_WIDTH), MAX_BROWSER_WIDTH))
                }
                initialSize={browserWidth}
                isSidebarOnLeft
            />
        </>
    );
};

export default BrowseSidebar;
