# Generated by ariadne-codegen
# Source: ./tableau-queries.graphql

from typing import Any, List, Optional

from pydantic import Field

from datahub.ingestion.source.tableau.codegen_ariadne.base_model import BaseModel


class GetItemsWorkbooksConnection(BaseModel):
    workbooks_connection: "GetItemsWorkbooksConnectionWorkbooksConnection" = Field(
        alias="workbooksConnection"
    )


class GetItemsWorkbooksConnectionWorkbooksConnection(BaseModel):
    nodes: List["GetItemsWorkbooksConnectionWorkbooksConnectionNodes"]
    page_info: "GetItemsWorkbooksConnectionWorkbooksConnectionPageInfo" = Field(
        alias="pageInfo"
    )


class GetItemsWorkbooksConnectionWorkbooksConnectionNodes(BaseModel):
    id: str
    name: Optional[str]
    luid: str
    uri: Optional[str]
    project_name: Optional[str] = Field(alias="projectName")
    owner: "GetItemsWorkbooksConnectionWorkbooksConnectionNodesOwner"
    description: Optional[str]
    uri: Optional[str]
    created_at: Any = Field(alias="createdAt")
    updated_at: Any = Field(alias="updatedAt")
    tags: List["GetItemsWorkbooksConnectionWorkbooksConnectionNodesTags"]
    sheets: List["GetItemsWorkbooksConnectionWorkbooksConnectionNodesSheets"]
    dashboards: List["GetItemsWorkbooksConnectionWorkbooksConnectionNodesDashboards"]
    embedded_datasources: List[
        "GetItemsWorkbooksConnectionWorkbooksConnectionNodesEmbeddedDatasources"
    ] = Field(alias="embeddedDatasources")


class GetItemsWorkbooksConnectionWorkbooksConnectionNodesOwner(BaseModel):
    username: Optional[str]


class GetItemsWorkbooksConnectionWorkbooksConnectionNodesTags(BaseModel):
    name: Optional[str]


class GetItemsWorkbooksConnectionWorkbooksConnectionNodesSheets(BaseModel):
    id: str


class GetItemsWorkbooksConnectionWorkbooksConnectionNodesDashboards(BaseModel):
    id: str


class GetItemsWorkbooksConnectionWorkbooksConnectionNodesEmbeddedDatasources(BaseModel):
    id: str


class GetItemsWorkbooksConnectionWorkbooksConnectionPageInfo(BaseModel):
    has_next_page: bool = Field(alias="hasNextPage")
    end_cursor: Optional[str] = Field(alias="endCursor")


GetItemsWorkbooksConnection.model_rebuild()
GetItemsWorkbooksConnectionWorkbooksConnection.model_rebuild()
GetItemsWorkbooksConnectionWorkbooksConnectionNodes.model_rebuild()
