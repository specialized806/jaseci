# Jac Programming Language Keyword Reference

 Keywords are special reserved words that have a specific meaning and purpose in the language and cannot be used as identifiers for variables, functions, or other objects.

---

## 1. Archetype and Data Structure Keywords

These keywords define the core data and structural elements in Jac, forming the foundation for graph-based and object-oriented programming.

**Core Archetype Keywords**

| Keyword | Description |
| --- | --- |
| `obj` | Defines a standard object, similar to a Python class, for holding data and behaviors. |
| `node` | Represents a vertex or location in a graph, capable of storing data. |
| `edge` | Defines a directed connection between two nodes, which can have its own attributes and logic. |
| `walker` | A mobile computational agent that traverses the graph of nodes and edges to process data. |
| `class` | Defines a standard Python-compatible class, allowing for seamless integration with the Python ecosystem. |
| `enum` | Creates an enumeration, a set of named constants. |

---

## 2. Variable and State Declaration Keywords

These keywords are used for declaring variables and managing their state and scope.

**Variable Declaration**

| Keyword | Description |
| --- | --- |
| `has` | Declares an instance variable within an archetype, with mandatory type hints. |
| `let` | Declares a module-level variable with lexical (module-level) scope. |
| `glob` | Declares a global variable accessible across all modules. |
| `global` | Modifies a global variable from within a local scope. |
| `nonlocal` | Modifies a variable from a nearby enclosing scope that isn't global. |

---

## 3. Ability and Function Keywords

These keywords define callable units of code, such as functions and methods associated with archetypes.

**Function and Method Definition**

| Keyword | Description |
| --- | --- |
| `can` | Defines an "ability" (a method) for an archetype. |
| `def` | Defines a standard function with mandatory type annotations. |
| `impl` | Separates the implementation of a construct from its declaration. |
| `return` | Exits a function and optionally returns a value. |
| `yield` | Pauses a function, returns a value, and creates a generator. |

---

## 4. Control Flow and Logic Keywords

These keywords direct the path of execution, enabling conditional logic, loops, and error handling.

**Control Flow Statements**

| Keyword | Description |
| --- | --- |
| `if` / `elif` / `else` | Executes code blocks conditionally. |
| `for` | Iterates over a sequence. |
| `while` | Creates a loop that executes as long as a condition is true. |
| `match` / `case` | Implements structural pattern matching. |
| `try` / `except` / `finally` | Handles exceptions. |
| `break` | Exits the current loop. |
| `continue` | Proceeds to the next iteration of a loop. |
| `raise` | Triggers an exception. |

---

## 5. Walker-Specific Control Keywords

These keywords are used exclusively to control the traversal behavior of `walker` agents on a graph.

**Walker Navigation**

| Keyword | Description |
| --- | --- |
| `visit` | Directs a walker to traverse to a node or edge. |
| `spawn` | Creates and starts a walker on a graph. |
| `ignore` | Excludes a node or edge from a walker's traversal. |
| `disengage` | Immediately terminates a walker's traversal. |
| `report` | Sends a result from a walker back to its spawning context. |
| `with entry` | Defines the main execution block for a module. |


---

## 6. Concurrency and Asynchronous Keywords

These keywords are used to manage concurrent and asynchronous operations for non-blocking execution.

**Asynchronous Operations**

| Keyword | Description |
| --- | --- |
| `flow` | Initiates a concurrent, non-blocking execution of an expression. |
| `wait` | Pauses execution to await the completion of a concurrent operation. |
| `async` | Declares a function or ability as asynchronous. |

---


## 7. AI and Language Model Integration

These keywords facilitate the integration of AI and Large Language Models (LLMs) directly into the language.


**AI Integration**


| Keyword | Description |
| --- | --- |
| `sem` | Associates a natural language "semantic string" with a code element for AI interpretation. |
| `by llm` | Indicates a function's implementation will be provided by an LLM. |

---

## 8. Miscellaneous Keywords

This section covers other essential keywords used for various operations.

<!-- <div class="purple-table" markdown="1"> -->

**Other Essential Keywords**

| Keyword | Description |
| --- | --- |
| `del` | Deletes objects, properties, or elements. |
| `assert` | Verifies if a condition is true, raising an error if not. |
| `<keyword>` | Used to escape reserved keywords when you want to use them as variable or attribute names, e.g., `<>node= 90;`, `<>dict = 8;`|

<!-- </div> -->

---

!!! tip "Keyword Usage Guidelines"
    - **Reserved words**: Keywords cannot be used as variable or function names
    - **Case sensitive**: All keywords must be written in lowercase
    - **Context matters**: Some keywords are only valid in specific contexts (e.g., walker keywords)
    - **Type safety**: Many keywords work with Jac's type system for better code reliability