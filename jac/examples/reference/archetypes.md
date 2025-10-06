# Archetypes

Archetypes are Jac's fundamental type declarations, providing five distinct keywords for building both traditional object-oriented and Object-Spatial programs: `class`, `obj`, `node`, `edge`, and `walker`.

## The Five Archetype Types

**class** - Traditional OOP classes with attributes and methods. Not spatial - cannot participate in graph structures or walker traversal.

**obj** - Object archetypes that bridge OOP and OSP. Support all OOP features while being compatible with spatial inheritance.

**node** - Spatial vertices representing locations in the graph. Can be connected via edges and host walker visits.

**edge** - First-class relationships between nodes with their own state, behavior, and abilities.

**walker** - Mobile computation units that traverse the graph, flowing to data rather than data flowing to functions.

## Inheritance

Archetypes support single and multiple inheritance:

- **Single inheritance:** `node Pet(Animal)` - Inherit from one parent
- **Multiple inheritance:** `node Pet(Animal, Domesticated, Mammal)` - Inherit from multiple parents
- **Inheritance chains:** `walker Veterinarian(Caretaker)` where `Caretaker(Person)` creates chain: Veterinarian → Caretaker → Person

**Important:** When inheriting from both `obj` and `class` archetypes:
- `obj` attributes are available as constructor parameters
- `class` attributes must be set after construction

## Access Modifiers

Control visibility across modules using colon syntax:

- `:pub` - Public, accessible anywhere
- `:prot` - Protected, accessible to subclasses
- `:priv` - Private, accessible only within defining module

Apply to any archetype: `obj :pub PublicAPI`, `edge :priv SecretEdge`

## Has Statements (Member Variables)

The `has` keyword declares attributes with optional type annotations and default values:

```
has name: str = "Default";
has age: int;
has trained: bool = False;
```

Attributes defined in `has` statements become instance variables accessible via `self`.

## Methods vs Abilities

**Methods (def)** - Traditional functions that must be explicitly called:
- Available in all archetypes
- Called directly: `object.method()`
- Execute on demand

**Abilities (can)** - Event-driven behaviors triggered during traversal:
- Available in `node`, `edge`, and `walker` archetypes
- Triggered automatically when walker visits matching node/edge type
- Enable bidirectional polymorphism: walkers have node-specific abilities, nodes have walker-specific abilities
- Syntax: `can ability_name with NodeType entry`

## Decorators

Python decorators can be applied to archetype definitions:

```
@print_bases
@track_creation
node DecoratedNode { }
```

Decorators execute at definition time (before main execution) and apply bottom-up when multiple decorators are stacked.

## Forward Declarations and Impl Blocks

Separate interface from implementation:

**Forward declaration:**
```
node AnimalNode;
walker SpecializedWalker;
edge SpecialEdge;
```

**Implementation:**
```
impl AnimalNode {
    has animal_type: str = "wild";
    def describe { ... }
}
```

Use for:
- Breaking circular dependencies
- Organizing large codebases
- Applying decorators before defining body
- Implementing interfaces

## Async Walkers

Walkers can be declared async for concurrent operations:

```
async walker AsyncInspector {
    async can inspect with `root entry { ... }
    async can check with Pet entry { ... }
}
```

Async abilities can use `await` for asynchronous operations during traversal.

## OSP Integration

The spatial archetypes (`node`, `edge`, `walker`) enable Object-Spatial Programming:

**Nodes** represent data locations in the graph and can:
- Be connected via edges
- Host walker visits
- Have walker-specific abilities that execute when visited
- Access visiting walker via `visitor` reference

**Edges** are first-class relationships that can:
- Carry their own state and behavior
- Have abilities triggered during edge traversal
- Be typed and filtered during visits
- Transform relationships from implementation details to program entities

**Walkers** are mobile computation that can:
- Spawn at nodes and traverse the graph
- Have node-specific abilities for different node types
- Accumulate abilities through inheritance
- Access current location via `here` reference

## Bidirectional Polymorphism

Jac enables unique bidirectional dispatch:
- **Walkers dispatch on node types:** Walker abilities execute based on visited node type
- **Nodes dispatch on walker types:** Node abilities execute based on visiting walker type

When a walker visits a node, both walker abilities and node abilities execute, enabling rich interaction patterns.

## Common Patterns

**Separation of concerns:**
```
obj DataModel { has data: dict; }
node DataNode(DataModel) { can process with AnalyzerWalker entry { ... } }
walker Analyzer { can analyze with DataNode entry { ... } }
```

**Edge-rich graphs:**
```
edge Relationship {
    has strength: int;
    can update with AuditWalker entry { ... }
}
```

**Walker specialization hierarchies:**
```
walker BaseProcessor { can process with Node entry { ... } }
walker Validator(BaseProcessor) { can validate with Node entry { ... } }
```

Child walkers inherit all parent abilities and add their own, enabling ability composition.

## See Also

- [Functions and Abilities](functions_and_abilities.md) - Method and ability syntax
- [Implementations](implementations.md) - Forward declarations and impl blocks
- [Object Spatial Calls](object_spatial_calls.md) - Spawn and walker execution
- [Object Spatial References](object_spatial_references.md) - Special references (here, visitor, self)
- [Inline Python](inline_python.md) - Embedding Python in archetypes
