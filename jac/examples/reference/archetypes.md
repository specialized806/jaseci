Archetypes are the fundamental type declarations in Jac, defining the building blocks for both traditional object-oriented programming and Object-Spatial Programming. Jac provides five archetype keywords: `class`, `obj`, `node`, `edge`, and `walker`, each serving distinct roles in program structure.

**Grammar Rules**

```
archetype: decorators? (KW_ASYNC)? arch_type
arch_type: KW_CLASS | KW_OBJ | KW_NODE | KW_EDGE | KW_WALKER
access_tag: COLON (KW_PUB | KW_PROT | KW_PRIV)
inherited_archs: LPAREN name_list? RPAREN
```

**Class Archetype**

Lines 4-11 define a basic class archetype: `class Animal`. Classes in Jac are traditional OOP classes similar to Python classes. They support:
- Attributes with `has` declarations (lines 5-6)
- Methods with `def` declarations (lines 8-10)
- Instantiation and inheritance
- Traditional OOP patterns

Classes are **not** spatial archetypes - they don't participate in the graph structure or walker traversal. Use classes for traditional data structures and utilities that don't need spatial features.

**Object Archetype (obj)**

Lines 14-22 define an object archetype: `obj Domesticated`. Objects are one of the four core OSP archetypes, providing a bridge between traditional OOP and spatial programming:
- Lines 15-16: Attributes using `has` keyword
- Lines 18-21: Methods using `def` keyword
- Objects can be inherited by nodes and walkers
- Objects support all OOP features while being compatible with OSP

The output shows objects can be instantiated with constructor parameters: `Domesticated(owner="Alice", trained=True)` (line 227).

**Node Archetype with Multiple Inheritance**

Lines 30-37 demonstrate node archetypes with multiple inheritance: `node Pet(Animal, Domesticated, Mammal)`.

**Nodes are the fundamental spatial archetype** representing vertices in the graph. Key features:
- Multiple inheritance: Pet inherits from Animal (class), Domesticated (obj), and Mammal (obj)
- Line 31: `has name: str = "Unnamed"` - Node-specific attribute
- Lines 34-36: Methods work just like in objects
- Nodes can be connected with edges
- Nodes can host walker visits
- Nodes can have abilities (see line 208)

Lines 231-236 show node usage: creating an instance, setting inherited attributes, calling methods. The output confirms: "Buddy plays with ball", "Training Bob's pet", "Warm blooded: True" (from Mammal).

**Attribute Inheritance Note**: When a node inherits from a class archetype (like Animal), the class's attributes are inherited but not automatically available as constructor parameters. Line 231 creates Pet with only obj-defined parameters, then lines 232-233 set class-inherited attributes manually.

**Edge Archetypes - Basic**

Lines 41-43 show a basic edge: `edge Connection`. Edges are first-class archetypes representing relationships between nodes. Unlike traditional OOP where relationships are implementation details (references, foreign keys), **edges are first-class citizens** in OSP.

**Edge Archetypes - With Attributes and Methods**

Lines 46-54 demonstrate edges with state and behavior:
- Line 47: `has strength: int = 5` - Edge carries data
- Lines 50-53: `def strengthen` - Edge has methods
- Line 46: `:pub` access modifier makes edge publicly visible

Lines 239-241 show edge usage: creating an edge instance and calling its method. Output: "Relationship strengthened to 9".

**Edge Archetypes - With Abilities**

Lines 57-64 show edges responding to walker visits: `edge Ownership`. The critical feature:
- Lines 60-63: `can track with OwnershipWalker entry` - **Edge ability**

When a walker visits an edge (line 198: `visit [edge -->]`), the edge's matching abilities execute. This enables edges to have active behavior during traversal, not just passive data storage.

Lines 270-281 demonstrate edge abilities:
- Line 280: Create edge with attributes: `+>: Ownership(duration_years=3) :+>`
- Line 281: Walker visits edges explicitly
- Output shows: "Edge: Ownership duration = 3 years" (edge ability executed)

**Walker Archetypes - Basic**

Lines 68-82 define a walker: `walker Person(Animal)`.

**Walkers are mobile computation units** that traverse the graph:
- Line 68: Walkers can inherit from other archetypes (Animal class)
- Lines 69-70: Walker state (attributes)
- Lines 72-75: `can greet with \`root entry` - Ability triggered when walker spawns at root
- Lines 77-81: `can visit_pet with Pet entry` - Ability triggered when visiting Pet nodes

The execution (lines 252-256) shows:
```
person = Person(name="Alice");
root spawn person;
```
Output: "Alice: Starting walk from root", "Alice visits Buddy", "Alice visits Max", "Alice visited 2 pets"

**Walker Archetypes - Inheritance Chain**

