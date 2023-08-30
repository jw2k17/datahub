import { Alert } from 'antd';
import React from 'react';
import styled from 'styled-components';
import useListDomains from '../../useListDomains';
import DomainNode from './DomainNode';
import { Domain } from '../../../../types.generated';

const NavigatorWrapper = styled.div`
    font-size: 14px;
    max-height: calc(100% - 65px);
    padding: 8px 8px 16px 16px;
    overflow: auto;
`;

interface Props {
    selectDomainOverride?: (urn: string, displayName: string) => void;
}

export default function DomainNavigator({ selectDomainOverride }: Props) {
    const { data, error } = useListDomains({});

    return (
        <NavigatorWrapper>
            {error && <Alert message="Loading Domains failed." showIcon type="error" />}
            {data?.listDomains?.domains.map((domain) => (
                <DomainNode
                    key={domain.urn}
                    domain={domain as Domain}
                    numDomainChildren={domain.children?.total || 0}
                    selectDomainOverride={selectDomainOverride}
                />
            ))}
        </NavigatorWrapper>
    );
}
