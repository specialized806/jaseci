# Jac Client Runtime Feature Roadmap

This document captures the language and compiler enhancements needed to migrate the remaining JavaScript glue code in `client_bundle.py` into native Jac modules.

# Overview

The current web compilation pipeline relies on three moving pieces:

1. `client_runtime.jac` — Jac source that provides JSX helpers, DOM builders, and walker RPC shims.
2. Jac compiler (`jac.lark` + `esast_gen_pass.py`) — translates Jac AST into ESTree, then JavaScript.
3. `client_bundle.py` — Python glue that compiles the runtime and target module to JS and injects browser bootstrap code.

```mermaid
graph TD
    A["Jac Module (.jac)"] --> B["ESTree AST"]
    R["client_runtime.jac"] --> B
    B --> C["JS Source"]
    C --> D["Browser Bundle"]
    D --> E["Browser Runtime"]
```

`client_bundle.py` still hosts a significant block of JavaScript — chiefly the polyfill, global registration, and hydration bootstrap — because the Jac language and ECMAScript backend lack certain constructs. Bridging these gaps will let us author the entire client runtime (including bootstrap) in Jac.

# Feature Gaps & Proposals

## 1. `typeof` and General Unary Operator Support

### Motivation

The bootstrap must probe browser globals (`globalThis`, `window`, `document`, etc.) without throwing in non-DOM contexts. JavaScript uses `typeof` for this:

```javascript
const scope = typeof globalThis !== "undefined" ? globalThis : window;
if (typeof document === "undefined") { return; }
```

Jac cannot emit this today because:

* The grammar (`jac.lark`) has no `TYPEOF` token.
* `EsastGenPass.exit_unary_expr` only maps `-, +, !, ~`.

### Desired Jac Source

```jac
let scope = typeof globalThis != "undefined" ? globalThis : window;

if typeof document == "undefined" {
    return;
}
```

### Proposed Compiler Changes

1. **Lexer/Parser**
   * Add `TYPEOF: "typeof"` terminal in `jac.lark`.
   * Update `factor` rule to include `TYPEOF factor`.

2. **IR Node (Optional)**
   * `uni.UnaryExpr` already models unary operators; extend it to accept the new token.

3. **ECMAScript Codegen**
   * Extend `op_map` in `EsastGenPass.exit_unary_expr` to map `Tok.TYPEOF` to `"typeof"`.
   * Ensure the unparser handles `typeof` (it already does generically for unary ops).

4. **Testing**
   * Unit tests covering `typeof` in expressions and control flow.
   * Integration test showing client runtime bootstrap compiled entirely from Jac.

### Migration Impact

Once `typeof` works, guards around `globalThis`, `window`, and `document` may move into `client_runtime.jac`, reducing the bootstrap JS block.

## 2. Function Expressions and Closures

### Motivation

`client_bundle.py` wraps registration logic in an Immediately Invoked Function Expression (IIFE) to prevent leaking helper variables:

```javascript
(function registerJacClientModule() {
  const moduleFunctions = {};
  // ...
})();
```

Jac currently supports `def` only as declarations, not expressions. Although `jac.lark` lists `lambda_expr`, `EsastGenPass` doesn't implement it, and there is no syntax for emitting a multi-statement closure at expression sites.

### Desired Jac Source

```jac
(def registerJacClientModule() {
    let moduleFunctions: dict[str, any] = {};
    // ...
})()  # IIFE pattern
```

or using lambda syntax if extended:

```jac
lambda registerJacClientModule() {
    let moduleFunctions: dict[str, any] = {};
    // ...
}();
```

### Proposed Design

1. **Function Expression Syntax**
   * Option A: Permit `def` as an expression when parenthesized.
   * Option B: Promote `lambda_expr` to generate `FunctionExpression` / `ArrowFunctionExpression`.

2. **AST Representation**
   * Introduce a new IR node (e.g., `FunctionExpr`) or reuse `Ability` with a flag.

