"""This is the Object-Spatial Implementation of the RPG Game"""
from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _
import sys
import pygame
import random
import time
from sprites import *
from game_obj import *
from settings.config import *
from settings.map import *
from utils.level_manager import *

class game(_.Walker):
    """The walker that initiates the game and runs an instance of the game"""
    g: Game = None
    last_level_id: str = '1_1000'
    current_level: int = 1
    fwd_dir: bool = True
    manager: LevelManager = _.field(factory=lambda: LevelManager())

    @_.entry
    @_.impl_patch_filename('main.impl\\game_walker.impl.jac')
    def start_game(self, here: _.Root) -> None:
        self.g = Game()
        _.connect(left=here, right=start_screen())
        _.visit(self, _.refs(_.Path(here)._out().visit()))

class play(_.Edge):
    level_id: str = '1_1000'

class start_screen(_.Node):
    """Start screen node which operate as the virtual root node"""
    game_started: bool = False

    @_.entry
    @_.impl_patch_filename('main.impl\\start_screen.impl.jac')
    def intro_screen(self, visitor: game) -> None:
        if self.game_started == False:
            self.game_started = True
            visitor.g.intro_screen()
            new_ID = str(1) + '_' + str(random.randint(1000, 9000))
            _.connect(left=self, right=level(game_level=1, level_id=new_ID), edge=play, conn_assign=(('level_id',), (new_ID,)))
            visitor.fwd_dir = True
            _.visit(visitor, _.refs(_.Path(self)._out(edge=lambda i: isinstance(i, play) and i.level_id == new_ID).visit()))
        else:
            new_ID = str(1) + '_' + str(random.randint(1000, 9000))
            _.connect(left=self, right=level(game_level=1, level_id=new_ID), edge=play, conn_assign=(('level_id',), (new_ID,)))
            print(':-: Visiting Intro Screen | Created Level ID :', new_ID)
            visitor.fwd_dir = True
            _.visit(visitor, _.refs(_.Path(self)._out(edge=lambda i: isinstance(i, play) and i.level_id == new_ID).visit()))

    @_.exit
    @_.impl_patch_filename('main.impl\\start_screen.impl.jac')
    def exit_game(self, visitor: game) -> None:
        if visitor.g.running == False:
            pygame.quit()
            sys.exit()
            _.disengage(visitor)
            return

class level(_.Node):
    """Level node which (should) have unique (ai generated) attributes"""
    game_level: int = 1
    level_id: str = '1_1000'
    played: bool = False
    level_config: Map = _.field(factory=lambda: Map())
    level_time: float = 500000

    @_.entry
    @_.impl_patch_filename('main.impl\\level.impl.jac')
    def run_game(self, visitor: game) -> None:
        if self.played == False:
            if visitor.current_level != self.game_level:
                visitor.current_level = self.game_level
            if visitor.manager.current_level != self.game_level:
                if self.game_level != 1:
                    visitor.manager.current_level = self.game_level
                    next_level = visitor.manager.get_next_level(self.game_level)
                    self.level_config.map = next_level
            else:
                self.level_config.map = _.filter(items=_.filter(items=_.refs(_.Path(_.refs(_.Path(self)._in())[0])._out()), func=lambda i: isinstance(i, level)), func=lambda i: i.level_id == visitor.last_level_id)[0].level_config.map
            visitor.g.GameMap.map = self.level_config.map
            visitor.g.new()
            print(':-: Playing Level :', self.game_level, '| Level ID :', self.level_id, '| Played :', str(self.played))
            start_time = time.time()
            visitor.g.main()
            end_time = time.time()
            visitor.last_level_id = self.level_id
            if visitor.g.won == True:
                self.level_time = end_time - start_time
                if visitor.manager.prev_levels:
                    visitor.manager.prev_levels[-1].time = self.level_time
                visitor.g.game_won()
                self.played = True
                visitor.g.won = False
                visitor.fwd_dir = True
                new_ID = str(self.game_level + 1) + '_' + str(random.randint(1000, 9000))
                _.connect(left=self, right=level(game_level=self.game_level + 1, level_id=new_ID), edge=play, conn_assign=(('level_id',), (new_ID,)))
                _.visit(visitor, _.refs(_.Path(self)._out(edge=lambda i: isinstance(i, play) and i.level_id == new_ID).visit()))
            else:
                visitor.g.game_over()
                self.played = True
                visitor.g.won = False
                visitor.fwd_dir = False
                _.visit(visitor, _.refs(_.Path(self)._in(edge=lambda i: isinstance(i, play)).visit()))
        elif visitor.fwd_dir == False:
            new_ID = str(self.game_level + 1) + '_' + str(random.randint(1000, 9000))
            print(':-: Visiting Level :', self.game_level, '| Level ID :', self.level_id, '| Played :', str(self.played), '| Created Level ID :', new_ID)
            visitor.fwd_dir = True
            _.connect(left=self, right=level(game_level=self.game_level + 1, level_id=new_ID), edge=play, conn_assign=(('level_id',), (new_ID,)))
            _.visit(visitor, _.refs(_.Path(self)._out(edge=lambda i: isinstance(i, play) and i.level_id == new_ID).visit()))
        else:
            print(':-: Visiting Level :', self.game_level, '| Level ID :', self.level_id, '| Played :', str(self.played))
            _.visit(visitor, _.refs(_.Path(self)._in().visit()))

    @_.exit
    @_.impl_patch_filename('main.impl\\level.impl.jac')
    def exit_game(self, visitor: game) -> None:
        if visitor.g.running == False:
            pygame.quit()
            sys.exit()
            _.disengage(visitor)
            return
'Run the game'
_.spawn(_.root(), game())
