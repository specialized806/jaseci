"""Collection of passes for Jac IR."""

from ..transform import Alert, Transform  # noqa: I100
from .annex_pass import JacAnnexPass  # noqa: I100
from .binder_pass import BinderPass  # noqa: I100
from .sym_tab_build_pass import SymTabBuildPass, UniPass  # noqa: I100
from .direct_import_pass import DirectImportPass  # noqa: I100
from .sym_tab_link_pass import SymTabLinkPass  # noqa: I100
from .def_use_pass import DefUsePass  # noqa: I100
from .sem_def_match_pass import SemDefMatchPass  # noqa: I100
from .import_pass import JacPyImportDepsPass  # noqa: I100
from .def_impl_match_pass import DeclImplMatchPass  # noqa: I100
from .pyast_load_pass import PyastBuildPass  # type: ignore # noqa: I100
from .pyast_gen_pass import PyastGenPass  # noqa: I100
from .pybc_gen_pass import PyBytecodeGenPass  # noqa: I100
from .cfg_build_pass import CFGBuildPass  # noqa: I100
from .pyjac_ast_link_pass import PyJacAstLinkPass  # noqa: I100
from .inheritance_pass import InheritancePass  # noqa: I100


__all__ = [
    "Alert",
    "Transform",
    "UniPass",
    "JacAnnexPass",
    "BinderPass",
    "JacPyImportDepsPass",
    "DirectImportPass",
    "SymTabBuildPass",
    "SymTabLinkPass",
    "DeclImplMatchPass",
    "DefUsePass",
    "SemDefMatchPass",
    "PyastBuildPass",
    "PyastGenPass",
    "PyBytecodeGenPass",
    "CFGBuildPass",
    "PyJacAstLinkPass",
    "InheritancePass",
]
