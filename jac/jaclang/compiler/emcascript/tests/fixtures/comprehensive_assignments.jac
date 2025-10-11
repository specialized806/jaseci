"""Comprehensive assignment tests."""

# Simple assignment
def test_simple_assignment()  -> int {
    x = 10;
    return x;
}


# Chain assignment
def test_chain_assignment()  -> int {
    a = b=c=5;
    return a + b + c;
}


# Type annotations
def test_type_annotations()  -> str {
    name: str = "Alice";
    age: int = 30;
    active: bool = True;
    score: float = 95.5;
    return name;
}


# Augmented assignments
def test_augmented()  -> int {
    x = 10;
    x += 5;
    x -= 3;
    x *= 2;
    x /= 4;
    x %= 7;
    return x;
}


# Tuple unpacking
def test_tuple_unpacking()  -> int {
    (x, y) = (10, 20);
    return x + y;
}


# List unpacking
def test_list_unpacking()  -> int {
    [a, b, c] = [1, 2, 3];
    return a + b + c;
}


# Multiple assignment
def test_multiple_assignment()  -> int {
    x = 1;
    y = 2;
    z = 3;
    return x + y + z;
}


# Assignment in expressions
def test_assignment_expression()  -> int {
    result = (x := 5) + 10;
    return result;
}
