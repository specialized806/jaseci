"""This file containes all definitions of sprites that apear in the game"""
from __future__ import annotations
from jaclang.runtimelib.builtin import *
from jaclang import JacMachineInterface as _
import pygame, random, math
from pygame.sprite import AbstractGroup
from settings.config import *
from settings.map import *

class Spritesheet(_.Obj):
    """Object for impoting sprite character images."""
    file: str

    @_.impl_patch_filename('sprites.impl\\spritesheet.impl.jac')
    def __post_init__(self) -> None:
        self.sheet = pygame.image.load(self.file).convert()

    @_.impl_patch_filename('sprites.impl\\spritesheet.impl.jac')
    def get_sprite(self, x: int, y: int, width: int, height: int) -> pygame.Surface:
        sprite = pygame.Surface([width, height])
        sprite.blit(self.sheet, (0, 0), (x, y, width, height))
        sprite.set_colorkey(BLACK)
        return sprite

class Player(pygame.sprite.Sprite, _.Obj):
    """Object for the player with type pygame.sprite.Sprite"""
    game: Game
    x: int
    y: int
    _layer: int = _.field(factory=lambda: PLAYER_LAYER)
    width: int = _.field(factory=lambda: TILESIZE)
    height: int = _.field(factory=lambda: TILESIZE)
    x_change: int = 0
    y_change: int = 0
    facing: str = 'down'
    animation_loop: float = 1

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def __post_init__(self) -> None:
        self._layer = PLAYER_LAYER
        self._groups = self.game.all_sprites
        pygame.sprite.Sprite.__init__(self, self._groups)
        self.x *= TILESIZE
        self.y *= TILESIZE
        self.image = self.game.character_spritesheet.get_sprite(3, 2, self.width - 5, self.height - 5)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def update(self) -> None:
        self.movement()
        self.animate()
        self.collide_enemy()
        self.rect.x += self.x_change
        self.collide_blocks('x')
        self.rect.y += self.y_change
        self.collide_blocks('y')
        self.x_change = 0
        self.y_change = 0

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def movement(self) -> None:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            for sprite in self.game.all_sprites:
                sprite.rect.x += PLAYER_SPEED
            self.x_change -= PLAYER_SPEED
            self.facing = 'left'
        if keys[pygame.K_RIGHT]:
            for sprite in self.game.all_sprites:
                sprite.rect.x -= PLAYER_SPEED
            self.x_change += PLAYER_SPEED
            self.facing = 'right'
        if keys[pygame.K_UP]:
            for sprite in self.game.all_sprites:
                sprite.rect.y += PLAYER_SPEED
            self.y_change -= PLAYER_SPEED
            self.facing = 'up'
        if keys[pygame.K_DOWN]:
            for sprite in self.game.all_sprites:
                sprite.rect.y -= PLAYER_SPEED
            self.y_change += PLAYER_SPEED
            self.facing = 'down'

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def collide_enemy(self) -> None:
        hits = pygame.sprite.spritecollide(self, self.game.enemies, False)
        if hits:
            self.kill()
            self.game.playing = False

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def animate(self) -> None:
        down_animations = [self.game.character_spritesheet.get_sprite(3, 2, self.width, self.height), self.game.character_spritesheet.get_sprite(35, 2, self.width, self.height), self.game.character_spritesheet.get_sprite(68, 2, self.width, self.height)]
        up_animations = [self.game.character_spritesheet.get_sprite(3, 34, self.width, self.height), self.game.character_spritesheet.get_sprite(35, 34, self.width, self.height), self.game.character_spritesheet.get_sprite(68, 34, self.width, self.height)]
        left_animations = [self.game.character_spritesheet.get_sprite(3, 98, self.width, self.height), self.game.character_spritesheet.get_sprite(35, 98, self.width, self.height), self.game.character_spritesheet.get_sprite(68, 98, self.width, self.height)]
        right_animations = [self.game.character_spritesheet.get_sprite(3, 66, self.width, self.height), self.game.character_spritesheet.get_sprite(35, 66, self.width, self.height), self.game.character_spritesheet.get_sprite(68, 66, self.width, self.height)]
        if self.facing == 'down':
            if self.y_change == 0:
                self.image = self.game.character_spritesheet.get_sprite(3, 2, self.width, self.height)
            else:
                self.image = down_animations[math.floor(self.animation_loop)]
                self.animation_loop += 0.1
                if self.animation_loop >= 3:
                    self.animation_loop = 1
        if self.facing == 'up':
            if self.y_change == 0:
                self.image = self.game.character_spritesheet.get_sprite(3, 34, self.width, self.height)
            else:
                self.image = up_animations[math.floor(self.animation_loop)]
                self.animation_loop += 0.1
                if self.animation_loop >= 3:
                    self.animation_loop = 1
        if self.facing == 'right':
            if self.x_change == 0:
                self.image = self.game.character_spritesheet.get_sprite(3, 66, self.width, self.height)
            else:
                self.image = right_animations[math.floor(self.animation_loop)]
                self.animation_loop += 0.1
                if self.animation_loop >= 3:
                    self.animation_loop = 1
        if self.facing == 'left':
            if self.x_change == 0:
                self.image = self.game.character_spritesheet.get_sprite(3, 98, self.width, self.height)
            else:
                self.image = left_animations[math.floor(self.animation_loop)]
                self.animation_loop += 0.1
                if self.animation_loop >= 3:
                    self.animation_loop = 1

    @_.impl_patch_filename('sprites.impl\\player.impl.jac')
    def collide_blocks(self, direction: str) -> None:
        if direction == 'x':
            hits = pygame.sprite.spritecollide(self, self.game.blocks, False)
            if hits:
                if self.x_change > 0:
                    self.rect.x = hits[0].rect.left - self.rect.width
                    for sprite in self.game.all_sprites:
                        sprite.rect.x += PLAYER_SPEED
                if self.x_change < 0:
                    self.rect.x = hits[0].rect.right
                    for sprite in self.game.all_sprites:
                        sprite.rect.x -= PLAYER_SPEED
        if direction == 'y':
            hits = pygame.sprite.spritecollide(self, self.game.blocks, False)
            if hits:
                if self.y_change > 0:
                    self.rect.y = hits[0].rect.top - self.rect.height
                    for sprite in self.game.all_sprites:
                        sprite.rect.y += PLAYER_SPEED
                if self.y_change < 0:
                    self.rect.y = hits[0].rect.bottom
                    for sprite in self.game.all_sprites:
                        sprite.rect.y -= PLAYER_SPEED

