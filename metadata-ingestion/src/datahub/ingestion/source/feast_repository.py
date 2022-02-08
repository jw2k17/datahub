from typing import Dict, Iterable, List, Tuple, Union

import datahub.emitter.mce_builder as builder
from datahub.emitter.mce_builder import DEFAULT_ENV
from datahub.configuration.common import ConfigModel
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.api.source import Source, SourceReport
from datahub.ingestion.api.workunit import MetadataWorkUnit
from datahub.metadata.com.linkedin.pegasus2avro.common import MLFeatureDataType
from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import (
    MLFeatureSnapshot,
    MLFeatureTableSnapshot,
    MLPrimaryKeySnapshot
)
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import (
    BrowsePathsClass,
    MLFeaturePropertiesClass,
    MLFeatureTablePropertiesClass,
    MLPrimaryKeyPropertiesClass
)

from feast import (
    BigQuerySource,
    Entity,
    Feature,
    FeatureStore,
    FeatureView,
    FileSource,
    KafkaSource,
    KinesisSource,
    OnDemandFeatureView,
    ValueType
)
from feast.data_source import DataSource, RequestDataSource


_field_type_mapping: Dict[str, str] = {
    ValueType.UNKNOWN: MLFeatureDataType.UNKNOWN,
    ValueType.BYTES: MLFeatureDataType.BYTE,
    ValueType.STRING: MLFeatureDataType.TEXT,
    ValueType.INT32: MLFeatureDataType.ORDINAL,
    ValueType.INT64: MLFeatureDataType.ORDINAL,
    ValueType.DOUBLE: MLFeatureDataType.CONTINUOUS,
    ValueType.FLOAT: MLFeatureDataType.CONTINUOUS,
    ValueType.BOOL: MLFeatureDataType.BINARY,
    ValueType.UNIX_TIMESTAMP: MLFeatureDataType.TIME,
    ValueType.BYTES_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.STRING_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.INT32_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.INT64_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.DOUBLE_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.FLOAT_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.BOOL_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.UNIX_TIMESTAMP_LIST: MLFeatureDataType.SEQUENCE,
    ValueType.NULL: MLFeatureDataType.USELESS
}


class FeastRepositorySourceConfig(ConfigModel):
    repository_path: str
    environment: str = DEFAULT_ENV


