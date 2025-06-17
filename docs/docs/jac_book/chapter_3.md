# Chapter 3: Variables, Types, and Basic Syntax

Jac emphasizes type safety and clear variable declarations. Unlike Python's optional typing, Jac requires type annotations for all variables and function parameters, preventing runtime type errors and improving code clarity.

## Variable Declarations with Mandatory Typing

### Basic Variable Declaration

In Jac, every variable must have a type annotation:

<div class="code-block">

```jac
with entry {
    # Basic type annotations (mandatory)
    name: str = "Alice";
    age: int = 25;
    height: float = 5.7;
    is_student: bool = True;

    # Type inference (type can be inferred from value)
    score = 95.5;  # Inferred as float
    count = 42;    # Inferred as int
    print(score);
}
```
</div>

### Global Variables

Use the `glob` keyword for global variables:

<div class="code-block">

```jac
glob app_name: str = "MyApp";
glob version: float = 1.0;
glob debug_mode: bool = False;

def get_app_info() -> str {
    :g: app_name, version;
    return f"{app_name} v{version}";
}

with entry {
    print(get_app_info());
    if debug_mode {
        print("Debug mode is enabled");
    }
}
```
</div>
## Basic Data Types and Type Inference

### Primitive Types

<div class="code-block">

```jac
with entry {
    # Numeric types
    whole_number: int = 42;
    decimal_number: float = 3.14;
    scientific: float = 1.23e-4;

    # Text type
    message: str = "Hello, Jac!";
    multiline: str = """This is a
    multiline string
    in Jac""";

    # Boolean type
    is_active: bool = True;
    is_complete: bool = False;

    # None type
    empty_value: None = None;
    print(scientific);
}
```
</div>

#### Any type
Sometimes you need dynamic typing. Jac provides `any` as an escape hatch

<div class="code-block">

```jac
with entry{
    # Using 'any' for flexible types
    flexible: any = 42;
    print(flexible);

    flexible = "now a string";  # Allowed with 'any'
    print(flexible);

    flexible = [1, 2, 3];      # Still allowed
    print(flexible);


    # Useful for JSON-like data
    json_data: dict[str, any] = {
        "name": "Alice",
        "age": 30,
        "tags": ["developer", "python"],
        "active": True
    };
    print(json_data);

}
```
</div>

## Data Structures and Collections

Jac provides powerful, type-safe collection types with built-in null safety and functional programming features. This chapter covers lists, dictionaries, sets, tuples, and the pipe operators that make data transformation elegant and safe.

### Lists

Lists in Jac are strongly typed and provide comprehensive type checking:

<div class="code-block">

```jac
# Safe list access with optional types
def get_first_item(items: list[str]) -> str | None {
    if len(items) > 0 {
        return items[0];
    }
    return None;
}

with entry {
    # Basic list declarations
    numbers: list[int] = [1, 2, 3, 4, 5];
    names: list[str] = ["Alice", "Bob", "Charlie"];
    mixed_types: list[int | str] = [1, "two", 3, "four"];

    # Empty lists with explicit types
    empty_numbers: list[int] = [];
    empty_strings: list[str] = list();

    # List operations
    numbers.append(6);
    first_name = names[0];
    numbers_length = len(numbers);
    print(get_first_item(names));
}
```
</div>

### Dictionaries

Dictionaries require explicit key and value types:

<div class="code-block">

```jac
# Type-safe dictionary access
def get_config_value(config: dict[str, any], key: str, default: any = None) -> any {
    return config.get(key, default);
}

with entry {
    # Basic dictionary declarations
    scores: dict[str, int] = {"Alice": 95, "Bob": 87, "Charlie": 92};
    config: dict[str, any] = {"debug": True, "port": 8080, "host": "localhost"};
    empty_dict: dict[str, int] = {};

    # Dictionary operations
    scores["Diana"] = 98;
    alice_score = scores.get("Alice", 0);
    all_names = list(scores.keys());
    print(all_names);
}
```
</div>

### Sets

Sets ensure unique elements with type safety:

<div class="code-block">

```jac
# Set operations
def combine_tags(tag_set1: set[str], tag_set2: set[str]) -> set[str] {
    return tag_set1.union(tag_set2);
}

with entry {
    # Basic set declarations
    unique_numbers: set[int] = {1, 2, 3, 4, 5};
    tags: set[str] = {"python", "jac", "programming"};
    empty_set: set[str] = set();

    # Set operations
    unique_numbers.add(6);
    unique_numbers.remove(1);
    has_python = "python" in tags;
    tag_count = len(tags);
    print(tag_count);
}
```
</div>

