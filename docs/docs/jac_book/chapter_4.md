# Chapter 4: Functions and Decorators

Jac provides a powerful function system with mandatory type annotations, decorators, and first-class support for functional programming patterns. This chapter covers function definitions, parameter handling, decorators, and lambda functions.

## Function Definitions

### Basic Function Syntax

All functions in Jac require explicit type annotations for parameters and return values:

<div class="code-block">

```jac
# Basic function with type annotations
def greet(name: str) -> str {
    return f"Hello, {name}!";
}

# Function with multiple parameters
def calculate_area(length: float, width: float) -> float {
    return length * width;
}

# Function with no return value
def print_info(name: str, age: int) -> None {
    print(f"Name: {name}, Age: {age}");
}

# Function with default parameters
def create_user(name: str, age: int = 18, is_active: bool = True) -> dict[str, any] {
    return {"name": name, "age": age, "is_active": is_active};
}

with entry {
    print(greet("Tommy"));
    print(calculate_area(10, 1.5));
    print(print_info("Tommy", 23));
    print(create_user("Tommy",23, True));

}
```
</div>

### Variable Arguments

Handle variable numbers of arguments:

<div class="code-block">

```jac
# Variable positional arguments
def sum_numbers(*args: int) -> int {
    total = 0;
    for num in args {
        total += num;
    }
    return total;
}

# Variable keyword arguments
def create_config(**kwargs: any) -> dict[str, any] {
    config = {"debug": False, "port": 8080};
    config.update(kwargs);
    return config;
}

# Combining both
def flexible_function(required: str, *args: int, **kwargs: any) -> dict[str, any] {
    return {
        "required": required,
        "args": list(args),
        "kwargs": kwargs
    };
}

with entry {
    # Using variable arguments
    total = sum_numbers(1, 2, 3, 4, 5);
    config = create_config(debug=True, host="localhost", timeout=30);
    result = flexible_function("test", 1, 2, 3, name="Alice", age=25);
    print(total);
    print(config);
    print(result);
}
```
</div>

## Parameter Types and Return Annotations

### Advanced Type Annotations

Use complex type annotations for precise function signatures:

<div class="code-block">

```jac
# Function with complex return types
def divide_numbers(a: float, b: float) -> float | None {
    if b == 0.0 {
        return None;
    }
    return a / b;
}

# Function with callable parameter
def apply_operation(values: list[int], operation: callable[[int], int]) -> list[int] {
    return [operation(value, 2) for value in values];
}

# Function returning function
def create_multiplier(factor: int) -> callable[[int], int] {
    def multiply(x: int) -> int {
        return x * factor;
    }
    return multiply;
}

# Generic function
def get_first_item(items: list[any]) -> any {
    if len(items) > 0 {
        return items[0];
    }
    return None;
}

with entry {
    num_list = [2,3,5];
    print(divide_numbers(5, 0));
    print(apply_operation(num_list, divide_numbers));
    print(get_first_item(num_list));
}
```
</div>

### Optional and Default Parameters

Handle optional parameters effectively:

<div class="code-block">

```jac
# Optional parameters with None defaults
def send_email(to: str, subject: str, body: str, cc: list[str] | None = None, bcc: list[str] | None = None) -> bool {
    print(f"Sending email to: {to}");
    print(f"Subject: {subject}");
    print(f"Body: {body}");

    if cc is not None {
        print(f"CC: {', '.join(cc)}");
    }

    if bcc is not None {
        print(f"BCC: {', '.join(bcc)}");
    }

    return True;
}

# Mutable default parameters (safer approach)
def add_to_list(item: str, target_list: list[str] | None = None) -> list[str] {
    if target_list is None {
        target_list = [];
    }
    target_list.append(item);
    return target_list;
}

with entry {
    send_email("Ninja", "Learning OSP", "Hi! I am Learning OSP", ["Tommy","Cap"]);
    print(add_to_list("Cherry",["Apple", "Banana"]));
}
```
</div>

## Decorators in Jac Context

<!-- ### Built-in Decorators

Jac provides several useful built-in decorators:

<div class="code-block">

