# Jac Client Import Patterns Proposal

## Executive Summary

This document proposes how Jac's `cl import` syntax can support the full spectrum of JavaScript/ECMAScript import patterns while maintaining Python-like ergonomics and minimal changes to the existing grammar.

## Current State

### Existing Grammar (jac.lark)

```lark
import_stmt: KW_IMPORT KW_FROM from_path LBRACE import_items RBRACE
           | KW_IMPORT import_path (COMMA import_path)* SEMI
           | KW_INCLUDE import_path SEMI

from_path: (DOT | ELLIPSIS)* import_path
         | (DOT | ELLIPSIS)+

import_path: (NAME COLON)? dotted_name (KW_AS NAME)?
import_items: (import_item COMMA)* import_item COMMA?
import_item: named_ref (KW_AS NAME)?
```

### Current Support

The grammar already supports:
- Named imports with `cl import from jac:client_runtime { funcName }`
- Module prefix notation via `NAME COLON` (e.g., `jac:client_runtime`)
- Aliasing with `as` keyword
- Relative imports via `DOT` and `ELLIPSIS`

**Example:**
```jac
cl import from jac:client_runtime {
    renderJsxTree,
    jacLogin,
    jacLogout
}
```

This generates:
```javascript
import { renderJsxTree, jacLogin, jacLogout } from "jac:client_runtime";
```

## Proposed Mapping

The proposal leverages the existing grammar with minimal extensions to support all JavaScript import patterns.

### Category 1: Named Imports (✅ Already Supported)

| JavaScript Pattern | Jac Pattern | Status |
|-------------------|-------------|---------|
| `import { useState } from 'react'` | `cl import from react { useState }` | ✅ Supported |
| `import { a, b, c } from 'lib'` | `cl import from lib { a, b, c }` | ✅ Supported |
| `import { foo as bar } from 'lib'` | `cl import from lib { foo as bar }` | ✅ Supported |

**esast_gen_pass.py:** Already implemented in `exit_import()` (lines 332-380)

---

### Category 2: Default Imports (⚠️ Needs Grammar Extension)

JavaScript default imports have no direct equivalent in Python-style imports. We propose using a special syntax that fits naturally with Jac's philosophy.

#### Proposal: Use `default` as a reserved import item name

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import React from 'react'` | `cl import from react { default as React }` | `import React from 'react'` |
| `import axios from 'axios'` | `cl import from axios { default as axios }` | `import axios from 'axios'` |
| `import Vue from 'vue'` | `cl import from vue { default as Vue }` | `import Vue from 'vue'` |

**Alternative syntax (more Pythonic):**
```jac
# Option A: Explicit default keyword
cl import react:default as React;

# Option B: Single identifier import (no braces = default)
cl import React from react;
```

**Recommendation:** Use **Option B** (`cl import Name from module`) as it:
- Matches JavaScript semantics exactly
- Doesn't require braces for single default imports
- Feels natural to JavaScript developers

**Grammar Addition:**
```lark
import_stmt: KW_IMPORT KW_FROM from_path LBRACE import_items RBRACE
           | KW_IMPORT NAME KW_FROM from_path SEMI  # NEW: default import
           | KW_IMPORT import_path (COMMA import_path)* SEMI
           | KW_INCLUDE import_path SEMI
```

**esast_gen_pass.py Implementation:**
```python
def exit_import(self, node: uni.Import) -> None:
    """Process import statement."""
    if node.from_loc and node.default_import:  # NEW: Check for default import
        # Generate: import Name from 'module'
        source = self.sync_loc(
            es.Literal(value=node.from_loc.dot_path_str),
            jac_node=node.from_loc
        )
        local = self.sync_loc(
            es.Identifier(name=node.default_import.sym_name),
            jac_node=node.default_import
        )
        specifiers = [
            self.sync_loc(
                es.ImportDefaultSpecifier(local=local),
                jac_node=node
            )
        ]
        import_decl = self.sync_loc(
            es.ImportDeclaration(specifiers=specifiers, source=source),
            jac_node=node
        )
        self.imports.append(import_decl)
        node.gen.es_ast = []
        return

    # ... existing named import logic ...
