import React, { useState } from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

export type Props = {
    query: string;
    showCopyText?: boolean;
    style?: any;
};

export default function CopyQuery({ query, showCopyText = false, style }: Props) {
    const [queryCopied, setQueryCopied] = useState(false);

    const copyQuery = () => {
        navigator.clipboard.writeText(query || '');
        setQueryCopied(true);
    };

    if (navigator.clipboard) {
        return (
            <Tooltip title="Copy the query">
                <Button onClick={copyQuery} style={style}>
                    {showCopyText && ((queryCopied && 'Copied') || 'Copy')}
                    {(queryCopied && <CheckOutlined />) || <CopyOutlined />}
                </Button>
            </Tooltip>
        );
    }

    return null;
}
