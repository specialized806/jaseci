# Chapter 17: Type System Deep Dive

In this chapter, we'll explore Jac's advanced type system that provides powerful generic programming capabilities, type constraints, and graph-aware type checking. We'll build a generic data processing system that demonstrates type safety, constraints, and runtime validation through practical examples.

!!! info "What You'll Learn"
    - Advanced generic programming with type parameters
    - Type constraints and bounded generics
    - Graph-aware type checking for nodes and edges
    - Runtime type validation and error handling
    - Building type-safe, reusable components

---

## Advanced Generics

Jac's type system goes beyond basic generics to provide powerful type parameterization that works seamlessly with Object-Spatial Programming. This enables building highly reusable and type-safe components.

!!! success "Generic Programming Benefits"
    - **Type Safety**: Catch type errors at compile time
    - **Code Reuse**: Write once, use with multiple types
    - **Performance**: No runtime type boxing/unboxing overhead
    - **Documentation**: Types serve as self-documenting contracts
    - **Graph Integration**: Generics work with nodes, edges, and walkers

### Traditional vs Jac Generics

!!! example "Generic Programming Comparison"
    === "Traditional Approach"
        ```python
        # data_processor.py - Limited generic support
        from typing import TypeVar, Generic, List, Optional, Protocol

        T = TypeVar('T')
        U = TypeVar('U')

        class Processor(Generic[T]):
            def __init__(self):
                self.items: List[T] = []

            def add(self, item: T) -> None:
                self.items.append(item)

            def process_all(self, func) -> List[T]:
                # Limited type checking for func parameter
                return [func(item) for item in self.items]

            def find(self, predicate) -> Optional[T]:
                for item in self.items:
                    if predicate(item):
                        return item
                return None

        # Usage requires explicit type annotations
        processor: Processor[int] = Processor()
        processor.add(42)
        processor.add("string")  # Runtime error, not caught at type check
        ```

    === "Jac Advanced Generics"
        <div class="code-block">
        ```jac
        # data_processor.jac - Advanced type-safe generics
        obj DataProcessor[T] {
            has items: list[T] = [];

            can add(item: T) -> None {
                self.items.append(item);
            }

            can process_all[U](func: (T) -> U) -> list[U] {
                return [func(item) for item in self.items];
            }

            can find(predicate: (T) -> bool) -> T | None {
                for item in self.items {
                    if predicate(item) {
                        return item;
                    }
                }
                return None;
            }

            can filter_by_type[U](target_type: type[U]) -> list[U] {
                return [item for item in self.items if isinstance(item, target_type)];
            }
        }

        with entry {
            # Type inference works automatically
            processor = DataProcessor[int]();
            processor.add(42);
            processor.add(24);

            # Type-safe operations
            doubled = processor.process_all((x: int) -> int => x * 2);
            print(f"Doubled: {doubled}");
        }
        ```
        </div>

---

## Type Constraints

Type constraints allow you to specify requirements that generic type parameters must satisfy, enabling more precise and safe generic programming.

### Basic Type Constraints

!!! example "Constrained Generic Processor"
    === "Jac"
        <div class="code-block">
        ```jac
        # constrained_processor.jac
        # Define a protocol for comparable types
        trait Comparable {
            can compare_to(other: Self) -> int;
        }

        # Constrained generic that only accepts comparable types
        obj SortedProcessor[T: Comparable] {
            has items: list[T] = [];

            can add(item: T) -> None {
                self.items.append(item);
                self.sort_items();
            }

            can sort_items() -> None {
                # Can use compare_to because T implements Comparable
                self.items.sort(key=lambda x: x);
            }

            can get_min() -> T | None {
                return self.items[0] if self.items else None;
            }

            can get_max() -> T | None {
                return self.items[-1] if self.items else None;
            }
        }

        # Implement Comparable for custom types
        obj Score {
            has value: int;
            has player: str;

            can compare_to(other: Score) -> int {
                return self.value - other.value;
            }
        }

        with entry {
            # Type constraint ensures only comparable types can be used
            score_processor = SortedProcessor[Score]();

            score_processor.add(Score(value=85, player="Alice"));
            score_processor.add(Score(value=92, player="Bob"));
            score_processor.add(Score(value=78, player="Charlie"));

            min_score = score_processor.get_min();
            max_score = score_processor.get_max();

            print(f"Lowest score: {min_score.player} - {min_score.value}");
            print(f"Highest score: {max_score.player} - {max_score.value}");
        }
        ```
        </div>

    === "Python Equivalent"
        ```python
        # constrained_processor.py - Complex protocol setup
        from typing import TypeVar, Generic, List, Optional, Protocol
        from abc import abstractmethod

        class Comparable(Protocol):
            @abstractmethod
            def compare_to(self, other: 'Comparable') -> int:
                pass

        T = TypeVar('T', bound=Comparable)

        class SortedProcessor(Generic[T]):
            def __init__(self):
                self.items: List[T] = []

            def add(self, item: T) -> None:
                self.items.append(item)
                self.sort_items()

            def sort_items(self) -> None:
                self.items.sort(key=lambda x: x.compare_to)

            def get_min(self) -> Optional[T]:
                return self.items[0] if self.items else None

            def get_max(self) -> Optional[T]:
                return self.items[-1] if self.items else None

        class Score:
            def __init__(self, value: int, player: str):
                self.value = value
                self.player = player

            def compare_to(self, other: 'Score') -> int:
                return self.value - other.value

        # Usage
        processor = SortedProcessor[Score]()
        processor.add(Score(85, "Alice"))
        # ... rest of implementation
        ```

