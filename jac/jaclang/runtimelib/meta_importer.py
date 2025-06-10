import importlib.abc
import importlib.util
import os
import sys
from types import ModuleType

from jaclang.utils import resolve_module
from jaclang.runtimelib.machine import JacMachineInterface


class JacMetaImporter(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    """Meta path importer to load .jac modules via Python's import system."""

    def find_spec(self, fullname: str, path=None, target=None):
        search_path = path[0] if path else os.getcwd()
        try:
            file_path, lang = resolve_module(fullname, search_path)
        except Exception:
            return None
        if lang != "jac":
            return None
        is_package = os.path.basename(file_path) == "__init__.jac"
        loader = self
        spec = importlib.util.spec_from_file_location(
            fullname,
            file_path,
            loader=loader,
            submodule_search_locations=[os.path.dirname(file_path)] if is_package else None,
        )
        return spec

    def create_module(self, spec):
        return None  # use default machinery

    def exec_module(self, module: ModuleType) -> None:
        file_path = module.__spec__.origin  # type: ignore
        base_path = os.path.dirname(file_path)
        target = os.path.splitext(os.path.basename(file_path))[0]
        ret = JacMachineInterface.jac_import(
            target=target,
            base_path=base_path,
            override_name=module.__name__,
        )
        if ret:
            loaded_module = ret[0]
            module.__dict__.update(loaded_module.__dict__)
        else:
            raise ImportError(f"Unable to import {module.__name__}")

