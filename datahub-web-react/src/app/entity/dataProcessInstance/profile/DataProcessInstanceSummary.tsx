import styled from 'styled-components';

import { Space, Table, Typography } from 'antd';

import { MlHyperParam, MlMetric, EntityType } from '../../../../types.generated';

import { useBaseEntity } from '../../shared/EntityContext';

import { InfoItem } from '../../shared/components/styled/InfoItem';

import { GetDataProcessInstanceQuery, useGetDataProcessInstanceQuery } from '../../../../graphql/dataProcessInstance.generated';

import { Pill } from '../../../../alchemy-components/components/Pills';

import { formatDetailedDuration } from '@src/app/shared/time/timeUtils';

import { capitalize } from 'lodash';




const TabContent = styled.div`

    padding: 16px;

`;




const InfoItemContainer = styled.div<{ justifyContent }>`

    display: flex;

    position: relative;

    justify-content: ${(props) => props.justifyContent};

    padding: 0px 2px;

`;




const InfoItemContent = styled.div`

    padding-top: 8px;

    width: 100px;

`;




const propertyTableColumns = [

    {

        title: 'Name',

        dataIndex: 'name',

        width: 450,

    },

    {

        title: 'Value',

        dataIndex: 'value',

    },

];







export default function MLModelSummary() {

    const baseEntity = useBaseEntity<GetDataProcessInstanceQuery>();

    const dpi = baseEntity?.dataProcessInstance;




    print("dpi TRP", dpi?.mlTrainingRunProperties);




    const formatDate = (timestamp?: number) => {

        if (!timestamp) return '-';

        const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp;

        return new Date(milliseconds).toISOString().slice(0, 19).replace('T', ' ');

    };




    const formatStatus = (state) => {

        if (!state || state.length === 0) return "-";

        const result = state[0]?.result?.resultType; 

        const statusColor = result === "SUCCESS" ? "green" : "red";

        return (

            <Pill label={capitalize(result)} colorScheme={statusColor}></Pill>

        );

    };




    const formatDuration = (state) => {

        if (!state || state.length === 0) return "-";

        return formatDetailedDuration(state[0]?.durationMillis);

    };




    return (

        <TabContent>

            <Space direction="vertical" style={{ width: '100%' }} size="large">

                <Typography.Title level={3}>Details</Typography.Title>

                <InfoItemContainer justifyContent="left">

                    <InfoItem title="Created At">

                        <InfoItemContent>{formatDate(dpi?.properties?.created?.time)}</InfoItemContent>

                    </InfoItem>

                    <InfoItem title="Created By">

                        <InfoItemContent>{dpi?.properties?.created?.actor}</InfoItemContent>

                    </InfoItem>

                    <InfoItem title="Status">

                        <InfoItemContent>{formatStatus(dpi?.state)}</InfoItemContent>

                    </InfoItem>

                    <InfoItem title="Duration">

                        <InfoItemContent>{formatDuration(dpi?.state)}</InfoItemContent> 

                    </InfoItem>

                    <InfoItem title="Run ID">

                        <InfoItemContent>{dpi?.mlTrainingRunProperties?.id}</InfoItemContent>

                    </InfoItem>

                </InfoItemContainer>

                <InfoItemContainer justifyContent="left">

                    <InfoItem title="Artifacts Location">

                        <InfoItemContent>{dpi?.mlTrainingRunProperties?.outputUrls}</InfoItemContent>

                    </InfoItem>

                </InfoItemContainer>

                <Typography.Title level={3}>Training Metrics</Typography.Title>

                <Table

                    pagination={false}

                    columns={propertyTableColumns}

                    dataSource={dpi?.mlTrainingRunProperties?.trainingMetrics as MlMetric[]}

                />

                <Typography.Title level={3}>Hyper Parameters</Typography.Title>

                <Table

                    pagination={false}

                    columns={propertyTableColumns}

                    dataSource={dpi?.mlTrainingRunProperties?.hyperParams as MlHyperParam[]}

                />

            </Space>

        </TabContent>

    );

}