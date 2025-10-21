// jac_app_react.jsx
// ----------------------------------------------------------------------
import React from 'react';
// Import hooks and utilities from the runtime module
import { useState, useEffect, jacIsLoggedIn, jacLogin } from './jac_runtime_react.js';

// ... (App and LoginForm component definitions remain the same as previous response) ...

function App() {
    const [route, setRoute] = useState(window.location.hash.slice(1) || 'home');
    const isLoggedIn = jacIsLoggedIn();
    
    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash.slice(1) || 'home');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    let content;
    if (!isLoggedIn || route === 'login') {
        content = <LoginForm setRoute={setRoute} />;
    } else if (route === 'home') {
        content = <h1>Welcome Home!</h1>;
    } else {
        content = <h1>404 - Route Not Found</h1>;
    }

    return (
        <div className="app-container">
            <header style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
                <a href="#home">Home</a> | 
                {isLoggedIn && <button onClick={() => { window.localStorage.removeItem('auth_token'); setRoute('login'); }}>Logout</button>}
            </header>
            <main>{content}</main>
        </div>
    );
}

function LoginForm({ setRoute }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await jacLogin(username, password);
        if (success) {
            setRoute('home');
            window.location.hash = '#home';
        } else {
            alert('Login failed!');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
            <h2>Login</h2>
            <input type="text" placeholder="User" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Pass" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Log In</button>
        </form>
    );
}

// The single function exported that returns the root component
export function littlex_app() {
    return App; 
}
// ----------------------------------------------------------------------