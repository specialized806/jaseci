"""Collection of passes for Jac IR."""

from enum import Enum

from .annex_pass import JacAnnexPass  # noqa: I100
from .sym_tab_build_pass import SymTabBuildPass, UniPass  # noqa: I100
from .def_use_pass import DefUsePass  # noqa: I100
from .import_pass import JacImportPass, PyImportPass  # noqa: I100
from .def_impl_match_pass import DeclImplMatchPass  # noqa: I100
from .pyast_load_pass import PyastBuildPass  # type: ignore # noqa: I100
from .pyast_gen_pass import PyastGenPass  # noqa: I100
from .type_check_pass import JacTypeCheckPass  # noqa: I100
from .pybc_gen_pass import PyBytecodeGenPass  # noqa: I100
from .py_collect_dep_pass import PyCollectDepsPass  # noqa: I100
from .cfg_build_pass import CFGBuildPass  # noqa: I100
from .pyjac_ast_link_pass import PyJacAstLinkPass  # noqa: I100
from .fuse_typeinfo_pass import FuseTypeInfoPass  # noqa: I100
from .access_modifier_pass import AccessCheckPass  # noqa: I100
from .inheritance_pass import InheritancePass  # noqa: I100


class CompilerMode(Enum):
    """Compiler modes."""

    PARSE = "PARSE"
    COMPILE = "COMPILE"
    NO_CGEN = "NO_CGEN"
    TYPECHECK = "TYPECHECK"


__all__ = [
    "UniPass",
    "JacAnnexPass",
    "JacImportPass",
    "PyImportPass",
    "SymTabBuildPass",
    "DeclImplMatchPass",
    "DefUsePass",
    "PyastBuildPass",
    "PyastGenPass",
    "JacTypeCheckPass",
    "PyBytecodeGenPass",
    "CompilerMode",
    "PyCollectDepsPass",
    "CFGBuildPass",
    "PyJacAstLinkPass",
    "FuseTypeInfoPass",
    "AccessCheckPass",
    "InheritancePass",
]