### Tuples

#### Basic Tuples

Tuples provide immutable, ordered collections with fixed types:

<div class="code-block">

```jac
# Function returning tuple
def get_name_age(person: dict[str, any]) -> tuple[str, int] {
    return (person["name"], person["age"]);
}

with entry {
    # Basic tuple types
    coordinates: tuple[float, float] = (10.5, 20.3);
    rgb_color: tuple[int, int, int] = (255, 128, 0);
    person_info: tuple[str, int, bool] = ("Alice", 25, True);

    # Tuple unpacking
    (x, y) = coordinates;
    (red, green, blue) = rgb_color;
    (name, age, is_active) = person_info;
    print(f"Name: {name}, Age: {age}, Active: {is_active}");
}
```
</div>

#### Named Tuples

For more descriptive data structures:

<div class="code-block">

```jac
# Named tuple-like structure using obj
obj Point {
    has x: float, y: float;
}

obj Color {
    has red: int, green: int, blue: int;
}

def calculate_distance(p1: Point, p2: Point) -> float {
    dx = p2.x - p1.x;
    dy = p2.y - p1.y;
    return (dx * dx + dy * dy) ** 0.5;
}

with entry {
    point1 = Point(x=0.0, y=0.0);
    point2 = Point(x=3.0, y=4.0);
    distance = calculate_distance(point1, point2);
    print(f"Distance: {distance}");
}
```
</div>

### Collection Comprehensions

#### List Comprehensions

Jac supports powerful list comprehensions with type safety:

<div class="code-block">

```jac
# Comprehensions with filtering
def filter_positive_numbers(numbers: list[int]) -> list[int] {
    return [n for n in numbers if n > 0];
}

# Safe comprehensions with null checking
def extract_lengths(strings: list[str | None]) -> list[int] {
    return [len(s) for s in strings if s is not None];
}

with entry {
    # Basic list comprehensions
    squares = [x * x for x in range(10)];
    even_numbers = [x for x in range(20) if x % 2 == 0];
    upper_names = [name.upper() for name in ["alice", "bob", "charlie"]];

    # Nested comprehensions
    matrix = [[i * j for j in range(3)] for i in range(3)];
    print(matrix);
}
```
</div>

#### Dictionary Comprehensions

Create dictionaries functionally:

<div class="code-block">

```jac
# Complex transformations
def normalize_scores(scores: dict[str, int]) -> dict[str, float] {
    max_score = max(scores.values()) if scores else 1;
    return {name: score / max_score for (name, score) in scores.items()};
}

with entry {
    # Basic dictionary comprehensions
    word_lengths = {word: len(word) for word in ["hello", "world", "jac"]};
    squares_dict = {x: x * x for x in range(5)};

    # Filtering in dictionary comprehensions
    positive_scores = {name: score for (name, score) in {"Alice": 95, "Bob": -5, "Charlie": 87}.items() if score > 0};
    print(normalize_scores(positive_scores));
}
```
</div>

#### Set Comprehensions

Generate unique collections:

<div class="code-block">

```jac
# Combining multiple sources
def get_all_characters(words: list[str]) -> set[str] {
    return {char.lower() for word in words for char in word};
}
with entry {
    # Set comprehensions
    word_list = ["hello", "hi", "world", "jac"];
    unique_lengths = {len(word) for word in word_list};
    even_squares = {x * x for x in range(10) if x % 2 == 0};
    print(get_all_characters(word_list));
}
```
</div>

## Control Flow with Curly Braces

### If-Else Statements

Jac uses curly braces for all code blocks:

<div class="code-block">

```jac
def check_grade(score: int) -> str {
    if score >= 90 {
        return "A";
    } elif score >= 80 {
        return "B";
    } elif score >= 70 {
        return "C";
    } elif score >= 60 {
        return "D";
    } else {
        return "F";
    }
}

# Ternary operator
def get_status(age: int) -> str {
    return "Adult" if age >= 18 else "Minor";
}

with entry {
    (myscore, myage) = (73, 23);
    print(f"Result is {check_grade(myscore)}");
    print(f"I am {get_status(myage)}");
}
```
</div>

### For and While Loops

<div class="code-block">

