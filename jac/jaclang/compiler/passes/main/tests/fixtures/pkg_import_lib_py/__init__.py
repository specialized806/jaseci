

from jaclang import JacMachineInterface as _

(tool_func) = _.py_jac_import(
    target="tools",
    base_path=__file__,
    items={"tool_func": None},
)
(help_func) = _.py_jac_import(
    target="sub.helper",
    base_path=__file__,
    items={"help_func": None},
)





# TODO: need to support this one also 

# from pkg_import_lib.tools  import  tool_func 
# from pkg_import_lib.sub.helper import help_func

# (tool_func) = _.py_jac_import(
#     target="pkg_import_lib_py.tools",
#     base_path=__file__,
#     items={"tool_func": None},
# )
# (help_func) = _.py_jac_import(
#     target="pkg_import_lib_py.sub.helper",
#     base_path=__file__,
#     items={"help_func": None},
# )