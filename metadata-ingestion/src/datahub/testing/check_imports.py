import pathlib
from typing import List


def ensure_no_indirect_model_imports(dirs: List[pathlib.Path]) -> None:
    # This is a poor-man's implementation of a import-checking linter.
    # e.g. https://pypi.org/project/flake8-custom-import-rules/
    # If our needs become more complex, we should move to a proper linter.
    denied_imports = {"datahub.metadata._schema_classes", "datahub.metadata._urns"}
    ignored_files = {
        "datahub/metadata/schema_classes.py",
        "datahub/metadata/urns.py",
        "datahub/testing/check_imports.py",
    }

    for dir in dirs:
        for file in dir.rglob("*.py"):
            if any(str(file).endswith(ignored_file) for ignored_file in ignored_files):
                continue

            with file.open() as f:
                for line in f:
                    if any(denied_import in line for denied_import in denied_imports):
                        raise ValueError(
                            f"Indirect import found in {file}: {line}. To resolve this, import the module without the _ prefix."
                        )
