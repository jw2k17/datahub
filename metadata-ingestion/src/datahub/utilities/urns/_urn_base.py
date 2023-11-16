import functools
import urllib.parse
from abc import abstractmethod
from typing import ClassVar, Dict, List, Optional, Type, TypeVar

from deprecated import deprecated

from datahub.utilities.urns.error import InvalidUrnError

URN_TYPES: Dict[str, Type["_SpecificUrn"]] = {}


def _split_entity_id(entity_id: str) -> List[str]:
    if not (entity_id.startswith("(") and entity_id.endswith(")")):
        return [entity_id]

    parts = []
    start_paren_count = 1
    part_start = 1
    for i in range(1, len(entity_id)):
        c = entity_id[i]
        if c == "(":
            start_paren_count += 1
        elif c == ")":
            start_paren_count -= 1
            if start_paren_count < 0:
                raise InvalidUrnError(f"{entity_id}, mismatched paren nesting")
        elif c == ",":
            if start_paren_count != 1:
                continue

            if i - part_start <= 0:
                raise InvalidUrnError(f"{entity_id}, empty part disallowed")
            parts.append(entity_id[part_start:i])
            part_start = i + 1

    if start_paren_count != 0:
        raise InvalidUrnError(f"{entity_id}, mismatched paren nesting")

    parts.append(entity_id[part_start:-1])

    return parts


_UrnSelf = TypeVar("_UrnSelf", bound="Urn")


@functools.total_ordering
class Urn:
    """
    URNs are globally unique identifiers used to refer to entities.

    It will be in format of urn:li:<type>:<id> or urn:li:<type>:(<id1>,<id2>,...)
    """

    LI_DOMAIN: ClassVar[str] = "li"  # retained for backwards compatibility

    _entity_type: str
    _entity_ids: List[str]

    def __init__(self, entity_type: str, entity_ids: List[str]) -> None:
        self._entity_type = entity_type
        self._entity_ids = entity_ids

        if not self._entity_ids:
            raise InvalidUrnError("Empty entity id.")
        for entity_id in self._entity_ids:
            if not entity_id:
                raise InvalidUrnError("Empty entity id.")

    @property
    def entity_type(self) -> str:
        return self._entity_type

    @property
    def entity_ids(self) -> List[str]:
        return self._entity_ids

    @classmethod
    def from_string(cls, urn_str: str) -> "Urn":
        """
        Create a Urn from the its string representation
        :param urn_str: the string representation of the Urn
        :return: Urn of the given string representation
        :raises InvalidUrnError if the string representation is in invalid format
        """

        # TODO: Add handling for url encoded urns e.g. urn%3A ...

        if not urn_str.startswith("urn:li:"):
            raise InvalidUrnError(
                f"Invalid urn string: {urn_str}. Urns should start with 'urn:li:'"
            )

        parts: List[str] = urn_str.split(":", maxsplit=3)
        if len(parts) != 4:
            raise InvalidUrnError(
                f"Invalid urn string: {urn_str}. Expect 4 parts from urn string but found {len(parts)}"
            )
        if "" in parts:
            raise InvalidUrnError(
                f"Invalid urn string: {urn_str}. There should not be empty parts in urn string."
            )

        _urn, _li, entity_type, entity_ids_str = parts
        entity_ids = _split_entity_id(entity_ids_str)

        # TODO undo encoding?

        UrnCls: Optional[Type["_SpecificUrn"]] = URN_TYPES.get(entity_type)
        if UrnCls:
            return UrnCls._parse_ids(entity_ids)

        # Fallback for unknown types.
        return Urn(entity_type, entity_ids)

    def urn(self) -> str:
        # TODO: add encoding?
        if len(self._entity_ids) == 1:
            return f"urn:li:{self._entity_type}:{self._entity_ids[0]}"

        return f"urn:li:{self._entity_type}:({','.join(self._entity_ids)})"

    def __str__(self) -> str:
        return self.urn()

    def urn_url_encoded(self) -> str:
        return Urn.url_encode(self.urn())

    def __eq__(self, other: object) -> bool:
        # TODO: Should we allow comparison with strings?
        if not isinstance(other, Urn):
            return False
        return self.urn() == other.urn()

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, Urn):
            return False
        return self.urn() < other.urn()

    def __hash__(self) -> int:
        return hash(self.urn())

    @classmethod
    @deprecated(reason="prefer .from_string")
    def create_from_string(cls, urn_str: str) -> "Urn":
        return cls.from_string(urn_str)

    @deprecated(reason="prefer .entity_ids")
    def get_entity_id(self) -> List[str]:
        return self._entity_ids

    @deprecated(reason="prefer .entity_type")
    def get_type(self) -> str:
        return self._entity_type

    @deprecated(reason="no longer needed")
    def get_domain(self) -> str:
        return "li"

    @deprecated(reason="no longer needed")
    def get_entity_id_as_string(self) -> str:
        urn = self.urn()
        prefix = "urn:li:"
        assert urn.startswith(prefix)
        id_with_type = urn[len(prefix) :]
        return id_with_type.split(":", maxsplit=1)[1]

    @classmethod
    @deprecated(reason="no longer needed")
    def validate(cls, urn_str: str) -> None:
        Urn.create_from_string(urn_str)

    @staticmethod
    def url_encode(urn: str) -> str:
        # safe='' encodes '/' as '%2F'
        return urllib.parse.quote(urn, safe="")


class _SpecificUrn(Urn):
    ENTITY_TYPE: str = ""

    def __init_subclass__(cls) -> None:
        # Validate the subclass.
        entity_type = cls.ENTITY_TYPE
        if not entity_type:
            raise ValueError(f'_SpecificUrn subclass {cls} must define "ENTITY_TYPE"')

        # Register the urn type.
        if entity_type in URN_TYPES:
            raise ValueError(f"duplicate urn type registered: {entity_type}")
        URN_TYPES[entity_type] = cls

        return super().__init_subclass__()

    @classmethod
    def underlying_key_aspect_type(cls) -> Type:
        raise NotImplementedError()

    @classmethod
    def from_string(cls: Type[_UrnSelf], urn_str: str) -> "_UrnSelf":
        urn = super().from_string(urn_str)
        if not isinstance(urn, cls):
            raise InvalidUrnError(
                f"Passed an urn of type {type(urn)} to the from_string method of {cls}. Use Urn.from_string() or {type(urn)}.from_string() instead."
            )
        return urn

    @classmethod
    @abstractmethod
    def _parse_ids(cls: Type[_UrnSelf], entity_ids: List[str]) -> _UrnSelf:
        raise NotImplementedError()
