import React from 'react';
import styled from 'styled-components';
import { Popover, Tooltip } from 'antd';
import { ClockCircleOutlined, EyeOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatNumberWithoutAbbreviation } from '../../../shared/formatNumber';
import { ANTD_GRAY } from '../../shared/constants';
import { toLocalDateTimeString, toRelativeTimeString } from '../../../shared/time/timeUtils';
import { StatsSummary } from '../../shared/components/styled/StatsSummary';
import { countFormatter, needsFormatting } from '../../../../utils/formatter';
import ExpandingStat from '../../dataset/shared/ExpandingStat';

const StatText = styled.span`
    color: ${ANTD_GRAY[8]};
`;

const HelpIcon = styled(QuestionCircleOutlined)`
    color: ${ANTD_GRAY[7]};
    padding-left: 4px;
`;

type Props = {
    chartCount?: number | null;
    viewCount?: number | null;
    uniqueUserCountLast30Days?: number | null;
    lastUpdatedMs?: number | null;
    createdMs?: number | null;
};

export const ChartStatsSummary = ({
    chartCount,
    viewCount,
    uniqueUserCountLast30Days,
    lastUpdatedMs,
    createdMs,
}: Props) => {
    const statsViews = [
        (!!chartCount && (
            <ExpandingStat
                color={ANTD_GRAY[8]}
                disabled={!needsFormatting(chartCount)}
                render={(isExpanded) => (
                    <>
                        <b>{isExpanded ? formatNumberWithoutAbbreviation(chartCount) : countFormatter(chartCount)}</b>{' '}
                        charts
                    </>
                )}
            />
        )) ||
            undefined,
        (!!viewCount && (
            <StatText>
                <EyeOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                <b>{formatNumberWithoutAbbreviation(viewCount)}</b> views
            </StatText>
        )) ||
            undefined,
        (!!uniqueUserCountLast30Days && (
            <StatText>
                <TeamOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                <b>{formatNumberWithoutAbbreviation(uniqueUserCountLast30Days)}</b> unique users
            </StatText>
        )) ||
            undefined,
        (!!lastUpdatedMs && (
            <Popover
                content={
                    <>
                        {createdMs && <div>Created on {toLocalDateTimeString(createdMs)}.</div>}
                        <div>
                            Changed on {toLocalDateTimeString(lastUpdatedMs)}.{' '}
                            <Tooltip title="The time at which the chart was last changed in the source platform">
                                <HelpIcon />
                            </Tooltip>
                        </div>
                    </>
                }
            >
                <StatText>
                    <ClockCircleOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                    Changed {toRelativeTimeString(lastUpdatedMs)}
                </StatText>
            </Popover>
        )) ||
            undefined,
    ].filter((stat) => stat !== undefined);

    return <>{statsViews.length > 0 && <StatsSummary stats={statsViews} />}</>;
};