```jac
# Timing decorator
@time
def slow_operation(n: int) -> int {
    total = 0;
    for i in range(n) {
        total += i * i;
    }
    return total;
}

# Cache decorator for memoization
@cache
def fibonacci(n: int) -> int {
    if n <= 1 {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

# Logging decorator
@log
def important_function(data: dict[str, any]) -> str {
    return f"Processed: {data}";
}
```
</div> -->

### Custom Decorators

Create your own decorators for cross-cutting concerns:

<div class="code-block">

```jac
import random;

# Validation decorator
def validate_positive(func: callable) -> callable {
    def wrapper(*args: any, **kwargs: any) -> any {
        for arg in args {
            if isinstance(arg, (int, float)) and arg < 0 {
                raise ValueError("All numeric arguments must be positive");
            }
        }
        return func(*args, **kwargs);
    }
    return wrapper;
}

# Retry decorator
def retry(max_attempts: int = 3) -> callable {
    def decorator(func: callable) -> callable {
        def wrapper(*args: any, **kwargs: any) -> any {
            last_exception = None;
            for attempt in range(max_attempts) {
                try {
                    return func(*args, **kwargs);
                } except Exception as e {
                    last_exception = e;
                    if attempt < max_attempts - 1 {
                        print(f"Attempt {attempt + 1} failed, retrying...");
                    }
                }
            }
            raise last_exception;
        }
        return wrapper;
    }
    return decorator;
}

# Using custom decorators
@validate_positive
def calculate_square_root(number: float) -> float {
    return number ** 0.5;
}

@retry(max_attempts=5)
def unreliable_network_call() -> str {
    if random.random() < 0.7 {
        raise ConnectionError("Network error");
    }
    return "Success!";
}

with entry {
    print(calculate_square_root(9));
    print(unreliable_network_call());
}
```
</div>

### Method Decorators

Decorators for object methods:

<div class="code-block">

```jac
obj BankAccount {
    has balance: float = 0.0;
    has is_frozen: bool = False;

    @property
    def balance_str() -> str {
        return f"${self.balance:.2f}";
    }

    @requires_unfrozen
    def deposit(amount: float) -> None;

    @requires_unfrozen
    @validate_positive
    def withdraw(amount: float) -> bool;
}

def requires_unfrozen(func: callable) -> callable {
    def wrapper(self, *args: any, **kwargs: any) -> any {
        if self.is_frozen {
            raise ValueError("Account is frozen");
        }
        return func(self, *args, **kwargs);
    }
    return wrapper;
}

impl BankAccount.deposit(amount: float) -> None {
    self.balance += amount;
}

impl BankAccount.withdraw(amount: float) -> bool {
    if amount > self.balance {
        return False;
    }
    self.balance -= amount;
    return True;
}
```
</div>

## Lambda Functions and Functional Programming

### Lambda Expressions

Create anonymous functions for short operations:

<div class="code-block">

```jac
with entry {
    # Basic lambda functions
    is_even = lambda n:int: n % 2 == 0;

    # Using lambdas with collections
    numbers = [1, 2, 3, 4, 5];
    squared = list(map(lambda x:int: x * x, numbers));
    print(squared);
    even_list = list(map(is_even, numbers));
    print(even_list);
}
```
</div>

### Higher-Order Functions

Functions that take or return other functions:

<div class="code-block">

```jac
# Function that takes a function as parameter
def apply_to_list(items: list[int], func: callable[[int], int]) -> list[int] {
    return [func(item) for item in items];
}

# Function that returns a function
def create_validator(min_value: int, max_value: int) -> callable[[int], bool] {
    return lambda x:int: min_value <= x <= max_value;
}

# Curried functions
def multiply(a: int) -> callable[[int], int] {
    return lambda b:int : a * b;
}

# Function composition
def compose(f: callable, g: callable) -> callable {
    return lambda x:any: f(g(x));
}

with entry {
    # Using higher-order functions
    numbers = [1, 2, 3, 4, 5];
    doubled = apply_to_list(numbers, lambda x:int: x * 2);
    print(doubled);

    # Using curried function
    double = multiply(2);
    triple = multiply(3);

    # Function composition
    add_one = lambda x:int: x + 1;
    square = lambda x:int: x * x;
    add_one_then_square = compose(square, add_one);
    print(add_one_then_square(4));

    result = add_one_then_square(5);  # (5 + 1)^2 = 36
    print(result);
}
```
</div>