### Multiple Type Constraints

!!! example "Multi-Constraint Generic"
    <div class="code-block">
    ```jac
    # multi_constraint.jac
    trait Serializable {
        can to_json() -> dict;
    }

    trait Cacheable {
        can get_cache_key() -> str;
    }

    # Multiple constraints using intersection types
    obj CachedProcessor[T: Comparable & Serializable & Cacheable] {
        has items: list[T] = [];
        has cache: dict[str, T] = {};

        can add_with_cache(item: T) -> None {
            cache_key = item.get_cache_key();

            if cache_key not in self.cache {
                self.items.append(item);
                self.cache[cache_key] = item;
            }
        }

        can export_to_json() -> list[dict] {
            return [item.to_json() for item in self.items];
        }

        can get_sorted_cache_keys() -> list[str] {
            sorted_items = sorted(self.items, key=lambda x: x);
            return [item.get_cache_key() for item in sorted_items];
        }
    }

    obj Product {
        has name: str;
        has price: float;
        has id: str;

        can compare_to(other: Product) -> int {
            return int((self.price - other.price) * 100);
        }

        can to_json() -> dict {
            return {"name": self.name, "price": self.price, "id": self.id};
        }

        can get_cache_key() -> str {
            return f"product_{self.id}";
        }
    }

    with entry {
        processor = CachedProcessor[Product]();

        processor.add_with_cache(Product(name="Laptop", price=999.99, id="1"));
        processor.add_with_cache(Product(name="Mouse", price=29.99, id="2"));

        json_data = processor.export_to_json();
        cache_keys = processor.get_sorted_cache_keys();

        print(f"Exported products: {len(json_data)}");
        print(f"Cache keys: {cache_keys}");
    }
    ```
    </div>

---

## Graph Type Checking

Jac's type system extends to Object-Spatial Programming constructs, providing compile-time guarantees about graph structure and walker behavior.

### Node and Edge Type Safety

!!! example "Type-Safe Graph Operations"
    <div class="code-block">
    ```jac
    # graph_types.jac
    # Define specific node types with constraints
    node Person {
        has name: str;
        has age: int;
    }

    node Company {
        has name: str;
        has industry: str;
    }

    # Type-safe edge definitions
    edge WorksAt {
        has position: str;
        has start_date: str;
    }

    edge FriendsWith {
        has since: str;
    }

    # Generic walker with type constraints
    walker FindConnections[NodeType, EdgeType] {
        has target_node: NodeType;
        has max_depth: int = 2;
        has found_connections: list[NodeType] = [];

        can traverse_graph with NodeType entry {
            if self.max_depth > 0 {
                # Type-safe edge traversal
                connected_nodes = [here --EdgeType--> NodeType];

                for node in connected_nodes {
                    if node not in self.found_connections {
                        self.found_connections.append(node);

                        # Recursive traversal with decremented depth
                        sub_walker = FindConnections[NodeType, EdgeType](
                            target_node=node,
                            max_depth=self.max_depth - 1
                        );
                        sub_walker spawn node;
                    }
                }
            }

            report self.found_connections;
        }
    }

    with entry {
        # Create typed graph structure
        alice = Person(name="Alice", age=30);
        bob = Person(name="Bob", age=25);
        tech_corp = Company(name="TechCorp", industry="Technology");

        # Type-safe connections
        alice +:WorksAt:position="Engineer",start_date="2023-01":+> tech_corp;
        alice +:FriendsWith:since="2020":+> bob;

        # Type-safe walker spawning
        person_finder = FindConnections[Person, FriendsWith](target_node=alice);
        friends = person_finder spawn alice;

        print(f"Found {len(friends)} friends");
    }
    ```
    </div>

