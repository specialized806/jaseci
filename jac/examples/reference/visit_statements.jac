# Visit statements

# ===== Edge Types =====
edge Friend {}
edge Family {}
edge Colleague {
    has relationship_strength: int;
}

# ===== Node Types =====
node Person {
    has name: str;
}

# ===== Walkers =====

# 1. Basic visit with else clause
walker BasicVisitor {
    can travel with `root entry {
        print("BasicVisitor at root: visiting outgoing edges");
        # Visit all outgoing edges, with fallback if no edges exist
        visit [-->] else {
            print("  No outgoing edges - dead end!");
        }
    }

    can travel_person with Person entry {
        print(f"  BasicVisitor reached: {here.name}");
    }
}

# 2. Visit without else - terminates with SEMI
walker SimpleVisitor {
    can go with `root entry {
        print("SimpleVisitor at root: visiting all outgoing without else clause");
        # Visit without else clause - just uses SEMI terminator
        visit [-->];
    }

    can go_person with Person entry {
        print(f"  SimpleVisitor at: {here.name}");
    }
}

# 3. Directional edge expressions - [-->], [<--], [<-->]
walker DirectionalDemo {
    can demo with `root entry {
        print("DirectionalDemo: outgoing edges [-->]");
        visit [-->];
    }

    can demo_person with Person entry {
        print(f"  At {here.name}");
        # Could visit incoming: visit [<--];
        # Could visit bidirectional: visit [<-->];
    }
}

# 4. Typed edge traversal - visit specific edge types
walker TypedEdgeWalker {
    can find_friends with Person entry {
        print(f"TypedEdgeWalker at {here.name}: visiting only Friend edges [->:Friend:->]");
        # Visit only through Friend edges (outgoing)
        visit [->:Friend:->];
    }
}

# 5. Filtered edge traversal - filter on edge attributes
walker FilteredWalker {
    can find_strong with Person entry {
        print(f"FilteredWalker at {here.name}: visiting where relationship_strength > 5");
        # Visit through Colleague edges with filter condition
        visit [->:Colleague:relationship_strength > 5:->];
    }
}

# 6. Direct node visit - visit specific node, not via edge expression
walker TargetedVisitor {
    has target: Person;

    can jump with `root entry {
        print(f"TargetedVisitor: jumping directly to target node (not via edge)");
        # Visit a specific node directly
        visit self.target;
    }

    can at_target with Person entry {
        print(f"  Arrived at target: {here.name}");
        disengage;
    }
}

# 7. Conditional visit - control traversal based on walker state
walker ConditionalVisitor {
    has depth: int = 0;
    has max_depth: int = 2;

    can traverse with `root entry {
        print(f"ConditionalVisitor: depth={self.depth}, max={self.max_depth}");
        if self.depth < self.max_depth {
            self.depth += 1;
            print(f"  Visiting (incrementing depth to {self.depth})");
            visit [-->];
        } else {
            print("  Max depth reached - stopping");
        }
    }

    can traverse_person with Person entry {
        print(f"  At {here.name}, depth={self.depth}");
        if self.depth < self.max_depth {
            self.depth += 1;
            visit [-->];
        }
    }
}

# 8. Multiple sequential visits - visit different edge types in sequence
walker MultiStageVisitor {
    can multi_stage with `root entry {
        print("MultiStageVisitor: visiting Friends then Family sequentially");
        print("  Stage 1: Friends");
        visit [->:Friend:->];
        print("  Stage 2: Family");
        visit [->:Family:->];
    }

    can at_person with Person entry {
        print(f"    Reached: {here.name}");
    }
}

# 9. Visit with incoming and bidirectional typed edges
walker IncomingEdgeDemo {
    can start with `root entry {
        print("IncomingEdgeDemo: visiting outgoing first");
        visit [-->];
    }

    can at_person with Person entry {
        print(f"  At {here.name} - demonstrating edge variations:");
        print("    [<-:Family:<-] would visit incoming Family edges");
        print("    [<-:Friend:->] would visit bidirectional Friend edges");
    }
}

# ===== Graph Setup and Tests =====
with entry {
    print("=== Building Social Network ===");

    # Create people
    alice = Person(name="Alice");
    bob = Person(name="Bob");
    charlie = Person(name="Charlie");
    diana = Person(name="Diana");

    # Connect root to Alice
    root ++> alice;

    # Friend connections
    alice +>:Friend:+> bob;
    alice +>:Friend:+> charlie;

    # Family connections
    alice +>:Family:+> diana;

    # Colleague connections with relationship strengths
    alice +>: Colleague(relationship_strength=3) :+> bob;
    alice +>: Colleague(relationship_strength=8) :+> charlie;

    print("\n=== Test 1: Basic Visitor with else clause ===");
    root spawn BasicVisitor();

    print("\n=== Test 2: Simple Visitor (no else) ===");
    root spawn SimpleVisitor();

    print("\n=== Test 3: Directional edges demo ===");
    root spawn DirectionalDemo();

    print("\n=== Test 4: Typed Edge Walker (Friends only) ===");
    alice spawn TypedEdgeWalker();

    print("\n=== Test 5: Filtered Walker (Strong colleagues) ===");
    alice spawn FilteredWalker();

    print("\n=== Test 6: Targeted Visitor (Direct node visit) ===");
    root spawn TargetedVisitor(target=charlie);

    print("\n=== Test 7: Conditional Visitor (Depth limited) ===");
    root spawn ConditionalVisitor();

    print("\n=== Test 8: Multi-Stage Visitor ===");
    root spawn MultiStageVisitor();

    print("\n=== Test 9: Incoming edge demonstrations ===");
    root spawn IncomingEdgeDemo();

    print("\n✓ All visit statement variations demonstrated!");
}
