# Chapter 4: Data Structures and Collections

Jac provides powerful, type-safe collection types with built-in null safety and functional programming features. This chapter covers lists, dictionaries, sets, tuples, and the pipe operators that make data transformation elegant and safe.

## Lists, Dicts, Sets with Type Safety

### Lists

Lists in Jac are strongly typed and provide comprehensive type checking:

<div class="code-block">

```jac
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

# Safe list access with optional types
def get_first_item(items: list[str]) -> str? {
    if len(items) > 0 {
        return items[0];
    }
    return None;
}
```
</div>

### Dictionaries

Dictionaries require explicit key and value types:

<div class="code-block">

```jac
# Basic dictionary declarations
scores: dict[str, int] = {"Alice": 95, "Bob": 87, "Charlie": 92};
config: dict[str, any] = {"debug": True, "port": 8080, "host": "localhost"};
empty_dict: dict[str, int] = {};

# Dictionary operations
scores["Diana"] = 98;
alice_score = scores.get("Alice", 0);
all_names = list(scores.keys());

# Type-safe dictionary access
def get_config_value(config: dict[str, any], key: str, default: any = None) -> any {
    return config.get(key, default);
}
```
</div>

### Sets

Sets ensure unique elements with type safety:

<div class="code-block">

```jac
# Basic set declarations
unique_numbers: set[int] = {1, 2, 3, 4, 5};
tags: set[str] = {"python", "jac", "programming"};
empty_set: set[str] = set();

# Set operations
unique_numbers.add(6);
unique_numbers.remove(1);
has_python = "python" in tags;
tag_count = len(tags);

# Set operations
def combine_tags(tag_set1: set[str], tag_set2: set[str]) -> set[str] {
    return tag_set1.union(tag_set2);
}
```
</div>

## Tuple Types and Keyword Tuples

### Basic Tuples

Tuples provide immutable, ordered collections with fixed types:

<div class="code-block">

```jac
# Basic tuple types
coordinates: tuple[float, float] = (10.5, 20.3);
rgb_color: tuple[int, int, int] = (255, 128, 0);
person_info: tuple[str, int, bool] = ("Alice", 25, True);

# Tuple unpacking
x, y = coordinates;
red, green, blue = rgb_color;
name, age, is_active = person_info;

# Function returning tuple
def get_name_age(person: dict[str, any]) -> tuple[str, int] {
    return (person["name"], person["age"]);
}
```
</div>

### Named Tuples

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

## Collection Comprehensions with Null-Safety

### List Comprehensions

Jac supports powerful list comprehensions with type safety:

<div class="code-block">

```jac
# Basic list comprehensions
squares = [x * x for x in range(10)];
even_numbers = [x for x in range(20) if x % 2 == 0];
upper_names = [name.upper() for name in ["alice", "bob", "charlie"]];

# Nested comprehensions
matrix = [[i * j for j in range(3)] for i in range(3)];

# Comprehensions with filtering
def filter_positive_numbers(numbers: list[int]) -> list[int] {
    return [n for n in numbers if n > 0];
}

# Safe comprehensions with null checking
def extract_lengths(strings: list[str?]) -> list[int] {
    return [len(s) for s in strings if s is not None];
}
```
</div>

### Dictionary Comprehensions

Create dictionaries functionally:

<div class="code-block">

```jac
# Basic dictionary comprehensions
word_lengths = {word: len(word) for word in ["hello", "world", "jac"]};
squares_dict = {x: x * x for x in range(5)};

# Filtering in dictionary comprehensions
positive_scores = {name: score for name, score in {"Alice": 95, "Bob": -5, "Charlie": 87}.items() if score > 0};

# Complex transformations
def normalize_scores(scores: dict[str, int]) -> dict[str, float] {
    max_score = max(scores.values()) if scores else 1;
    return {name: score / max_score for name, score in scores.items()};
}
```
</div>

### Set Comprehensions

Generate unique collections:

<div class="code-block">

```jac
# Set comprehensions
unique_lengths = {len(word) for word in ["hello", "hi", "world", "jac"]};
even_squares = {x * x for x in range(10) if x % 2 == 0};

# Combining multiple sources
def get_all_characters(words: list[str]) -> set[str] {
    return {char.lower() for word in words for char in word};
}
```
</div>

