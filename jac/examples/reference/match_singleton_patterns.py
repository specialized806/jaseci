from __future__ import annotations
from jaclang.runtimelib.builtin import *
data = True
match True:
    case True:
        print('Matched the singleton True.')
    case None:
        print('Matched the singleton None.')
