Enumerations in Jac provide type-safe named constants with associated values. Jac enums support integer and string values, forward declarations, Python code blocks, iteration, and integration with Object-Spatial Programming (OSP).

**Basic Enum with Integer Values**

Lines 6-16 demonstrate the simplest enum syntax:
```jac
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

print(f"Color.RED value: {Color.RED.value}");  // Prints: 1
```

Enum members are accessed via `EnumName.MEMBER`. The `.value` attribute returns the associated value. The `.name` attribute returns the member name as a string.

**Enum with String Values**

Lines 20-31 show enums with string values:
```jac
enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

print(f"Role.ADMIN value: {Role.ADMIN.value}");  // Prints: admin
```

Enum values can be any type: integers, strings, floats, or tuples.

**Enum with Trailing Comma**

Lines 34-45 demonstrate trailing commas (lines 36-38):
```jac
enum Status {
    PENDING = 0,
    ACTIVE = 1,
    INACTIVE = 2,  // Trailing comma allowed
}
```

Trailing commas are optional but recommended for version control: adding new members doesn't require modifying the previous line.

**Forward Declaration with Impl**

Lines 48-62 show forward declaration pattern:
```jac
@unique
enum Priority;

impl Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}
```

The `@unique` decorator (from Python's `enum` module) ensures all values are distinct. Forward declaration with `enum Name;` allows applying decorators before defining the body. The `impl` block provides the member definitions.

**Enum with Python Code Block**

Lines 65-85 embed Python methods using `::py::` delimiters:
```jac
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

print(Level.BEGINNER.get_level_name());  // Prints: beginner
print(Level.BEGINNER.get_next_level().name);  // Prints: INTERMEDIATE
```

Python methods have access to `self.name`, `self.value`, and can return enum instances.

**Enum Comparison**

Lines 91-101 show comparison operators:
```jac
status1 = Status.ACTIVE;
status2 = Status.ACTIVE;
status3 = Status.INACTIVE;

if status1 == status2 {  // True: same enum member
    print("Equal");
}

if status1 != status3 {  // True: different members
    print("Not equal");
}
```

Enum members are compared by identity, not value. Two references to the same member are equal.

**Enum in Functions**

Lines 105-122 show using enums as function parameters:
```jac
def get_status_message(status: Status) -> str {
    if status == Status.PENDING {
        return "Waiting for approval";
    } elif status == Status.ACTIVE {
        return "Currently active";
    } elif status == Status.INACTIVE {
        return "No longer active";
    }
}

print(get_status_message(Status.PENDING));  // Prints: Waiting for approval
```

Enums as parameters provide type safety and enable exhaustive pattern matching.

**Enum with Access Modifier**

Lines 125-136 show access control:
```jac
enum :protect Permission {
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute'
}
```

Access modifiers (`:pub`, `:protect`, `:priv`) control enum visibility across modules.

**Enum Iteration**

Lines 143-150 show iterating over enum members:
```jac
for color in Color {
    print(f"  {color.name} = {color.value}");
}
// Prints:
//   RED = 1
//   GREEN = 2
//   BLUE = 3
```

Enums are iterable, yielding members in definition order.

**Enum in Data Structures**

Lines 158-176 show enums in collections:
```jac
// List of enums
colors = [Color.RED, Color.GREEN, Color.BLUE];
for c in colors {
    print(f"  {c.name}");
}

// Dict with enum keys
role_permissions = {
    Role.ADMIN: "Full access",
    Role.USER: "Limited access",
    Role.GUEST: "Read-only"
};

for item in role_permissions.items() {
    role = item[0];
    perm = item[1];
    print(f"  {role.name}: {perm}");
}
```

Enums work as list elements and dictionary keys/values.

**Enum Direction (Sequential Values)**

Lines 181-194 demonstrate sequential numbering:
```jac
enum Direction {
    NORTH = 0,
    SOUTH = 1,
    EAST = 2,
    WEST = 3
}
```

While Jac doesn't have Python's `auto()`, sequential values are simple to define manually.

**Enum in Node Attributes (OSP)**

Lines 197-210 show enums as node attributes:
```jac
node Task {
    has title: str = "Task";
    has priority: Priority = Priority.MEDIUM;
    has status: Status = Status.PENDING;
}

task = Task(title="Build feature", priority=Priority.HIGH, status=Status.ACTIVE);
print(f"Priority: {task.priority.name} ({task.priority.value})");
```

Nodes can have enum-typed attributes with default values. This provides type-safe state management for graph nodes.

**Enum in Walker Logic (OSP)**

Lines 213-243 demonstrate filtering based on enum values:
```jac
walker TaskFilter {
    has target_priority: Priority = Priority.HIGH;
    has matched: list = [];

    can filter with Task entry {
        if here.priority == self.target_priority {
            self.matched.append(here.title);
        }
        visit [-->];
    }
}

task1 = Task(title="Critical Bug", priority=Priority.HIGH);
task2 = Task(title="Documentation", priority=Priority.LOW);
task3 = Task(title="Security Patch", priority=Priority.HIGH);

root ++> task1;
root ++> task2;
root ++> task3;

root spawn TaskFilter(target_priority=Priority.HIGH);
// Matches: "Critical Bug" and "Security Patch"
```

Walkers use enum comparison (`here.priority == self.target_priority`) to filter nodes during graph traversal.

**Enum Value Lookup**

Lines 250-258 show accessing enums by value and name:
```jac
// Access by value
red_color = Color(1);
print(f"Color(1): {red_color.name}");  // Prints: RED

// Access by name
admin_role = Role['ADMIN'];
print(f"Role['ADMIN']: {admin_role.value}");  // Prints: admin
```

- `EnumName(value)` - Lookup by value (raises error if not found)
- `EnumName['NAME']` - Lookup by member name string

**Enum with Complex Logic**

Lines 262-293 show enums with sophisticated methods:
```jac
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500

    ::py::
    def is_success(self):
        return 200 <= self.value < 300

    def is_client_error(self):
        return 400 <= self.value < 500

    def is_server_error(self):
        return 500 <= self.value < 600
    ::py::
}

statuses = [HttpStatus.OK, HttpStatus.BAD_REQUEST, HttpStatus.SERVER_ERROR];

for status in statuses {
    print(f"{status.name}: Success={status.is_success()}");
}
// Prints:
//   OK: Success=True
//   BAD_REQUEST: Success=False
//   SERVER_ERROR: Success=False
```

Complex enums encapsulate logic related to their values, enabling categorization and validation methods.

**Enum Attributes Summary**

| Attribute | Description | Example |
|-----------|-------------|---------|
| `.name` | Member name as string | `Color.RED.name` → `"RED"` |
| `.value` | Associated value | `Color.RED.value` → `1` |
| Custom methods | Defined in `::py::` blocks | `level.get_next_level()` |

**Common Patterns**

**State machine states**:
```jac
enum State {
    IDLE = 0,
    RUNNING = 1,
    PAUSED = 2,
    STOPPED = 3
}

current_state = State.IDLE;
if current_state == State.IDLE {
    current_state = State.RUNNING;
}
```

**Configuration options**:
```jac
enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    CRITICAL = 4
}

def should_log(level: LogLevel, threshold: LogLevel) -> bool {
    return level.value >= threshold.value;
}
```

**Type-safe flags**:
```jac
enum Feature {
    FEATURE_A = 'feature_a',
    FEATURE_B = 'feature_b',
    FEATURE_C = 'feature_c'
}

enabled_features = [Feature.FEATURE_A, Feature.FEATURE_C];

if Feature.FEATURE_A in enabled_features {
    enable_feature_a();
}
```

**Node state management (OSP)**:
```jac
node Server {
    has state: ServerState = ServerState.OFFLINE;
    has role: ServerRole = ServerRole.WORKER;
}

walker HealthCheck {
    can check with Server entry {
        if here.state == ServerState.OFFLINE {
            print(f"Server {here.id} is offline");
        }
    }
}
```

**Key Differences from Python**

1. **Semicolons**: Jac enum member lists use commas, but statements end with semicolons
2. **Python code blocks**: Use `::py::` delimiters to embed Python methods
3. **Forward declarations**: Use `enum Name;` then `impl Name { ... }`
4. **Access modifiers**: `:pub`, `:protect`, `:priv` control visibility
5. **OSP integration**: Enums work seamlessly as node attributes and in walker logic

**Relationship to Other Features**

Enumerations interact with:
- **If statements** (if_statements.jac): Enum comparison for conditional logic
- **For loops** (for_statements.jac): Iterating enum members
- **Functions** (functions_and_abilities.jac): Type-safe parameters and return values
- **Nodes** (archetypes.jac): Enum-typed attributes for state management
- **Walkers** (archetypes.jac): Filtering and processing based on enum values
- **Decorators**: `@unique` ensures value uniqueness

Enumerations provide type-safe named constants with powerful extensibility through Python code blocks and seamless integration with Jac's Object-Spatial Programming paradigm.
