Jac provides special reference keywords that are automatically available in specific contexts, allowing access to important runtime objects and enabling key Object-Spatial Programming patterns. The primary special references are `self`, `super`, `here`, `visitor`, and `root`.

**self - Instance Reference**

Lines 4-16 demonstrate `self` referring to the current instance in object methods.

Line 8: `self.count += 1` - Access instance attribute
Line 14: `self.increment()` - Call instance method on self

`self` is available in **all instance methods** (both `def` and `can` abilities) and refers to:
- In objects/classes: The current object instance
- In nodes: The current node instance
- In walkers: The current walker instance

Lines 204-207 show usage: creating Counter instance and calling methods. Output shows counter incrementing: "Counter at 1", "Counter at 2", "Counter at 1" (after reset).

**super - Parent Class Reference**

Lines 18-45 demonstrate `super` accessing parent class methods and attributes.

Line 36: `super.init(species="Dog")` - Call parent's init method
Line 42: `super.speak()` - Call parent's speak method

`super` enables:
- Calling overridden parent methods
- Proper initialization in inheritance hierarchies
- Method delegation to parent classes

Lines 210-211 show creating Dog instance which inherits from Animal. Output shows both parent and child init executing:
```
Animal init: Dog       # super.init() call
Dog init: Labrador     # Dog's init
```

Lines 42-43 show method override with delegation - Dog's `speak` calls `super.speak()` then adds its own behavior. Output:
```
Dog makes a sound      # super.speak()
Dog says: Woof!        # Dog's additional behavior
```

**here - Current Node Reference**

Lines 47-69 demonstrate `here` referring to the current node during walker traversal.

Line 58: `here` in `\`root entry` ability refers to the root node
Lines 64-65: `here.title` and `here.completed` access current Task node's attributes

`here` is available in **spatial contexts** (walker and node abilities) and refers to:
- In walker abilities: The node currently being visited
- In node abilities: The node itself (same as `self` for nodes)
- Always refers to a node, never a walker

Lines 219-221 show walker execution. Output demonstrates `here` changing as walker visits different nodes:
```
TaskProcessor: Starting at Root()          # here = root
  Processing: Write Code (priority 10)     # here = task1
  Processing: Write Tests (priority 8)     # here = task2
```

Line 65: `here.completed = True` - Walker modifies the node it's visiting, demonstrating how walkers can update data at each location.

**visitor - Current Walker Reference**

Lines 72-81 demonstrate `visitor` referring to the walker currently visiting a node.

Line 78: `visitor.processed_count` - Access walker's attributes from node ability
Line 79: Uses visitor data to customize node behavior

`visitor` is available **only in node abilities** (abilities defined on nodes with `can ... entry`). It refers to the walker that triggered the ability.

This creates **bidirectional communication**:
- Walker abilities: Walker's behavior when visiting specific node types
- Node abilities (with `visitor`): Node's behavior when visited by specific walker types

Lines 224-230 show InteractiveTask node responding to TaskProcessor walker. Output:
```
Interactive 1 visited by walker (processed 1 so far)
```

The node ability (line 78) accesses `visitor.processed_count`, reading the walker's state. Line 230 confirms the node stored data about its visitor: `"TaskProcessor #1"`.

**root - Root Node Reference**

Lines 84-99 demonstrate `root` as a globally accessible reference to the root node.

Line 89: `self.start_node = root` - Store root reference
Line 90: Access root for printing
Line 95: Access root from any node during traversal

`root` is **always available in spatial contexts** and refers to the persistent root node of the current execution context.

**The root Persistence Model** (lines 156-184):

The `root` keyword is central to Jac's persistence-by-reachability model:

1. **Automatic Persistence**: Anything connected to root (via edges) persists automatically
2. **Per-User Isolation**: Each user has their own distinct root node
3. **Global Accessibility**: The `root` keyword provides access anywhere in spatial code
4. **No Explicit Save**: No need for database calls or serialization - connectivity = persistence

Lines 171-182 demonstrate this:
```
data1 = PersistentData(value="persisted");
root ++> data1;  # Connected to root = persists

data2 = PersistentData(value="temporary");
# Not connected = eventually garbage collected
```

Output confirms: `data1 connected to root: True`, `data2 connected to root: False`.

This inverts traditional persistence models:
- **Traditional**: Explicitly save objects to database
- **Jac**: Connect objects to root; persistence is automatic

Lines 232-235 show accessing root from anywhere. Output confirms walker can store and compare root: `"Walker stored root: True"`.

**init - Constructor Method**

Lines 107-114 demonstrate `init` as the constructor method called during object instantiation.

Line 107: `def init(name: str, value: int)` - Constructor signature
Lines 109-111: Initialize instance attributes
Line 113: Explicitly call postinit

`init` is called automatically when creating instances: `ConfiguredObject(name="test", value=5)` (line 238).

