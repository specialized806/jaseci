from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _

class Map(_.Obj):
    Level_no: int = 1
    time_to_win_level: float = 60.0
    nos_retry: int = 0
    map: list[str] = _.field(factory=lambda: ['BBBBBBBBBBBBBBBBBBBB', 'B...E..............B', 'B.......B..........B', 'B....BBBB..........B', 'B..................B', 'B..................B', 'B.........P........B', 'B..................B', 'B.............E....B', 'B..................B', 'B..................B', 'B.........B........B', 'B.........B........B', 'B.........B........B', 'BBBBBBBBBBBBBBBBBBBB'])