```

---

### Category 3: Mixed Default + Named Imports (⚠️ Needs Implementation)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import React, { useState } from 'react'` | `cl import React, { useState } from react` | Same |
| `import Vue, { createApp } from 'vue'` | `cl import Vue, { createApp } from vue` | Same |

**Grammar Addition:**
```lark
import_stmt: KW_IMPORT KW_FROM from_path LBRACE import_items RBRACE
           | KW_IMPORT NAME KW_FROM from_path SEMI
           | KW_IMPORT NAME COMMA LBRACE import_items RBRACE KW_FROM from_path SEMI  # NEW
           | KW_IMPORT import_path (COMMA import_path)* SEMI
           | KW_INCLUDE import_path SEMI
```

**Example:**
```jac
cl import React, { Component, useState } from react;
```

**esast_gen_pass.py Implementation:**
```python
# Combine ImportDefaultSpecifier + ImportSpecifier in specifiers list
specifiers = [
    es.ImportDefaultSpecifier(local=default_ident),
    *[es.ImportSpecifier(imported=..., local=...) for each named import]
]
```

---

### Category 4: Namespace Imports (✅ No Grammar Changes Needed!)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import * as React from 'react'` | `cl import from react { * as React }` | `import * as React from 'react'` |
| `import * as _ from 'lodash'` | `cl import from lodash { * as _ }` | `import * as _ from 'lodash'` |
| `import * as utils from './utils'` | `cl import from .utils { * as utils }` | `import * as utils from './utils'` |

**Key Insight:** The existing grammar already supports this! The `import_item` rule allows `named_ref (KW_AS NAME)?`, and `named_ref` can be `*` (which is a valid token).

**Alternative (if we add standalone syntax):**
```lark
import_stmt: KW_IMPORT STAR_MUL KW_AS NAME KW_FROM from_path SEMI  # Optional sugar
```

**esast_gen_pass.py Implementation:**
```python
# In exit_import(), detect if item.name is '*'
for item in node.items:
    if isinstance(item, uni.ModuleItem):
        if item.name.sym_name == '*':
            # Generate ImportNamespaceSpecifier instead of ImportSpecifier
            local = self.sync_loc(
                es.Identifier(name=item.alias.sym_name),
                jac_node=item.alias
            )
            specifiers.append(
                self.sync_loc(
                    es.ImportNamespaceSpecifier(local=local),
                    jac_node=item
                )
            )
        else:
            # ... existing named import logic ...
```

---

### Category 5: Side-Effect Only Imports (✅ Already Supported)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import 'bootstrap/dist/css/bootstrap.min.css'` | `cl import bootstrap/dist/css/bootstrap.min.css;` | Same |
| `import 'normalize.css'` | `cl import normalize.css;` | Same |
| `import './styles.css'` | `cl import .styles.css;` | `import './styles.css'` |

**Note:** Current grammar supports this via:
```lark
KW_IMPORT import_path (COMMA import_path)* SEMI
```

**esast_gen_pass.py Implementation:**
```python
# For imports without items (side-effect only)
if not node.items:
    import_decl = self.sync_loc(
        es.ImportDeclaration(specifiers=[], source=source),
        jac_node=node
    )
```

---

### Category 6: Dynamic Imports (⚠️ Requires Async Support)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `const m = await import('./mod.js')` | `let m = await import("./mod.js")` | Same |
| `const { func } = await import('lib')` | `let { func } = await import("lib")` | Same |

**Note:** This is an expression, not a statement. No grammar changes needed for import syntax.

**Implementation:** Use existing function call mechanism:
```jac
cl async def loadModule() {
    let module = await import("./module.js");
    let Component = module.default;
}
```

**esast_gen_pass.py:**
- Already handles `await` expressions
- `import()` is treated as a CallExpression with an Identifier('import')

---

### Category 7: Local/Relative Imports (✅ Already Supported)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import { util } from './utils'` | `cl import from .utils { util }` | `import { util } from './utils'` |
| `import { helper } from '../lib'` | `cl import from ..lib { helper }` | `import { helper } from '../lib'` |
| `import { cfg } from '../../config'` | `cl import from ...config { cfg }` | `import { cfg } from '../../config'` |