## Pipe Operators for Data Transformation

### Basic Pipe Operations

The pipe operator `|>` enables functional-style data processing:

<div class="code-block">

```jac
# Basic pipe operations
result = [1, 2, 3, 4, 5] |> sum;
length = "Hello World" |> len;
upper_text = "hello" |> str.upper;

# Chaining operations
processed_numbers = [1, 2, 3, 4, 5]
    |> (lambda x: [n * 2 for n in x])
    |> (lambda x: [n for n in x if n > 4])
    |> sum;
```
</div>

### Data Processing Pipelines

Build complex data transformations:

<div class="code-block">

```jac
# Data processing pipeline
def process_user_data(users: list[dict[str, any]]) -> list[str] {
    return users \
        |> (lambda x: [user for user in x if user.get("active", False)]) \
        |> (lambda x: [user["name"].upper() for user in x if "name" in user]) \
        |> (lambda x: sorted(x));
}

# Functional data transformation
def analyze_scores(scores: list[int]) -> dict[str, float] {
    total = scores |> sum;
    count = scores |> len;
    average = total / count if count > 0 else 0.0;

    return {
        "total": float(total),
        "average": average,
        "max": float(scores |> max) if scores else 0.0,
        "min": float(scores |> min) if scores else 0.0
    };
}
```
</div>

### Custom Pipeline Functions

Create reusable pipeline components:

<div class="code-block">

```jac
def filter_by(predicate: callable) -> callable {
    return lambda items: [item for item in items if predicate(item)];
}

def map_with(transform: callable) -> callable {
    return lambda items: [transform(item) for item in items];
}

def take(n: int) -> callable {
    return lambda items: items[:n];
}

# Using custom pipeline functions
def process_numbers(numbers: list[int]) -> list[int] {
    return numbers \
        |> filter_by(lambda x: x > 0) \
        |> map_with(lambda x: x * 2) \
        |> take(5);
}
```
</div>

## Code Example: Data Processing Pipeline

Let's build a comprehensive data processing system:

<div class="code-block">

```jac
obj Student {
    has name: str,
    age: int,
    grades: list[float],
    is_active: bool = True;

    def get_average() -> float;
    def get_letter_grade() -> str;
}

impl Student.get_average() -> float {
    if len(self.grades) == 0 {
        return 0.0;
    }
    return sum(self.grades) / len(self.grades);
}

impl Student.get_letter_grade() -> str {
    average = self.get_average();
    if average >= 90.0 {
        return "A";
    } elif average >= 80.0 {
        return "B";
    } elif average >= 70.0 {
        return "C";
    } elif average >= 60.0 {
        return "D";
    } else {
        return "F";
    }
}

obj GradeAnalyzer {
    has students: list[Student] = [];

    def add_student(student: Student) -> None;
    def get_active_students() -> list[Student];
    def get_top_performers(n: int = 5) -> list[Student];
    def get_grade_distribution() -> dict[str, int];
    def generate_report() -> dict[str, any];
}

impl GradeAnalyzer.add_student(student: Student) -> None {
    self.students.append(student);
}

impl GradeAnalyzer.get_active_students() -> list[Student] {
    return [s for s in self.students if s.is_active];
}

impl GradeAnalyzer.get_top_performers(n: int = 5) -> list[Student] {
    return self.get_active_students() \
        |> (lambda students: sorted(students, key=lambda s: s.get_average(), reverse=True)) \
        |> (lambda students: students[:n]);
}

impl GradeAnalyzer.get_grade_distribution() -> dict[str, int] {
    grades = [s.get_letter_grade() for s in self.get_active_students()];
    distribution: dict[str, int] = {};

    for grade in grades {
        distribution[grade] = distribution.get(grade, 0) + 1;
    }

    return distribution;
}

impl GradeAnalyzer.generate_report() -> dict[str, any] {
    active_students = self.get_active_students();
    if len(active_students) == 0 {
        return {"error": "No active students"};
    }

    averages = [s.get_average() for s in active_students];

    return {
        "total_students": len(active_students),
        "class_average": sum(averages) / len(averages),
        "highest_average": max(averages),
        "lowest_average": min(averages),
        "grade_distribution": self.get_grade_distribution(),
        "top_performers": [s.name for s in self.get_top_performers(3)]
    };
}

with entry {
    # Create analyzer and add students
    analyzer = GradeAnalyzer();

    # Add sample students
    students_data = [
        ("Alice", 20, [95.0, 87.0, 92.0, 89.0]),
        ("Bob", 19, [78.0, 82.0, 85.0, 79.0]),
        ("Charlie", 21, [92.0, 94.0, 88.0, 96.0]),
        ("Diana", 20, [65.0, 72.0, 68.0, 71.0]),
        ("Eve", 22, [88.0, 91.0, 85.0, 87.0])
    ];

    for name, age, grades in students_data {
        student = Student(name=name, age=age, grades=grades);
        analyzer.add_student(student);
    }

    # Generate and display report
    report = analyzer.generate_report();

    print("=== Grade Analysis Report ===");
    print(f"Total Students: {report['total_students']}");
    print(f"Class Average: {report['class_average']:.2f}");
    print(f"Highest Average: {report['highest_average']:.2f}");
    print(f"Lowest Average: {report['lowest_average']:.2f}");

    print("\nGrade Distribution:");
    for grade, count in report["grade_distribution"].items() {
        print(f"  {grade}: {count} students");
    }

    print(f"\nTop Performers: {', '.join(report['top_performers'])}");
}
```
</div>

