import { ApiStatus } from '@datahub/utils/api/shared';
import { DatasetPlatform } from '@datahub/metadata-types/constants/entity/dataset/platform';
import { FabricType } from '@datahub/metadata-types/constants/common/fabric-type';

export default {
  status: ApiStatus.OK,
  result: {
    page: 1,
    category: 'datasets',
    source: null,
    itemsPerPage: 10,
    keywords: 'pageviewevent',
    count: 13951,
    totalPages: 1396,
    data: [
      {
        id: 0,
        name: 'pageviewevent_mp.pageviewevent',
        source: 'dalids',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:dalids,pageviewevent_mp.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'connectifier_pageviewevent_mp.pageviewevent',
        source: 'dalids',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:dalids,connectifier_pageviewevent_mp.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'pageviewevent_mp.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,pageviewevent_mp.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'ab.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,ab.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'connectifier_pageviewevent_mp.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,connectifier_pageviewevent_mp.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'u_ketl_dev.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,u_ketl_dev.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'TRACKING.PageViewEvent',
        source: 'kafka',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:kafka,TRACKING.PageViewEvent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'u_yjzhang.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,u_yjzhang.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'ei_tracking_column.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,ei_tracking_column.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      },
      {
        id: 0,
        name: 'tracking_deduped.pageviewevent',
        source: 'hive',
        urn: 'urn:li:dataset:(urn:li:dataPlatform:hive,tracking_deduped.pageviewevent,PROD)',
        created: null,
        modified: null,
        formatedModified: null,
        schema: '',
        hdfsBrowserLink: null,
        isFavorite: false,
        isOwned: false,
        watchId: 0,
        isWatched: false,
        hasSchemaHistory: false,
        properties: null,
        owners: null
      }
    ],
    groupbydataorigin: { [FabricType.PROD]: 13936, [FabricType.CORP]: 15, [FabricType.EI]: 0 },
    groupbyplatform: {
      [DatasetPlatform.Hive]: 13670,
      [DatasetPlatform.Pinot]: 3,
      [DatasetPlatform.Teradata]: 7,
      [DatasetPlatform.Kafka]: 63,
      [DatasetPlatform.Dalids]: 32,
      [DatasetPlatform.HDFS]: 163,
      [DatasetPlatform.MySql]: 12,
      [DatasetPlatform.Presto]: 1
    },
    groupbyfabric: { [FabricType.PROD]: 13936, [FabricType.CORP]: 15, [FabricType.EI]: 0 },
    groupbysource: {
      [DatasetPlatform.Hive]: 13670,
      [DatasetPlatform.Pinot]: 3,
      [DatasetPlatform.Teradata]: 7,
      [DatasetPlatform.Kafka]: 63,
      [DatasetPlatform.Dalids]: 32,
      [DatasetPlatform.HDFS]: 163,
      [DatasetPlatform.MySql]: 12,
      [DatasetPlatform.Presto]: 1
    }
  }
};
