import re
import unittest.mock
from abc import ABC, abstractmethod
from enum import auto
from typing import IO, Any, ClassVar, Dict, List, Optional, Type

import pydantic
from cached_property import cached_property
from pydantic import BaseModel, Extra, ValidationError
from pydantic.fields import Field
from typing_extensions import Protocol, Self, runtime_checkable

from datahub.configuration._config_enum import ConfigEnum
from datahub.utilities.dedup_list import deduplicate_list

REDACT_KEYS = {
    "password",
    "token",
    "secret",
    "options",
    "sqlalchemy_uri",
}
REDACT_SUFFIXES = {
    "_password",
    "_secret",
    "_token",
    "_key",
    "_key_id",
}


def _should_redact_key(key: str) -> bool:
    return key in REDACT_KEYS or any(key.endswith(suffix) for suffix in REDACT_SUFFIXES)


def _redact_value(value: Any) -> Any:
    if isinstance(value, str):
        # If it's just a variable reference, it's ok to show as-is.
        if value.startswith("$"):
            return value
        return "********"
    elif value is None:
        return None
    elif isinstance(value, bool):
        # We don't have any sensitive boolean fields.
        return value
    elif isinstance(value, list) and not value:
        # Empty states are fine.
        return []
    elif isinstance(value, dict) and not value:
        return {}
    else:
        return "********"


def redact_raw_config(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {
            k: _redact_value(v) if _should_redact_key(k) else redact_raw_config(v)
            for k, v in obj.items()
        }
    elif isinstance(obj, list):
        return [redact_raw_config(v) for v in obj]
    else:
        return obj


class ConfigModel(BaseModel):
    class Config:
        extra = Extra.forbid
        underscore_attrs_are_private = True
        keep_untouched = (
            cached_property,
        )  # needed to allow cached_property to work. See https://github.com/samuelcolvin/pydantic/issues/1241 for more info.

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model: Type["ConfigModel"]) -> None:
            # We use the custom "hidden_from_docs" attribute to hide fields from the
            # autogenerated docs.
            remove_fields = []
            for key, prop in schema.get("properties", {}).items():
                if prop.get("hidden_from_docs"):
                    remove_fields.append(key)

            for key in remove_fields:
                del schema["properties"][key]

    @classmethod
    def parse_obj_allow_extras(cls, obj: Any) -> Self:
        with unittest.mock.patch.object(cls.Config, "extra", pydantic.Extra.allow):
            return cls.parse_obj(obj)


class PermissiveConfigModel(ConfigModel):
    # A permissive config model that allows extra fields.
    # This is useful for cases where we want to strongly type certain fields,
    # but still allow the user to pass in arbitrary fields that we don't care about.
    # It is usually used for argument bags that are passed through to third-party libraries.

    class Config:
        extra = Extra.allow


class TransformerSemantics(ConfigEnum):
    """Describes semantics for aspect changes"""

    OVERWRITE = auto()  # Apply changes blindly
    PATCH = auto()  # Only apply differences from what exists already on the server


class TransformerSemanticsConfigModel(ConfigModel):
    semantics: TransformerSemantics = TransformerSemantics.OVERWRITE
    replace_existing: bool = False


class DynamicTypedConfig(ConfigModel):
    type: str = Field(
        description="The type of the dynamic object",
    )
    # This config type is declared Optional[Any] here. The eventual parser for the
    # specified type is responsible for further validation.
    config: Optional[Any] = Field(
        default=None,
        description="The configuration required for initializing the state provider. Default: The datahub_api config if set at pipeline level. Otherwise, the default DatahubClientConfig. See the defaults (https://github.com/datahub-project/datahub/blob/master/metadata-ingestion/src/datahub/ingestion/graph/client.py#L19).",
    )


# TODO: Many of these exception types are fairly specialized and shouldn't live in a common module.


class MetaError(Exception):
    """A base class for all meta exceptions."""


class PipelineExecutionError(MetaError):
    """An error occurred when executing the pipeline."""


class GraphError(MetaError):
    """An error in communicating with the DataHub Graph."""


class OperationalError(GraphError):
    """A GraphError with extra debug annotations."""

    message: str
    info: dict

    def __init__(self, message: str, info: Optional[dict] = None):
        self.message = message
        self.info = info or {}


class ConfigurationError(MetaError):
    """A configuration error."""


class IgnorableError(MetaError):
    """An error that can be ignored."""


@runtime_checkable
class ExceptionWithProps(Protocol):
    def get_telemetry_props(self) -> Dict[str, Any]:
        ...


