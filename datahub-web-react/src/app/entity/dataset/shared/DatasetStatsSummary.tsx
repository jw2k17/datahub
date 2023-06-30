/* eslint-disable no-param-reassign */
import React from 'react';
import styled from 'styled-components/macro';
import { Popover } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { ANTD_GRAY } from '../../shared/constants';
import { toLocalDateTimeString, toRelativeTimeString } from '../../../shared/time/timeUtils';
import { StatsSummary } from '../../shared/components/styled/StatsSummary';
import { ByteCountStat } from './ByteCountStat';
import QueryCountStat from './QueryCountStat';
import StatText from './StatText';
import RowCountStat from './RowCountStat';
import UserCountStat from './UserCountStat';

const PopoverContent = styled.div`
    max-width: 300px;
`;

type Props = {
    rowCount?: number | null;
    columnCount?: number | null;
    sizeInBytes?: number | null;
    totalSqlQueries?: number | null;
    queryCountLast30Days?: number | null;
    uniqueUserCountLast30Days?: number | null;
    lastUpdatedMs?: number | null;
    color?: string;
    mode?: 'normal' | 'tooltip-content';
};

export const DatasetStatsSummary = ({
    rowCount,
    columnCount,
    sizeInBytes,
    totalSqlQueries,
    queryCountLast30Days,
    uniqueUserCountLast30Days,
    lastUpdatedMs,
    color,
    mode = 'normal',
}: Props) => {
    rowCount = 2133440;
    columnCount = 12;
    sizeInBytes = 29321728;
    totalSqlQueries = 987654321;
    queryCountLast30Days = 987654321;
    uniqueUserCountLast30Days = 98765;
    lastUpdatedMs = Date.now();

    const isTooltipMode = mode === 'tooltip-content';
    const displayedColor = isTooltipMode ? '' : color ?? ANTD_GRAY[7];

    const statsViews = [
        !!rowCount && (
            <RowCountStat
                color={displayedColor}
                disabled={isTooltipMode}
                rowCount={rowCount}
                columnCount={columnCount}
            />
        ),
        !!sizeInBytes && <ByteCountStat color={displayedColor} disabled={isTooltipMode} sizeInBytes={sizeInBytes} />,
        (!!queryCountLast30Days || !!totalSqlQueries) && (
            <QueryCountStat
                color={displayedColor}
                disabled={isTooltipMode}
                queryCountLast30Days={queryCountLast30Days}
                totalSqlQueries={totalSqlQueries}
            />
        ),
        !!uniqueUserCountLast30Days && (
            <UserCountStat color={displayedColor} disabled={isTooltipMode} userCount={uniqueUserCountLast30Days} />
        ),
        !!lastUpdatedMs && (
            <Popover
                open={isTooltipMode ? false : undefined}
                content={
                    <PopoverContent>
                        Data was last updated in the source platform on{' '}
                        <strong>{toLocalDateTimeString(lastUpdatedMs)}</strong>
                    </PopoverContent>
                }
            >
                <StatText color={displayedColor}>
                    <ClockCircleOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                    Updated {toRelativeTimeString(lastUpdatedMs)}
                </StatText>
            </Popover>
        ),
    ].filter(Boolean);

    return <>{statsViews.length > 0 && <StatsSummary stats={statsViews} />}</>;
};
