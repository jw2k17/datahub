import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useQuickFiltersContext } from '../../../../providers/QuickFiltersContext';
import { QuickFilter as QuickFilterType } from '../../../../types.generated';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { getQuickFilterDetails } from './utils';
import { ANTD_GRAY } from '../../../entity/shared/constants';

const QuickFilterWrapper = styled(Button)<{ isSelected: boolean }>`
    border: 1px solid ${ANTD_GRAY[4]};
    border-radius: 16px;
    box-shadow: none;
    font-weight: 400;
    color: black;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px 10px;
    font-size: 12px;
    margin: 4px;

    &:hover {
        color: black;
    }

    ${(props) =>
        props.isSelected &&
        `
        border: 1px solid ${props.theme.styles['primary-color-dark']};
        background-color: ${props.theme.styles['primary-color-light']};
        &:hover {
            background-color: ${props.theme.styles['primary-color-light']};
        }
    `}
`;

const LabelWrapper = styled.span`
    margin-left: 4px;
`;

interface Props {
    quickFilter: QuickFilterType;
}

export default function QuickFilter({ quickFilter }: Props) {
    const entityRegistry = useEntityRegistry();
    const { selectedQuickFilter, setSelectedQuickFilter } = useQuickFiltersContext();

    const isSelected = selectedQuickFilter?.value === quickFilter.value;
    const { label, icon } = getQuickFilterDetails(quickFilter, entityRegistry);

    function handleClick() {
        if (isSelected) {
            setSelectedQuickFilter(null);
        } else {
            setSelectedQuickFilter(quickFilter);
        }
    }

    return (
        <QuickFilterWrapper onClick={handleClick} isSelected={isSelected}>
            {icon}
            <LabelWrapper>{label}</LabelWrapper>
        </QuickFilterWrapper>
    );
}
