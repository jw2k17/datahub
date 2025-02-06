# Generated by ariadne-codegen
# Source: ./tableau-queries.graphql

from typing import Annotated, Any, List, Literal, Optional, Union

from pydantic import Field

from datahub.ingestion.source.tableau.codegen_ariadne.base_model import BaseModel
from datahub.ingestion.source.tableau.codegen_ariadne.enums import (
    FieldDataType,
    FieldRole,
    FieldRoleCategory,
)


class GetItemsPublishedDatasourcesConnection(BaseModel):
    published_datasources_connection: "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnection" = Field(
        alias="publishedDatasourcesConnection"
    )


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnection(BaseModel):
    nodes: List[
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodes"
    ]
    page_info: "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionPageInfo" = Field(
        alias="pageInfo"
    )


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodes(
    BaseModel
):
    typename__: Literal["PublishedDatasource"] = Field(alias="__typename")
    id: str
    name: Optional[str]
    luid: str
    has_extracts: Optional[bool] = Field(alias="hasExtracts")
    extract_last_refresh_time: Optional[Any] = Field(alias="extractLastRefreshTime")
    extract_last_incremental_update_time: Optional[Any] = Field(
        alias="extractLastIncrementalUpdateTime"
    )
    extract_last_update_time: Optional[Any] = Field(alias="extractLastUpdateTime")
    upstream_tables: List[
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTables"
    ] = Field(alias="upstreamTables")
    fields: List[
        Annotated[
            Union[
                "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsField",
                "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsCalculatedField",
                "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsColumnField",
                "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsGroupField",
            ],
            Field(discriminator="typename__"),
        ]
    ]
    owner: (
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesOwner"
    )
    description: Optional[str]
    uri: Optional[str]
    project_name: Optional[str] = Field(alias="projectName")
    tags: List[
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesTags"
    ]


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTables(
    BaseModel
):
    id: str
    name: Optional[str]
    database: Optional[
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTablesDatabase"
    ]
    schema_: Optional[str] = Field(alias="schema")
    full_name: Optional[str] = Field(alias="fullName")
    connection_type: Optional[str] = Field(alias="connectionType")
    description: Optional[str]
    columns_connection: Optional[
        "GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTablesColumnsConnection"
    ] = Field(alias="columnsConnection")


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTablesDatabase(
    BaseModel
):
    typename__: Literal[
        "CloudFile",
        "DataCloud",
        "Database",
        "DatabaseServer",
        "File",
        "WebDataConnector",
    ] = Field(alias="__typename")
    name: Optional[str]
    id: str


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTablesColumnsConnection(
    BaseModel
):
    total_count: int = Field(alias="totalCount")


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsField(
    BaseModel
):
    typename__: Literal[
        "BinField",
        "CombinedField",
        "CombinedSetField",
        "DatasourceField",
        "Field",
        "HierarchyField",
        "SetField",
    ] = Field(alias="__typename")
    id: str
    name: Optional[str]
    description: Optional[str]
    is_hidden: Optional[bool] = Field(alias="isHidden")
    folder_name: Optional[str] = Field(alias="folderName")


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsCalculatedField(
    BaseModel
):
    typename__: Literal["CalculatedField"] = Field(alias="__typename")
    id: str
    name: Optional[str]
    description: Optional[str]
    is_hidden: Optional[bool] = Field(alias="isHidden")
    folder_name: Optional[str] = Field(alias="folderName")
    role: Optional[FieldRole]
    data_type: Optional[FieldDataType] = Field(alias="dataType")
    default_format: Optional[str] = Field(alias="defaultFormat")
    aggregation: Optional[str]
    formula: Optional[str]


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsColumnField(
    BaseModel
):
    typename__: Literal["ColumnField"] = Field(alias="__typename")
    id: str
    name: Optional[str]
    description: Optional[str]
    is_hidden: Optional[bool] = Field(alias="isHidden")
    folder_name: Optional[str] = Field(alias="folderName")
    data_category: Optional[FieldRoleCategory] = Field(alias="dataCategory")
    role: Optional[FieldRole]
    data_type: Optional[FieldDataType] = Field(alias="dataType")
    default_format: Optional[str] = Field(alias="defaultFormat")
    aggregation: Optional[str]


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesFieldsGroupField(
    BaseModel
):
    typename__: Literal["GroupField"] = Field(alias="__typename")
    id: str
    name: Optional[str]
    description: Optional[str]
    is_hidden: Optional[bool] = Field(alias="isHidden")
    folder_name: Optional[str] = Field(alias="folderName")
    role: Optional[FieldRole]
    data_type: Optional[FieldDataType] = Field(alias="dataType")


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesOwner(
    BaseModel
):
    username: Optional[str]


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesTags(
    BaseModel
):
    name: Optional[str]


class GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionPageInfo(
    BaseModel
):
    has_next_page: bool = Field(alias="hasNextPage")
    end_cursor: Optional[str] = Field(alias="endCursor")


GetItemsPublishedDatasourcesConnection.model_rebuild()
GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnection.model_rebuild()
GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodes.model_rebuild()
GetItemsPublishedDatasourcesConnectionPublishedDatasourcesConnectionNodesUpstreamTables.model_rebuild()