def should_show_stack_trace(exc: Exception) -> bool:
    # Unless the exception is a ValidationError or explicitly opts out of stack traces,
    # we should show the stack trace.

    if isinstance(exc, ValidationError) or isinstance(exc.__cause__, ValidationError):
        return False

    return getattr(exc, "SHOW_STACK_TRACE", True)


class ConfigurationWarning(Warning):
    """A configuration warning."""


class ConfigurationMechanism(ABC):
    @abstractmethod
    def load_config(self, config_fp: IO) -> dict:
        pass


class OauthConfiguration(ConfigModel):
    provider: Optional[str] = Field(
        description="Identity provider for oauth, e.g- microsoft"
    )
    client_id: Optional[str] = Field(
        description="client id of your registered application"
    )
    scopes: Optional[List[str]] = Field(
        description="scopes required to connect to snowflake"
    )
    use_certificate: bool = Field(
        description="Do you want to use certificate and private key to authenticate using oauth",
        default=False,
    )
    client_secret: Optional[str] = Field(
        description="client secret of the application if use_certificate = false"
    )
    authority_url: Optional[str] = Field(
        description="Authority url of your identity provider"
    )
    encoded_oauth_public_key: Optional[str] = Field(
        description="base64 encoded certificate content if use_certificate = true"
    )
    encoded_oauth_private_key: Optional[str] = Field(
        description="base64 encoded private key content if use_certificate = true"
    )


class AllowDenyPattern(ConfigModel):
    """A class to store allow deny regexes"""

    # This regex is used to check if a given rule is a regex expression or a literal.
    # Note that this is not a perfect check. For example, the '.' character should
    # be considered a regex special character, but it's used frequently in literal
    # patterns and hence we allow it anyway.
    IS_SIMPLE_REGEX: ClassVar = re.compile(r"^[A-Za-z0-9 _.-]+$")

    allow: List[str] = Field(
        default=[".*"],
        description="List of regex patterns to include in ingestion",
    )
    deny: List[str] = Field(
        default=[],
        description="List of regex patterns to exclude from ingestion.",
    )
    ignoreCase: Optional[bool] = Field(
        default=True,
        description="Whether to ignore case sensitivity during pattern matching.",
    )  # Name comparisons should default to ignoring case

    @property
    def regex_flags(self) -> int:
        return re.IGNORECASE if self.ignoreCase else 0

    @classmethod
    def allow_all(cls) -> "AllowDenyPattern":
        return AllowDenyPattern()

    def allowed(self, string: str) -> bool:
        for deny_pattern in self.deny:
            if re.match(deny_pattern, string, self.regex_flags):
                return False

        return any(
            re.match(allow_pattern, string, self.regex_flags)
            for allow_pattern in self.allow
        )

    def is_fully_specified_allow_list(self) -> bool:
        """
        If the allow patterns are literals and not full regexes, then it is considered
        fully specified. This is useful if you want to convert a 'list + filter'
        pattern into a 'search for the ones that are allowed' pattern, which can be
        much more efficient in some cases.
        """
        return all(
            self.IS_SIMPLE_REGEX.match(allow_pattern) for allow_pattern in self.allow
        )

    def get_allowed_list(self) -> List[str]:
        """Return the list of allowed strings as a list, after taking into account deny patterns, if possible"""
        assert self.is_fully_specified_allow_list()
        return [a for a in self.allow if self.allowed(a)]

    def __eq__(self, other):  # type: ignore
        return isinstance(other, self.__class__) and self.__dict__ == other.__dict__


class KeyValuePattern(ConfigModel):
    """
    The key-value pattern is used to map a regex pattern to a set of values.
    For example, you can use it to map a table name to a list of tags to apply to it.
    """

    rules: Dict[str, List[str]] = {".*": []}
    first_match_only: bool = Field(
        default=True,
        description="Whether to stop after the first match. If false, all matching rules will be applied.",
    )

    @classmethod
    def all(cls) -> "KeyValuePattern":
        return KeyValuePattern()

    def value(self, string: str) -> List[str]:
        matching_keys = [key for key in self.rules.keys() if re.match(key, string)]
        if not matching_keys:
            return []
        elif self.first_match_only:
            return self.rules[matching_keys[0]]
        else:
            return deduplicate_list(
                [v for key in matching_keys for v in self.rules[key]]
            )


class VersionedConfig(ConfigModel):
    version: str = "1"


class LineageConfig(ConfigModel):
    incremental_lineage: bool = Field(
        default=True,
        description="When enabled, emits lineage as incremental to existing lineage already in DataHub. When disabled, re-states lineage on each run.",
    )

    sql_parser_use_external_process: bool = Field(
        default=False,
        description="When enabled, sql parser will run in isolated in a separate process. This can affect processing time but can protect from sql parser's mem leak.",
    )
