# Chapter 13: Persistence and the Root Node

In this chapter, we'll explore Jac's revolutionary automatic persistence system and the fundamental concept of the root node. We'll build a simple counter application that demonstrates how Jac automatically maintains state between program runs without any database configuration.

!!! info "What You'll Learn"
    - Understanding Jac's automatic persistence mechanism
    - The root node as the entry point for all persistent data
    - State consistency across program executions
    - Building stateful applications without manual database setup

---

## What is Automatic Persistence?

Traditional programming requires explicit database setup, connection management, and data serialization. Jac eliminates this complexity by making persistence a core language feature. When you create nodes and connect them to your graph, they automatically persist between program runs.

!!! success "Persistence Benefits"
    - **Zero Configuration**: No database setup or connection strings
    - **Automatic State**: Data persists without explicit save/load operations
    - **Graph Integrity**: Relationships between nodes are maintained
    - **Type Safety**: Persistent data maintains type information
    - **Instant Recovery**: Applications resume exactly where they left off

### Traditional vs Jac Persistence

!!! example "Persistence Comparison"
    === "Traditional Approach"
        ```python
        # counter.py - Manual database setup required
        import sqlite3
        import os

        class Counter:
            def __init__(self):
                self.db_path = "counter.db"
                self.init_db()

            def init_db(self):
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS counter (
                        id INTEGER PRIMARY KEY,
                        value INTEGER
                    )
                ''')
                # Initialize counter if not exists
                cursor.execute('SELECT value FROM counter WHERE id = 1')
                if not cursor.fetchone():
                    cursor.execute('INSERT INTO counter (id, value) VALUES (1, 0)')
                conn.commit()
                conn.close()

            def get_value(self):
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute('SELECT value FROM counter WHERE id = 1')
                value = cursor.fetchone()[0]
                conn.close()
                return value

            def increment(self):
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute('UPDATE counter SET value = value + 1 WHERE id = 1')
                conn.commit()
                conn.close()

        if __name__ == "__main__":
            counter = Counter()
            print(f"Current value: {counter.get_value()}")
            counter.increment()
            print(f"After increment: {counter.get_value()}")
        ```

    === "Jac Automatic Persistence"
        <div class="code-block">
        ```jac
        # counter.jac - No database setup needed
        node Counter {
            has value: int = 0;

            def increment() -> int {
                self.value += 1;
                return self.value;
            }

            def get_value() -> int {
                return self.value;
            }
        }

        with entry {
            # Get or create counter from root
            counter_node = [root -->(`?Counter)];

            if not counter_node {
                # Create new counter if none exists
                counter_node = Counter();
                root ++> counter_node;
            } else {
                counter_node = counter_node[0];
            }

            print(f"Current value: {counter_node.get_value()}");
            new_value = counter_node.increment();
            print(f"After increment: {new_value}");
        }
        ```
        </div>

---

## The Root Node Concept

The root node is Jac's fundamental concept for persistent data organization. Every Jac program has access to a special `root` node that serves as the entry point for all persistent graph structures.

### Understanding Root Node

!!! info "Root Node Properties"
    - **Global Access**: Available in every Jac program execution
    - **Persistence Gateway**: Starting point for all persistent data
    - **Graph Anchor**: All persistent nodes must be reachable from root
    - **Automatic Creation**: Exists automatically without explicit declaration

### Basic Counter Implementation

Let's start with the simplest possible counter that remembers its value:

!!! example "Simple Persistent Counter"
    === "Jac"
        <div class="code-block">
        ```jac
        # simple_counter.jac
        node Counter {
            has value: int = 0;
        }

        with entry {
            # Look for existing counter
            existing_counter = [root -->(`?Counter)];

            if existing_counter {
                counter = existing_counter[0];
                print(f"Found existing counter: {counter.value}");
            } else {
                counter = Counter();
                root ++> counter;
                print("Created new counter");
            }

            # Increment and show new value
            counter.value += 1;
            print(f"Counter value: {counter.value}");
        }
        ```
        </div>

    === "Python Equivalent"
        ```python
        # simple_counter.py - Requires manual file I/O
        import json
        import os

        COUNTER_FILE = "counter.json"

        def load_counter():
            if os.path.exists(COUNTER_FILE):
                with open(COUNTER_FILE, 'r') as f:
                    data = json.load(f)
                    print(f"Found existing counter: {data['value']}")
                    return data['value']
            else:
                print("Created new counter")
                return 0

        def save_counter(value):
            with open(COUNTER_FILE, 'w') as f:
                json.dump({"value": value}, f)

        if __name__ == "__main__":
            counter_value = load_counter()
            counter_value += 1
            save_counter(counter_value)
            print(f"Counter value: {counter_value}")
        ```

### Running the Counter

```bash
# First run
jac run simple_counter.jac
# Output: Created new counter
#         Counter value: 1

# Second run
jac run simple_counter.jac
# Output: Found existing counter: 1
#         Counter value: 2

# Third run
jac run simple_counter.jac
# Output: Found existing counter: 2
#         Counter value: 3
```

!!! tip "Automatic Persistence in Action"
    Notice how the counter value persists between runs without any explicit save/load operations!

---

## State Consistency

Jac maintains state consistency through its graph-based persistence model. All connected nodes and their relationships are automatically maintained across program executions.

### Enhanced Counter with History

Let's enhance our counter to track increment history:

!!! example "Counter with History Tracking"
    <div class="code-block">
    ```jac
    # history_counter.jac
    node Counter {
        has created_at: str;
        has value: int = 0;

        def increment() -> int {
            self.value += 1;
            # Create history entry
            history_entry = HistoryEntry(
                timestamp=str(len([root -->(`?HistoryEntry)]) + 1),
                old_value=self.value - 1,
                new_value=self.value
            );
            self ++> history_entry;
            return self.value;
        }

        def get_history() -> list[str] {
            history_nodes = [root -->(`?HistoryEntry)];
            return [f"Step {h.timestamp}: {h.old_value} -> {h.new_value}"
                   for h in history_nodes];
        }
    }

    node HistoryEntry {
        has timestamp: str;
        has old_value: int;
        has new_value: int;
    }

    with entry {
        # Get or create counter
        counter_nodes = [root -->(`?Counter)];

        if counter_nodes {
            counter = counter_nodes[0];
            print(f"Resuming counter at value: {counter.value}");
        } else {
            counter = Counter(created_at="2024-01-15");
            root ++> counter;
            print("Created new counter with history tracking");
        }

        # Perform increment
        new_value = counter.increment();
        print(f"Incremented to: {new_value}");

        # Show history
        history = counter.get_history();
        print("History:");
        for entry in history {
            print(f"  {entry}");
        }
    }
    ```
    </div>

### Multiple Runs Demonstration

```bash
# First run
jac run history_counter.jac
# Output: Created new counter with history tracking
#         Incremented to: 1
#         History:
#           Step 1: 0 -> 1

