# Disengage statements - Walker control flow and early termination

# ===== Node Definition =====
node Person {
    has name: str;
    has processed: bool = False;
}

# ===== Walker 1: Basic Disengage =====
walker BasicDisengage {
    can start with `root entry {
        print("BasicDisengage: Starting at root");
        visit [-->];
    }

    can check with Person entry {
        print(f"  Visiting: {here.name}");
        if here.name == "Bob" {
            print(f"  Found Bob - disengaging!");
            disengage;
        }
        visit [-->];
    }
}

# ===== Walker 2: Skip Statement =====
walker SkipWalker {
    can start with `root entry {
        print("\nSkipWalker: Demonstrating skip");
        visit [-->];
    }

    can process with Person entry {
        if here.name == "Charlie" {
            print(f"  Skipping {here.name}");
            skip;  # Skip stops current node, continues traversal
        }
        print(f"  Processing {here.name}");
        here.processed = True;
        visit [-->];
    }
}

# ===== Walker 3: Disengage vs Skip =====
walker ComparisonWalker {
    has mode: str = "normal";

    can start with `root entry {
        print(f"\nComparisonWalker: mode={self.mode}");
        visit [-->];
    }

    can handle with Person entry {
        print(f"  At {here.name}");

        if self.mode == "disengage" and here.name == "Bob" {
            print("    Using disengage - walker stops completely");
            disengage;
        }

        if self.mode == "skip" and here.name == "Bob" {
            print("    Using skip - skips this node, continues");
            skip;
        }

        print(f"    Processed {here.name}");
        visit [-->];
    }
}

# ===== Walker 4: Loop Control =====
walker LoopControl {
    can demonstrate with `root entry {
        print("\nLoopControl: Break and Continue");

        # Break - exits loop
        print("  Break example:");
        for i in range(5) {
            if i == 3 {
                print(f"    Breaking at {i}");
                break;
            }
            print(f"    i={i}");
        }

        # Continue - skips iteration
        print("  Continue example:");
        for i in range(5) {
            if i == 2 {
                continue;
            }
            print(f"    i={i}");
        }

        # Disengage would stop walker entirely (not just loop)
        visit [-->];
    }

    can show with Person entry {
        print(f"  At {here.name} - disengage would stop walker here");
        disengage;
    }
}

# ===== Walker 5: Depth-Limited with Disengage =====
walker DepthLimited {
    has depth: int = 0;
    has max_depth: int = 2;

    can start with `root entry {
        print(f"\nDepthLimited: max_depth={self.max_depth}");
        visit [-->];
    }

    can traverse with Person entry {
        self.depth += 1;
        print(f"  Depth {self.depth}: {here.name}");

        if self.depth >= self.max_depth {
            print(f"  Max depth reached - disengaging");
            disengage;
        }

        visit [-->];
    }
}

# ===== Graph Setup and Tests =====
with entry {
    print("=== Building Graph ===\n");

    # Create nodes
    alice = Person(name="Alice");
    bob = Person(name="Bob");
    charlie = Person(name="Charlie");
    diana = Person(name="Diana");

    # Build graph: root -> Alice -> Bob -> Diana
    #                          \-> Charlie
    root ++> alice;
    alice ++> bob;
    alice ++> charlie;
    bob ++> diana;

    print("Graph: root -> Alice -> Bob -> Diana");
    print("                    \\-> Charlie\n");

    # Test 1: Basic disengage
    print("=== Test 1: Basic Disengage ===");
    root spawn BasicDisengage();

    # Test 2: Skip statement
    print("\n=== Test 2: Skip Statement ===");
    root spawn SkipWalker();
    print(f"  Charlie processed: {charlie.processed}");
    print(f"  Bob processed: {bob.processed}");

    # Test 3: Disengage vs skip comparison
    print("\n=== Test 3a: Normal Mode ===");
    root spawn ComparisonWalker(mode="normal");

    print("\n=== Test 3b: Disengage Mode ===");
    root spawn ComparisonWalker(mode="disengage");

    print("\n=== Test 3c: Skip Mode ===");
    root spawn ComparisonWalker(mode="skip");

    # Test 4: Loop control
    print("\n=== Test 4: Loop Control ===");
    root spawn LoopControl();

    # Test 5: Depth limited
    print("\n=== Test 5: Depth-Limited Walker ===");
    root spawn DepthLimited();

    # Summary
    print("\n=== Control Flow Summary ===");
    print("  • disengage - Stops entire walker execution immediately");
    print("  • skip - Skips current node processing, walker continues");
    print("  • break - Exits innermost loop");
    print("  • continue - Skips to next loop iteration");
    print("  • return - Exits function/method");

    print("\n✓ Disengage statements demonstrated!");
}