class FeastRepositorySource(Source):
    source_config: FeastRepositorySourceConfig
    report: SourceReport = SourceReport()

    def __init__(self, config: FeastRepositorySourceConfig, ctx: PipelineContext):
        super().__init__(ctx)
        
        self.source_config = config
    
    def _get_field_type(self, field_type: str, parent_name: str) -> str:
        '''
        Maps types encountered in Feast to corresponding schema types.
        '''

        enum_type = _field_type_mapping.get(field_type)

        if enum_type is None:
            self.report.report_warning(
                parent_name, f'unable to map type {field_type} to metadata schema'
            )

            enum_type = MLFeatureDataType.UNKNOWN

        return enum_type

    def _get_data_source_details(self, source: DataSource) -> Tuple[str, str]:
        '''
        Get Feast batch/stream source platform and name.
        '''

        platform = 'unknown'
        name = 'unknown'

        if isinstance(source, FileSource):
            platform = 'file'

            name = source.file_options.file_url \
                .replace('://', '.') \
                .replace('/', '.')

        if isinstance(source, BigQuerySource):
            platform = 'bigquery'
            name = source.bigquery_options.table_ref

        if isinstance(source, KafkaSource):
            platform = 'kafka'
            name = source.kafka_options.topic

        if isinstance(source, KinesisSource):
            platform = 'kinesis'
            name = f'{source.kinesis_options.region}:{source.kinesis_options.stream_name}'

        if isinstance(source, RequestDataSource):
            platform = 'request'
            name = source.name

        return platform, name
    
    def _get_data_sources(
        self,
        project: str,
        feature_view: Union[FeatureView, OnDemandFeatureView]
    ) -> List[str]:
        '''
        Get data source URN list.
        '''
        
        sources = []
        
        if feature_view.batch_source is not None:
            batch_source_platform, batch_source_name = self._get_data_source_details(feature_view.batch_source)
            sources.append(
                builder.make_dataset_urn(
                    batch_source_platform,
                    f'{project}.{batch_source_name}',
                    self.config.environment
                )
            )
        
        if feature_view.stream_source is not None:
            stream_source_platform, stream_source_name = self._get_data_source_details(feature_view.stream_source)
            sources.append(
                builder.make_dataset_urn(
                    stream_source_platform,
                    f'{project}.{stream_source_name}',
                    self.config.environment
                )
            )
            
        return sources
    
    def _get_entity(self, project: str, feature_view: FeatureView, entity: Entity) -> MetadataWorkUnit:
        '''
        Generate an MLPrimaryKey workunit for a Feast entity.
        '''

        feature_view_name = f'{project}.{feature_view.name}'

        entity_snapshot = MLPrimaryKeySnapshot(
            urn=builder.make_ml_primary_key_urn(
                feature_view_name, entity.name
            ),
            aspects=[]
        )
        
        entity_snapshot.aspects.append(
            MLPrimaryKeyPropertiesClass(
                description=entity.description,
                dataType=self.get_field_type(
                    entity.value_type, entity.name
                ),
                sources=self._get_data_sources(project, feature_view)
            )
        )
        
        mce = MetadataChangeEvent(proposedSnapshot=entity_snapshot)

        return MetadataWorkUnit(id=entity.name, mce=mce)

    def _get_feature(
        self,
        project: str,
        feature_view: Union[FeatureView, OnDemandFeatureView],
        feature: Feature
    ) -> MetadataWorkUnit:
        '''
        Generate an MLFeature workunit for a Feast feature.
        '''

        feature_view_name = f'{project}.{feature_view.name}'
        
        feature_snapshot = MLFeatureSnapshot(
            urn=builder.make_ml_feature_urn(
                feature_view_name, feature.name
            ),
            aspects=[]
        )

        feature_sources = []

        if isinstance(feature_view, FeatureView):
            feature_sources = self._get_data_sources(project, feature_view)
        elif isinstance(feature_view, OnDemandFeatureView):
            if feature_view.input_request_data_sources is not None:
                for _, request_source in feature_view.input_request_data_sources.items():
                    source_platform, source_name = self._get_data_source_details(request_source)

                    feature_sources.append(
                        builder.make_dataset_urn(
                            source_platform,
                            f'{project}.{source_name}',
                            self.config.environment
                        )
                    )

            if feature_view.input_feature_views is not None:
                for _, feature_view_source in feature_view.input_feature_views.items():
                    feature_sources.extend(self._get_data_sources(project, feature_view_source))
        
        feature_snapshot.aspects.append(
            MLFeaturePropertiesClass(
                description=feature.labels.get('description'),
                dataType=self._get_field_type(
                    feature.dtype, feature.name
                ),
                sources=feature_sources
            )
        )
        
        mce = MetadataChangeEvent(proposedSnapshot=feature_snapshot)

        return MetadataWorkUnit(id=feature.name, mce=mce)

    def _get_feature_view(self, project: str, feature_view: FeatureView) -> MetadataWorkUnit:
        '''
        Generate an MLFeatureTable workunit for a Feast feature view.
        '''
        
        feature_view_name = f'{project}.{feature_view.name}'

        feature_view_snapshot = MLFeatureTableSnapshot(
            urn=builder.make_ml_feature_table_urn('feast', feature_view_name),
            aspects=[
                BrowsePathsClass(paths=[
                    f'{feature_view_name}',
                    f'feast/{feature_view_name}'
                ])
            ]
        )

        feature_view_snapshot.aspects.append(
            MLFeatureTablePropertiesClass(
                mlFeatures=[
                    builder.make_ml_feature_urn(
                        feature_view_name,
                        feature.name,
                    )
                    for feature in feature_view.features
                ],
                mlPrimaryKeys=[
                    builder.make_ml_primary_key_urn(
                        feature_view_name, entity_name
                    )
                    for entity_name in feature_view.entities
                ]
            )
        )

        mce = MetadataChangeEvent(proposedSnapshot=feature_view_snapshot)

        return MetadataWorkUnit(id=feature_view_name, mce=mce)

    def _get_on_demand_feature_view(
        self,
        project: str,
        on_demand_feature_view: OnDemandFeatureView
    ) -> MetadataWorkUnit:
        '''
        Generate an MLFeatureTable workunit for a Feast on-demand feature view.
        '''
        
        on_demand_feature_view_name = f'{project}.{on_demand_feature_view.name}'

        on_demand_feature_view_snapshot = MLFeatureTableSnapshot(
            urn=builder.make_ml_feature_table_urn('feast', on_demand_feature_view_name),
            aspects=[
                BrowsePathsClass(paths=[
                    f'{on_demand_feature_view_name}',
                    f'feast/{on_demand_feature_view_name}'
                ])
            ],
        )

        on_demand_feature_view_snapshot.aspects.append(
            MLFeatureTablePropertiesClass(
                mlFeatures=[
                    builder.make_ml_feature_urn(
                        on_demand_feature_view_name,
                        feature.name,
                    )
                    for feature in on_demand_feature_view.features
                ],
                mlPrimaryKeys=[]
            )
        )

        mce = MetadataChangeEvent(proposedSnapshot=on_demand_feature_view_snapshot)

        return MetadataWorkUnit(id=on_demand_feature_view_name, mce=mce)

    @classmethod
    def create(cls, config_dict, ctx):
        config = FeastRepositorySourceConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_workunits(self) -> Iterable[MetadataWorkUnit]:
        feature_store = FeatureStore(self.source_config.repository_path)
        
        feature_views = feature_store.list_feature_views()
        on_demand_feature_views = feature_store.list_on_demand_feature_views()
        
        for feature_view in feature_views:
            for entity_name in feature_view.entities:
                entity = feature_store.get_entity(entity_name)
                work_unit = self._get_entity(feature_store.project, feature_view, entity)
                
                self.report.report_workunit(work_unit)

                yield work_unit

            for feature in feature_view.features:
                work_unit = self._get_feature(feature_store.project, feature_view, feature)
                
                self.report.report_workunit(work_unit)

                yield work_unit

            work_unit = self._get_feature_view(feature_store.project, feature_view)
            
            self.report.report_workunit(work_unit)
            
            yield work_unit

        for on_demand_feature_view in on_demand_feature_views:
            for feature in on_demand_feature_view.features:
                work_unit = self._get_feature(feature_store.project, on_demand_feature_view, feature)
                
                self.report.report_workunit(work_unit)

                yield work_unit

            work_unit = self._get_on_demand_feature_view(feature_store.project, on_demand_feature_view)
            
            self.report.report_workunit(work_unit)
            
            yield work_unit

    def get_report(self) -> SourceReport:
        return self.report

    def close(self) -> None:
        return