### Walker Type Validation

!!! example "Type-Safe Walker Patterns"
    <div class="code-block">
    ```jac
    # walker_validation.jac
    # Generic validator walker
    walker DataValidator[T] {
        has validation_rules: list[(T) -> bool] = [];
        has validated_items: list[T] = [];
        has failed_items: list[T] = [];

        can add_rule(rule: (T) -> bool) -> None {
            self.validation_rules.append(rule);
        }

        can validate_item(item: T) -> bool {
            for rule in self.validation_rules {
                if not rule(item) {
                    self.failed_items.append(item);
                    return False;
                }
            }
            self.validated_items.append(item);
            return True;
        }

        can get_validation_report() -> dict {
            return {
                "total_validated": len(self.validated_items),
                "total_failed": len(self.failed_items),
                "success_rate": len(self.validated_items) /
                               (len(self.validated_items) + len(self.failed_items))
                               if (len(self.validated_items) + len(self.failed_items)) > 0 else 0
            };
        }
    }

    obj User {
        has email: str;
        has age: int;
        has username: str;
    }

    with entry {
        # Create type-specific validator
        user_validator = DataValidator[User]();

        # Add type-safe validation rules
        user_validator.add_rule(lambda user: "@" in user.email);
        user_validator.add_rule(lambda user: user.age >= 18);
        user_validator.add_rule(lambda user: len(user.username) >= 3);

        # Test data
        users = [
            User(email="alice@test.com", age=25, username="alice"),
            User(email="invalid-email", age=17, username="b"),
            User(email="bob@test.com", age=30, username="bob123")
        ];

        # Validate all users
        for user in users {
            is_valid = user_validator.validate_item(user);
            print(f"User {user.username}: {'Valid' if is_valid else 'Invalid'}");
        }

        # Get validation report
        report = user_validator.get_validation_report();
        print(f"Validation complete: {report}");
    }
    ```
    </div>

---

## Runtime Type Validation

Jac provides powerful runtime type checking capabilities that complement compile-time type safety, enabling robust error handling and dynamic type validation.

### Dynamic Type Checking

!!! example "Runtime Type Validation System"
    <div class="code-block">
    ```jac
    # runtime_validation.jac
    import from typing { Any }

    obj TypeChecker[T] {
        has expected_type: type[T];
        has strict_mode: bool = True;

        can validate(value: Any) -> T | None {
            try {
                if isinstance(value, self.expected_type) {
                    return value;
                } elif not self.strict_mode {
                    # Attempt type conversion
                    return self.try_convert(value);
                } else {
                    return None;
                }
            } except Exception as e {
                print(f"Type validation error: {e}");
                return None;
            }
        }

        can try_convert(value: Any) -> T | None {
            try {
                if self.expected_type == int {
                    return int(value);
                } elif self.expected_type == float {
                    return float(value);
                } elif self.expected_type == str {
                    return str(value);
                } else {
                    return None;
                }
            } except (ValueError, TypeError) {
                return None;
            }
        }

        can validate_collection(values: list[Any]) -> list[T] {
            validated = [];
            for value in values {
                validated_value = self.validate(value);
                if validated_value is not None {
                    validated.append(validated_value);
                }
            }
            return validated;
        }
    }

    # Type-safe data processor with runtime validation
    obj SafeDataProcessor[T] {
        has type_checker: TypeChecker[T];
        has validated_data: list[T] = [];
        has rejected_data: list[Any] = [];

        can process_input(raw_data: list[Any]) -> dict {
            for item in raw_data {
                validated = self.type_checker.validate(item);
                if validated is not None {
                    self.validated_data.append(validated);
                } else {
                    self.rejected_data.append(item);
                }
            }

            return {
                "processed": len(self.validated_data),
                "rejected": len(self.rejected_data),
                "success_rate": len(self.validated_data) / len(raw_data) if raw_data else 0
            };
        }

        can get_typed_data() -> list[T] {
            return self.validated_data;
        }
    }

    with entry {
        # Create processors for different types
        int_processor = SafeDataProcessor[int](
            type_checker=TypeChecker[int](expected_type=int, strict_mode=False)
        );

        string_processor = SafeDataProcessor[str](
            type_checker=TypeChecker[str](expected_type=str, strict_mode=True)
        );

        # Mixed input data
        mixed_data = [42, "hello", 3.14, "world", True, None, "123"];

        # Process with type validation
        int_result = int_processor.process_input(mixed_data);
        str_result = string_processor.process_input(mixed_data);

        print(f"Integer processing: {int_result}");
        print(f"String processing: {str_result}");
        print(f"Valid integers: {int_processor.get_typed_data()}");
        print(f"Valid strings: {string_processor.get_typed_data()}");
    }
    ```
    </div>

