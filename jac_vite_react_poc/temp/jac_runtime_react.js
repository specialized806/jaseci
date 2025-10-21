// jac_runtime_react.js
// ----------------------------------------------------------------------
import { useState, useEffect } from 'react';

// Export React core hooks/objects for the App to use
export { useState, useEffect };

// Export legacy auth/api utilities (must be used via imports by jac_app_react.jsx)
export function jacIsLoggedIn() {
    return window.localStorage.getItem('auth_token') === 'mock_token';
}

export async function jacLogin(username, password) {
    if (username === 'test' && password === 'pass') {
        window.localStorage.setItem('auth_token', 'mock_token');
        return true;
    }
    return false;
}
// ----------------------------------------------------------------------