class Enemy(pygame.sprite.Sprite, _.Obj):
    """Object for enemies with type pygame.sprite.Sprite"""
    game: Game
    x: int
    y: int
    _layer: int = _.field(factory=lambda: ENEMY_LAYER)
    width: inr = _.field(factory=lambda: TILESIZE)
    height: int = _.field(factory=lambda: TILESIZE)
    x_change: int = 0
    y_change: int = 0
    animation_loop: float = 0
    movement_loop: int = 0

    @_.impl_patch_filename('sprites.impl\\enemy.impl.jac')
    def __post_init__(self) -> None:
        self._groups = (self.game.all_sprites, self.game.enemies)
        pygame.sprite.Sprite.__init__(self, self._groups)
        self.x *= TILESIZE
        self.y *= TILESIZE
        self.image = self.game.enemy_spritesheet.get_sprite(3, 2, self.width, self.height)
        self.facing = random.choice(['up', 'down', 'left', 'right'])
        self.max_travel = random.randint(7, 30)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y

    @_.impl_patch_filename('sprites.impl\\enemy.impl.jac')
    def update(self) -> None:
        self.movement()
        self.animate()
        self.rect.x += self.x_change
        self.collide_blocks('x')
        self.rect.y += self.y_change
        self.collide_blocks('y')
        self.x_change = 0
        self.y_change = 0

    @_.impl_patch_filename('sprites.impl\\enemy.impl.jac')
    def movement(self) -> None:
        if self.facing == 'left':
            self.x_change -= ENEMY_SPEED
            self.movement_loop -= 1
            if self.movement_loop <= -self.max_travel:
                self.facing = 'right'
        if self.facing == 'right':
            self.x_change += ENEMY_SPEED
            self.movement_loop += 1
            if self.movement_loop >= self.max_travel:
                self.facing = 'left'
        if self.facing == 'up':
            self.y_change += ENEMY_SPEED
            self.movement_loop += 1
            if self.movement_loop >= self.max_travel:
                self.facing = 'down'
        if self.facing == 'down':
            self.y_change -= ENEMY_SPEED
            self.movement_loop -= 1
            if self.movement_loop <= -self.max_travel:
                self.facing = 'up'

    @_.impl_patch_filename('sprites.impl\\enemy.impl.jac')
    def animate(self) -> None:
        down_animations = [self.game.enemy_spritesheet.get_sprite(3, 2, self.width, self.height), self.game.enemy_spritesheet.get_sprite(35, 2, self.width, self.height), self.game.enemy_spritesheet.get_sprite(68, 2, self.width, self.height)]
        up_animations = [self.game.enemy_spritesheet.get_sprite(3, 34, self.width, self.height), self.game.enemy_spritesheet.get_sprite(35, 34, self.width, self.height), self.game.enemy_spritesheet.get_sprite(68, 34, self.width, self.height)]
        left_animations = [self.game.enemy_spritesheet.get_sprite(3, 98, self.width, self.height), self.game.enemy_spritesheet.get_sprite(35, 98, self.width, self.height), self.game.enemy_spritesheet.get_sprite(68, 98, self.width, self.height)]
        right_animations = [self.game.enemy_spritesheet.get_sprite(3, 66, self.width, self.height), self.game.enemy_spritesheet.get_sprite(35, 66, self.width, self.height), self.game.enemy_spritesheet.get_sprite(68, 66, self.width, self.height)]
        if self.facing == 'down':
            self.image = down_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.1
            if self.animation_loop >= 3:
                self.animation_loop = 1
        if self.facing == 'up':
            self.image = up_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.1
            if self.animation_loop >= 3:
                self.animation_loop = 1
        if self.facing == 'right':
            self.image = right_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.1
            if self.animation_loop >= 3:
                self.animation_loop = 1
        if self.facing == 'left':
            self.image = left_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.1
            if self.animation_loop >= 3:
                self.animation_loop = 1

    @_.impl_patch_filename('sprites.impl\\enemy.impl.jac')
    def collide_blocks(self, direction: str) -> None:
        if direction == 'x':
            hits = pygame.sprite.spritecollide(self, self.game.blocks, False)
            if hits:
                if self.x_change > 0:
                    self.rect.x = hits[0].rect.left - self.rect.width
                if self.x_change < 0:
                    self.rect.x = hits[0].rect.right
        if direction == 'y':
            hits = pygame.sprite.spritecollide(self, self.game.blocks, False)
            if hits:
                if self.y_change > 0:
                    self.rect.y = hits[0].rect.top - self.rect.height
                if self.y_change < 0:
                    self.rect.y = hits[0].rect.bottom