### Type Guards and Assertions

!!! example "Advanced Type Guards"
    <div class="code-block">
    ```jac
    # type_guards.jac
    # Type guard functions for complex validation
    def is_valid_email(value: Any) -> bool {
        return isinstance(value, str) and "@" in value and "." in value;
    }

    def is_positive_number(value: Any) -> bool {
        return isinstance(value, (int, float)) and value > 0;
    }

    def is_non_empty_string(value: Any) -> bool {
        return isinstance(value, str) and len(value.strip()) > 0;
    }

    # Generic validator with type guards
    obj GuardedValidator[T] {
        has type_guards: list[(Any) -> bool] = [];
        has error_messages: list[str] = [];

        can add_guard(guard: (Any) -> bool, message: str = "Validation failed") -> None {
            self.type_guards.append(guard);
            self.error_messages.append(message);
        }

        can validate_with_guards(value: Any) -> tuple[bool, list[str]] {
            errors = [];

            for i, guard in enumerate(self.type_guards) {
                if not guard(value) {
                    errors.append(self.error_messages[i]);
                }
            }

            return (len(errors) == 0, errors);
        }

        can assert_valid(value: Any) -> T {
            is_valid, errors = self.validate_with_guards(value);

            if not is_valid {
                error_msg = f"Validation failed: {', '.join(errors)}";
                raise ValueError(error_msg);
            }

            return value;
        }
    }

    with entry {
        # Create email validator with multiple guards
        email_validator = GuardedValidator[str]();
        email_validator.add_guard(is_valid_email, "Invalid email format");
        email_validator.add_guard(is_non_empty_string, "Email cannot be empty");

        # Create number validator
        number_validator = GuardedValidator[float]();
        number_validator.add_guard(is_positive_number, "Number must be positive");

        # Test validation
        test_emails = ["user@example.com", "invalid-email", "", None];
        test_numbers = [42.5, -10, 0, "not-a-number"];

        for email in test_emails {
            is_valid, errors = email_validator.validate_with_guards(email);
            print(f"Email '{email}': {'Valid' if is_valid else f'Invalid - {errors}'}");
        }

        for number in test_numbers {
            is_valid, errors = number_validator.validate_with_guards(number);
            print(f"Number '{number}': {'Valid' if is_valid else f'Invalid - {errors}'}");
        }
    }
    ```
    </div>

---

## Best Practices

!!! summary "Type System Guidelines"
    - **Use constraints wisely**: Apply type constraints to ensure safety without over-restricting
    - **Leverage inference**: Let Jac infer types where possible while maintaining clarity
    - **Design for reuse**: Create generic components that work across multiple types
    - **Validate at boundaries**: Use runtime validation for external data inputs
    - **Document type relationships**: Make type constraints and relationships clear
    - **Test with multiple types**: Verify generic code works with different type parameters

## Key Takeaways

!!! summary "What We've Learned"
    **Advanced Type Features:**

    - **Generic programming**: Type-safe parameterization for reusable components
    - **Type constraints**: Bounded generics ensure type requirements are met
    - **Graph-aware types**: Compile-time safety for spatial programming constructs
    - **Runtime validation**: Dynamic type checking complements static analysis

    **Practical Applications:**

    - **Reusable components**: Build libraries that work with multiple data types
    - **Safe graph operations**: Prevent type errors in node and edge relationships
    - **Data validation**: Robust input validation with clear error messages
    - **Performance optimization**: Type information enables compiler optimizations

    **Development Benefits:**

    - **Early error detection**: Catch type mismatches at compile time
    - **Better documentation**: Types serve as executable documentation
    - **IDE support**: Enhanced autocomplete and error highlighting
    - **Refactoring safety**: Type system prevents breaking changes

    **Advanced Features:**

    - **Multiple constraints**: Intersection types for complex requirements
    - **Type guards**: Runtime validation patterns for dynamic typing
    - **Generic walkers**: Type-safe graph traversal patterns
    - **Protocol support**: Interface-based programming with traits

!!! tip "Try It Yourself"
    Master the type system by building:
    - A generic data processing pipeline with multiple constraints
    - Type-safe graph algorithms with proper node/edge typing
    - Runtime validation systems for API endpoints
    - Generic walker patterns for different graph structures

    Remember: Jac's type system catches errors early while enabling powerful generic programming!

---

*Ready to learn about testing and debugging? Continue to [Chapter 18: Testing and Debugging](chapter_18.md)!*