# Second run
jac run history_counter.jac
# Output: Resuming counter at value: 1
#         Incremented to: 2
#         History:
#           Step 1: 0 -> 1
#           Step 2: 1 -> 2

# Third run
jac run history_counter.jac
# Output: Resuming counter at value: 2
#         Incremented to: 3
#         History:
#           Step 1: 0 -> 1
#           Step 2: 1 -> 2
#           Step 3: 2 -> 3
```

!!! success "State Consistency Demonstrated"
    Both the counter value and the complete history graph persist perfectly across runs.

---

## Building Stateful Applications

The automatic persistence enables building sophisticated stateful applications with minimal code. Let's create a counter management system:

!!! example "Multi-Counter Management System"
    <div class="code-block">
    ```jac
    # counter_manager.jac
    node CounterManager {
        has created_at: str;

        def create_counter(name: str) -> Counter {
            # Check if counter already exists
            existing = [root -->(`?Counter)](?name == name);
            if existing {
                return existing[0];
            }

            new_counter = Counter(name=name, value=0);
            self ++> new_counter;
            return new_counter;
        }

        def list_counters() -> list[str] {
            counters = [root -->(`?Counter)];
            return [f"{c.name}: {c.value}" for c in counters];
        }

        def get_total() -> int {
            counters = [root -->(`?Counter)];
            return sum([c.value for c in counters]);
        }
    }

    node Counter {
        has name: str;
        has value: int = 0;

        def increment(amount: int = 1) -> int {
            self.value += amount;
            return self.value;
        }
    }

    with entry {
        # Get or create manager
        manager_nodes = [root -->(`?CounterManager)];

        if manager_nodes {
            manager = manager_nodes[0];
            print("Using existing counter manager");
        } else {
            manager = CounterManager(created_at="2024-01-15");
            root ++> manager;
            print("Created new counter manager");
        }

        # Create and use counters
        page_views = manager.create_counter("page_views");
        user_signups = manager.create_counter("user_signups");

        # Simulate some activity
        page_views.increment(5);
        user_signups.increment(2);

        # Show status
        print("\nCounter Status:");
        for counter_info in manager.list_counters() {
            print(f"  {counter_info}");
        }

        print(f"\nTotal activity: {manager.get_total()}");
    }
    ```
    </div>

### Progressive State Building

```bash
# First run - Initialize system
jac run counter_manager.jac
# Output: Created new counter manager
#         Counter Status:
#           page_views: 5
#           user_signups: 2
#         Total activity: 7

# Second run - Continue accumulating
jac run counter_manager.jac
# Output: Using existing counter manager
#         Counter Status:
#           page_views: 10
#           user_signups: 4
#         Total activity: 14

# Third run - Data persists and grows
jac run counter_manager.jac
# Output: Using existing counter manager
#         Counter Status:
#           page_views: 15
#           user_signups: 6
#         Total activity: 21
```

---

## Persistence Best Practices

!!! tip "Effective Persistence Patterns"
    - **Root Connection**: Always connect persistent nodes to root or root-connected nodes
    - **Initialization Checks**: Use filtering to check for existing data before creating new nodes
    - **Graph Relationships**: Leverage edges to maintain data relationships automatically
    - **Type Safety**: Rely on Jac's type system for data integrity across runs

### Data Integrity Example

!!! example "Safe Data Access Pattern"
    <div class="code-block">
    ```jac
    # safe_counter.jac
    node AppState {
        has initialized: bool = False;
        has version: str = "1.0";
    }

    walker initialize_app {
        can setup with `root entry {
            # Check for existing app state
            app_state = [root -->(`?AppState)];

            if not app_state {
                # First run initialization
                state = AppState(initialized=True);
                counter = Counter(value=0);

                root ++> state;
                state ++> counter;

                report {"status": "initialized", "counter": 0};
            } else {
                # App already initialized
                state = app_state[0];
                counter = [root -->(`?Counter)][0];
                report {"status": "existing", "counter": counter.value};
            }
        }
    }

    node Counter {
        has value: int = 0;
    }

    with entry {
        result = initialize_app() spawn root;
        print(f"App status: {result}");
    }
    ```
    </div>

---

## Key Takeaways

!!! summary "What We've Learned"
    - **Automatic Persistence**: Jac handles data persistence without configuration
    - **Root Node**: Central entry point for all persistent graph structures
    - **State Consistency**: Complete application state maintained across runs
    - **Zero Overhead**: No database setup, connection management, or serialization code
    - **Graph Integrity**: Relationships between nodes persist automatically

### Next Steps

In the upcoming chapters, we'll explore:
- **Chapter 14**: Converting persistent applications to cloud APIs
- **Chapter 15**: Multi-user systems with shared persistent state
- **Chapter 16**: Advanced persistence patterns for complex applications

!!! tip "Try It Yourself"
    Experiment with the counter examples by:
    - Adding reset functionality to counters
    - Creating counters with different increment amounts
    - Building a simple todo list that persists

    Remember: Any node connected to root (directly or indirectly) will persist automatically!

---

*Ready to learn how persistent applications become cloud APIs? Continue to [Chapter 14: Jac Cloud Introduction](chapter_14.md)!*