Lines 85-101 demonstrate multi-level walker inheritance:
- `Caretaker(Person)` - Inherits from Person (lines 85-92)
- `Veterinarian(Caretaker)` - Inherits from Caretaker, creating chain: Veterinarian → Caretaker → Person → Animal (lines 94-101)

When Veterinarian walker visits a Pet node (line 268), **all inherited abilities execute**:
1. Person's `visit_pet` ability (line 77) - inherited two levels up
2. Caretaker's `care_for` ability (line 88) - inherited one level up
3. Veterinarian's `examine` ability (line 97) - defined directly

Output shows all three execute:
```
Smith visits Buddy                        # Person ability
Smith cares for Buddy (quality: 10)      # Caretaker ability
Dr. Smith (canine) examines Buddy        # Veterinarian ability
```

This demonstrates **ability composition through inheritance** - child walkers accumulate abilities from parent walkers.

**Async Walker**

Lines 104-117 show async walker: `async walker AsyncInspector`.
- Line 104: `async walker` keyword combination
- Lines 107-110: `async can inspect with \`root entry` - Async ability
- Lines 112-116: Async abilities can use `await` (not shown in this example)

Async walkers enable concurrent graph traversal and asynchronous operations during traversal.

**Access Modifiers**

Lines 120-131 demonstrate access control:
- Line 120: `:priv` - Private, accessible only within defining module
- Line 124: `:pub` - Public, accessible anywhere
- Line 129: `:protect` - Protected, accessible to subclasses

Lines 269-274 show all three can still be instantiated locally (same module). Access modifiers control cross-module visibility.

**Forward Declarations**

Lines 135-137 show forward declarations using semicolons:
- `node AnimalNode;` - Declares node without body
- `walker SpecializedWalker;` - Declares walker without body
- `edge SpecialEdge;` - Declares edge without body

Forward declarations enable:
- Breaking circular dependencies
- Separating interface from implementation
- Declaring types before full definition

**Implementation Blocks (impl)**

Lines 141-170 provide implementations for forward-declared archetypes using `impl` blocks.

**Node implementation** (lines 141-148):
```
impl AnimalNode {
    has animal_type: str = "wild";
    def describe { ... }
}
```

The `impl` keyword introduces the implementation. You can add attributes (`has`) and methods (`def`) within impl blocks. Line 277 shows usage: `AnimalNode(animal_type="lion", habitat="savanna")`.

**Walker implementation** (lines 150-159):
```
impl SpecializedWalker {
    has specialization: str = "research";
    can process with AnimalNode entry { ... }
}
```

Walkers in impl blocks can have abilities. Line 300 spawns: `animal_node spawn SpecializedWalker(specialization="wildlife")`.

**Edge implementation** (lines 163-170):
```
impl SpecialEdge {
    has edge_weight: float = 1.0;
    def get_weight -> float { ... }
}
```

Edges in impl blocks work like objects - attributes and methods. Line 295: `SpecialEdge(edge_weight=2.5)`.

**Impl blocks vs inline definitions**:
- **Inline**: Define archetype body immediately: `node Pet { has name: str; }`
- **Impl**: Declare first, implement later: `node Pet;` then `impl Pet { has name: str; }`

Use impl blocks for forward references, organizing large codebases, or implementing interfaces.

**Decorators on Archetypes**

Lines 173-187 demonstrate decorators applied to archetype definitions:
- Lines 173-181: Define decorator functions `print_bases` and `track_creation`
- Lines 183-187: Apply multiple decorators to a node:

```
@print_bases
@track_creation
node DecoratedNode(Pet) { ... }
```

Decorators execute at **definition time** (before main execution). The output shows:
```
Created archetype: DecoratedNode
Archetype DecoratedNode bases: ['Pet', 'NodeArchetype']
```

This appears before "=== 1. Basic Archetypes ===" because decorators run when the archetype is defined, not when it's instantiated.

Multiple decorators apply bottom-up: `DecoratedNode` is passed to `track_creation`, then the result to `print_bases`.

**Edge Abilities in Action**

Lines 190-200 define `OwnershipWalker` that explicitly visits edges:
- Line 198: `visit [edge -->]` - Visit edges instead of nodes

When combined with edge abilities (lines 60-63), this creates **edge-aware traversal**:
1. Walker visits Pet node
2. `visit [edge -->]` queues connected edges
3. Edge's ability (`can track with OwnershipWalker entry`) executes
4. Edge can modify its own state (line 62: `self.duration_years += 1`)

This pattern enables edges as active participants in computation, not just connections.

**Node Abilities with Walker-Specific Dispatch**

Lines 203-217 demonstrate **nodes having walker-specific abilities**:

