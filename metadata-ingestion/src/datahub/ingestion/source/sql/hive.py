import json
import re
import uuid
from typing import Any, Dict, List, Optional

# This import verifies that the dependencies are available.
from pyhive import hive  # noqa: F401
from pyhive.sqlalchemy_hive import HiveDate, HiveDecimal, HiveTimestamp

from datahub.ingestion.extractor import schema_util
from datahub.ingestion.source.sql.sql_common import (
    BasicSQLAlchemyConfig,
    SQLAlchemySource,
    register_custom_type,
)
from datahub.metadata.com.linkedin.pegasus2avro.schema import (
    DateTypeClass,
    NumberTypeClass,
    SchemaField,
    TimeTypeClass,
)
from datahub.metadata.schema_classes import NullTypeClass

register_custom_type(HiveDate, DateTypeClass)
register_custom_type(HiveTimestamp, TimeTypeClass)
register_custom_type(HiveDecimal, NumberTypeClass)


class HiveConfig(BasicSQLAlchemyConfig):
    # defaults
    scheme = "hive"

    # Hive SQLAlchemy connector returns views as tables.
    # See https://github.com/dropbox/PyHive/blob/b21c507a24ed2f2b0cf15b0b6abb1c43f31d3ee0/pyhive/sqlalchemy_hive.py#L270-L273.
    # Disabling views helps us prevent this duplication.
    include_views = False


class HiveSource(SQLAlchemySource):

    _COMPLEX_TYPE = re.compile("^(struct|map|array|uniontype)")

    def __init__(self, config, ctx):
        super().__init__(config, ctx, "hive")

    @classmethod
    def create(cls, config_dict, ctx):
        config = HiveConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_schema_names(self, inspector):
        assert isinstance(self.config, HiveConfig)
        # This condition restricts the ingestion to the specified database.
        if self.config.database:
            return [self.config.database]
        else:
            return super().get_schema_names(inspector)

    def get_schema_fields_for_column(
        self,
        dataset_name: str,
        columns: Dict[Any, Any],
        pk_constraints: Optional[Dict[Any, Any]] = None,
    ) -> List[SchemaField]:

        fields = super().get_schema_fields_for_column(
            dataset_name, columns, pk_constraints
        )

        if self._COMPLEX_TYPE.match(fields[0].nativeDataType) and isinstance(
            fields[0].type.type, NullTypeClass
        ):
            assert len(fields) == 1
            field = fields[0]
            # Get avro schema for newfields along with parent complex field
            avro_schema = self.get_avro_schema_from_native_data_type(
                field.nativeDataType, field.fieldPath
            )

            newfields = schema_util.avro_schema_to_mce_fields(json.dumps(avro_schema))

            # TODO - set nullable correctly as per native data type or from schema_util
            for subfield in newfields:
                subfield.nullable = field.nullable

            # First field is the parent complex field
            newfields[0].description = field.description
            newfields[0].isPartOfKey = field.isPartOfKey
            return newfields

        return fields

    def get_avro_schema_from_native_data_type(
        self, column_type: str, column_name: str
    ) -> Dict[str, Any]:
        # Below Record structure represents the dataset level
        # Inner fields represent the complex field (struct/array/map/union)
        return {
            "type": "record",
            "name": "__struct_",
            "fields": [
                {"name": column_name, "type": _parse_datatype_string(column_type)}
            ],
        }


_BRACKETS = {"(": ")", "[": "]", "{": "}", "<": ">"}

# TODO - Check these mappings carefully
_all_atomic_types = {
    "string": "string",
    "int": "int",
    "integer": "int",
    "double": "double",
    "double precision": "double",
    "binary": "boolean",
    "boolean": "boolean",
    "decimal": "decimal",
    "float": "float",
    "byte": "int",
    "tinyint": "int",
    "smallint": "int",
    "int": "int",
    "bigint": "long",
    "varchar": "string",
    "char": "string",
    "date": "date",
    "timestamp": "timestamp",
    "numeric": "decimal",
}

_FIXED_DECIMAL = re.compile("decimal\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)")

