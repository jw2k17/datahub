import pathlib
import logging

import click

from gometa.configuration.common import ConfigurationMechanism, ConfigurationError, nicely_formatted_validation_errors
from gometa.configuration.yaml import YamlConfigurationMechanism
from gometa.configuration.toml import TomlConfigurationMechanism
from gometa.ingestion.run.pipeline import Pipeline, PipelineConfig

logger = logging.getLogger(__name__)

# Set to debug on the root logger.
logging.getLogger(None).setLevel(logging.DEBUG)
logging.getLogger('urllib3').setLevel(logging.WARN)

# Configure logger.
BASE_LOGGING_FORMAT = "[%(asctime)s] %(levelname)-8s {%(name)s:%(lineno)d} - %(message)s"
logging.basicConfig(level=logging.DEBUG, format=BASE_LOGGING_FORMAT)

# CONNECTION_STRING_FORMAT_REGEX = re.compile(f"^{HOST_REGEX}(:{PATH_REGEX})?$")
DEFAULT_CONTEXT_SETTINGS = dict(help_option_names=["-h", "--help"])
# EXECUTION_CONTEXT_SETTINGS = dict(
#     help_option_names=["-h", "--help"], ignore_unknown_options=True, allow_interspersed_args=False
# )


@click.command(context_settings=DEFAULT_CONTEXT_SETTINGS)
@click.option("-c", "--config", help="Config file in .toml or .yaml format", required=True)
def gometa_ingest(config: str):
    """Main command for ingesting metadata into DataHub"""

    config_file = pathlib.Path(config)
    if not config_file.is_file():
        raise ConfigurationError(f"Cannot open config file {config}")

    config_mech: ConfigurationMechanism
    if config_file.suffix in [".yaml", ".yml"]:
        config_mech = YamlConfigurationMechanism()
    elif config_file.suffix == ".toml":
        config_mech = TomlConfigurationMechanism()
    else:
        raise ConfigurationError(
            "Only .toml and .yml are supported. Cannot process file type {}".format(config_file.suffix)
        )

    with config_file.open() as fp:
        pipeline_config = config_mech.load_config(fp)

    with nicely_formatted_validation_errors():
        logger.debug(f'Using config: {pipeline_config}')
        pipeline = Pipeline.create(pipeline_config)
    pipeline.run()
