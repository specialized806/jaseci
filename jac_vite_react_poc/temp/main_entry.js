
// main_entry.js - The Orchestration Wrapper
import { startJacApp } from './jac_runtime_react.js';
import { littlex_app } from './jac_app_react.jsx';

// Execute the app startup sequence
const App = littlex_app();
startJacApp(App);