_FIXED_STRING = re.compile("(var)?char\\(\\s*(\\d+)\\s*\\)")


def _parse_datatype_string(s):
    s = s.strip()
    if s.startswith("array<"):
        if s[-1] != ">":
            raise ValueError("'>' should be the last char, but got: %s" % s)
        return {
            "type": "array",
            "items": _parse_datatype_string(s[6:-1]),
            "native_data_type": s,
        }
    elif s.startswith("map<"):
        if s[-1] != ">":
            raise ValueError("'>' should be the last char, but got: %s" % s)
        parts = _ignore_brackets_split(s[4:-1], ",")
        if len(parts) != 2:
            raise ValueError(
                "The map type string format is: 'map<key_type,value_type>', "
                + "but got: %s" % s
            )
        # kt = _parse_datatype_string(parts[0])  # keys are assumed to be strings in avro map
        vt = _parse_datatype_string(parts[1])
        return {"type": "map", "values": vt, "native_data_type": s}
    elif s.startswith("uniontype<"):
        if s[-1] != ">":
            raise ValueError("'>' should be the last char, but got: %s" % s)
        parts = _ignore_brackets_split(s[10:-1], ",")
        t = []
        for part in parts:
            t.append(_parse_datatype_string(part))
        return t
    elif s.startswith("struct<"):
        if s[-1] != ">":
            raise ValueError("'>' should be the last char, but got: %s" % s)
        return _parse_struct_fields_string(s[7:-1])
    elif ":" in s:
        return _parse_struct_fields_string(s)
    else:
        return _parse_basic_datatype_string(s)


def _parse_struct_fields_string(s):
    parts = _ignore_brackets_split(s, ",")
    fields = []
    for part in parts:
        name_and_type = _ignore_brackets_split(part, ":")
        if len(name_and_type) != 2:
            raise ValueError(
                "The struct field string format is: 'field_name:field_type', "
                + "but got: %s" % part
            )
        field_name = name_and_type[0].strip()
        if field_name.startswith("`"):
            if field_name[-1] != "`":
                raise ValueError("'`' should be the last char, but got: %s" % s)
            field_name = field_name[1:-1]
        field_type = _parse_datatype_string(name_and_type[1])
        fields.append({"name": field_name, "type": field_type})
    return {
        "type": "record",
        "name": "__struct_{}".format(str(uuid.uuid4()).replace("-", "")),
        "fields": fields,
        "native_data_type": "struct<{}>".format(s),
    }


def _parse_basic_datatype_string(s):
    if s in _all_atomic_types.keys():
        return {"type": _all_atomic_types[s], "native_data_type": s}
    elif _FIXED_DECIMAL.match(s):
        m = _FIXED_DECIMAL.match(s)
        return {
            "type": "bytes",
            "logicalType": "decimal",
            "precision": int(m.group(1)),  # type: ignore
            "scale": int(m.group(2)),  # type: ignore
            "native_data_type": s,
        }
    elif _FIXED_STRING.match(s):
        m = _FIXED_STRING.match(s)
        return {"type": "string", "native_data_type": s}
    else:
        return {"type": "null", "native_data_type": s}
        # raise ValueError("Could not parse datatype: %s" % s)


def _ignore_brackets_split(s, separator):
    """
    Splits the given string by given separator, but ignore separators inside brackets pairs, e.g.
    given "a,b" and separator ",", it will return ["a", "b"], but given "a<b,c>, d", it will return
    ["a<b,c>", "d"].
    """
    parts = []
    buf = ""
    level = 0
    for c in s:
        if c in _BRACKETS.keys():
            level += 1
            buf += c
        elif c in _BRACKETS.values():
            if level == 0:
                raise ValueError("Brackets are not correctly paired: %s" % s)
            level -= 1
            buf += c
        elif c == separator and level > 0:
            buf += c
        elif c == separator:
            parts.append(buf)
            buf = ""
        else:
            buf += c

    if len(buf) == 0:
        raise ValueError("The %s cannot be the last char: %s" % (separator, s))
    parts.append(buf)
    return parts
