#!/bin/bash
# run_poc.sh

# --- A. Create Mock Input Files for Testing ---

# 1. Mock the Runtime JS (MUST include 'export')
cat <<EOL > runtime.js
export function __jacJsx(tag, props, children) {
  return {"tag": tag, "props": props, "children": children};
}
export function renderJsxTree(node, container) {
  container.replaceChildren(__buildDom(node));
}
// Add other necessary exports from your full runtime.js
export function __jacExecuteHydration() {
  console.log("Hydration logic executed.");
}
EOL

# 2. Mock the Application Logic (MUST include 'export' for the entry point)
cat <<EOL > app_logic.js
// Mock Application State (will be bundled)
const appState = {"current_route": "login"};

// Mock App Component
function App() {
  return __jacJsx("div", {}, ["Hello from App. Current route: ", appState.current_route]);
}

// Mock The Router/Entry Point (MUST be exported)
export function littlex_app() {
  console.log("littlex_app running...");
  return App();
}
EOL

# --- B. Run the POC ---
python3 main.py --runtime_file jac_runtime.js --app_logic_file app_logic.js --entry littlex_app --output poc_bundle.js

# --- C. Clean up mock files ---
# rm runtime.js littlex.js

echo " "
echo "Content of final bundle (poc_bundle.js):"
echo "---"
cat poc_bundle.js | head -n 30 # Show only the first 30 lines