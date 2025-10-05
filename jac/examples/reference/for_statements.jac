# For Statements - Iteration and looping constructs

# ===== Part 1: Basic For-In Loop (Python-style) =====
with entry {
    print("=== 1. Basic For-In Loop ===");
    # Iterate over string characters
    for char in "Jac" {
        print(f"  char: {char}");
    }

    # Iterate over list
    fruits = ["apple", "banana", "cherry"];
    for fruit in fruits {
        print(f"  fruit: {fruit}");
    }
}

# ===== Part 2: For-In with Range =====
with entry {
    print("\n=== 2. For-In with Range ===");

    # Range with start and stop
    for i in range(3, 7) {
        print(f"  i = {i}");
    }

    # Range with start, stop, step
    for j in range(0, 10, 2) {
        print(f"  j = {j}");
    }

    # Range with just stop (starts at 0)
    for k in range(5) {
        print(f"  k = {k}");
    }
}

# ===== Part 3: For-To-By Loop (Jac-specific C-style) =====
with entry {
    print("\n=== 3. For-To-By Loop (Jac-specific) ===");

    # Basic to-by loop
    for i=0 to i<5 by i+=1 {
        print(f"  i = {i}");
    }

    # Counting down
    for j=10 to j>5 by j-=1 {
        print(f"  j = {j}");
    }

    # Step by 2
    for k=0 to k<10 by k+=2 {
        print(f"  k = {k}");
    }
}

# ===== Part 4: For with Break =====
with entry {
    print("\n=== 4. For with Break ===");

    for num in range(10) {
        if num == 5 {
            print(f"  Breaking at {num}");
            break;
        }
        print(f"  num = {num}");
    }
}

# ===== Part 5: For with Continue =====
with entry {
    print("\n=== 5. For with Continue ===");

    for num in range(10) {
        if num % 2 == 0 {
            continue;  # Skip even numbers
        }
        print(f"  odd: {num}");
    }
}

# ===== Part 6: For with Else Clause =====
with entry {
    print("\n=== 6. For with Else Clause ===");

    # Else executes when loop completes normally
    for x in [1, 2, 3] {
        print(f"  x = {x}");
    } else {
        print("  Loop completed normally");
    }

    # Else doesn't execute when break is used
    for num in range(10) {
        if num == 3 {
            print("  Breaking at 3");
            break;
        }
        print(f"  num = {num}");
    } else {
        print("  This won't print due to break");
    }
}

# ===== Part 7: Nested For Loops =====
with entry {
    print("\n=== 7. Nested For Loops ===");

    # Classic nested loops
    for i in range(3) {
        for j in range(2) {
            print(f"  i={i}, j={j}");
        }
    }

    # Mix for-in and for-to-by
    for i in ["a", "b"] {
        for j=0 to j<2 by j+=1 {
            print(f"  {i}{j}");
        }
    }
}

# ===== Part 8: For with Tuple Access =====
with entry {
    print("\n=== 8. For with Tuple Access ===");

    # Iterate over tuples and access elements
    pairs = [(1, "one"), (2, "two"), (3, "three")];
    for pair in pairs {
        num = pair[0];
        word = pair[1];
        print(f"  {num}: {word}");
    }

    # Nested tuple access
    data = [(1, (10, 20)), (2, (30, 40))];
    for item in data {
        idx = item[0];
        inner = item[1];
        a = inner[0];
        b = inner[1];
        print(f"  idx={idx}, a={a}, b={b}");
    }
}

# ===== Part 9: For with Enumerate =====
with entry {
    print("\n=== 9. For with Enumerate ===");

    items = ["apple", "banana", "cherry"];
    for enum_pair in enumerate(items) {
        idx = enum_pair[0];
        item = enum_pair[1];
        print(f"  {idx}: {item}");
    }

    # Enumerate with start index
    for enum_pair in enumerate(items, start=1) {
        idx = enum_pair[0];
        item = enum_pair[1];
        print(f"  #{idx}: {item}");
    }
}

# ===== Part 10: For with Zip =====
with entry {
    print("\n=== 10. For with Zip ===");

    names = ["Alice", "Bob", "Charlie"];
    ages = [25, 30, 35];

    for zipped in zip(names, ages) {
        name = zipped[0];
        age = zipped[1];
        print(f"  {name} is {age} years old");
    }

    # Zip with three iterables
    scores = [90, 85, 95];
    for zipped in zip(names, ages, scores) {
        name = zipped[0];
        age = zipped[1];
        score = zipped[2];
        print(f"  {name}: age={age}, score={score}");
    }
}

# ===== Part 11: List Comprehensions =====
with entry {
    print("\n=== 11. List Comprehensions ===");

    # Basic comprehension
    squares = [x**2 for x in range(5)];
    print(f"  Squares: {squares}");

    # Comprehension with condition
    evens = [x for x in range(10) if x % 2 == 0];
    print(f"  Evens: {evens}");

    # Comprehension with transformation
    upper = [s.upper() for s in ["hello", "world"]];
    print(f"  Upper: {upper}");

    # Nested comprehension
    pairs = [(x, y) for x in range(3) for y in range(2)];
    print(f"  Pairs: {pairs}");
}

# ===== Part 12: Dictionary Comprehensions =====
with entry {
    print("\n=== 12. Dictionary Comprehensions ===");

    # Basic dict comprehension
    squares_dict = {x: x**2 for x in range(5)};
    print(f"  Squares dict: {squares_dict}");

    # From pairs - manual unpacking
    pairs = [("a", 1), ("b", 2), ("c", 3)];
    mapping = {pair[0]: pair[1] for pair in pairs};
    print(f"  Mapping: {mapping}");

    # With condition
    even_squares = {x: x**2 for x in range(10) if x % 2 == 0};
    print(f"  Even squares: {even_squares}");
}

