from __future__ import annotations
from typing import cast
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _
from mtllm import Model
llm = Model(model_name='gpt-4o', verbose=True)

class Position(_.Obj):
    x: int
    y: int

class Wall(_.Obj):
    start_pos: Position
    end_pos: Position

class Map_tiles(_.Obj):
    level: Level
    walls: list[Wall]
    small_obstacles: list[Position]
    enemies: list[Position]
    player_pos: Position

class Level(_.Obj):
    name: int
    difficulty: int
    time: int
    width: int
    height: int
    num_wall: int
    num_enemies: int

class LevelManager(_.Obj):
    current_level: int = 0
    current_difficulty: int = 1
    prev_levels: list[Level] = _.field(factory=lambda: [])
    prev_level_maps: list[Map_tiles] = _.field(factory=lambda: [])

    def create_next_level(self, last_levels: list[Level], difficulty: int) -> Level:
        return cast(Level, llm(temperature=0.8).invoke(
            caller=self.create_next_level,
            args={'last_levels': last_levels, 'difficulty': difficulty},
        ))

    def create_next_map(self, level: Level) -> Map_tiles:
        return cast(Map_tiles, llm(temperature=0.8).invoke(
            caller=self.create_next_map,
            args={'level': level},
        ))

    def get_next_level(self, current_level: int) -> tuple(Level, Map_tiles):
        """Get the Next Level"""

    def get_map(self, map: Map_tiles) -> str:
        """Get the map of the level"""
