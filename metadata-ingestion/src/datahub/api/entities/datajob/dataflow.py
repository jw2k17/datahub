from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Callable, Dict, Iterable, List, Optional, Set, Union

import datahub.emitter.mce_builder as builder
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.metadata.schema_classes import (
    AuditStampClass,
    DataFlowInfoClass,
    DataFlowSnapshotClass,
    GlobalTagsClass,
    MetadataChangeEventClass,
    OwnerClass,
    OwnershipClass,
    OwnershipSourceClass,
    OwnershipSourceTypeClass,
    OwnershipTypeClass,
    TagAssociationClass,
)
from datahub.utilities.urns.data_flow_urn import DataFlowUrn

if TYPE_CHECKING:
    from datahub.emitter.kafka_emitter import DatahubKafkaEmitter
    from datahub.emitter.rest_emitter import DatahubRestEmitter


@dataclass
class DataFlow:
    """The DataHub representation of data-flow.

    Args:
        urn (int): Unique identifier of the DataFlow in DataHub. For more detail refer https://datahubproject.io/docs/what/urn/.
        id (str): Identifier of DataFlow in orchestrator.
        orchestrator (str): orchestrator. for example airflow.
        cluster (Optional[str]): [depricated] Please use env.
        name (str): Name of the DataFlow.
        description (str): Description about DataFlow 
        properties (Optional[str]): Additional properties if any.
        url (Optional[str]): URL pointing to DataFlow.
        tags (Set[str]): tags that need to be apply on DataFlow.
        owners (Set[str]): owners that need to be apply on DataFlow.
        platform_instance (Optional[str]): The instance of the platform that all assets produced by this orchestrator belong to. For more detail refer https://datahubproject.io/docs/platform-instances/.
        env (Optional[str]): The environment that all assets produced by this orchestrator belong to. For more detail and possible values refer https://datahubproject.io/docs/graphql/enums/#fabrictype.
    """
    urn: DataFlowUrn = field(init=False)
    id: str
    orchestrator: str
    cluster: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    properties: Dict[str, str] = field(default_factory=dict)
    url: Optional[str] = None
    tags: Set[str] = field(default_factory=set)
    owners: Set[str] = field(default_factory=set)
    platform_instance: Optional[str] = None
    env: Optional[str] = None

    def __post_init__(self):
        if self.env is not None:            
            self.urn = DataFlowUrn.create_from_ids(
                orchestrator=self.orchestrator,
                env=self.env,
                flow_id=self.id,
                platform_instance=self.platform_instance,
            )
        else:
            self.urn = DataFlowUrn.create_from_ids(
                orchestrator=self.orchestrator,
                env=self.cluster,
                flow_id=self.id,
                platform_instance=self.platform_instance,
            )

    def generate_ownership_aspect(self):
        ownership = OwnershipClass(
            owners=[
                OwnerClass(
                    owner=builder.make_user_urn(owner),
                    type=OwnershipTypeClass.DEVELOPER,
                    source=OwnershipSourceClass(
                        type=OwnershipSourceTypeClass.SERVICE,
                        # url=dag.filepath,
                    ),
                )
                for owner in (self.owners or [])
            ],
            lastModified=AuditStampClass(
                time=0, actor=builder.make_user_urn(self.orchestrator)
            ),
        )
        return [ownership]

    def generate_tags_aspect(self) -> List[GlobalTagsClass]:
        tags = GlobalTagsClass(
            tags=[
                TagAssociationClass(tag=builder.make_tag_urn(tag))
                for tag in (sorted(self.tags) or [])
            ]
        )
        return [tags]

    def generate_mce(self) -> MetadataChangeEventClass:
        flow_mce = MetadataChangeEventClass(
            proposedSnapshot=DataFlowSnapshotClass(
                urn=str(self.urn),
                aspects=[
                    DataFlowInfoClass(
                        name=self.id,
                        description=self.description,
                        customProperties=self.properties,
                        externalUrl=self.url,
                    ),
                    *self.generate_ownership_aspect(),
                    *self.generate_tags_aspect(),
                ],
            )
        )

        return flow_mce

    def generate_mcp(self) -> Iterable[MetadataChangeProposalWrapper]:
        mcp = MetadataChangeProposalWrapper(
            entityUrn=str(self.urn),
            aspect=DataFlowInfoClass(
                name=self.name if self.name is not None else self.id,
                description=self.description,
                customProperties=self.properties,
                externalUrl=self.url,
            ),
        )
        yield mcp

        for owner in self.generate_ownership_aspect():
            mcp = MetadataChangeProposalWrapper(
                entityUrn=str(self.urn),
                aspect=owner,
            )
            yield mcp

        for tag in self.generate_tags_aspect():
            mcp = MetadataChangeProposalWrapper(
                entityUrn=str(self.urn),
                aspect=tag,
            )
            yield mcp

    def emit(
        self,
        emitter: Union["DatahubRestEmitter", "DatahubKafkaEmitter"],
        callback: Optional[Callable[[Exception, str], None]] = None,
    ) -> None:
        """
        Emit the DataFlow entity to Datahub

        :param emitter: Datahub Emitter to emit the process event
        :param callback: (Optional[Callable[[Exception, str], None]]) the callback method for KafkaEmitter if it is used
        """

        for mcp in self.generate_mcp():
            emitter.emit(mcp, callback)
