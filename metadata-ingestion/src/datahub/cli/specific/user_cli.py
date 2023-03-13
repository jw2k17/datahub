import logging
import pathlib
from pathlib import Path

import click
from click_default_group import DefaultGroup

from datahub.api.entities.corpuser.corpuser import CorpUser
from datahub.cli.specific.file_loader import load_file
from datahub.ingestion.graph.client import DataHubGraph, get_default_graph
from datahub.telemetry import telemetry
from datahub.upgrade import upgrade

logger = logging.getLogger(__name__)


@click.group(cls=DefaultGroup, default="upsert")
def user() -> None:
    """A group of commands to interact with the User entity in DataHub."""
    pass


@user.command(
    name="upsert",
    context_settings=dict(
        ignore_unknown_options=True,
        allow_extra_args=True,
    ),
)
@click.option("-f", "--file", required=True, type=click.Path(exists=True))
@click.option(
    "--override-editable",
    required=False,
    default=False,
    is_flag=True,
    help="Use this flag to overwrite the information that is set via the UI",
)
@upgrade.check_upgrade
@telemetry.with_telemetry()
def upsert(file: Path, override_editable: bool) -> None:
    """Create or Update a User in DataHub"""

    emitter: DataHubGraph = get_default_graph()
    config_dict = load_file(pathlib.Path(file))
    user_configs = config_dict if isinstance(config_dict, list) else [config_dict]
    try:
        for user_config in user_configs:
            try:
                datahub_user: CorpUser = CorpUser.parse_obj(user_config)
                for mcp in datahub_user.generate_mcp(
                    generation_config=CorpUser.GenerationConfig(
                        override_editable=override_editable
                    )
                ):
                    emitter.emit(mcp)
                click.secho(f"Update succeeded for urn {datahub_user.urn}.", fg="green")
            except Exception as e:
                click.secho(
                    f"Update failed for id {user_config.get('id')}. due to {e}",
                    fg="red",
                )
    finally:
        emitter.close()
