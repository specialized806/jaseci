Connect expressions are specialized operators in Jac for creating and managing edges between nodes in graph structures. These operators are fundamental to Jac's Object-Spatial Programming paradigm, enabling declarative graph construction and manipulation. Unlike traditional object-oriented programming where relationships are managed through references or collections, Jac provides first-class syntax for spatial connections.

**Grammar Rules**

```
connect: (connect (connect_op | disconnect_op))? atomic_pipe
connect_op: connect_from | connect_to | connect_any
disconnect_op: KW_DELETE edge_op_ref

connect_to: CARROW_R | CARROW_R_P1 expression (COLON kw_expr_list)? CARROW_R_P2
connect_from: CARROW_L | CARROW_L_P1 expression (COLON kw_expr_list)? CARROW_L_P2
connect_any: CARROW_BI | CARROW_L_P1 expression (COLON kw_expr_list)? CARROW_R_P2
```

Connect expressions are part of the arithmetic expression hierarchy, making them composable with other expressions.

**Basic Untyped Connect (++>)**

Line 34 demonstrates the simplest connect form: `alice ++> bob;`

The forward connect operator `++>` (`CARROW_R`):
- Creates a directed edge from the left operand (source) to the right operand (target)
- Uses the default edge type (generic edge)
- Returns a list of created edges
- Establishes the spatial relationship "alice connects to bob"

This is the most common form for simple graph construction where edge type doesn't matter.

**Backward Connect (<++)**

Line 43 shows backward connection: `charlie <++ diana;`

The backward connect operator `<++` (`CARROW_L`):
- Creates an edge from RIGHT to LEFT (reverse of written order)
- In this example, creates edge from Diana TO Charlie
- Useful when the natural writing order is reversed from the desired edge direction
- Equivalent to writing `diana ++> charlie` but reads differently in context

Line 44's output confirms: "edge goes from Diana to Charlie"

**Bidirectional Connect (<++>)**

Line 51 demonstrates bidirectional: `eve <++> frank;`

The bidirectional operator `<++>` (`CARROW_BI`):
- Creates edges in BOTH directions simultaneously
- Creates edge from Eve to Frank AND edge from Frank to Eve
- Useful for symmetric relationships (friendship, mutual connections)
- More concise than writing two separate connect statements

**Typed Forward Connect (+>:Type:+>)**

Line 59 shows typed connection: `grace +>:LivesIn:+> nyc;`

The typed forward connect pattern `+>:EdgeType:+>` (`CARROW_R_P1 expression CARROW_R_P2`):
- Specifies the edge archetype to use (LivesIn)
- Creates a typed edge instead of generic edge
- The `EdgeType` is an expression (typically edge archetype name)
- Enables type-specific edge traversal and filtering later

The syntax `+>:` begins the typed connect, `:+>` completes it, with the type expression in between.

**Typed Backward Connect (<+:Type:<+)**

Line 68 demonstrates: `henry <+:LivesIn:<+ london;`

The typed backward pattern `<+:EdgeType:<+` (`CARROW_L_P1 expression CARROW_L_P2`):
- Creates typed edge from RIGHT to LEFT
- Edge goes from London to Henry, but written in reverse order
- Combines type specification with directional control

Line 69 confirms: "edge from London to Henry"

**Typed Bidirectional Connect (<+:Type:+>)**

Line 76 shows: `iris <+:Friend:+> jack;`

The typed bidirectional pattern `<+:EdgeType:+>` (`CARROW_L_P1 expression CARROW_R_P2`):
- Creates typed edges in both directions
- Both edges use the Friend archetype
- Note the asymmetric arrow syntax: `<+:` and `:+>`
- Creates Friend edge from Iris to Jack AND Friend edge from Jack to Iris

**Connect with Edge Attributes**

Lines 85-99 demonstrate edge attribute initialization during connection.

Forward with attributes (line 85):
```
kate +>: Friend(since=2015) :+> liam;
```

The pattern `+>: EdgeType(attr=val) :+>`:
- Instantiates the edge archetype with specific attributes
- `Friend(since=2015)` creates Friend edge with since=2015
- Combines type specification with attribute initialization
- Uses parentheses for archetype instantiation

Backward with attributes (line 92):
```
mike <+: Friend(since=2018) :<+ nina;
```

Pattern `<+: EdgeType(attr=val) :<+`:
- Same attribute initialization, but reversed direction
- Edge goes from Nina to Mike with since=2018

Bidirectional with attributes (line 99):
```
oscar <+: Colleague(department="Engineering") :+> paula;
```

Pattern `<+: EdgeType(attr=val) :+>`:
- Creates two typed edges with same attributes
- Both edges are Colleague edges with department="Engineering"
- Both directions share the same attribute initialization

