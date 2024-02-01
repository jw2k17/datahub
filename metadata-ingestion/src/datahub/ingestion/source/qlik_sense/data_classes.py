from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Type, Union

from pydantic import BaseModel, Field, root_validator

from datahub.emitter.mcp_builder import ContainerKey
from datahub.ingestion.source.qlik_sense.config import QLIK_DATETIME_FORMAT, Constant
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    BooleanType,
    BytesType,
    DateType,
    NumberType,
    StringType,
    TimeType,
)

FIELD_TYPE_MAPPING: Dict[
    str,
    Type[
        Union[
            BooleanType,
            BytesType,
            DateType,
            NumberType,
            StringType,
            TimeType,
        ]
    ],
] = {
    "DATE": DateType,
    "TIME": TimeType,
    "DATETIME": DateType,
    "TIMESTAMP": DateType,
    "STRING": StringType,
    "DOUBLE": NumberType,
    "DECIMAL": NumberType,
    "INTEGER": NumberType,
    "BOOLEAN": BooleanType,
    "BINARY": BytesType,
}

KNOWN_DATA_PLATFORM_MAPPING = {
    "gbq": "bigquery",
    "snowflake": "snowflake",
}


class SpaceKey(ContainerKey):
    space: str


class AppKey(ContainerKey):
    app: str


class SpaceType(Enum):
    PERSONAL = "personal"
    SHARED = "shared"
    MANAGED = "managed"
    DATA = "data"


PERSONAL_SPACE_DICT = {
    "id": Constant.PERSONAL_SPACE_ID,
    "name": Constant.PERSONAL_SPACE_NAME,
    "description": "",
    "type": SpaceType.PERSONAL,
    "createdAt": datetime.now().strftime(QLIK_DATETIME_FORMAT),
    "updatedAt": datetime.now().strftime(QLIK_DATETIME_FORMAT),
}


class Space(BaseModel):
    id: str
    name: str
    description: str
    type: SpaceType
    createdAt: datetime
    updatedAt: datetime
    ownerId: Optional[str] = None

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        values[Constant.CREATEDAT] = datetime.strptime(
            values[Constant.CREATEDAT], QLIK_DATETIME_FORMAT
        )
        values[Constant.UPDATEDAT] = datetime.strptime(
            values[Constant.UPDATEDAT], QLIK_DATETIME_FORMAT
        )
        return values


class Item(BaseModel):
    id: str
    description: str = ""
    ownerId: str
    spaceId: str
    createdAt: datetime
    updatedAt: datetime


class SchemaField(BaseModel):
    name: str
    dataType: Optional[str] = None
    primaryKey: Optional[bool] = None
    nullable: Optional[bool] = None

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        values[Constant.DATATYPE] = values.get(Constant.DATATYPE, {}).get(Constant.TYPE)
        return values


class QlikDataset(Item):
    name: str
    secureQri: str
    type: str
    size: int
    rowCount: int
    datasetSchema: List[SchemaField]

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        # Update str time to datetime
        values[Constant.CREATEDAT] = datetime.strptime(
            values[Constant.CREATEDTIME], QLIK_DATETIME_FORMAT
        )
        values[Constant.UPDATEDAT] = datetime.strptime(
            values[Constant.LASTMODIFIEDTIME], QLIK_DATETIME_FORMAT
        )
        if not values.get(Constant.SPACEID):
            # spaceId none indicates dataset present in personal space
            values[Constant.SPACEID] = Constant.PERSONAL_SPACE_ID
        values[Constant.QRI] = values[Constant.SECUREQRI]
        values[Constant.SIZE] = values[Constant.OPERATIONAL].get(Constant.SIZE, 0)
        values[Constant.ROWCOUNT] = values[Constant.OPERATIONAL][Constant.ROWCOUNT]

        values[Constant.DATASETSCHEMA] = values[Constant.SCHEMA][Constant.DATAFIELDS]
        return values


class Chart(BaseModel):
    qId: str
    qType: str


class Sheet(BaseModel):
    id: str
    title: str
    description: str
    ownerId: str
    createdAt: datetime
    updatedAt: datetime
    charts: List[Chart] = []

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        values[Constant.CREATEDAT] = datetime.strptime(
            values[Constant.CREATEDDATE], QLIK_DATETIME_FORMAT
        )
        values[Constant.UPDATEDAT] = datetime.strptime(
            values[Constant.MODIFIEDDATE], QLIK_DATETIME_FORMAT
        )
        return values


class QlikAppDataset(BaseModel):
    tableName: str
    schemaName: str
    databaseName: str
    tableAlias: str
    dataconnectorid: str
    dataconnectorName: str
    dataconnectorPlatform: str
    datasetSchema: List[SchemaField] = Field(alias="fields")

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        values[Constant.DATABASENAME] = values[Constant.CONNECTORPROPERTIES][
            Constant.TABLEQUALIFIERS
        ][0]
        values[Constant.SCHEMANAME] = values[Constant.CONNECTORPROPERTIES][
            Constant.TABLEQUALIFIERS
        ][1]
        values[Constant.DATACONNECTORID] = values[Constant.CONNECTIONINFO][Constant.ID]
        values[Constant.DATACONNECTORPLATFORM] = values[Constant.CONNECTIONINFO][
            Constant.SOURCECONNECTORID
        ]
        return values


class App(Item):
    qTitle: str
    qri: str
    qUsage: str
    sheets: List[Sheet] = []
    datasets: List[QlikAppDataset] = []

    @root_validator(pre=True)
    def update_values(cls, values: Dict) -> Dict:
        values[Constant.CREATEDAT] = datetime.strptime(
            values[Constant.CREATEDDATE], QLIK_DATETIME_FORMAT
        )
        values[Constant.UPDATEDAT] = datetime.strptime(
            values[Constant.MODIFIEDDATE], QLIK_DATETIME_FORMAT
        )
        if not values.get(Constant.SPACEID):
            # spaceId none indicates app present in personal space
            values[Constant.SPACEID] = Constant.PERSONAL_SPACE_ID
        values[Constant.QRI] = f"qri:app:sense://{values['id']}"
        return values
