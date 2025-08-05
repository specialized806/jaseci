# <span style="color: orange">Code Walkthrough: AI-Powered Game Level Generation

This walkthrough demonstrates how Large Language Models (LLMs) can be integrated into code to generate dynamic game levels. This documentation covers the `by llm` syntax, examines how structured datatypes provide context to AI models, and shows their implementation in a complete level generation system. The full implementation of the game is available in the [github repo](https://github.com/jaseci-labs/jaseci/tree/main/jac/examples/rpg_game).

<div align="center">
  <video width="480" height="300" autoplay loop muted playsinline>
    <source src="/learn/examples/mtp_examples/assets/rpg_demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

## <span style="color: orange">Implementation of `by llm` Methods

The implementation uses two `by llm` method definitions that delegate game logic to the AI:

```jac
def create_next_level (last_levels: list[Level], difficulty: int, level_width: int, level_height: int)
-> Level by llm();

def create_next_map(level: Level) -> Map by llm();
```

Let's examine these methods to understand their implementation.

### <span style="color: orange">Level Creation Method

```jac
def create_next_level (last_levels: list[Level], difficulty: int, level_width: int, level_height: int)
-> Level by llm();
```

This method uses a simplified approach to level generation. The implementation provides the LLM with:

- **Historical Context**: `last_levels: list[Level]` - The AI can access previously generated levels for variety and progression
- **Difficulty Guidance**: `difficulty: int` - An integer parameter that the AI uses to scale challenge
- **Spatial Constraints**: `level_width: int, level_height: int` - Boundary parameters that the AI must respect
- **Expected Output**: `-> Level` - The AI returns a structured Level object

The LLM processes this information and generates a new `Level` object with attributes matching the specified difficulty and dimensions.

### <span style="color: orange">Map Generation Method

```jac
def create_next_map(level: Level) -> Map by llm();
```

This method transforms a high-level `Level` configuration into a detailed `Map` with specific positions for walls, enemies, and the player. The LLM processes:

- The level's constraints (width, height, difficulty)
- How many walls and enemies should be placed
- Where to position elements for balanced gameplay
- How to create a playable and challenging layout

## <span style="color: orange">Datatype Context for AI Processing

The structured datatypes provide domain-specific context to the AI. Each datatype defines specific aspects of the game domain:

### <span style="color: orange">Data Structures

```jac
obj Position {
    has x: int, y: int;
}

obj Wall {
    has start_pos: Position, end_pos: Position;
}

obj Level {
    has name: str, difficulty: int;
    has width: int, height: int, num_wall: int, num_enemies: int;
    has time_countdown: int, n_retries_allowed: int;
}

obj Map {
    has level: Level, walls: list[Wall], small_obstacles: list[Position];
    has enemies: list[Position];
    has player_pos: Position;
}
```

These structures define the game domain:

- **Position**: Basic 2D coordinates (x, y) for spatial positioning
- **Wall**: Linear barriers defined by start and end positions
- **Level**: Game configuration including dimensions, difficulty, and element counts
- **Map**: Complete level layout containing walls, obstacles, enemies, and player position

## <span style="color: orange">LevelManager Implementation

The `LevelManager` coordinates the AI-driven generation process:

```jac
obj LevelManager {
    has current_level: int = 0, current_difficulty: int = 1,
        prev_levels: list[Level] = [], prev_level_maps: list[Map] = [];

    # ...by llm methods as defined above...

    def get_next_level -> tuple(Level, Map) {
        self.current_level += 1;
        # Keeping Only the Last 3 Levels
        if len(self.prev_levels) > 3 {
            self.prev_levels.pop(0);
            self.prev_level_maps.pop(0);
        }
        # Generating the New Level
        new_level = self.create_next_level(
            self.prev_levels,
            self.current_difficulty,
            20, 20
        );

        self.prev_levels.append(new_level);
        # Generating the Map of the New Level
        new_level_map = self.create_next_map(new_level);
        self.prev_level_maps.append(new_level_map);
        # Increasing the Difficulty for end of every 2 Levels
        if self.current_level % 2 == 0 {
            self.current_difficulty += 1;
        }
        return (new_level, new_level_map);
    }
}
```

### <span style="color: orange">Map Conversion Function

The `get_map` function transforms the AI-generated `Map` object into game tiles:

```jac
def get_map(map: Map) -> str {
    map_tiles = [['.' for _ in range(map.level.width)] for _ in range(map.level.height)];

    # Place walls
    for wall in map.walls {
        for x in range(wall.start_pos.x, wall.end_pos.x + 1) {
            for y in range(wall.start_pos.y, wall.end_pos.y + 1) {
                map_tiles[y-1][x-1] = 'B';
            }
        }
    }

    # Place obstacles, enemies, and player
    for obs in map.small_obstacles {
        map_tiles[obs.y-1][obs.x-1] = 'B';
    }
    for enemy in map.enemies {
        map_tiles[enemy.y-1][enemy.x-1] = 'E';
    }
    map_tiles[map.player_pos.y-1][map.player_pos.x-1] = 'P';

    # Add border walls
    map_tiles = [['B'] + row + ['B'] for row in map_tiles];
    map_tiles = [['B' for _ in range(map.level.width + 2)]] + map_tiles + [['B' for _ in range(map.level.width + 2)]];
    return [''.join(row) for row in map_tiles];
}
```

This function converts structured AI output into the visual representation used by the game interface.

## <span style="color: orange">System Integration

The LLM processes the entire domain through these datatypes. When `create_next_level` is called, the AI considers:

- Game progression (from previous levels)
- Player challenge curve (difficulty scaling)
- Spatial constraints (dimensions)
- Balanced gameplay (enemy count, wall placement)

## <span style="color: orange">Summary

This implementation demonstrates the integration of structured datatypes with AI delegation. The `by llm` syntax leverages AI pattern recognition capabilities to solve design problems. The datatypes serve as a vocabulary for communicating game design concepts to the AI, resulting in dynamic and balanced game content.