**Grammar Token Mappings**

The grammar defines these terminal tokens for connect operators:

| Operator | Token | Grammar Symbol |
|----------|-------|----------------|
| `++>` | Forward untyped | `CARROW_R` |
| `<++` | Backward untyped | `CARROW_L` |
| `<++>` | Bidirectional untyped | `CARROW_BI` |
| `+>:` | Forward typed start | `CARROW_R_P1` |
| `:+>` | Forward typed end | `CARROW_R_P2` |
| `<+:` | Backward typed start | `CARROW_L_P1` |
| `:<+` | Backward typed end | `CARROW_L_P2` |

The "P1" and "P2" suffixes indicate "Part 1" and "Part 2" of the typed connect syntax.

**Disconnect Operator**

Lines 102-108 document the disconnect syntax:

Grammar: `disconnect_op: KW_DELETE edge_op_ref`

Syntax patterns:
- `node del [-->] target` - Delete all outgoing edges from node to target
- `node del [->:Type:->] target` - Delete specific typed edge
- `node del [<--] target` - Delete incoming edges

The disconnect operator uses the `del` keyword combined with edge reference expressions to remove specific edges from the graph. Note: Implementation may vary by runtime version.

**Chained Connect Operations**

Line 128 demonstrates chaining: `t1 ++> t2 ++> t3;`

Connect operators are left-associative and can be chained:
- First evaluates: `t1 ++> t2` (creates edge from t1 to t2)
- Then evaluates: `result ++> t3` (creates edge from t2 to t3)
- Creates a path: t1 → t2 → t3

This is possible because connect expressions return values that can be used as operands for subsequent connects. Chaining is useful for building linear structures, paths, or chains.

**Connect to Multiple Targets**

Lines 139-142 show connecting one node to multiple others:

```
parent ++> child1;
parent ++> child2;
parent ++> child3;
```

To create fan-out structures (one-to-many relationships):
- Write separate connect statements for each target
- All edges originate from the same source node
- Creates star or tree patterns
- Common for hierarchical structures (parent-child, hub-spoke)

**Inline Node Creation**

Line 138 demonstrates: `start ++> Person(name="InlineNode", age=35);`

Connect operators can take node creation expressions as operands:
- `Person(name="InlineNode", age=35)` creates new node
- Connect operator immediately links it to `start`
- No need for intermediate variable
- Concise graph construction pattern

This pattern is powerful for building graphs declaratively without verbose variable assignments.

**Connect Expression Values**

Connect expressions return values that can be used in larger expressions. Based on line 145's correction from the original attempt, connect operators return lists of edges or nodes, not single values. The exact return semantics depend on the operator:

- Forward connect returns target node(s)
- Can be assigned to variables or used in expressions
- Enables functional composition of graph operations

**Edge Traversal Integration**

Lines 170-171 show how connect expressions integrate with traversal:

```
visit [-->];
```

After using connect operators to build a graph, visit statements traverse the created edges. The edge expressions in visit statements (`[-->]`, `[->:Type:->]`) reference the edges created by connect operators.

Connect operators BUILD the graph structure, while visit statements and edge references TRAVERSE it.

**Complete Operator Set**

All connect operator variations:

**Untyped (default edge type):**
1. `node1 ++> node2` - Forward
2. `node1 <++ node2` - Backward (edge from node2 to node1)
3. `node1 <++> node2` - Bidirectional

**Typed (specific edge archetype):**
4. `node1 +>:Type:+> node2` - Forward typed
5. `node1 <+:Type:<+ node2` - Backward typed
6. `node1 <+:Type:+> node2` - Bidirectional typed

**With attributes:**
7. `node1 +>: Type(attr=val) :+> node2` - Forward with attrs
8. `node1 <+: Type(attr=val) :<+ node2` - Backward with attrs
9. `node1 <+: Type(attr=val) :+> node2` - Bidirectional with attrs

**Disconnect:**
10. `node del [edge_expr] target` - Delete edges

**Semantic Differences from Traditional OOP**

In traditional object-oriented programming, relationships are typically managed through:
- References: `person.manager = otherPerson`
- Collections: `person.friends.add(friend)`
- Association objects: `relationship = new Relationship(person1, person2)`

Jac's connect expressions differ fundamentally:
- First-class syntax for relationships (not method calls or assignments)
- Spatial semantics: connections exist in graph space, not just object memory
- Bidirectional awareness: the graph knows connections in both directions
- Type-safe edges: edge archetypes enforce structure
- Declarative style: describe what connections exist, not how to create them

**Graph Construction Patterns**