## Configuration Management Example

Here's a practical example of using collections for configuration:

<div class="code-block">

```jac
obj ConfigManager {
    has config: dict[str, any] = {};
    has defaults: dict[str, any] = {};

    def load_defaults() -> None;
    def set_value(key: str, value: any) -> None;
    def get_value(key: str) -> any?;
    def get_all_settings() -> dict[str, any];
    def validate_config() -> list[str];
}

impl ConfigManager.load_defaults() -> None {
    self.defaults = {
        "database_host": "localhost",
        "database_port": 5432,
        "api_timeout": 30,
        "max_connections": 100,
        "debug_mode": False,
        "log_level": "INFO"
    };
}

impl ConfigManager.set_value(key: str, value: any) -> None {
    self.config[key] = value;
}

impl ConfigManager.get_value(key: str) -> any? {
    return self.config.get(key, self.defaults.get(key));
}

impl ConfigManager.get_all_settings() -> dict[str, any] {
    # Merge defaults with custom config
    merged = self.defaults.copy();
    merged.update(self.config);
    return merged;
}

impl ConfigManager.validate_config() -> list[str] {
    errors: list[str] = [];
    all_settings = self.get_all_settings();

    # Validate port number
    port = all_settings.get("database_port");
    if not isinstance(port, int) or port < 1 or port > 65535 {
        errors.append("database_port must be between 1 and 65535");
    }

    # Validate timeout
    timeout = all_settings.get("api_timeout");
    if not isinstance(timeout, int) or timeout <= 0 {
        errors.append("api_timeout must be a positive integer");
    }

    # Validate log level
    valid_levels = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"};
    log_level = all_settings.get("log_level");
    if log_level not in valid_levels {
        errors.append(f"log_level must be one of: {', '.join(valid_levels)}");
    }

    return errors;
}

with entry {
    config = ConfigManager();
    config.load_defaults();

    # Override some settings
    config.set_value("database_host", "production-db.company.com");
    config.set_value("debug_mode", True);
    config.set_value("log_level", "DEBUG");

    # Validate configuration
    errors = config.validate_config();
    if errors {
        print("Configuration errors:");
        for error in errors {
            print(f"  - {error}");
        }
    } else {
        print("Configuration is valid!");
        settings = config.get_all_settings();
        for key, value in settings.items() {
            print(f"  {key}: {value}");
        }
    }
}
```
</div>

## Key Takeaways

1. **Type Safety**: All collections require explicit type annotations
2. **Null Safety**: Use optional types and proper null checking
3. **Comprehensions**: Powerful functional collection creation
4. **Pipe Operators**: Enable elegant data transformation pipelines
5. **Immutable Design**: Prefer immutable operations where possible
6. **Error Handling**: Always validate data and handle edge cases
7. **Performance**: Choose appropriate collection types for your use case

In the next chapter, we'll explore functions, decorators, and functional programming patterns in Jac.
