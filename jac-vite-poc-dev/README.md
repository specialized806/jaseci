# Jac Vite Development Workflow - Improved

This directory contains an improved development workflow for Jac applications that addresses the issues identified in the production bundler.

## 🚀 Quick Start

### Development Mode (Recommended)
```bash
# Start development server with Hot Module Replacement
python jac_dev_server_improved.py

# Or use the unified tool
python ../jac_unified.py dev
```

### Production Build
```bash
# Build production bundle
python ../jac_unified.py build

# Serve production bundle locally
python ../jac_unified.py serve
```

### Watch Mode
```bash
# Watch for changes and auto-rebuild
python ../jac_unified.py watch
```

## 🔧 What's Improved

### 1. **Proper Jac Runtime Integration**
- ✅ Functions are properly registered with Jac runtime
- ✅ Hydration works correctly in development
- ✅ Same runtime behavior as production

### 2. **Hot Module Replacement (HMR)**
- ✅ Instant updates when you change code
- ✅ Preserves application state during updates
- ✅ Better development experience

### 3. **Consistent Development/Production**
- ✅ Same function registration logic
- ✅ Same module structure
- ✅ Easier to catch production issues early

### 4. **Better Error Handling**
- ✅ Clear error messages
- ✅ Proper validation of required files
- ✅ Graceful cleanup on exit

## 📁 File Structure

```
jac-vite-poc-dev/
├── jac_dev_server_improved.py    # Improved development server
├── index_dev.html                # Enhanced HTML template
├── app_logic.js                  # Your Jac application logic
├── runtime.js                    # Jac runtime utilities
├── package.json                  # Node.js dependencies
└── node_modules/                 # Vite and dependencies
```

## 🛠️ Development Features

### Hot Module Replacement
- Changes to `app_logic.js` are instantly reflected
- No page refresh needed
- Application state is preserved

### Function Name Preservation
- Function names are preserved for easier debugging
- Same registration logic as production
- Easy to trace function calls

### Enhanced HTML Template
- Development-specific styling
- Clear indication of development mode
- Better error reporting

### Automatic Cleanup
- Temporary files are cleaned up on exit
- Use `--no-cleanup` flag to preserve files for debugging

## 🔄 Workflow Comparison

### Old Development Workflow
```bash
# Had issues with ES module imports
# Missing Jac runtime registration
# Inconsistent with production
python jac_cl_dev_server.py
```

### New Development Workflow
```bash
# Proper Jac runtime integration
# Hot Module Replacement
# Consistent with production
python jac_dev_server_improved.py
```

## 🐛 Troubleshooting

### Common Issues

1. **"Function not found during registration"**
   - Make sure function is defined in `app_logic.js`
   - Check that function name is in the `client_functions` list

2. **"Module not registered"**
   - Verify module name matches between HTML and server
   - Check `JAC_CLIENT_MODULE_NAME` constant

3. **HMR not working**
   - Ensure Vite is properly installed (`npm install`)
   - Check that files are being watched correctly

### Debug Mode
```bash
# Preserve temporary files for debugging
python jac_dev_server_improved.py --no-cleanup
```

## 🚀 Next Steps

This improved development workflow addresses the critical issues identified in the production bundler:

1. **✅ Proper Jac Runtime Integration** - Functions are correctly registered
2. **✅ Hot Module Replacement** - Better development experience
3. **✅ Consistent Behavior** - Same logic as production
4. **✅ Better Error Handling** - Clear error messages

The next step would be to implement the solutions outlined in `../jac-vite-poc-new/issues.md` to enable minification while preserving function names for production builds.
