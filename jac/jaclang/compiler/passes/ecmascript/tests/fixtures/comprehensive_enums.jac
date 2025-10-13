"""Comprehensive enum tests."""

# Basic enum with integer values
enum Color {
    RED = 1,
    GREEN = 2,
    BLUE = 3
}

# Enum with string values
enum Status {
    PENDING = "pending",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

# Enum with mixed values
enum Priority {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    URGENT = 3
}

# Enum with single value
enum Mode {
    DEBUG = "debug"
}

# Multiple enums
enum Direction {
    NORTH = "N",
    SOUTH = "S",
    EAST = "E",
    WEST = "W"
}

enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
}