Output shows init execution: `"init: test = 5"` (before "postinit").

**postinit - Post-Construction Hook**

Lines 116-120 demonstrate `postinit` for initialization logic that runs after `init`.

Line 116: `def postinit` - No parameters, called after init
Lines 117-119: Compute derived values based on initialized attributes

In this example, postinit is called manually (line 113), but in some contexts it may be called automatically by the runtime. The `postinit` pattern enables:
- Derived attribute computation
- Validation after all attributes set
- Setup requiring full object state

Output shows execution order: `"init: test = 5"` then `"postinit: computed = 10"`.

**Special References in Node Abilities**

Lines 122-136 clarify which references are available in node abilities:

```
can log_access with RootExplorer entry {
    # Available references:
    # - self: this node
    # - visitor: the walker visiting
    # - here: also this node (self == here)
    # - root: root node
}
```

Line 134 demonstrates: `self is here` evaluates to True in node abilities.

This means in node abilities, both `self` and `here` refer to the same node instance, while `visitor` refers to the walker.

**Special References in Walker Abilities**

Lines 139-154 clarify which references are available in walker abilities:

```
can demonstrate with \`root entry {
    # Available references:
    # - self: this walker
    # - here: current node (root in this case)
    # - root: root node
    # - visitor: NOT available (walker is the visitor)
}
```

Lines 148-152 demonstrate accessing each reference. Output confirms:
```
self = ReferenceDemo(walker_id='ref_demo')    # Walker instance
here = Root()                                  # Current node
root = Root()                                  # Root node
here is root: True                             # At root node
```

Note that `visitor` is not available in walker abilities because the walker IS the visitor.

**Combining Multiple References**

Lines 187-200 demonstrate using multiple special references together:

Line 195: `visitor.walker_id if hasattr(visitor, 'walker_id')` - Safely access visitor attribute
Line 196: `self.name` - Access node's own attribute
Line 199: `root` - Access global root

This shows how node abilities can coordinate:
- `self`: Node's own state
- `visitor`: Walker's state and identity
- `root`: Global persistence anchor

Output demonstrates the combination:
```
Work Item 1 processed by TaskProcessor
  (root is always accessible: Root())
```

**Reference Availability Summary**

| Reference | Object Methods | Walker Abilities | Node Abilities | Meaning |
|-----------|---------------|------------------|----------------|---------|
| `self` | ✓ | ✓ | ✓ | Current instance (obj/walker/node) |
| `super` | ✓ | ✓ | ✓ | Parent class |
| `here` | ✗ | ✓ | ✓ | Current node being visited |
| `visitor` | ✗ | ✗ | ✓ | Current walker (in node abilities) |
| `root` | ✗ | ✓ | ✓ | Root node (persistence anchor) |

**Common Patterns**

**Walker state accumulation**:
```
walker Analyzer {
    has stats: dict = {};
    can analyze with DataNode entry {
        self.stats[here.id] = here.value;  # self = walker, here = node
    }
}
```

**Node responding to walker**:
```
node SecurityNode {
    can check_access with AdminWalker entry {
        # visitor = walker, self = node
        if visitor.has_permission(self.required_permission) {
            self.grant_access();
        }
    }
}
```

**Using root for persistence**:
```
walker DataCreator {
    can create with `root entry {
        new_data = DataNode(value="important");
        root ++> new_data;  # Connect to root = persists
    }
}
```

**Parent method delegation**:
```
obj SpecializedProcessor(BaseProcessor) {
    def process(data: object) {
        super.process(data);  # Do base processing
        # Add specialized behavior
    }
}
```

**Key Insights**

1. **self is universal**: Available in all instance contexts (objects, walkers, nodes)
2. **here tracks location**: Automatically updates as walker visits different nodes
3. **visitor enables bidirectionality**: Nodes can inspect and respond to specific walkers
4. **root is the persistence anchor**: Connectivity to root determines persistence
5. **References are context-specific**: Different references available in different contexts
6. **here and self overlap**: In node abilities, `here` and `self` refer to the same node
7. **super enables composition**: Properly delegate to parent classes while adding behavior

**Relationship to Other Features**

Special references interact with:
- **Archetypes** (archetypes.jac): `self` and `super` work with all archetypes; `here`, `visitor`, `root` work with spatial archetypes
- **Abilities** (functions_and_abilities.jac): `can` abilities have access to spatial references (`here`, `visitor`, `root`)
- **Spawn** (object_spatial_calls.jac): `root spawn Walker()` uses root; walker execution populates `here` and `visitor`
- **Visit statements**: `visit [-->]` queues nodes that become `here` in subsequent ability executions

Special references are the mechanism by which spatial computation accesses and manipulates the graph structure, enabling the "computation flows to data" paradigm where walkers (`self`) traverse nodes (`here`) in a persistent graph anchored at `root`.