Lines 27-149 demonstrate several graph patterns:

**Linear Chain** (line 128):
```
n1 ++> n2 ++> n3;  // Creates: n1 → n2 → n3
```

**Star/Hub** (lines 139-142):
```
center ++> spoke1;
center ++> spoke2;
center ++> spoke3;
```

**Bidirectional Network** (lines 51, 76):
```
node1 <++> node2;  // Creates: node1 ↔ node2
```

**Typed Relationships** (lines 59, 68, 76):
```
person +>:LivesIn:+> city;
person1 <+:Friend:+> person2;
```

**Heterogeneous Graph** (mixing types):
```
person +>:LivesIn:+> city;
person +>:WorksAt:+> company;
person <+:Friend:+> other_person;
```

**Edge Attributes and State**

Lines 13-23 define edge archetypes with attributes:

```
edge Friend {
    has since: int = 2020;
}
```

Edge archetypes can have:
- Attributes (has statements) - store edge metadata
- Default values - initialized when edge created
- Abilities (can statements) - behaviors triggered on traversal
- Type hierarchies - edges can inherit from other edges

When connecting with attributes (lines 85-99), the edge instances carry state:
- `Friend(since=2015)` creates edge with temporal information
- `Colleague(department="Engineering")` creates edge with categorical data
- Attributes are accessible during traversal and filtering

**Connect Expressions in Context**

The complete spatial programming workflow:

1. **Define archetypes** (lines 4-23): Node and edge types
2. **Create nodes** (lines 30-31): `alice = Person(...)`
3. **Connect nodes** (line 34): `alice ++> bob`
4. **Traverse graph** (line 171): `visit [-->]`
5. **Query edges** (visit with filters): `visit [->:Friend:->]`

Connect expressions are step 3 in this workflow, bridging node creation and graph traversal.

**Comparison with Edge References**

Connect operators (this file) vs edge reference expressions (object_spatial_references.jac):

**Connect operators** (`++>`, `+>:Type:+>`):
- CREATE edges between existing nodes
- Imperative: "make this connection"
- Return created edges/nodes
- Used in graph construction code

**Edge references** (`[-->]`, `[->:Type:->]`):
- QUERY/TRAVERSE existing edges
- Declarative: "find these connections"
- Return target nodes
- Used in visit statements, iterations, filters

Same edge can be created by connect operator then traversed by edge reference:
```
alice +>:Friend:+> bob;        // Create edge
visit [->:Friend:->];          // Traverse edge
```

**Walker Interaction**

Lines 26-161 show walkers using connect operators:

Walkers can build graphs dynamically:
- Create nodes during traversal
- Connect newly created nodes
- Modify graph structure based on logic
- Implement graph algorithms that construct results

Pattern (lines 27-149):
```
walker GraphBuilder {
    can build with `root entry {
        n1 = Person(...);
        n2 = Person(...);
        n1 ++> n2;  // Build graph during walker execution
    }
}
```

This enables dynamic, computation-driven graph construction, not just static initialization.

**Performance Considerations**

Connect operators:
- Create physical edges in the graph runtime
- May involve memory allocation and indexing
- Bidirectional operators create two edges (double cost)
- Typed edges may have overhead for type checking
- Attributes add memory per edge instance

For large-scale graphs:
- Use untyped connects when type doesn't matter
- Avoid bidirectional when one direction suffices
- Consider bulk connect operations over individual connects
- Balance between edge attributes and node attributes

**Integration with Other Language Features**

Connect expressions compose with:

**Assignments** (line 145):
```
result = node1 ++> node2;
```

**Conditionals** (implied):
```
if condition {
    node1 ++> node2;
}
```

**Loops** (implied):
```
for item in items {
    parent ++> item;
}
```

**Walrus operator** (hypothetical):
```
if (edge := node1 ++> node2) {
    // Use edge
}
```

**Return values** (hypothetical):
```
can method -> Edge {
    return node1 +>:Friend:+> node2;
}
```

**Summary of Grammar Coverage**

This example demonstrates:
- ✅ All connect_op variants (connect_to, connect_from, connect_any)
- ✅ Untyped connects (CARROW_R, CARROW_L, CARROW_BI)
- ✅ Typed connects (CARROW_R_P1...P2, CARROW_L_P1...P2)
- ✅ Edge attribute initialization (kw_expr_list in grammar)
- ✅ Chained connect operations (left-associative composition)
- ⚠️ Disconnect operator (documented but implementation varies)

Connect expressions are essential for declarative graph construction in Jac, providing concise, readable syntax for creating the spatial structures that walkers traverse. They transform graph building from verbose imperative code into expressive spatial declarations.