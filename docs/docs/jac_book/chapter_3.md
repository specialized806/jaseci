# Chapter 4: Variables, Types, and Basic Syntax

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
    :g: debug_mode;
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

## Code Example: Type-Safe Calculator

<div class="code-block">

```jac
enum Operation {
    ADD = "+",
    SUBTRACT = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    POWER = "**"
}

obj Calculator {
    has history: list[str] = [];

    def calculate(a: float, b: float, op: Operation) -> float;
    def add_to_history(calculation: str) -> None;
}

impl Calculator.calculate(a: float, b: float, op: Operation) -> float {
    result: float;

    match op {
        case Operation.ADD:
            result = a + b;
        case Operation.SUBTRACT:
            result = a - b;
        case Operation.MULTIPLY:
            result = a * b;
        case Operation.DIVIDE:
            if b == 0.0 {
                raise ValueError("Division by zero");
            }
            result = a / b;
        case Operation.POWER:
            result = a ** b;
        case _:
            raise ValueError("Invalid operation");
    }

    calculation = f"{a} {op.value} {b} = {result}";
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
    result = calc.calculate(10.0, 5.0, Operation.ADD);
    print(f"Result: {result}");
}
```
</div>

## Key Takeaways

1. **Mandatory Typing**: All variables require type annotations for safety
2. **Type Inference**: Types can be inferred from values when obvious
3. **Optional Types**: Use `?` for nullable types and handle None cases
4. **Pattern Matching**: Powerful `match` statements for complex conditions
5. **Control Flow**: Familiar if/while/for structures with curly braces
6. **Type Safety**: Catch errors at compile time rather than runtime

In the next chapter, we'll explore Jac's data structures and collection types in detail.
