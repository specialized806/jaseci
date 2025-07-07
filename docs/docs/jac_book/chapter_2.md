# 1. Environment Setup and First Program
---
Getting started with Jac is straightforward - you'll have your development environment ready and your first program running in just a few minutes. This chapter covers installation, IDE setup, and writing your first Jac programs.


> Jac builds on Python's ecosystem while adding powerful new features. You'll need Python 3.12+ and can use any text editor, though VS Code provides the best experience with syntax highlighting and debugging tools.

## Installation and IDE Setup
---
### System Requirements
- Python 3.12 or higher
- pip package manager
- 4GB RAM minimum (8GB recommended)
- 500MB storage for Jac and dependencies


### Installing Jac
Installing Jac is as simple as installing any Python package:

#### Quick Install via pip

```bash
# Install Jac from PyPI
pip install jaclang

# Verify installation
jac --version
```
<br />
#### Via Virtual Environment (Recommended)

For project isolation, consider using a virtual environment:

**Linux/MacOS**

```bash
# Create virtual environment
python -m venv jac-env

# Activate it (Linux/Mac)
source jac-env/bin/activate

# Install Jac
pip install jaclang
```
<br />
**Windows**
```powerhell
# Create virtual environment
python -m venv jac-env

# Activate it (Windows)
jac-env\Scripts\activate

# Install Jac
pip install jaclang
```
<br />

### VS Code Extension
For the best development experience, install the Jac VS Code extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Jac"
4. Install the official Jac extension

Alternatively, visit the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=jaseci-labs.jaclang-extension) directly.

The extension provides:

- Syntax highlighting for Jac-specific constructs
- Error detection and type checking
- Code formatting and snippets
- Graph visualization for nodes and edges

### Basic CLI Commands
Jac provides a simple command-line interface (CLI) for running scripts and managing projects. This cli provides developers the ability to either run scripts locally for testing or [even serve them as web applications](../chapter_12). Here are the most common commands:
```bash
# Run a Jac file
jac run filename.jac

# Get help
jac --help

# Serve as web application (advanced)
jac serve filename.jac
```
<br />

## Hello World in Jac
---
Let's start with the traditional first program:




```jac
# hello.jac
with entry {
    print("Hello, Jac World!");
}
```
<br />

Run your first Jac program:
```bash
jac run hello.jac
```
<br />

## Project Structure Conventions
---
Jac encourages separating interface declarations from implementations, making code more maintainable as projects grow.

As your projects grow, following these conventions will help:

```
my_project/
├── main.jac              # Main program
├── models/
│   ├── user.jac          # User interface
│   ├── user.impl.jac     # User implementation
│   └── user.test.jac     # User tests
└── utils/
    ├── helpers.jac       # Helper functions
    └── constants.jac     # Application constants
```
<br />
### Interface and Implementation Separation
You many notice that from the project structure above, there is a file `user.jac` and `user.impl.jac`. This is a common pattern in Jac projects where interfaces are defined separately from their implementations. This allows for better organization and easier testing.

Lets consider a simple example of a user interface and its implementation. The user has a `name` and `email` attributes, and we want to validate the email format and provide a display name via the `get_display_name` and `validate` methods.

We can first define the interface in `user.jac`:
```jac
# user.jac - Interface declaration
obj User {
    has name: str;
    has email: str;

    def validate() -> bool;
    def get_display_name() -> str;
}
```
<br />

Next, we implement the interface in `user.impl.jac`:
```jac
# user.impl.jac - Implementation
impl User.validate {
    return "@" in self.email and len(self.name) > 0;
}

impl User.get_display_name {
    return f"{self.name} <{self.email}>";
}
```
<br />


## Entry Blocks and Basic Execution
---
The `with entry` block is Jac's equivalent to Python's `if __name__ == "__main__":` - it defines where program execution begins.

### Single Entry Blocks
```jac
# Variables and functions can be defined outside entry
glob app_name: str = "My Jac App";
glob version: str = "1.0.0";

def greet(name: str) -> str {
    return f"Hello, {name}!";
}

# Entry block - program starts here
with entry {
    print(f"Starting {app_name} v{version}");

    user_name: str = "Alice";
    greeting: str = greet(user_name);
    print(greeting);

    print("Program finished!");
}
```
<br />

### Multiple Entry Blocks

Jac allows multiple entry blocks that execute in order:

```jac
# setup.jac - Multiple entry blocks execute in sequence
glob counter: int = 0;

# First entry block
with entry {
    print("Initialization phase");
    counter = 1;
}

# Second entry block
with entry {
    print("Processing phase");
    counter += 1;
    print(f"Counter is now: {counter}");
}

# Third entry block
with entry {
    print("Cleanup phase");
    print(f"Final counter value: {counter}");
}
```
<br />

