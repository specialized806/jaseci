#  Plugin Foundation Documentation

## Overview

The `machine.py` file forms the **foundation of plugin functionality** in the Jaseci Cloud architecture. It leverages the **Pluggy** library to define a flexible and modular **plugin system** using a **hook mechanism**.

This document provides a detailed breakdown of how plugins are structured and implemented in `machine.py`, including all relevant classes and static methods. It is designed to help contributors and maintainers understand this file independently, without needing a full view of the entire Jaseci codebase.

---

##  What is Pluggy?

**Pluggy** is a lightweight plugin system library used extensively in projects like **pytest**. It allows defining:

- **Hook specifications** (`@hookspec`) — method signatures to be implemented.
- **Hook implementations** (`@hookimpl`) — actual logic for the hooks.
- **Plugin Manager** to register, manage, and dispatch hook calls dynamically.

---

##  Plugin Architecture in `machine.py`

### Classes Implemented

| Class   | Role                                                                 |
|---------|----------------------------------------------------------------------|
| `Spec`  | Contains hook specifications using `@hookspec` — acts as a contract |
| `Impl`  | Contains actual implementations of plugin logic using `@hookimpl`   |
| `Proxy` | Provides interface methods to call the registered plugin hooks via `plugin_manager.hook.<method>()` |

---

## Class: `JacMachineInterface`

This class is the core **interface layer** of the plugin system. It:

- Inherits and composes multiple core classes like `JacClassReferences`, `JacNode`, `JacEdge`, etc.
- Bridges access between static utility classes and plugin-enabled logic.
- Allows static access patterns for interacting with various components like walkers, access control, etc.

### Inherited Static Classes

- `JacClassReferences`
- `JacAccessValidation`
- `JacNode`
- `JacEdge`
- `JacWalker`
- `JacBuiltin`
- `JacCmd`
- `JacBasics`
- `JacUtils`

---

## How to Implement a Plugin

### Step 1: Define an Implementation Method with `@hookimpl`

```python
from jaclang.runtimelib.machine import hookimpl

@hookimpl
def get_edges_with_node(...):
```


### Step 2: Register Your Plugin with the Plugin Manager
```python
plugin_manager.register(YourPluginClass())
```

## Static Methods that can be plugged in

The following static methods are exposed through the plugin interface and can be improved using hook implementation

| **Function**             | **Notes**                                                                 |
|--------------------------|---------------------------------------------------------------------------|
| `connect`                | Needs better description — what kind of connection? What parameters?      |
| `disconnect`             | Clarify whether it's object-to-object disconnection or session-related.   |
| `perm_grant`             | Rename or clarify — it grants permission to everyone.                     |
| `perm_revoke`            | Removes all permissions — state scope and cascading effects.              |
| `check_read_access`      | Widely used — should include examples and return behavior.                |
| `check_write_access`     | Add detailed context on when and why it’s triggered.                      |
| `check_connect_access`   | Explain with use case and expected outcome.                               |
| `check_access_level`     | Critical access logic — needs detailed breakdown.                         |
| `get_edges_with_node`    | Clarify difference from `get_edges`. Add real-world usage scenarios.      |
| `edges_to_nodes`         | Misleading name — it means “get connected nodes”. Rename or explain.      |
| `remove_edge`            | Common function — include code samples or visual diagrams.                |
| `visit` / `ignore`       | Missing docstrings — clarify usage context and purpose.                   |
| `spawn_call`             | Describe lifecycle and execution flow clearly.                            |
| `async_spawn_call`       | Needs distinct async-specific explanation (currently same as `spawn_call`).|
| `disengage`              | Explain context — e.g., walker termination, access cleanup, etc.          |
| `setup`                  | Clarify what is being setup — graph, context, permissions, etc.?          |
| `reset_graph`            | Clarify whether it's a full or partial reset — and when to use it.        |
| `make_archetype`         | Add explanation about its role in object/class/type creation.             |
| `impl_patch_filename`    | Explain purpose — dynamic patching, hot reloading, etc.                   |
| `jac_import`             | Key function — handles `.jac` and `.py` imports. Needs examples and context. |
