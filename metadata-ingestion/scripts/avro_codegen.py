import json
import types
import unittest.mock
from pathlib import Path
from typing import Any, Dict, Iterable, List, Union

import avro.schema
import click
from avrogen import write_schema_files


def load_schema_file(schema_file: Union[str, Path]) -> dict:
    raw_schema_text = Path(schema_file).read_text()
    return json.loads(raw_schema_text)


def merge_schemas(schemas_obj: List[Any]) -> str:
    # Combine schemas.
    merged = ["null"] + schemas_obj

    # Patch add_name method to NOT complain about duplicate names
    def add_name(self, name_attr, space_attr, new_schema):
        to_add = avro.schema.Name(name_attr, space_attr, self.default_namespace)

        self.names[to_add.fullname] = new_schema
        return to_add

    with unittest.mock.patch("avro.schema.Names.add_name", add_name):
        cleaned_schema = avro.schema.make_avsc_object(merged)

    # Convert back to an Avro schema JSON representation.
    class MappingProxyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, types.MappingProxyType):
                return dict(obj)
            return json.JSONEncoder.default(self, obj)

    out_schema = cleaned_schema.to_json()
    encoded = json.dumps(out_schema, cls=MappingProxyEncoder, indent=2)
    return encoded


autogen_header = """# flake8: noqa

# This file is autogenerated by /metadata-ingestion/scripts/avro_codegen.py
# Do not modify manually!

# fmt: off
"""
autogen_footer = """
# fmt: on
"""


def suppress_checks_in_file(filepath: Union[str, Path]) -> None:
    """
    Adds a couple lines to the top of an autogenerated file:
        - Comments to suppress flake8 and black.
        - A note stating that the file was autogenerated.
    """

    with open(filepath, "r+") as f:
        contents = f.read()

        f.seek(0, 0)
        f.write(autogen_header)
        f.write(contents)
        f.write(autogen_footer)


def add_avro_python3_warning(filepath: Path) -> None:
    contents = filepath.read_text()

    contents = f"""
# The SchemaFromJSONData method only exists in avro-python3, but is called make_avsc_object in avro.
# We can use this fact to detect conflicts between the two packages. Pip won't detect those conflicts
# because both are namespace packages, and hence are allowed to overwrite files from each other.
# This means that installation order matters, which is a pretty unintuitive outcome.
# See https://github.com/pypa/pip/issues/4625 for details.
try:
    from avro.schema import SchemaFromJSONData
    import warnings

    warnings.warn("It seems like 'avro-python3' is installed, which conflicts with the 'avro' package used by datahub. "
                + "Try running `pip uninstall avro-python3 && pip install --upgrade --force-reinstall avro` to fix this issue.")
except ImportError:
    pass

{contents}
    """

    filepath.write_text(contents)


load_schema_method = """
import functools
import pathlib

def _load_schema(schema_name: str) -> str:
    return (pathlib.Path(__file__).parent / f"{schema_name}.avsc").read_text()
"""
individual_schema_method = """
@functools.lru_cache(maxsize=None)
def get{schema_name}Schema() -> str:
    return _load_schema("{schema_name}")
"""


def make_load_schema_methods(schemas: Iterable[str]) -> str:
    return load_schema_method + "".join(
        individual_schema_method.format(schema_name=schema) for schema in schemas
    )


