# Jac Bundler CLI Architecture

## Overview
The Jac Bundler CLI is a Python tool that orchestrates the bundling of Jac application files using Vite as the underlying bundler.

## Architecture Flow

```
Input Files                    Jac Bundler CLI                    Output
┌─────────────┐               ┌─────────────────┐               ┌─────────────┐
│ app_logic.js│──────────────▶│ 1. File Combine │               │             │
│ runtime.js  │               │                 │               │             │
│ package.json│               │                 │               │             │
└─────────────┘               └─────────────────┘               │             │
                                │                                 │             │
                                ▼                                 │             │
                               ┌─────────────────┐               │             │
                               │ 2. Generate     │               │             │
                               │    Vite Config  │               │             │
                               └─────────────────┘               │             │
                                │                                 │             │
                                ▼                                 │             │
                               ┌─────────────────┐               │             │
                               │ 3. Run Vite     │──────────────▶│ client.[hash].js │
                               │    Build        │               │             │
                               └─────────────────┘               │             │
                                │                                 │             │
                                ▼                                 │             │
                               ┌─────────────────┐               │             │
                               │ 4. Clean Up     │               │             │
                               │    Temp Files   │               │             │
                               └─────────────────┘               └─────────────┘
```

## Key Components

### 1. File Combination (`create_temp_entry`)
- **Input**: `app_logic.js`, `runtime.js`
- **Process**: 
  - Reads both files
  - Creates Jac runtime initialization script
  - Combines files in order: Runtime → App Logic → Init Script
- **Output**: `temp_main_entry.js`

### 2. Vite Configuration (`create_vite_config`)
- **Input**: Entry file path, output directory
- **Process**: Generates temporary `vite.config.js` with:
  - IIFE format (Immediately Invoked Function Expression)
  - Disabled minification (preserves function names)
  - Module alias resolution for `client_runtime`
- **Output**: `vite.config.js`

### 3. Vite Build (`run_vite_build`)
- **Input**: Config file, package.json
- **Process**: Executes `npx vite build --config vite.config.js`
- **Output**: Bundled JavaScript file in `static/client/js/`

### 4. Cleanup (`clean_up_files`)
- **Process**: Removes temporary files (`temp_main_entry.js`, `vite.config.js`)

## Key Features

- **Function Name Preservation**: Disables minification to keep function names for Jac runtime registration
- **Module Resolution**: Handles `client_runtime` import alias
- **Error Handling**: Comprehensive error checking at each step
- **Temporary File Management**: Creates and cleans up temporary files automatically
- **Hash-based Output**: Generates files with content hashes for cache busting

## Dependencies

- **Python**: Path handling, subprocess execution
- **Node.js/npm**: Required for Vite execution
- **Vite**: JavaScript bundler (installed via npm)