**Grammar Support:**
```lark
from_path: (DOT | ELLIPSIS)* import_path
```

**esast_gen_pass.py:** Already converts `DOT` to `./` and `ELLIPSIS` to `../`

---

### Category 8: NPM Module Imports (✅ Already Supported)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import { createServer } from 'http'` | `cl import from http { createServer }` | Same |
| `import axios from 'axios'` | `cl import axios from axios` | Same |
| `import moment from 'moment'` | `cl import moment from moment` | Same |

**Note:** No special handling needed - module resolution is handled by the bundler/runtime.

---

### Category 9: JSON Imports (✅ Supported via Standard Import)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import config from './config.json'` | `cl import config from .config.json` | Same |
| `import pkg from './package.json'` | `cl import pkg from .package.json` | Same |

**Note:** JSON imports work automatically if the bundler (webpack, vite, etc.) supports them.

---

### Category 10: Scoped Package Imports (✅ Already Supported)

| JavaScript Pattern | Jac Pattern | Generated JS |
|-------------------|-------------|--------------|
| `import { Button } from '@mui/material'` | `cl import from @mui/material { Button }` | Same |
| `import styled from '@emotion/styled'` | `cl import styled from @emotion/styled` | Same |

**Note:** The `@` symbol is already valid in `NAME` tokens in Lark.

---

## Implementation Priority

### Phase 1: High Priority (Core Functionality)

1. **Namespace Imports** - **NO GRAMMAR CHANGES NEEDED!** 🎉
   - Use existing syntax: `cl import from lodash { * as _ }`
   - ESTree: Detect `*` in item name, generate `ImportNamespaceSpecifier`
   - Testing: lodash, date-fns examples
   - **Easiest to implement - should be done first!**

2. **Default Imports** - Required for React, Vue, and most major libraries
   - Grammar: Add `KW_IMPORT NAME KW_FROM from_path SEMI`
   - ESTree: Generate `ImportDefaultSpecifier`
   - Testing: React, axios, moment examples

3. **Mixed Default + Named** - Common in modern frameworks
   - Grammar: Add `KW_IMPORT NAME COMMA LBRACE import_items RBRACE KW_FROM from_path SEMI`
   - ESTree: Combine default + named specifiers
   - Testing: React with hooks

### Phase 2: Medium Priority (Enhanced Support)

4. **Side-Effect Only Imports** - CSS, polyfills
   - Verify existing implementation handles empty specifiers
   - Testing: CSS imports, polyfill imports

5. **Dynamic Imports** - Code splitting, lazy loading
   - Document usage pattern (no grammar changes needed)
   - Testing: Async module loading examples

### Phase 3: Low Priority (Edge Cases)

6. **Type-Only Imports** - TypeScript compatibility (future)
   - `import type { User } from './types'`
   - Not needed for JavaScript generation initially

---

## Proposed Grammar Changes

### Minimal Grammar Extensions Required

**Good News:** Namespace imports require **NO grammar changes** - just use `cl import from module { * as Name }`!

**Only 2 new productions needed:**

```lark
import_stmt: KW_IMPORT KW_FROM from_path LBRACE import_items RBRACE  # Named/Namespace (EXISTING)
           | KW_IMPORT NAME KW_FROM from_path SEMI                     # Default import (NEW)
           | KW_IMPORT NAME COMMA LBRACE import_items RBRACE KW_FROM from_path SEMI  # Mixed (NEW)
           | KW_IMPORT import_path (COMMA import_path)* SEMI            # Side-effect / Python-style (EXISTING)
           | KW_INCLUDE import_path SEMI                                # Include (EXISTING)

from_path: (DOT | ELLIPSIS)* import_path
         | (DOT | ELLIPSIS)+

import_path: (NAME COLON)? dotted_name (KW_AS NAME)?
import_items: (import_item COMMA)* import_item COMMA?
import_item: named_ref (KW_AS NAME)?  # Note: named_ref can be '*'
dotted_name: named_ref (DOT named_ref)*
```

### What Changed?

