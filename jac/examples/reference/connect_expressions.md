# Connect Expressions

Connect expressions are specialized operators for creating and managing edges between nodes in graph structures. These operators are fundamental to Jac's Object-Spatial Programming, providing first-class syntax for spatial relationships.

## Untyped Connections

**Forward connect (`++>`)** - Creates directed edge from left to right:
```
alice ++> bob;  // Edge from alice to bob
```

**Backward connect (`<++`)** - Creates edge from right to left:
```
charlie <++ diana;  // Edge from diana to charlie
```

**Bidirectional connect (`<++>`)** - Creates edges in both directions:
```
eve <++> frank;  // Edges in both directions
```

Untyped connections use the default generic edge type.

## Typed Connections

**Forward typed (`+>:Type:+>`)** - Specify edge archetype:
```
grace +>:LivesIn:+> nyc;
```

**Backward typed (`<+:Type:<+`)** - Typed edge from right to left:
```
henry <+:LivesIn:<+ london;  // LivesIn edge from london to henry
```

**Bidirectional typed (`<+:Type:+>`)** - Typed edges in both directions:
```
iris <+:Friend:+> jack;
```

Typed connections enable type-specific edge traversal and filtering.

## Direction Variants

All three directional patterns (forward, backward, bidirectional) work with:
- Untyped connections (generic edges)
- Typed connections (specific edge archetypes)
- Edge attribute initialization (see below)

Backward and bidirectional operators provide flexibility in writing order while maintaining precise control over edge direction.

## Edge Attribute Initialization

Initialize edge attributes during connection:

**Forward with attributes:**
```
kate +>: Friend(since=2015) :+> liam;
```

**Backward with attributes:**
```
mike <+: Friend(since=2018) :<+ nina;  // Edge from nina to mike
```

**Bidirectional with attributes:**
```
oscar <+: Colleague(department="Engineering") :+> paula;
```

The edge archetype is instantiated with specific attribute values during connection.

## Chained Connections

Connect operators are left-associative and can be chained:

```
t1 ++> t2 ++> t3;  // Creates path: t1 → t2 → t3
```

First evaluates `t1 ++> t2`, then connects result to `t3`. Useful for building linear structures, paths, or chains.

## Inline Node Creation

Create nodes directly within connect expressions:

```
start ++> Person(name="InlineNode", age=35);
nina +>:Friend:+> Person(name="NewFriend", age=40);
```

Eliminates need for intermediate variables, enabling concise declarative graph construction.

## Connect to Multiple Targets

Build fan-out structures by connecting one node to multiple targets:

```
parent ++> child1;
parent ++> child2;
parent ++> child3;
```

Creates star or tree patterns common in hierarchical structures.

## Disconnect Operator

Remove edges from the graph:

```
node del [-->] target       // Delete outgoing edges
node del [->:Type:->] target  // Delete specific typed edge
node del [<--] target       // Delete incoming edges
```

The `del` keyword combined with edge reference expressions removes specific edges. Note: Implementation may vary by runtime version.

## Operator Summary

**Untyped (default edge):**
- `node1 ++> node2` - Forward
- `node1 <++ node2` - Backward
- `node1 <++> node2` - Bidirectional

**Typed (specific archetype):**
- `node1 +>:Type:+> node2` - Forward typed
- `node1 <+:Type:<+ node2` - Backward typed
- `node1 <+:Type:+> node2` - Bidirectional typed

**With attributes:**
- `node1 +>: Type(attr=val) :+> node2` - Forward
- `node1 <+: Type(attr=val) :<+ node2` - Backward
- `node1 <+: Type(attr=val) :+> node2` - Bidirectional

## Connect vs Edge References

**Connect operators** (`++>`, `+>:Type:+>`):
- CREATE edges between nodes
- Imperative: "make this connection"
- Used in graph construction

**Edge references** (`[-->]`, `[->:Type:->`):
- QUERY/TRAVERSE existing edges
- Declarative: "find these connections"
- Used in visit statements and traversal

The same edge can be created by a connect operator then traversed by an edge reference.

## OSP Integration

Connect expressions integrate with Object-Spatial Programming features:

**Building graphs:**
```
person +>:LivesIn:+> city;
person +>:WorksAt:+> company;
person <+:Friend:+> other_person;
```

**Traversing connections:**
```
walker GraphExplorer {
    can explore with `root entry {
        visit [-->];  // Traverse all outgoing edges
    }
}
```

**Dynamic construction:**
Walkers can build graphs during traversal:
```
walker GraphBuilder {
    can build with Node entry {
        new_node = DataNode(...);
        here ++> new_node;  // Create edge during traversal
    }
}
```

## Differences from Traditional OOP

Traditional OOP manages relationships through:
- References: `person.manager = otherPerson`
- Collections: `person.friends.add(friend)`
- Association objects: `new Relationship(person1, person2)`

Jac's connect expressions differ fundamentally:
- First-class syntax for relationships (not method calls)
- Spatial semantics: connections exist in graph space
- Bidirectional awareness: graph knows connections in both directions
- Type-safe edges: edge archetypes enforce structure
- Declarative style: describe what connections exist

## Common Graph Patterns

**Linear chain:**
```
n1 ++> n2 ++> n3;
```

**Star/hub:**
```
center ++> spoke1;
center ++> spoke2;
center ++> spoke3;
```

**Bidirectional network:**
```
node1 <++> node2 <++> node3;
```

**Heterogeneous graph:**
```
person +>:LivesIn:+> city;
person +>:WorksAt:+> company;
person <+:Friend:+> other;
```

## See Also

- [Archetypes](archetypes.md) - Defining nodes, edges, and walkers
- [Object Spatial References](object_spatial_references.md) - Edge reference expressions for traversal
- [Object Spatial Calls](object_spatial_calls.md) - Spawn and visit statements
- [Walrus Assignments](walrus_assignments.md) - Connect-and-assign patterns