class Block(pygame.sprite.Sprite, _.Obj):
    """Object for blocks (Walls) with type pygame.sprite.Sprite"""
    game: Game
    x: int
    y: int
    _layer: int = _.field(factory=lambda: BLOCK_LAYER)
    width: int = _.field(factory=lambda: TILESIZE)
    height: int = _.field(factory=lambda: TILESIZE)

    @_.impl_patch_filename('sprites.impl\\inanimates.impl.jac')
    def __post_init__(self) -> None:
        self._groups = (self.game.all_sprites, self.game.blocks)
        pygame.sprite.Sprite.__init__(self, self._groups)
        self.x *= TILESIZE
        self.y *= TILESIZE
        self.image = self.game.terrain_spritesheet.get_sprite(960, 448, self.width, self.height)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y

class Ground(pygame.sprite.Sprite, _.Obj):
    """Object for ground with type pygame.sprite.Sprite"""
    game: Game
    x: int
    y: int
    _layer: int = _.field(factory=lambda: GROUND_LAYER)
    width: int = _.field(factory=lambda: TILESIZE)
    height: int = _.field(factory=lambda: TILESIZE)

    @_.impl_patch_filename('sprites.impl\\inanimates.impl.jac')
    def __post_init__(self) -> None:
        self._groups = self.game.all_sprites
        pygame.sprite.Sprite.__init__(self, self._groups)
        self.x *= TILESIZE
        self.y *= TILESIZE
        self.image = self.game.terrain_spritesheet.get_sprite(64, 352, self.width, self.height)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y