### Functional Utilities

Build a library of functional programming utilities:

<div class="code-block">

```jac
# Functional utility functions
def partial(func: callable, *partial_args: any) -> callable {
    def wrapper(*args: any, **kwargs: any) -> any {
        return func(*partial_args, *args, **kwargs);
    }
    return wrapper;
}

def pipes(*functions: callable) -> callable {
    def pipeline(initial_value: any) -> any {
        result = initial_value;
        for func in functions {
            result = func(result);
        }
        return result;
    }
    return pipeline;
}

def memoize(func: callable) -> callable {
    cache: dict[any, any] = {};

    def wrapper(*args: any) -> any {
        key = str(args);  # Simple key generation
        if key not in cache {
            cache[key] = func(*args);
        }
        return cache[key];
    }
    return wrapper;
}

# Using functional utilities
def expensive_calculation(n: int) -> int {
    # Simulate expensive operation
    result = 0;
    for i in range(n) {
        result += i * i;
    }
    return result;
}

with entry {
    cached_calculation = memoize(expensive_calculation);
    print("Result of cached calculation:", cached_calculation(10));

    # Create a data processing pipeline
    process_data = pipes(
        lambda data:callable: [x for x in data if x > 0],  # Filter positive
        lambda data:callable: [x * 2 for x in data],       # Double values
        lambda data:callable: sorted(data),                 # Sort
        lambda data:callable: data[:5]                      # Take first 5
    );
    sample_data = [-10, 5, 3, -2, 8, 0, 1];
    print("Processed data pipeline result:", process_data(sample_data));
}
```
</div>

## Code Example: Data Validation System

Let's build a comprehensive validation system using functions and decorators:

<div class="code-block">