```
node InteractivePet {
    can greet_person with Person entry { ... }      # Line 208
    can greet_vet with Veterinarian entry { ... }   # Line 213
}
```

When a walker visits a node, **both walker and node abilities execute**:
- Walker abilities: Walker's behavior when visiting this node type
- Node abilities: Node's behavior when visited by this walker type

Lines 318-322 show Person visiting InteractivePet:
- Node ability `greet_person` executes: "Fluffy wags tail at Dana" (line 209)
- Node uses `visitor.name` to access the visiting walker
- Happiness increases: 55 (line 322)

Lines 325-329 show Veterinarian visiting InteractivePet:
- Both `greet_person` AND `greet_vet` execute (Veterinarian inherits from Person)
- Output: "Fluffy wags tail at Jones" (Person ability) then "Fluffy is nervous around Dr. Jones" (Vet ability)
- Happiness: 57 (line 329) - net result of +5 (greet_person) -3 (greet_vet) = +2

This demonstrates **bidirectional polymorphism**:
- Walkers dispatch on node types (walker abilities)
- Nodes dispatch on walker types (node abilities)

**The visitor Reference**

Lines 209 and 214 use `visitor.name` to access the current walker. The `visitor` special reference is available in **node abilities** and refers to the walker currently visiting. This enables nodes to inspect walker state and create dynamic responses.

**Archetype Comparison Table**

| Archetype | Keyword | Spatial | Can Connect | Can Traverse | Can Have Abilities | Use Case |
|-----------|---------|---------|-------------|--------------|-------------------|----------|
| Class | `class` | No | No | No | No | Traditional OOP, utilities |
| Object | `obj` | No | No | No | No | OOP with OSP inheritance compatibility |
| Node | `node` | Yes | Yes (via edges) | No | Yes | Graph vertices, data locations |
| Edge | `edge` | Yes | N/A (is connection) | No | Yes | First-class relationships |
| Walker | `walker` | Yes | No | Yes | Yes | Mobile computation, graph traversal |

**Constructor Parameter Inheritance**

An important subtlety appears in lines 231-233 and similar places:
```
pet1 = Pet(name="Buddy", owner="Bob");  # obj attributes work as params
pet1.species = "Dog";                    # class attributes set manually
pet1.age = 3;
```

When a node/walker/obj inherits from:
- **obj**: Inherited attributes available as constructor parameters
- **class**: Inherited attributes must be set after construction

This is why `Pet(Animal, Domesticated, Mammal)` can use `owner` (from Domesticated obj) in constructor but not `species` (from Animal class).

**Common Patterns**

**Separation of concerns with archetypes**:
```
obj DataModel {          # Pure data
    has data: dict;
}
node DataNode(DataModel) {   # Data + spatial location
    can process with AnalyzerWalker entry { ... }
}
walker Analyzer {        # Computation
    can analyze with DataNode entry { ... }
}
```

**Edge-rich graphs**:
```
edge Relationship {
    has strength: int;
    can update with AuditWalker entry {
        # Edges track their own metrics
    }
}
```

**Walker specialization hierarchies**:
```
walker BaseProcessor { can process with Node entry { ... } }
walker Validator(BaseProcessor) { can validate with Node entry { ... } }
walker Transformer(BaseProcessor) { can transform with Node entry { ... } }
# All inherit process, add specific behavior
```

**Key Insights**

1. **Five archetypes, two paradigms**: `class` and `obj` support traditional OOP; `node`, `edge`, `walker` enable OSP
2. **Edges are first-class**: Unlike pointers/references, edges are archetypes with state, behavior, and abilities
3. **Walkers are mobile computation**: They flow to data (nodes), not data to functions
4. **Abilities are event-driven dispatch**: Walker+node type combinations trigger abilities automatically
5. **Multiple inheritance works**: Nodes and walkers can inherit from multiple obj/class archetypes
6. **Bidirectional interaction**: Walkers have node-specific abilities; nodes have walker-specific abilities
7. **Impl blocks separate interface from implementation**: Forward declare, implement later
8. **Decorators apply at definition time**: Transform archetypes as they're defined

**Relationship to Other Features**

Archetypes interact with:
- **Abilities** (functions_and_abilities.jac): Walkers and nodes have `can` abilities triggered during traversal
- **Spawn** (object_spatial_calls.jac): Walkers spawn at nodes and traverse the graph
- **Edge references** (object_spatial_references.jac): Navigate between nodes via edges
- **Special references** (names_and_references.jac): `here` (current node), `visitor` (current walker), `self` (current instance)

Archetypes are the type system foundation for Jac's dual-paradigm approach, supporting traditional OOP through classes and objects while enabling computation-flows-to-data through spatial node-edge-walker archetypes.