# ===== Part 13: Set Comprehensions =====
with entry {
    print("\n=== 13. Set Comprehensions ===");

    # Basic set comprehension
    unique_lengths = {len(word) for word in ["apple", "pie", "banana"]};
    print(f"  Unique lengths: {unique_lengths}");

    # Set removes duplicates automatically
    mods = {x % 3 for x in range(10)};
    print(f"  Modulos: {mods}");
}

# ===== Part 14: For in Walker Abilities (OSP) =====
node Task {
    has title: str = "Task";
    has priority: int = 1;
    has completed: bool = False;
}

walker TaskProcessor {
    has processed: list = [];
    has total_priority: int = 0;

    can process_all with `root entry {
        print("\n=== 14. For in Walker Abilities (OSP) ===");
        tasks = [-->];
        for task_node in tasks {
            print(f"  Processing: {task_node.title}");
            self.processed.append(task_node.title);
            self.total_priority += task_node.priority;
        }
        print(f"  Total tasks: {len(self.processed)}");
        print(f"  Total priority: {self.total_priority}");
    }
}

with entry {
    task1 = Task(title="Write code", priority=3);
    task2 = Task(title="Review PR", priority=2);
    task3 = Task(title="Deploy", priority=5);

    root ++> task1;
    root ++> task2;
    root ++> task3;

    root spawn TaskProcessor();
}

# ===== Part 15: For with Edge Iteration (OSP) =====
node Person {
    has name: str = "Person";
    has age: int = 0;
}

edge Friendship {
    has strength: int = 5;
    has years: int = 1;
}

walker NetworkAnalyzer {
    has friend_count: int = 0;
    has total_strength: int = 0;

    can analyze with Person entry {
        print(f"\n=== 15. For with Edge Iteration (OSP) ===");
        print(f"  Analyzing {here.name}'s network:");

        # Get all outgoing edges
        friends = [-->];
        for friend in friends {
            self.friend_count += 1;
            print(f"    Friend: {friend.name}, age: {friend.age}");
        }

        print(f"  Total friends: {self.friend_count}");
        disengage;
    }
}

with entry {
    alice = Person(name="Alice", age=30);
    bob = Person(name="Bob", age=35);
    charlie = Person(name="Charlie", age=28);

    root ++> alice;
    alice ++> bob;
    alice ++> charlie;

    alice spawn NetworkAnalyzer();
}

# ===== Part 16: For in Functions =====
def sum_list(numbers: list) -> int {
    total = 0;
    for num in numbers {
        total += num;
    }
    return total;
}

def find_max(values: list) -> int {
    if len(values) == 0 {
        return 0;
    }

    max_val = values[0];
    for val in values {
        if val > max_val {
            max_val = val;
        }
    }
    return max_val;
}

with entry {
    print("\n=== 16. For in Functions ===");
    nums = [5, 10, 15, 20, 25];
    print(f"  Sum: {sum_list(nums)}");
    print(f"  Max: {find_max(nums)}");
}

# ===== Part 17: For with Dictionary Iteration =====
with entry {
    print("\n=== 17. For with Dictionary Iteration ===");

    config = {"host": "localhost", "port": 8080, "debug": True};

    # Iterate over keys (default)
    print("  Keys:");
    for key in config {
        print(f"    {key}");
    }

    # Iterate over values
    print("  Values:");
    for value in config.values() {
        print(f"    {value}");
    }

    # Iterate over key-value pairs
    print("  Items:");
    for item in config.items() {
        key = item[0];
        value = item[1];
        print(f"    {key}: {value}");
    }
}

# ===== Part 18: For with Conditional Iteration =====
with entry {
    print("\n=== 18. For with Conditional Logic ===");

    # Filter items during iteration
    numbers = [5, 12, 8, 20, 3, 15];
    filtered = [];

    for num in numbers {
        if num > 10 {
            print(f"  Including: {num}");
            filtered.append(num);
        } else {
            print(f"  Skipping: {num}");
        }
    }

    print(f"  Filtered {len(filtered)} numbers: {filtered}");
}

# ===== Part 19: For with String Methods =====
with entry {
    print("\n=== 19. For with String Methods ===");

    text = "Hello World";

    # Iterate over characters
    print("  Characters:");
    for char in text {
        print(f"    '{char}'");
    }

    # Iterate over words (after split)
    print("  Words:");
    for word in text.split() {
        print(f"    {word}");
    }

    # Iterate over lines
    multiline = "Line 1\nLine 2\nLine 3";
    print("  Lines:");
    for line in multiline.split("\n") {
        print(f"    {line}");
    }
}

# ===== Part 20: Performance Patterns =====
with entry {
    print("\n=== 20. Performance Patterns ===");

    # Pre-compute length for efficiency
    items = [10, 20, 30, 40, 50];
    item_count = len(items);
    print(f"  Processing {item_count} items:");

    for i in range(item_count) {
        print(f"    Item {i}: {items[i]}");
    }

    # Use enumerate instead of manual indexing
    print("  Better pattern with enumerate:");
    for enum_pair in enumerate(items) {
        idx = enum_pair[0];
        item = enum_pair[1];
        print(f"    Item {idx}: {item}");
    }
}

with entry {
    print("\n✓ For statements demonstrated!");
}