```jac
# Validation result types
obj ValidationResult {
    has is_valid: bool,
    errors: list[str] = [];

    def add_error(error: str) -> None;
    def combine(other: ValidationResult) -> ValidationResult;
}

impl ValidationResult.add_error(error: str) -> None {
    self.errors.append(error);
    self.is_valid = False;
}

impl ValidationResult.combine(other: ValidationResult) -> ValidationResult {
    combined = ValidationResult(
        is_valid=self.is_valid and other.is_valid,
        errors=self.errors + other.errors
    );
    return combined;
}

# Validator function type
type Validator[T] = callable[[T], ValidationResult];

# Basic validators
def required[T](value: T?) -> ValidationResult {
    if value is None {
        return ValidationResult(is_valid=False, errors=["Field is required"]);
    }
    return ValidationResult(is_valid=True);
}

def min_length(min_len: int) -> Validator[str] {
    def validator(value: str) -> ValidationResult {
        if len(value) < min_len {
            return ValidationResult(
                is_valid=False,
                errors=[f"Must be at least {min_len} characters long"]
            );
        }
        return ValidationResult(is_valid=True);
    }
    return validator;
}

def max_length(max_len: int) -> Validator[str] {
    def validator(value: str) -> ValidationResult {
        if len(value) > max_len {
            return ValidationResult(
                is_valid=False,
                errors=[f"Must be no more than {max_len} characters long"]
            );
        }
        return ValidationResult(is_valid=True);
    }
    return validator;
}

def email_format(value: str) -> ValidationResult {
    if "@" not in value or "." not in value {
        return ValidationResult(
            is_valid=False,
            errors=["Invalid email format"]
        );
    }
    return ValidationResult(is_valid=True);
}

def numeric_range(min_val: float, max_val: float) -> Validator[float] {
    def validator(value: float) -> ValidationResult {
        if value < min_val or value > max_val {
            return ValidationResult(
                is_valid=False,
                errors=[f"Must be between {min_val} and {max_val}"]
            );
        }
        return ValidationResult(is_valid=True);
    }
    return validator;
}

# Validation combinator
def combine_validators[T](*validators: Validator[T]) -> Validator[T] {
    def combined_validator(value: T) -> ValidationResult {
        result = ValidationResult(is_valid=True);
        for validator in validators {
            validation_result = validator(value);
            result = result.combine(validation_result);
        }
        return result;
    }
    return combined_validator;
}

# Field validation decorator
def validate_field(field_name: str, validator: Validator) -> callable {
    def decorator(func: callable) -> callable {
        def wrapper(self, *args: any, **kwargs: any) -> any {
            field_value = getattr(self, field_name, None);
            validation_result = validator(field_value);

            if not validation_result.is_valid {
                error_msg = f"Validation failed for {field_name}: {', '.join(validation_result.errors)}";
                raise ValueError(error_msg);
            }

            return func(self, *args, **kwargs);
        }
        return wrapper;
    }
    return decorator;
}

# User model with validation
obj User {
    has name: str?,
    email: str?,
    age: float?,
    password: str?;

    def validate() -> ValidationResult;

    @validate_field("email", combine_validators(required, email_format))
    def send_welcome_email() -> None;

    @validate_field("age", combine_validators(required, numeric_range(13.0, 120.0)))
    def calculate_category() -> str;
}

impl User.validate() -> ValidationResult {
    result = ValidationResult(is_valid=True);

    # Validate name
    name_validator = combine_validators(required, min_length(2), max_length(50));
    result = result.combine(name_validator(self.name));

    # Validate email
    email_validator = combine_validators(required, email_format);
    result = result.combine(email_validator(self.email));

    # Validate age
    age_validator = combine_validators(required, numeric_range(13.0, 120.0));
    result = result.combine(age_validator(self.age));

    # Validate password
    password_validator = combine_validators(required, min_length(8));
    result = result.combine(password_validator(self.password));

    return result;
}

impl User.send_welcome_email() -> None {
    print(f"Welcome email sent to {self.email}!");
}

impl User.calculate_category() -> str {
    if self.age < 18.0 {
        return "Minor";
    } elif self.age < 65.0 {
        return "Adult";
    } else {
        return "Senior";
    }
}

# Utility functions for user management
def create_valid_user(name: str, email: str, age: float, password: str) -> User | None {
    user = User(name=name, email=email, age=age, password=password);
    validation_result = user.validate();

    if validation_result.is_valid {
        return user;
    } else {
        print("User creation failed:");
        for error in validation_result.errors {
            print(f"  - {error}");
        }
        return None;
    }
}

def process_user_batch(user_data: list[dict[str, any]]) -> list[User] {
    valid_users: list[User] = [];

    create_user_func = lambda data: create_valid_user(
        data.get("name", ""),
        data.get("email", ""),
        data.get("age", 0.0),
        data.get("password", "")
    );

    for data in user_data {
        user = create_user_func(data);
        if user is not None {
            valid_users.append(user);
        }
    }

    return valid_users;
}

with entry {
    # Test validation system
    test_users = [
        {"name": "Alice Johnson", "email": "alice@example.com", "age": 25.0, "password": "secure123"},
        {"name": "B", "email": "invalid-email", "age": 15.0, "password": "123"},  # Invalid
        {"name": "Charlie Brown", "email": "charlie@test.com", "age": 30.0, "password": "password123"}
    ];

    valid_users = process_user_batch(test_users);

    print(f"Created {len(valid_users)} valid users:");
    for user in valid_users {
        print(f"  - {user.name} ({user.email})");
        print(f"    Category: {user.calculate_category()}");
    }
}
```
</div>

## Key Takeaways

1. **Type Safety**: All function parameters and returns require type annotations
2. **Decorators**: Powerful tool for cross-cutting concerns and code reuse
3. **Higher-Order Functions**: Functions as first-class citizens enable powerful abstractions
4. **Lambda Functions**: Concise syntax for simple anonymous functions
5. **Functional Programming**: Jac supports functional paradigms alongside OOP
6. **Validation**: Use function composition to build complex validation systems
7. **Code Reuse**: Decorators and higher-order functions promote DRY principles

In the next chapter, we'll explore Jac's import system and module organization.