3. **Codegen**
   * Emit `es.FunctionExpression` or `es.ArrowFunctionExpression` rather than `FunctionDeclaration`.
   * Handle name scoping: if the expression carries an identifier, emit named function expressions for stack traces while keeping them local.

4. **Immediate Invocation**
   * Allow call syntax immediately after the function expression (`(... )()`).

### Examples

**Jac (proposed)**:

```jac
let hydrate = def(payload: dict) {
    if not payload.get("function") {
        return;
    }
    // ...
};

hydrate(init_payload);
```

**Generated JS**:

```javascript
const hydrate = function (payload) {
  if (!payload.get("function")) {
    return;
  }
  // ...
};

hydrate(init_payload);
```

### Testing & Tooling

* Parser tests ensuring precedence with surrounding expressions.
* Codegen tests verifying IIFE emission.
* Formatting rules (Jac formatter) updated to handle inline `def`.

## 3. Arrow Functions / Concise Lambdas

### Motivation

The bootstrap defines small callbacks (e.g., `const applyRender = (node) => { ... };`). Forcing these to be top-level Jac functions clutters the API.

### Proposal

Implement arrow-style lambda expressions leveraging the existing but unused `lambda_expr` rule:

**Jac (proposed)**:

```jac
let apply_render = (node) => {
    let renderer = globalThis.renderJsxTree or renderJsxTree;
    if not renderer {
        return;
    }
    renderer(node, root_el);
};
```

**Generated JS**:

```javascript
const apply_render = (node) => {
  const renderer = globalThis.renderJsxTree || renderJsxTree;
  if (!renderer) {
    return;
  }
  renderer(node, root_el);
};
```

### Implementation Notes

* Reuse `lambda_expr` grammar, map to `uni.LambdaExpr`.
* Extend `EsastGenPass` with `exit_lambda_expr` to produce `es.ArrowFunctionExpression`.
* Support both expression-bodied and block-bodied lambdas.

### Compatibility

Arrow functions capture lexical `this`; ensure Jac semantics align or document differences.

## 4. Module-Scoped State Encapsulation

### Motivation

The JS bootstrap uses block scope (`const moduleFunctions = {};`) hidden inside the IIFE. Jac's `let` at top level currently emits `const` in module scope, risking collisions.

### Proposal

Introduce a `module` block or use function expressions (Feature 2) to isolate scope. Additional enhancements could include:

* Allowing `with entry` blocks to compile into closures.
* Supporting block-scoped `let` inside top-level braces.

```jac
with module {
    let module_functions: dict[str, any] = {};
    // ...
}
```

Generates:

```javascript
(()=>{
  const module_functions = {};
  // ...
})();
```

This could piggyback on the same IIFE infrastructure introduced for function expressions.

## 5. JSON Serialization Helpers

The bootstrap serializes manifest payloads using `JSON.stringify`. Jac already wraps these in `client_runtime.jac`. No compiler changes are required, but we should expose higher-level helpers to avoid duplicating serialization logic when moving the bootstrap into Jac.

# Summary Roadmap

```mermaid
timeline
    title Compiler Enhancements for Client Runtime
    Q1 2025 : Parser - add typeof token & unary support
    Q1 2025 : ES Codegen - unary operator mapping
    Q2 2025 : Function expressions & IIFE support
    Q2 2025 : Lambda/arrow expression codegen
    Q3 2025 : Refactor client bootstrap into Jac runtime
```

# Next Steps

1. Implement `typeof` in lexer, parser, and codegen; add regression tests.
2. Design and implement function expression syntax and semantics.
3. Enable arrow/lambda expressions and update tooling (formatter, linter).
4. Refactor `client_bundle.py` to call Jac-authored bootstrap once language support lands.

These changes will streamline the client build pipeline, reduce handwritten JS, and keep runtime logic in the Jac language proper.
