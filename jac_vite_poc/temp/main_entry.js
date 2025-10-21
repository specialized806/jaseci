
// main_entry.js - The Orchestration Wrapper

import { renderJsxTree, __jacExecuteHydration, jacSignup, jacLogin, jacLogout, jacIsLoggedIn } from './jac_runtime.js';
import { littlex_app } from './app_logic.js';

// ⚠️ Note: Global exposure is a temporary hack for Jac's current global reliance.
// The long-term goal is to have the Jac compiler replace global calls with imports.
// For POC purposes, we re-expose the main app entry function and runtime dependencies globally.
window.littlex_app = littlex_app; 
window.jacSignup = jacSignup;
window.jacLogin = jacLogin;
window.jacLogout = jacLogout;
window.jacIsLoggedIn = jacIsLoggedIn;


// --- Application Startup ---
// 1. Initialise the router and get the root JSX node
const initialJsxNode = littlex_app();

// 2. Start the hydration/rendering process.
// This function will look for the JSX tree and render it.
// It also contains the logic to run the first client function (like littlex_app) 
// if running without SSR hydration.
__jacExecuteHydration();


// --- HMR Placeholder (for future reference) ---
// if (import.meta.hot) {
//     import.meta.hot.accept(() => {
//         // Logic to re-run littlex_app() and call renderJsxTree() on the root
//         console.log('HMR update received for Jac application.');
//         // renderJsxTree(littlex_app(), document.getElementById("__jac_root")); 
//     });
// }
