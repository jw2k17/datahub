import React, { useState } from 'react';
import { Tag, Tooltip } from 'antd';
import styled from 'styled-components';

const StyledTag = styled(Tag)`
    cursor: pointer;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;

    &&:hover {
        color: ${(props) => props.theme.styles['primary-color']};
        border-color: ${(props) => props.theme.styles['primary-color']};
    }
`;

type Props = {
    value: string;
};

export default function SampleValueTag({ value }: Props) {
    const [copied, setCopied] = useState(false);

    if (navigator.clipboard) {
        const onClick = () => {
            setCopied(true);
            navigator.clipboard.writeText(value);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <Tooltip title={copied ? 'Copied' : 'Click to copy'}>
                <StyledTag onClick={onClick}>{value}</StyledTag>
            </Tooltip>
        );
    }
    return <StyledTag>{value}</StyledTag>;
}
