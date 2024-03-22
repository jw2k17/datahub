import logging
import re
from functools import lru_cache
from typing import Dict, List, Optional, Sequence, Union, cast

from pydantic.class_validators import root_validator

from datahub.configuration.common import TransformerSemanticsConfigModel
from datahub.emitter.mce_builder import Aspect, make_ownership_type_urn
from datahub.emitter.mcp import MetadataChangeProposalWrapper
from datahub.ingestion.api.common import PipelineContext
from datahub.ingestion.transformer.dataset_transformer import DatasetTagsTransformer
from datahub.metadata.schema_classes import (
    GlobalTagsClass,
    MetadataChangeProposalClass,
    OwnerClass,
    OwnershipClass,
    OwnershipTypeClass,
)
from datahub.utilities.urns.corp_group_urn import CorpGroupUrn
from datahub.utilities.urns.corpuser_urn import CorpuserUrn
from datahub.utilities.urns.tag_urn import TagUrn

logger = logging.getLogger(__name__)


class ExtractOwnersFromTagsConfig(TransformerSemanticsConfigModel):
    tag_prefix: Optional[str]
    tag_pattern: Optional[str]
    is_user: bool = True
    owner_character_mapping: Optional[Dict[str, str]] = None
    email_domain: Optional[str] = None
    extract_owner_type_from_tag_pattern: bool = False
    owner_type: str = "TECHNICAL_OWNER"
    owner_type_urn: Optional[str] = None

    @root_validator(pre=True)
    def raise_error_for_tag_prefix(cls, values: Dict) -> Dict:
        if (
            values.get("tag_prefix") is not None
            and values.get("tag_pattern") is not None
        ):
            raise ValueError(
                "Cannot provide both tag_prefix and tag_pattern parameter. tag_prefix is deprecated in favor of tag_pattern."
            )
        if values.get("tag_pattern") is None and values.get("tag_prefix") is None:
            raise ValueError("tag_pattern is required")
        if values.get("tag_prefix") is not None:
            logger.warning(
                "The tag_prefix argument is deprecated. Use tag_pattern instead."
            )
            values["tag_pattern"] = values["tag_prefix"]
        return values


@lru_cache(maxsize=10)
def get_owner_type(owner_type_str: str) -> str:
    for item in dir(OwnershipTypeClass):
        if str(item) == owner_type_str:
            return item
    return OwnershipTypeClass.CUSTOM


class ExtractOwnersFromTagsTransformer(DatasetTagsTransformer):
    """Transformer that can be used to set extract ownership from entity tags (currently does not support column level tags)"""

    ctx: PipelineContext
    config: ExtractOwnersFromTagsConfig
    owner_mcps: List[MetadataChangeProposalWrapper]

    def __init__(self, config: ExtractOwnersFromTagsConfig, ctx: PipelineContext):
        super().__init__()
        self.ctx = ctx
        self.config = config
        self.owner_mcps = []

    @classmethod
    def create(
        cls, config_dict: dict, ctx: PipelineContext
    ) -> "ExtractOwnersFromTagsTransformer":
        config = ExtractOwnersFromTagsConfig.parse_obj(config_dict)
        return cls(config, ctx)

    def get_owner_urn(self, owner_str: str) -> str:
        if self.config.email_domain is not None:
            return owner_str + "@" + self.config.email_domain
        return owner_str

    def convert_owner_as_per_mapping(self, owner: str) -> str:
        if self.config.owner_character_mapping:
            for key in sorted(
                self.config.owner_character_mapping.keys(),
                key=len,
                reverse=True,
            ):
                owner = owner.replace(key, self.config.owner_character_mapping[key])
        return owner

    def handle_end_of_stream(
        self,
    ) -> Sequence[Union[MetadataChangeProposalWrapper, MetadataChangeProposalClass]]:

        return self.owner_mcps

    def transform_aspect(
        self, entity_urn: str, aspect_name: str, aspect: Optional[Aspect]
    ) -> Optional[Aspect]:
        in_tags_aspect: Optional[GlobalTagsClass] = cast(GlobalTagsClass, aspect)
        if in_tags_aspect is None:
            return None
        tags = in_tags_aspect.tags
        owners: List[OwnerClass] = []

        for tag_class in tags:
            tag_str = TagUrn.from_string(tag_class.tag).name
            re_match = re.search(cast(str, self.config.tag_pattern), tag_str)
            if re_match:
                owner_str = tag_str[re_match.end() :].strip()
                owner_str = self.convert_owner_as_per_mapping(owner_str)
                owner_urn_str = self.get_owner_urn(owner_str)
                owner_urn = (
                    str(CorpuserUrn(owner_urn_str))
                    if self.config.is_user
                    else str(CorpGroupUrn(owner_urn_str))
                )

                if self.config.extract_owner_type_from_tag_pattern:
                    if re_match.groups():
                        owners.append(
                            OwnerClass(
                                owner=owner_urn,
                                type=OwnershipTypeClass.CUSTOM,
                                typeUrn=make_ownership_type_urn(re_match.group(1)),
                            )
                        )
                else:
                    owner_type = get_owner_type(self.config.owner_type)
                    if owner_type == OwnershipTypeClass.CUSTOM:
                        assert (
                            self.config.owner_type_urn is not None
                        ), "owner_type_urn must be set if owner_type is CUSTOM"

                    owners.append(
                        OwnerClass(
                            owner=owner_urn,
                            type=owner_type,
                            typeUrn=self.config.owner_type_urn,
                        )
                    )

        self.owner_mcps.append(
            MetadataChangeProposalWrapper(
                entityUrn=entity_urn,
                aspect=OwnershipClass(
                    owners=owners,
                ),
            )
        )
        if not self.config.replace_existing:
            return aspect
        else:
            return None