```jac
# For loops
def process_names(names: list[str]) -> None {
    for name in names {
        print(f"Hello, {name}!");
    }
}

# Range loops
def print_numbers(n: int) -> None {
    for i in range(n) {
        print(f"Number: {i}");
    }
}

# While loops
def countdown(start: int) -> None {
    count = start;
    while count > 0 {
        print(f"Countdown: {count}");
        count -= 1;
    }
    print("Blast off!");
}

with entry {
    # Jac's unique for-to-by loop
    for i = 0 to i < 10 by i += 2 {
        print(i);  # 0, 2, 4, 6, 8
    }

    # Complex for-to-by examples
    # Countdown
    for count = 10 to count > 0 by count -= 1 {
        print(f"{count}...");
    }
    print("Liftoff!");

    # Exponential growth
    for value = 1 to value <= 1000 by value *= 2 {
        print(value);  # 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
    }

    process_names(["John", "Emily", "Emma"]);
    print_numbers(3);
    countdown(2);
}
```
</div>

## Pattern Matching

Jac supports advanced pattern matching for complex conditional logic:

<div class="code-block">

```jac
def describe_value(value: any) -> str {
    match value {
        case int() if value > 0:
            return f"Positive integer: {value}";
        case int() if value < 0:
            return f"Negative integer: {value}";
        case 0:
            return "Zero";
        case str() if len(value) > 10:
            return f"Long string: {value[:10]}...";
        case str():
            return f"Short string: {value}";
        case list() if len(value) == 0:
            return "Empty list";
        case list():
            return f"List with {len(value)} items";
        case _:
            return f"Unknown type: {type(value)}";
    }
}

with entry {
    print(describe_value(5));
}
```
</div>

## Walrus Operator (:=)
Both Python and Jac support the walrus operator for assignment expressions:

<div class="code-block">

```jac
with entry {
    mylist = [1,2,3,4,5,6,7,4,5,6,7];
    # Without walrus
    value = len(mylist);
    if value > 10 {
        print(f"List is too long ({value} elements)");
    }

    mylist = [1,2,3,4,4,5,6,7];
    # With walrus
    if (value := len(mylist)) > 10{
        print(f"List is too long ({value} elements)");
    } else {
        print(f"List is not too long ({value} elements)");
    }
}
```
</div>

## Exception Handling

Exception handling in Jac follows Python patterns with brace syntax:

<div class="code-block">

```jac
# Basic pattern matching
def safe_divide(a: float, b: float) -> float {
    try {
        return a / b;
    } except ZeroDivisionError {
        print("Cannot divide by zero!");
        return 0.0;
    }
}

# Raising exceptions
def validate_age(age: int) {
    if age < 0 {
        raise ValueError("Age cannot be negative");
    }
    if age > 150 {
        raise ValueError("Age seems unrealistic");
    }
}

with entry {
    print(safe_divide(10, 2));  # Should print 5.0
    print(safe_divide(10, 0));  # Should print "Cannot divide by zero!" and return 0.0

    try {
        validate_age(-5);  # Should raise ValueError
    } except ValueError as e {
        print(f"Validation error: {e}");
    }
}
```
</div>

## Code Example: Type-Safe Calculator

<div class="code-block">

```jac
obj Calculator {
    has history: list[str] = [];

    def calculate(a: float, b: float, op: str) -> float;
    def add_to_history(calculation: str) -> None;
}

impl Calculator.calculate(a: float, b: float, op: str) -> float {
    result: float = 0;

    match op {
        case "+":
            result = a + b;
        case "-":
            result = a - b;
        case "*":
            result = a * b;
        case "/":
            if b == 0.0 {
                raise ValueError("Division by zero");
            }
            result = a / b;
        case "**":
            result = a ** b;
        case _:
            raise ValueError("Invalid operation");
    }

    calculation = f"{a} {op} {b} = {result}";
    self.add_to_history(calculation);
    return result;
}

impl Calculator.add_to_history(calculation: str) -> None {
    self.history.append(calculation);
    if len(self.history) > 10 {
        self.history = self.history[-10:];
    }
}

with entry {
    calc = Calculator();
    result = calc.calculate(10.0, 5.0, "+");
    print(f"Result: {result}");
    print("Completed");
}
```
</div>

## Key Takeaways

1. **Mandatory Typing**: All variables require type annotations for safety
2. **Type Inference**: Types can be inferred from values when obvious
3. **Pattern Matching**: Powerful `match` statements for complex conditions
4. **Control Flow**: Familiar if/while/for structures with curly braces
5. **Type Safety**: Catch errors at compile time rather than runtime

In the next chapter, we'll explore Jac's data structures and collection types in detail.
