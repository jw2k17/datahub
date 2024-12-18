from datahub.emitter.mce_builder import make_dataset_urn
from datahub.emitter.rest_emitter import DataHubRestEmitter
from datahub.metadata.schema_classes import GlossaryTermAssociationClass
from datahub.specific.dataset import DatasetPatchBuilder

# Create DataHub Client
rest_emitter = DataHubRestEmitter(gms_server="http://localhost:8080")

# Create Dataset URN
dataset_urn = make_dataset_urn(
    platform="snowflake", name="fct_users_created", env="PROD"
)

# Create Dataset Patch to Add + Remove Term for 'profile_id' column
patch_builder = DatasetPatchBuilder(dataset_urn)
patch_builder.add_term(
    GlossaryTermAssociationClass("urn:li:glossaryTerm:term-to-add-id")
)
patch_builder.remove_term("urn:li:glossaryTerm:term-to-remove-id")
patch_mcps = patch_builder.build()

# Emit Dataset Patch
for patch_mcp in patch_mcps:
    rest_emitter.emit(patch_mcp)