class Attack(pygame.sprite.Sprite, _.Obj):
    """"Object class for attacks by the player"""
    game: Game
    x: int
    y: int
    _layer: int = _.field(factory=lambda: ATTACK_LAYER)
    width: int = _.field(factory=lambda: TILESIZE)
    height: int = _.field(factory=lambda: TILESIZE)
    animation_loop: float = 0

    @_.impl_patch_filename('sprites.impl\\attack.impl.jac')
    def __post_init__(self) -> None:
        self._groups = (self.game.all_sprites, self.game.attacks)
        pygame.sprite.Sprite.__init__(self, self._groups)
        self.image = self.game.attack_spritesheet.get_sprite(0, 0, self.width, self.height)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y

    @_.impl_patch_filename('sprites.impl\\attack.impl.jac')
    def update(self) -> None:
        self.animate()
        self.collide()

    @_.impl_patch_filename('sprites.impl\\attack.impl.jac')
    def collide(self) -> None:
        hits = pygame.sprite.spritecollide(self, self.game.enemies, True)

    @_.impl_patch_filename('sprites.impl\\attack.impl.jac')
    def animate(self) -> None:
        direction = self.game.player.facing
        right_animations = [self.game.attack_spritesheet.get_sprite(0, 64, self.width, self.height), self.game.attack_spritesheet.get_sprite(32, 64, self.width, self.height), self.game.attack_spritesheet.get_sprite(64, 64, self.width, self.height), self.game.attack_spritesheet.get_sprite(96, 64, self.width, self.height), self.game.attack_spritesheet.get_sprite(128, 64, self.width, self.height)]
        down_animations = [self.game.attack_spritesheet.get_sprite(0, 32, self.width, self.height), self.game.attack_spritesheet.get_sprite(32, 32, self.width, self.height), self.game.attack_spritesheet.get_sprite(64, 32, self.width, self.height), self.game.attack_spritesheet.get_sprite(96, 32, self.width, self.height), self.game.attack_spritesheet.get_sprite(128, 32, self.width, self.height)]
        left_animations = [self.game.attack_spritesheet.get_sprite(0, 96, self.width, self.height), self.game.attack_spritesheet.get_sprite(32, 96, self.width, self.height), self.game.attack_spritesheet.get_sprite(64, 96, self.width, self.height), self.game.attack_spritesheet.get_sprite(96, 96, self.width, self.height), self.game.attack_spritesheet.get_sprite(128, 96, self.width, self.height)]
        up_animations = [self.game.attack_spritesheet.get_sprite(0, 0, self.width, self.height), self.game.attack_spritesheet.get_sprite(32, 0, self.width, self.height), self.game.attack_spritesheet.get_sprite(64, 0, self.width, self.height), self.game.attack_spritesheet.get_sprite(96, 0, self.width, self.height), self.game.attack_spritesheet.get_sprite(128, 0, self.width, self.height)]
        if direction == 'up':
            self.image = up_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.5
            if self.animation_loop >= 5:
                self.kill()
        if direction == 'down':
            self.image = down_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.5
            if self.animation_loop >= 5:
                self.kill()
        if direction == 'left':
            self.image = left_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.5
            if self.animation_loop >= 5:
                self.kill()
        if direction == 'right':
            self.image = right_animations[math.floor(self.animation_loop)]
            self.animation_loop += 0.5
            if self.animation_loop >= 5:
                self.kill()

class Button(_.Obj):
    """Object class for buttons used in the game (Start, Restart)"""
    x: int
    y: int
    width: int
    height: int
    fg: tuple
    bg: tuple
    content: str
    fontsize: int

    @_.impl_patch_filename('sprites.impl\\interface.impl.jac')
    def __post_init__(self) -> None:
        self.font = pygame.font.Font(GENERAL_FONT, self.fontsize)
        self.image = pygame.Surface((self.width, self.height))
        self.image.fill(self.bg)
        self.rect = self.image.get_rect()
        self.rect.x = self.x
        self.rect.y = self.y
        self.text = self.font.render(self.content, True, self.fg)
        self.text_rect = self.text.get_rect(center=(self.width / 2, self.width / 2))
        self.image.blit(self.text, self.text_rect)

    @_.impl_patch_filename('sprites.impl\\interface.impl.jac')
    def is_pressed(self, pos: tuple, pressed: tuple) -> bool:
        if self.rect.collidepoint(pos):
            if pressed[0]:
                return True
            return False
        return False
