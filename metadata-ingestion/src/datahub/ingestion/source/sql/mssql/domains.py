from dataclasses import dataclass, field
from typing import Dict, List, Optional, Union

from datahub.emitter.mce_builder import (
    make_data_flow_urn,
    make_data_job_urn,
    make_dataset_urn,
)
from datahub.metadata.schema_classes import (
    DataFlowInfoClass,
    DataJobInfoClass,
    DataJobInputOutputClass,
)


@dataclass
class ProcedureDependency:
    db: str
    schema: str
    name: str
    type: str
    env: str
    server: str
    source: str = "mssql"


@dataclass
class ProcedureLineageStream:
    dependencies: List[ProcedureDependency]

    @property
    def as_datajobs_url_list(self):
        datajobs_list = []
        job_flows: Dict[str, MSSQLProceduresContainer] = {}
        for dependency in self.dependencies:
            if dependency.type != "SQL_STORED_PROCEDURE":
                continue
            if dependency.schema in job_flows:
                flow = job_flows[dependency.schema]
            else:
                procedure_flow_name = (
                    f"{dependency.db}.{dependency.schema}.stored_procedures"
                )
                flow = MSSQLProceduresContainer(
                    name=procedure_flow_name,
                    env=dependency.env,
                    db=dependency.db,
                    host_port=dependency.server,
                )
                job_flows[dependency.schema] = flow
            upstream_procedure = StoredProcedure(
                flow=flow,
                db=dependency.db,
                schema=dependency.schema,
                name=dependency.name,
            )
            data_job = MSSQLDataJob(entity=upstream_procedure)
            datajobs_list.append(data_job.full_server_urn)
        return datajobs_list

    @property
    def as_datasets_url_list(self):
        return [
            make_dataset_urn(
                platform=dep.source,
                name=f"{dep.db}.{dep.schema}.{dep.name}",
                env=dep.env,
            )
            for dep in self.dependencies
            if dep.type in ("TABLE_TYPE", "VIEW", "USER_TABLE")
        ]

    @property
    def as_property(self):
        return {
            f"{dep.db}.{dep.schema}.{dep.name}": dep.type for dep in self.dependencies
        }


@dataclass
class MSSQLJob:
    db: str
    host_port: str
    name: str
    env: str
    source: str = "mssql"
    type: str = "JOB"

    @property
    def formatted_name(self) -> str:
        return self.name.replace(",", "-")

    @property
    def full_type(self) -> str:
        return f"({self.source},{self.formatted_name},{self.env})"

    @property
    def orchestrator(self):
        return self.source

    @property
    def cluster(self):
        return f"{self.env}/{self.host_port}"


@dataclass
class MSSQLProceduresContainer:
    db: str
    host_port: str
    name: str
    env: str
    source: str = "mssql"
    type: str = "JOB"

    @property
    def formatted_name(self) -> str:
        return self.name.replace(",", "-")

    @property
    def orchestrator(self) -> str:
        return self.source

    @property
    def cluster(self) -> str:
        return f"{self.env}/{self.host_port}/{self.db}"

    @property
    def full_type(self) -> str:
        return f"({self.source},{self.name},{self.env})"


@dataclass
class ProcedureParameter:
    name: str
    type: str

    @property
    def properties(self):
        return {"type": self.type}


@dataclass
class StoredProcedure:
    db: str
    schema: str
    name: str
    flow: Union[MSSQLJob, MSSQLProceduresContainer]
    type: str = "STORED_PROCEDURE"
    source: str = "mssql"

    @property
    def full_type(self) -> str:
        return self.source.upper() + "_" + self.type

    @property
    def formatted_name(self) -> str:
        return self.name.replace(",", "-")

    @property
    def full_name(self) -> str:
        return f"{self.db}.{self.schema}.{self.formatted_name}"


@dataclass
class JobStep:
    job_name: str
    step_name: str
    flow: MSSQLJob
    type: str = "JOB_STEP"
    source: str = "mssql"

    @property
    def formatted_step_name(self) -> str:
        return self.step_name.replace(",", "-")

    @property
    def formatted_job_name(self) -> str:
        return self.job_name.replace(",", "-")

    @property
    def full_type(self) -> str:
        return self.source.upper() + "_" + self.type

    @property
    def full_name(self) -> str:
        return f"{self.formatted_job_name}.{self.formatted_step_name}"


@dataclass
class MSSQLDataJob:
    entity: Union[StoredProcedure, JobStep]
    type: str = "dataJob"
    source: str = "mssql"
    external_url: str = ""
    description: Optional[str] = None
    status: Optional[str] = None
    incoming: List[str] = field(default_factory=list)
    outgoing: List[str] = field(default_factory=list)
    input_jobs: List[str] = field(default_factory=list)
    job_properties: Dict[str, str] = field(default_factory=dict)

    @property
    def urn(self):
        return make_data_job_urn(
            orchestrator=self.entity.flow.source,
            flow_id=self.entity.flow.formatted_name,
            job_id=self.entity.full_name,
            cluster=self.entity.flow.env,
        )

    @property
    def full_server_urn(self):
        return make_data_job_urn(
            orchestrator=self.entity.flow.orchestrator,
            flow_id=self.entity.flow.formatted_name,
            job_id=self.entity.full_name,
            cluster=self.entity.flow.cluster,
        )

    def add_property(self, name, value):
        self.job_properties[name] = value

    @property
    def valued_properties(self):
        if self.job_properties:
            return {k: v for k, v in self.job_properties.items() if v is not None}
        return self.job_properties

    @property
    def as_datajob_input_output_aspect_data(self):
        return dict(
            aspectName="dataJobInputOutput",
            aspect=DataJobInputOutputClass(
                inputDatasets=sorted(self.incoming),
                outputDatasets=sorted(self.outgoing),
                inputDatajobs=sorted(self.input_jobs),
            ),
        )

    @property
    def as_datajob_info_aspect_data(self):
        return dict(
            aspectName="dataJobInfo",
            aspect=DataJobInfoClass(
                name=self.entity.full_name,
                type=self.entity.full_type,
                description=self.description,
                customProperties=self.valued_properties,
                externalUrl=self.external_url,
                status=self.status,
            ),
        )


@dataclass
class MSSQLDataFlow:
    entity: Union[MSSQLJob, MSSQLProceduresContainer]
    type: str = "dataFlow"
    source: str = "mssql"
    external_url: str = ""
    flow_properties: Dict[str, str] = field(default_factory=dict)

    def add_property(self, name, value):
        self.flow_properties[name] = value

    @property
    def urn(self):
        return make_data_flow_urn(
            orchestrator=self.entity.source,
            flow_id=self.entity.formatted_name,
            cluster=self.entity.env,
        )

    @property
    def full_server_urn(self):
        return make_data_flow_urn(
            orchestrator=self.entity.orchestrator,
            flow_id=self.entity.formatted_name,
            cluster=self.entity.cluster,
        )

    @property
    def as_dataflow_info_aspect_data(self):
        return dict(
            aspectName="dataFlowInfo",
            aspect=DataFlowInfoClass(
                name=self.entity.formatted_name,
                customProperties=self.flow_properties,
                externalUrl=self.external_url,
            ),
        )
