"""Comprehensive class/object tests covering various patterns."""

# Basic object with fields
obj Person {
    has name: str;
    has age: int = 0;
}

# Object with multiple typed fields
obj Employee {
    has name: str = "Unknown";
    has salary: int = 50000;
    has department: str = "General";
    has is_active: bool = True;
}

# Object with methods
obj Calculator {
    has value: float = 0.0;

    def add(x: float) -> float {
        self.value += x;
        return self.value;
    }

    def subtract(x: float) -> float {
        self.value -= x;
        return self.value;
    }

    def reset {
        self.value = 0.0;
    }

    def get_value -> float {
        return self.value;
    }
}

# Object with static method
obj MathUtils {
    static def square(x: int) -> int {
        return x * x;
    }

    static def cube(x: int) -> int {
        return x * x * x;
    }
}

# Inheritance
obj Student(Person) {
    has student_id: int = 0;
    has gpa: float = 0.0;

    def get_info -> str {
        return self.name + " (" + str(self.student_id) + ")";
    }
}

# Object with init-like constructor method
obj Point {
    has x: float = 0.0;
    has y: float = 0.0;

    def distance_from_origin -> float {
        return (self.x ** 2 + self.y ** 2) ** 0.5;
    }
}

# Object with class-level attribute
obj Counter {
    has count: int = 0;

    def increment {
        self.count += 1;
    }
}

# Object with simple methods
obj Circle {
    has radius: float = 1.0;

    def area -> float {
        return 3.14159 * self.radius * self.radius;
    }

    def circumference -> float {
        return 2 * 3.14159 * self.radius;
    }
}

# Object with complex methods
obj DataProcessor {
    has items: list = [];

    def add_item(item: object) {
        self.items.append(item);
    }

    def filter_items(threshold: int) -> list {
        result = [];
        for item in self.items {
            if item > threshold {
                result.append(item);
            }
        }
        return result;
    }

    def clear {
        self.items = [];
    }
}

# Object with property-style getters/setters
obj Temperature {
    has celsius: float = 0.0;

    def get_fahrenheit -> float {
        return self.celsius * 9.0 / 5.0 + 32.0;
    }

    def set_from_fahrenheit(f: float) {
        self.celsius = (f - 32.0) * 5.0 / 9.0;
    }
}
