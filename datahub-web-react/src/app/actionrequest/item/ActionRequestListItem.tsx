import React from 'react';
import styled from 'styled-components';
import { List } from 'antd';
import { ActionRequest, ActionRequestType } from '../../../types.generated';
import TermAssociationRequestItem from './TermAssociationRequestItem';
import TagAssociationRequestItem from './TagAssociationRequestItem';

const ActionRequestItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

type Props = {
    actionRequest: ActionRequest;
    onUpdate: () => void;
};

/**
 * Base Action Request List Item. Each specific action request type has it's own way
 * to render the item, which is handled inside this component.
 */
export default function ActionRequestListItem({ actionRequest, onUpdate }: Props) {
    const getActionRequestItemContent = (request: ActionRequest) => {
        const requestType = request.type;
        switch (requestType) {
            // Request to add a glossary term to an entity.
            case ActionRequestType.TermAssociation:
                return <TermAssociationRequestItem actionRequest={request} onUpdate={onUpdate} />;
            // Request to add a tag to an entity.
            case ActionRequestType.TagAssociation:
                return <TagAssociationRequestItem actionRequest={request} onUpdate={onUpdate} />;
            default:
                throw new Error(`Unrecognized Action Request Type ${requestType} provided. Unable to render.`);
        }
    };

    const actionRequestItemContent = getActionRequestItemContent(actionRequest);

    return (
        <List.Item>
            <ActionRequestItemContainer>{actionRequestItemContent}</ActionRequestItemContainer>
        </List.Item>
    );
}
