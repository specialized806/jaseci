# Enumerations

Enumerations provide type-safe named constants with associated values. Jac enums support integer and string values, Python code blocks, iteration, and seamless integration with Object-Spatial Programming.

## Basic Enum Syntax

Define enums with named members and values:

```
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}
```

Access members via `EnumName.MEMBER` and retrieve values with `.value` and names with `.name`.

## Value Types

Enums support multiple value types:

- **Integers:** `enum Priority { LOW = 1, MEDIUM = 2, HIGH = 3 }`
- **Strings:** `enum Role { ADMIN = 'admin', USER = 'user', GUEST = 'guest' }`
- **Other types:** Floats, tuples, or any Python literal

Trailing commas are optional but recommended for version control.

## Python Code Blocks in Enums

Embed Python methods using `::py::` delimiters:

```
enum Level {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3

    ::py::
    def get_level_name(self):
        return self.name.lower()

    def get_next_level(self):
        if self.value < 3:
            return Level(self.value + 1)
        return self
    ::py::
}
```

Python methods have access to `self.name`, `self.value`, and can return enum instances.

## Enum Methods

Methods defined in Python blocks can:
- Perform logic based on enum values
- Return other enum members
- Categorize or validate values
- Encapsulate enum-specific behavior

Example: `HttpStatus.OK.is_success()` returns `True` for 2xx status codes.

## Comparison and Iteration

**Comparison:** Enum members are compared by identity:
```
if status == Status.ACTIVE { ... }
```

**Iteration:** Enums are iterable in definition order:
```
for color in Color {
    print(f"{color.name} = {color.value}");
}
```

**Lookup:**
- By value: `Color(1)` returns `Color.RED`
- By name: `Role['ADMIN']` returns `Role.ADMIN`

## Forward Declarations

Separate declaration from implementation:

```
@unique
enum Priority;

impl Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}
```

Forward declarations allow applying decorators (like `@unique` from Python's enum module) before defining members.

## Access Modifiers

Control enum visibility across modules:

```
enum :protect Permission {
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute'
}
```

Use `:pub`, `:protect`, or `:priv` to control access.

## OSP Integration

**Enums as Node Attributes:**
```
node Task {
    has priority: Priority = Priority.MEDIUM;
    has status: Status = Status.PENDING;
}
```

Provides type-safe state management for graph nodes with default values.

**Enums in Walker Logic:**
```
walker TaskFilter {
    has target_priority: Priority = Priority.HIGH;

    can filter with Task entry {
        if here.priority == self.target_priority {
            self.matched.append(here.title);
        }
    }
}
```

Walkers use enum comparison to filter nodes during graph traversal, enabling type-safe filtering and state-based routing.

## Common Patterns

**State machine states:**
```
enum State { IDLE = 0, RUNNING = 1, PAUSED = 2, STOPPED = 3 }
```

**Configuration options:**
```
enum LogLevel { DEBUG = 0, INFO = 1, WARNING = 2, ERROR = 3 }

def should_log(level: LogLevel, threshold: LogLevel) -> bool {
    return level.value >= threshold.value;
}
```

**Type-safe flags:**
```
enum Feature { FEATURE_A = 'feature_a', FEATURE_B = 'feature_b' }
enabled_features = [Feature.FEATURE_A, Feature.FEATURE_C];
if Feature.FEATURE_A in enabled_features { ... }
```

**Node state management (OSP):**
```
walker HealthCheck {
    can check with Server entry {
        if here.state == ServerState.OFFLINE {
            print(f"Server {here.id} is offline");
        }
    }
}
```

## Data Structures

Enums work seamlessly in collections:

- **Lists:** `colors = [Color.RED, Color.GREEN, Color.BLUE]`
- **Dictionaries:** Enums as keys or values
- **Function parameters:** Type-safe parameters with exhaustive pattern matching

## See Also

- [If Statements](if_statements.md) - Enum comparison for conditional logic
- [For Statements](for_statements.md) - Iterating enum members
- [Functions and Abilities](functions_and_abilities.md) - Type-safe parameters
- [Archetypes](archetypes.md) - Enum-typed node attributes
- [Inline Python](inline_python.md) - Python code blocks in enums