1. **Namespace imports** - Use existing `{ * as Name }` syntax (no change!)
2. **Default imports** - Add `import Name from module` syntax
3. **Mixed imports** - Add `import Name, { a, b } from module` syntax

---

## esast_gen_pass.py Changes

### Updated exit_import() Method

```python
def exit_import(self, node: uni.Import) -> None:
    """Process import statement - supports all ES6 import patterns."""

    # Skip non-client imports
    if not node.is_client_decl:
        return

    source = self.sync_loc(
        es.Literal(value=node.from_loc.dot_path_str),
        jac_node=node.from_loc
    )

    specifiers: list[
        Union[
            es.ImportSpecifier,
            es.ImportDefaultSpecifier,
            es.ImportNamespaceSpecifier,
        ]
    ] = []

    # Case 1: Namespace import (import * as Name from 'module')
    if node.namespace_import:
        specifiers.append(
            self.sync_loc(
                es.ImportNamespaceSpecifier(
                    local=self.sync_loc(
                        es.Identifier(name=node.namespace_import.sym_name),
                        jac_node=node.namespace_import
                    )
                ),
                jac_node=node
            )
        )

    # Case 2: Default import (import Name from 'module')
    elif node.default_import:
        specifiers.append(
            self.sync_loc(
                es.ImportDefaultSpecifier(
                    local=self.sync_loc(
                        es.Identifier(name=node.default_import.sym_name),
                        jac_node=node.default_import
                    )
                ),
                jac_node=node
            )
        )

    # Case 3: Named imports (import { a, b } from 'module')
    if node.items:
        for item in node.items:
            if isinstance(item, uni.ModuleItem):
                imported = self.sync_loc(
                    es.Identifier(name=item.name.sym_name),
                    jac_node=item.name
                )
                local = self.sync_loc(
                    es.Identifier(
                        name=(
                            item.alias.sym_name
                            if item.alias
                            else item.name.sym_name
                        )
                    ),
                    jac_node=item.alias if item.alias else item.name,
                )
                specifiers.append(
                    self.sync_loc(
                        es.ImportSpecifier(imported=imported, local=local),
                        jac_node=item,
                    )
                )

    # Track client imports
    if node.is_client_decl and node.from_loc.prefix:
        resolved_path = node.from_loc.resolve_relative_path()
        import_key = node.from_loc.dot_path_str
        self.client_manifest.imports[import_key] = resolved_path
        self.client_manifest.has_client = True

    # Generate import declaration
    import_decl = self.sync_loc(
        es.ImportDeclaration(specifiers=specifiers, source=source),
        jac_node=node,
    )
    self.imports.append(import_decl)
    node.gen.es_ast = []
```

---

## Testing Strategy

### Unit Tests

1. **test_import_default.jac**
```jac
cl import React from react;
cl import axios from axios;
```

2. **test_import_namespace.jac**
```jac
cl import * as React from react;
cl import * as _ from lodash;
```

3. **test_import_mixed.jac**
```jac
cl import React, { useState, useEffect } from react;
cl import Vue, { createApp } from vue;
```

4. **test_import_named.jac** (existing)
```jac
cl import from react { useState, useEffect };
cl import from lodash { debounce as delay };
```

5. **test_import_side_effect.jac**
```jac
cl import bootstrap/dist/css/bootstrap.min.css;
cl import normalize.css;
```

6. **test_import_relative.jac**
```jac
cl import Button from .components.Button;
cl import from ..utils { helper };
```

### Integration Tests

Add to `test_js_generation.py`:
```python
def test_import_patterns_comprehensive(self) -> None:
    """Test all import patterns generate correct JavaScript."""
    source = """
cl import React from react;
cl import * as _ from lodash;
cl import Vue, { createApp } from vue;
cl import from axios { get, post };
cl import ./styles.css;
"""
    # Verify generated JS matches expected output
```

---

## Examples

### Example 1: React Component with Hooks

**Jac Source:**
```jac
cl import React, { useState, useEffect } from react;

cl def Counter() {
    let [count, setCount] = useState(0);

    useEffect(lambda -> None {
        console.log(f"Count is {count}");
    }, [count]);

    return <div>
        <h1>Count: {count}</h1>
        <button onclick={lambda e -> None { setCount(count + 1); }}>
            Increment
        </button>
    </div>;
}
```