## Basic Calculator Program
---
Let's build a simple calculator to demonstrate Jac's syntax. The calculator consists of 4 functions that represent basic arithmetic operations: addition, subtraction, multiplication, and division. Each function takes two float arguments and returns the result.

The division function `divide` also contain additional logic to handle division by zero, returning an error message in that case. First, it checks if the divisor input `b` is zero, and if so, it returns an error message. Otherwise, it performs the division and returns the result.



```jac
# calculator.jac
def add(a: float, b: float) -> float {
    return a + b;
}

def subtract(a: float, b: float) -> float {
    return a - b;
}

def multiply(a: float, b: float) -> float {
    return a * b;
}

def divide(a: float, b: float) -> float | str {
    if b == 0.0 {
        return "Error: Cannot divide by zero!";
    }
    return a / b;
}

with entry {
    print("=== Simple Calculator ===");

    # Test calculations
    num1: float = 10.0;
    num2: float = 3.0;

    print(f"{num1} + {num2} = {add(num1, num2)}");
    print(f"{num1} - {num2} = {subtract(num1, num2)}");
    print(f"{num1} * {num2} = {multiply(num1, num2)}");
    print(f"{num1} / {num2} = {divide(num1, num2)}");

    # Test division by zero
    print(f"{num1} / 0 = {divide(num1, 0.0)}");
}
```
<br />

### Enhanced Calculator with Object-Oriented Design

<div class="code-block">
```jac
# oop_calculator.jac
obj Calculator {
    has history: list[str] = [];

    def add(a: float, b: float) -> float {
        result: float = a + b;
        self.history.append(f"{a} + {b} = {result}");
        return result;
    }

    def subtract(a: float, b: float) -> float {
        result: float = a - b;
        self.history.append(f"{a} - {b} = {result}");
        return result;
    }

    def get_history() -> list[str] {
        return self.history;
    }

    def clear_history() {
        self.history = [];
    }
}

with entry {
    calc = Calculator();

    # Perform calculations
    result1: float = calc.add(5.0, 3.0);
    result2: float = calc.subtract(10.0, 4.0);

    print(f"Results: {result1}, {result2}");

    # Show history
    print("Calculation History:");
    for entry in calc.get_history() {
        print(f"  {entry}");
    }
}
```
</div>


## Common Beginner Mistakes and Solutions
---
Most beginner issues stem from Jac's stricter type requirements compared to Python. Here are the most common mistakes and their solutions.

| **Issue** | **Solution** |
|-----------|--------------|
| Missing semicolons | Add `;` at the end of statements |
| Missing type annotations | Add types to all variables: `x: int = 5;` |
| No entry block | Add `with entry { ... }` for executable scripts |
| Python-style indentation | Use `{ }` braces instead of indentation |

### Example of Common Fixes
Someone unfamiliar with Jac might write code like this:

```jac
# This won't work - missing types and semicolons
def greet(name) {
    return f"Hello, {name}"
}

# Missing entry block
print(greet("World"))
```
<br />

The corrected version of the code would be:
```jac
# This works - proper types and syntax
def greet(name: str) -> str {
    return f"Hello, {name}";
}

with entry {
    print(greet("World"));
}
```


## Jac REPL
---
!!! warning "Warning"
    Currently, the Jac REPL feature is not available. Please use standard Jac script execution for testing and running your code.

## Best Practices
---
- **Use virtual environments**: Keep your Jac projects isolated
- **Start with entry blocks**: Always begin executable code with `with entry`
- **Type everything**: Take advantage of mandatory type annotations
- **Organize your code**: Use proper project structure from the beginning
- **Test early and often**: Run your code frequently to catch errors quickly

## Key Takeaways
---
**Environment Setup:**

- **Installation**: Simple pip install with Python 3.12+ requirement
- **VS Code Extension**: Provides syntax highlighting and error detection
- **Virtual Environments**: Recommended for project isolation

**Jac Fundamentals:**

- **Entry blocks**: `with entry { }` defines program execution start
- **Type safety**: Mandatory type annotations prevent runtime errors
- **Project structure**: Clean organization with interface/implementation separation
- **CLI commands**: `jac run` for execution, `jac serve` for web applications

**Key Differences from Python:**

- Curly braces `{ }` instead of indentation for code blocks
- Semicolons `;` required for statement termination
- Mandatory type annotations for all variables and functions
- `glob` for global variables instead of `global` keyword

!!! tip "Try It Yourself"
    Practice the basics by creating:
    - A simple temperature converter
    - A basic inventory management system
    - A calculator with different operations
    - A text processing utility

    Remember: Focus on proper typing and project structure from the beginning!

---

*Your development environment is ready! Now let's explore Jac's enhanced syntax and type system.*

