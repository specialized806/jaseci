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