def annotate_aspects(aspects: List[dict], schema_class_file: Path) -> None:
    schema_classes_lines = schema_class_file.read_text().splitlines()
    line_lookup_table = {line: i for i, line in enumerate(schema_classes_lines)}

    # Create the Aspect class.
    # We ensure that it cannot be instantiated directly, as
    # per https://stackoverflow.com/a/7989101/5004662.
    schema_classes_lines[
        # This is a no-op line, so it's safe to overwrite.
        line_lookup_table["__SCHEMAS: Dict[str, RecordSchema] = {}"]
    ] = """
class _Aspect(DictWrapper):
    ASPECT_NAME: str = None  # type: ignore

    def __init__(self):
        if type(self) is _Aspect:
            raise TypeError("_Aspect is an abstract class, and cannot be instantiated directly.")
        super().__init__()

    @classmethod
    def get_aspect_name(cls) -> str:
        return cls.ASPECT_NAME  # type: ignore
"""

    for aspect in aspects:
        className = f'{aspect["name"]}Class'
        aspectName = aspect["Aspect"]["name"]
        class_def_original = f"class {className}(DictWrapper):"

        # Make the aspects inherit from the Aspect class.
        class_def_line = line_lookup_table[class_def_original]
        schema_classes_lines[class_def_line] = f"class {className}(_Aspect):"

        # Define the ASPECT_NAME class attribute.
        # There's always an empty line between the docstring and the RECORD_SCHEMA class attribute.
        # We need to find it and insert our line of code there.
        empty_line = class_def_line + 1
        while not (
            schema_classes_lines[empty_line].strip() == ""
            and schema_classes_lines[empty_line + 1]
            .strip()
            .startswith("RECORD_SCHEMA = ")
        ):
            empty_line += 1
        schema_classes_lines[empty_line] = f"    ASPECT_NAME = '{aspectName}'"

    schema_class_file.write_text("\n".join(schema_classes_lines))


@click.command()
@click.argument(
    "schemas_path", type=click.Path(exists=True, file_okay=False), required=True
)
@click.argument("outdir", type=click.Path(), required=True)
def generate(schemas_path: str, outdir: str) -> None:
    required_schema_files = {
        "mxe/MetadataChangeEvent.avsc",
        "mxe/MetadataChangeProposal.avsc",
        "usage/UsageAggregation.avsc",
        "mxe/MetadataChangeLog.avsc",
        "mxe/PlatformEvent.avsc",
        "platform/event/v1/EntityChangeEvent.avsc",
    }

    # Find all the aspect schemas / other important schemas.
    aspect_file_stems: List[str] = []
    schema_files: List[Path] = []
    for schema_file in Path(schemas_path).glob("**/*.avsc"):
        relative_path = schema_file.relative_to(schemas_path).as_posix()
        if relative_path in required_schema_files:
            schema_files.append(schema_file)
            required_schema_files.remove(relative_path)
        elif load_schema_file(schema_file).get("Aspect"):
            aspect_file_stems.append(schema_file.stem)
            schema_files.append(schema_file)

    assert not required_schema_files, f"Schema files not found: {required_schema_files}"

    schemas: Dict[str, dict] = {}
    for schema_file in schema_files:
        schema = load_schema_file(schema_file)
        schemas[Path(schema_file).stem] = schema

    merged_schema = merge_schemas(list(schemas.values()))

    write_schema_files(merged_schema, outdir)

    # Schema files post-processing.
    (Path(outdir) / "__init__.py").write_text("# This file is intentionally empty.\n")
    add_avro_python3_warning(Path(outdir) / "schema_classes.py")
    annotate_aspects(
        [schemas[aspect_file_stem] for aspect_file_stem in aspect_file_stems],
        Path(outdir) / "schema_classes.py",
    )

    # Save raw schema files in codegen as well.
    schema_save_dir = Path(outdir) / "schemas"
    schema_save_dir.mkdir()
    for schema_out_file, schema in schemas.items():
        (schema_save_dir / f"{schema_out_file}.avsc").write_text(
            json.dumps(schema, indent=2)
        )

    # Add load_schema method.
    with open(schema_save_dir / "__init__.py", "a") as schema_dir_init:
        schema_dir_init.write(make_load_schema_methods(schemas.keys()))

    # Add headers for all generated files
    generated_files = Path(outdir).glob("**/*.py")
    for file in generated_files:
        suppress_checks_in_file(file)


if __name__ == "__main__":
    generate()
