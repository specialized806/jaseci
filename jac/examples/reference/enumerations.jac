# Enumerations - Type-safe named constants

import from enum { unique }

# ===== Part 1: Basic Enum with Integer Values =====
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

with entry {
    print("=== 1. Basic Enum with Integer Values ===");
    print(f"  Color.RED value: {Color.RED.value}");
    print(f"  Color.GREEN value: {Color.GREEN.value}");
    print(f"  Color.BLUE value: {Color.BLUE.value}");
}

# ===== Part 2: Enum with String Values =====
enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

with entry {
    print("\n=== 2. Enum with String Values ===");
    print(f"  Role.ADMIN value: {Role.ADMIN.value}");
    print(f"  Role.USER value: {Role.USER.value}");
    print(f"  Role.GUEST value: {Role.GUEST.value}");
}

# ===== Part 3: Enum with Trailing Comma =====
enum Status {
    PENDING = 0,
    ACTIVE = 1,
    INACTIVE = 2,
}

with entry {
    print("\n=== 3. Enum with Trailing Comma ===");
    print(f"  Status.PENDING: {Status.PENDING.value}");
    print(f"  Status.ACTIVE: {Status.ACTIVE.value}");
    print(f"  Status.INACTIVE: {Status.INACTIVE.value}");
}

# ===== Part 4: Forward Declaration with Impl =====
@unique
enum Priority;

impl Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

with entry {
    print("\n=== 4. Forward Declaration with Impl ===");
    print(f"  Priority.LOW: {Priority.LOW.value}");
    print(f"  Priority.MEDIUM: {Priority.MEDIUM.value}");
    print(f"  Priority.HIGH: {Priority.HIGH.value}");
}

# ===== Part 5: Enum with Python Code Block =====
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

with entry {
    print("\n=== 5. Enum with Python Code Block ===");
    print(f"  Level.BEGINNER name: {Level.BEGINNER.get_level_name()}");
    print(f"  Next after BEGINNER: {Level.BEGINNER.get_next_level().name}");
}

# ===== Part 6: Enum Comparison =====
with entry {
    print("\n=== 6. Enum Comparison ===");

    status1 = Status.ACTIVE;
    status2 = Status.ACTIVE;
    status3 = Status.INACTIVE;

    if status1 == status2 {
        print("  status1 == status2: True");
    }

    if status1 != status3 {
        print("  status1 != status3: True");
    }
}

# ===== Part 7: Enum in Functions =====
def get_status_message(status: Status) -> str {
    if status == Status.PENDING {
        return "Waiting for approval";
    } elif status == Status.ACTIVE {
        return "Currently active";
    } elif status == Status.INACTIVE {
        return "No longer active";
    } else {
        return "Unknown status";
    }
}

with entry {
    print("\n=== 7. Enum in Functions ===");
    print(f"  {Status.PENDING.name}: {get_status_message(Status.PENDING)}");
    print(f"  {Status.ACTIVE.name}: {get_status_message(Status.ACTIVE)}");
    print(f"  {Status.INACTIVE.name}: {get_status_message(Status.INACTIVE)}");
}

# ===== Part 8: Enum with Access Modifier =====
enum :protect Permission {
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute'
}

with entry {
    print("\n=== 8. Enum with Access Modifier ===");
    print(f"  Permission.READ: {Permission.READ.value}");
    print(f"  Permission.WRITE: {Permission.WRITE.value}");
    print(f"  Permission.EXECUTE: {Permission.EXECUTE.value}");
}

# ===== Part 9: Enum Iteration =====
with entry {
    print("\n=== 9. Enum Iteration ===");

    print("  All Color values:");
    for color in Color {
        print(f"    {color.name} = {color.value}");
    }

    print("  All Role values:");
    for role in Role {
        print(f"    {role.name} = {role.value}");
    }
}

# ===== Part 10: Enum in Data Structures =====
with entry {
    print("\n=== 10. Enum in Data Structures ===");

    # List of enums
    colors = [Color.RED, Color.GREEN, Color.BLUE];
    print("  Colors in list:");
    for c in colors {
        print(f"    {c.name}");
    }

    # Dict with enum keys
    role_permissions = {
        Role.ADMIN: "Full access",
        Role.USER: "Limited access",
        Role.GUEST: "Read-only"
    };

    print("  Role permissions:");
    for item in role_permissions.items() {
        role = item[0];
        perm = item[1];
        print(f"    {role.name}: {perm}");
    }
}

# ===== Part 11: Enum with Auto-numbering =====
# Note: Auto() might not be available, using manual values
enum Direction {
    NORTH = 0,
    SOUTH = 1,
    EAST = 2,
    WEST = 3
}

with entry {
    print("\n=== 11. Enum Direction ===");
    print(f"  Direction.NORTH: {Direction.NORTH.value}");
    print(f"  Direction.SOUTH: {Direction.SOUTH.value}");
    print(f"  Direction.EAST: {Direction.EAST.value}");
    print(f"  Direction.WEST: {Direction.WEST.value}");
}

# ===== Part 12: Enum in Node Attributes (OSP) =====
node Task {
    has title: str = "Task";
    has priority: Priority = Priority.MEDIUM;
    has status: Status = Status.PENDING;
}

with entry {
    print("\n=== 12. Enum in Node Attributes (OSP) ===");

    task = Task(title="Build feature", priority=Priority.HIGH, status=Status.ACTIVE);
    print(f"  Task: {task.title}");
    print(f"  Priority: {task.priority.name} ({task.priority.value})");
    print(f"  Status: {task.status.name}");
}

# ===== Part 13: Enum in Walker Logic (OSP) =====
walker TaskFilter {
    has target_priority: Priority = Priority.HIGH;
    has matched: list = [];

    can filter with Task entry {
        print(f"    Checking task: {here.title}, priority={here.priority.name}");
        if here.priority == self.target_priority {
            self.matched.append(here.title);
            print(f"      Matched!");
        }
        visit [-->];
    }

    can report with exit {
        print(f"  Found {len(self.matched)} high-priority tasks: {self.matched}");
    }
}

with entry {
    print("\n=== 13. Enum in Walker Logic (OSP) ===");

    task1 = Task(title="Critical Bug", priority=Priority.HIGH);
    task2 = Task(title="Documentation", priority=Priority.LOW);
    task3 = Task(title="Security Patch", priority=Priority.HIGH);

    root ++> task1;
    root ++> task2;
    root ++> task3;

    root spawn TaskFilter(target_priority=Priority.HIGH);
}

# ===== Part 14: Enum Value Lookup =====
with entry {
    print("\n=== 14. Enum Value Lookup ===");

    # Access by value
    red_color = Color(1);
    print(f"  Color(1): {red_color.name}");

    green_color = Color(2);
    print(f"  Color(2): {green_color.name}");

    # Access by name
    admin_role = Role['ADMIN'];
    print(f"  Role['ADMIN']: {admin_role.value}");
}

# ===== Part 15: Enum with Complex Logic =====
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

with entry {
    print("\n=== 15. Enum with Complex Logic ===");

    statuses = [HttpStatus.OK, HttpStatus.BAD_REQUEST, HttpStatus.SERVER_ERROR];

    for status in statuses {
        print(f"  {status.name} ({status.value}):");
        print(f"    Success: {status.is_success()}");
        print(f"    Client Error: {status.is_client_error()}");
        print(f"    Server Error: {status.is_server_error()}");
    }
}

with entry {
    print("\n✓ Enumerations demonstrated!");
}
