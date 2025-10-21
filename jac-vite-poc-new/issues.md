# Jac Vite Bundler - Future Issues to Fix

## Critical Issues

### 1. Minification Disabled (Production Issue)
**Problem**: Currently minification is disabled (`minify: false`) to preserve function names for Jac runtime registration.

**Where it's causing issues**:
```javascript
// In jac_bundler_cli.py line 104:
minify: false, // Disable minification to preserve function names
```

**Current bundle size**: `client.CIPFkygj.js  26.15 kB` (unminified)
**Expected minified size**: ~15-18 kB (30-40% reduction)

**Impact**: 
- Larger bundle sizes in production
- Slower loading times
- Not suitable for production deployment

**Where it needs to be fixed**:
- `jac_bundler_cli.py` lines 104-105: Enable minification while preserving Jac function names
- Need custom Vite plugin or Rollup configuration

**Potential Solutions**:
- Implement a custom Vite plugin that preserves specific function names during minification
- Use Rollup's `preserveEntrySignatures` option
- Modify Jac runtime to work with minified function names
- Create a function name mapping system that survives minification

### 2. Manual Function Mapping (Maintenance Issue)
**Problem**: The `functionMap` object in `jac_bundler_cli.py` manually maps all function names, requiring updates when functions are added/removed.

**Where it's causing issues**:
```javascript
// In jac_bundler_cli.py lines 44-70:
const functionMap = {
    "navigate_to": navigate_to,
    "render_app": render_app,
    "get_current_route": get_current_route,
    // ... 22 more manual mappings
    "littlex_app": littlex_app
};
```

**Example failure scenario**:
- Developer adds new function `handleLogout()` to `app_logic.js`
- Forgets to add it to `client_functions` list (line 29-37)
- Forgets to add it to `functionMap` (lines 44-70)
- Runtime error: `[Jac] Client function not found during registration: handleLogout`

**Impact**:
- Prone to human error
- Requires manual maintenance
- Easy to forget updating when adding new functions

**Where it needs to be fixed**:
- `jac_bundler_cli.py` lines 29-37: `client_functions` list
- `jac_bundler_cli.py` lines 44-70: `functionMap` object
- Need automatic function discovery mechanism

**Potential Solutions**:
- Automatically generate the function map from AST analysis
- Use reflection/introspection to discover functions at runtime
- Create a build-time script that scans `app_logic.js` for exported functions

### 3. IIFE Scope Limitations
**Problem**: Functions are trapped in IIFE scope and need manual exposure to global scope.

**Where it's causing issues**:
```javascript
// In generated bundle (client.CIPFkygj.js):
(function() {
  "use strict";
  function TweetCard(tweet) { /* ... */ }
  function App() { /* ... */ }
  // ... all functions trapped inside IIFE
  
  // Manual workaround needed:
  const functionMap = { "TweetCard": TweetCard, "App": App, /* ... */ };
  for (const funcName of clientFunctions) {
    globalThis[funcName] = functionMap[funcName]; // Manual global exposure
  }
})();
```

**Example error when this fails**:
```
Uncaught ReferenceError: TweetCard is not defined
    at <anonymous> line 593 > eval:1
```

**Impact**:
- Complex workarounds needed
- Potential naming conflicts
- Not following standard module patterns

**Where it needs to be fixed**:
- `jac_bundler_cli.py` lines 97-102: Vite config output format
- Generated bundle structure needs to change from IIFE to proper module exports

**Potential Solutions**:
- Use ES modules instead of IIFE
- Implement proper module exports/imports
- Use a different bundling strategy that doesn't require global exposure

## Medium Priority Issues

### 4. Hardcoded Module Name
**Problem**: Module name `"littleX_single_nodeps"` is hardcoded in both bundler and HTML.

**Where it's causing issues**:
```python
# In jac_bundler_cli.py line 14:
JAC_CLIENT_MODULE_NAME = "littleX_single_nodeps"
```

```html
<!-- In index.html line 11: -->
<script id="__jac_init__" type="application/json">
{
    "module": "littleX_single_nodeps",  <!-- Hardcoded -->
    "function": "App",
    ...
}
```

**Example problem**:
- Developer creates new Jac app called "myApp"
- Must manually change module name in 2+ places
- Easy to forget updating HTML file
- Causes runtime error: `[Jac] Client module not registered: myApp`

**Impact**: 
- Not reusable for other Jac applications
- Requires manual updates when changing module names

**Where it needs to be fixed**:
- `jac_bundler_cli.py` line 14: Make configurable
- `index.html` line 11: Auto-generate or make configurable
- Add command-line argument: `--module-name myApp`

**Solution**: Make module name configurable via command-line argument or config file.

### 5. Bundle File Reference Updates
**Problem**: HTML file needs manual updates when bundle hash changes.

**Where it's causing issues**:
```html
<!-- In index.html line 26: -->
<script src="/static/client/js/client.CIPFkygj.js" defer></script>
<!-- Must manually update every time bundle rebuilds -->
```

**Example workflow problem**:
1. Developer runs `python jac_bundler_cli.py`
2. New bundle created: `client.ABC123.js`
3. Developer forgets to update HTML file
4. Browser loads old bundle: `client.CIPFkygj.js`
5. Runtime errors due to outdated bundle

**Impact**:
- Manual maintenance required
- Easy to forget updating references
- Silent failures when using old bundles

**Where it needs to be fixed**:
- `index.html` line 26: Auto-generate script tag
- `jac_bundler_cli.py`: Add HTML template generation
- Need build script that updates HTML automatically

**Solution**: Implement automatic HTML template generation or use a build script that updates references.

### 6. Missing Error Handling
**Problem**: Limited error handling for missing functions or registration failures.

**Where it's causing issues**:
```javascript
// In runtime.js lines 380-384:
let funcRef = scope[funcName];
if (!funcRef) {
  console.error("[Jac] Client function not found during registration: " + funcName);
  continue; // Silent failure - function just skipped
}
```

**Example silent failure**:
- Function `handleLogout` missing from `functionMap`
- Runtime logs error but continues
- App appears to work but logout functionality broken
- No clear indication that function registration failed

**Impact**:
- Silent failures in some cases
- Difficult to debug issues
- Partial functionality failures go unnoticed

**Where it needs to be fixed**:
- `runtime.js` lines 380-384: Add validation and fail-fast behavior
- `jac_bundler_cli.py`: Add pre-build validation
- Need comprehensive error reporting

**Solution**: Add comprehensive error handling and validation.

## Low Priority Issues

### 7. Development vs Production Builds
**Problem**: No distinction between development and production builds.
**Impact**:
- Same configuration for both environments
- No development-specific optimizations

**Solution**: Implement separate build configurations for dev/prod.

### 8. Bundle Analysis
**Problem**: No bundle size analysis or optimization suggestions.
**Impact**:
- No visibility into bundle composition
- Missing optimization opportunities

**Solution**: Add bundle analysis tools and reporting.

## Recommended Next Steps

1. **Immediate**: Implement automatic function discovery to eliminate manual mapping
2. **Short-term**: Create a Vite plugin that preserves Jac function names during minification
3. **Medium-term**: Refactor to use proper ES modules instead of IIFE + global exposure
4. **Long-term**: Integrate with Jac's build system for seamless development experience