// main.jsx
// ----------------------------------------------------------------------
import React from 'react';
import { createRoot } from 'react-dom/client';

// 1. Import the main application component created by the Jac compiler
// The entry function must return the component itself.
import { littlex_app } from './jac_app_react.jsx'; 

// Get the main component function/class from the entry point
const App = littlex_app();

// 2. Standard React Mount
const rootEl = document.getElementById('__jac_root');

if (rootEl) {
    const root = createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
// ----------------------------------------------------------------------