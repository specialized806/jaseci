from __future__ import annotations
from jaclang.runtimelib.builtin import *
day = ' sunday'
match day:
    case 'monday':
        print('confirmed')
    case _:
        print('other')
