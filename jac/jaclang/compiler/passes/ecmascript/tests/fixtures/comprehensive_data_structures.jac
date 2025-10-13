"""Comprehensive data structure tests."""

# Lists
def test_lists() -> list {
    # Empty list
    empty = [];

    # List with values
    numbers = [1, 2, 3, 4, 5];

    # List with different types
    mixed = [1, "two", 3.0, True];

    # Nested lists
    nested = [[1, 2], [3, 4], [5, 6]];

    return numbers;
}

# Tuples
def test_tuples() -> tuple {
    # Empty tuple
    empty = ();

    # Tuple with values
    coords = (10, 20);

    # Tuple with multiple values
    data = (1, "two", 3.0, True);

    return coords;
}

# Dictionaries
def test_dicts() -> dict {
    # Empty dict
    empty = {};

    # Dict with string keys
    person = {"name": "Alice", "age": 30};

    # Dict with various keys
    config = {"timeout": 100, "enabled": True, "host": "localhost"};

    # Nested dicts
    nested = {"user": {"name": "Bob", "age": 25}};

    return person;
}

# Sets
def test_sets() -> set {
    # Set with values
    numbers = {1, 2, 3, 4, 5};

    # Set operations will be in expressions
    unique = {1, 2, 2, 3, 3, 3};

    return unique;
}

# List indexing
def test_indexing() -> int {
    numbers = [10, 20, 30, 40, 50];
    first = numbers[0];
    last = numbers[4];

    return first + last;
}

# Dict access
def test_dict_access() -> str {
    person = {"name": "Charlie", "age": 35};
    name = person["name"];

    return name;
}

# List slicing
def test_slicing() -> list {
    numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    slice1 = numbers[2:5];
    slice2 = numbers[:3];
    slice3 = numbers[7:];

    return slice1;
}

# List comprehension
def test_comprehension() -> list {
    squares = [x * x for x in range(10)];
    evens = [x for x in range(20) if x % 2 == 0];

    return squares;
}