**Generated JavaScript:**
```javascript
import React, { useState, useEffect } from "react";

function Counter() {
    let [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`Count is ${count}`);
    }, [count]);

    return __jacJsx("div", {}, [
        __jacJsx("h1", {}, ["Count: ", count]),
        __jacJsx("button", { onclick: (e) => { setCount(count + 1); } }, [
            "Increment"
        ])
    ]);
}
```

### Example 2: Utility Library with Namespace Import

**Jac Source:**
```jac
// Option 1: Using existing syntax (NO grammar changes!)
cl import from lodash { * as _ };

// Option 2: Alternative standalone syntax (if grammar extension added)
cl import * as _ from lodash;

cl def processData(data: list) {
    return _.map(data, lambda item -> dict {
        return _.pick(item, ["id", "name"]);
    });
}
```

**Generated JavaScript:**
```javascript
import * as _ from "lodash";

function processData(data) {
    return _.map(data, (item) => {
        return _.pick(item, ["id", "name"]);
    });
}
```

### Example 3: CSS and Side-Effect Imports

**Jac Source:**
```jac
cl import normalize.css;
cl import ./styles/main.css;
cl import core-js/stable;

cl import Button from .components.Button;

cl def App() {
    return <div class="app">
        <Button label="Click Me" />
    </div>;
}
```

**Generated JavaScript:**
```javascript
import "normalize.css";
import "./styles/main.css";
import "core-js/stable";
import Button from "./components/Button";

function App() {
    return __jacJsx("div", { class: "app" }, [
        __jacJsx(Button, { label: "Click Me" }, [])
    ]);
}
```

---

## Backwards Compatibility

All proposed changes are **additive**:

1. ✅ Existing named imports (`cl import from X { a, b }`) continue to work
2. ✅ Existing relative imports (`cl import from .utils { func }`) continue to work
3. ✅ Existing prefix notation (`jac:client_runtime`) continues to work
4. ✅ No breaking changes to esast_gen_pass.py logic

---

## Migration Path

### For Existing Code
No changes required - all existing `cl import` statements remain valid.

### For New Code
Developers can now use:
```jac
# Old style (still works)
cl import from react { default as React, useState }

# New style (cleaner)
cl import React, { useState } from react;
```

---

## Open Questions

1. **Wildcard Exports:** Should we support `export * from 'module'`?
   - **Recommendation:** Defer to Phase 3 - not commonly used in application code

2. **Type Imports:** How to handle TypeScript `import type`?
   - **Recommendation:** Not needed for JavaScript generation initially

3. **Import Assertions:** Support for `import data from './file.json' assert { type: 'json' }`?
   - **Recommendation:** Wait for wider browser support

4. **Re-exports:** Should `cl` declarations support re-exporting?
   - **Recommendation:** Yes, but as separate feature (export syntax)

---

## Conclusion

This proposal enables full JavaScript import compatibility in Jac's `cl` declarations through **minimal, non-breaking grammar extensions**.

### Key Findings

1. **Namespace imports require ZERO grammar changes!** 🎉
   - Simply use: `cl import from module { * as Name }`
   - Can be implemented immediately in `esast_gen_pass.py`

2. **Only 2 grammar productions need to be added:**
   - Default imports: `import Name from module`
   - Mixed imports: `import Name, { a, b } from module`

3. **Implementation can be done incrementally:**
   - **Phase 1 (Quick Win):** Namespace imports (implementation-only)
   - **Phase 2 (Essential):** Default imports (small grammar change)
   - **Phase 3 (Enhanced):** Mixed imports (small grammar change)
   - **Phase 4 (Future):** Type imports + advanced patterns

4. **100% backwards compatible** - all existing code continues to work

All patterns maintain Jac's Python-inspired syntax while generating standard, idiomatic JavaScript code.

### Immediate Next Steps

1. Implement namespace import detection in `esast_gen_pass.py::exit_import()`
2. Add test cases for `cl import from lodash { * as _ }`
3. Verify generated JavaScript matches expected output
4. Document the pattern in jsx_client_serv_design.md
