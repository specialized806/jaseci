cl import from .post {Post}

# Pages
cl def HomeView() -> any {
    return <div
    style={{
        "minHeight": "100vh",
        "fontFamily": "-apple-system, BlinkMacSystemFont, sans-serif"
    }}>
        <main
        style={{
            "maxWidth": "1200px",
            "margin": "0 auto",
            "padding": "60px 40px"
        }}>
            <div
            style={{
                "textAlign": "center",
                "marginBottom": "80px"
            }}>
                <h1
                style={{
                    "fontSize": "56px",
                    "marginBottom": "20px"
                }}>
                    Welcome to
                    <span style={{"color": "#007bff"}}>OneLang</span>
                </h1>
                <Post />
                <p
                style={{
                    "fontSize": "20px",
                    "color": "#666"
                }}>
                    One Language. One Stack. Zero Friction.
                </p>
            </div>

            <div
            style={{
                "display": "grid",
                "gridTemplateColumns": "repeat(2, 1fr)",
                "gap": "24px",
                "marginBottom": "60px"
            }}>
                <a
                href="https://docs.jaseci.org"
                target="_blank"
                style={{
                    "padding": "32px",
                    "backgroundColor": "white",
                    "border": "1px solid #eaeaea",
                    "borderRadius": "8px",
                    "textDecoration": "none",
                    "color": "#000"
                }}>
                    <h3
                    style={{
                        "marginTop": "0",
                        "marginBottom": "12px"
                    }}>📖 Documentation</h3>
                    <p style={{"color": "#666", "margin": "0"}}>
                        Learn how to build with OneLang
                    </p>
                </a>
                <a
                href="https://docs.jaseci.org/learn"
                target="_blank"
                style={{
                    "padding": "32px",
                    "backgroundColor": "white",
                    "border": "1px solid #eaeaea",
                    "borderRadius": "8px",
                    "textDecoration": "none",
                    "color": "#000"
                }}>
                    <h3
                    style={{
                        "marginTop": "0",
                        "marginBottom": "12px"
                    }}>🎓 Learn</h3>
                    <p style={{"color": "#666", "margin": "0"}}>
                        Tutorials and guides
                    </p>
                </a>
                <a
                href="/examples"
                style={{
                    "padding": "32px",
                    "backgroundColor": "white",
                    "border": "1px solid #eaeaea",
                    "borderRadius": "8px",
                    "textDecoration": "none",
                    "color": "#000"
                }}>
                    <h3
                    style={{
                        "marginTop": "0",
                        "marginBottom": "12px"
                    }}>💡 Examples</h3>
                    <p style={{"color": "#666", "margin": "0"}}>
                        Sample applications
                    </p>
                </a>
                <a
                href="https://github.com/Jaseci-Labs/jaseci"
                target="_blank"
                style={{
                    "padding": "32px",
                    "backgroundColor": "white",
                    "border": "1px solid #eaeaea",
                    "borderRadius": "8px",
                    "textDecoration": "none",
                    "color": "#000"
                }}>
                    <h3
                    style={{
                        "marginTop": "0",
                        "marginBottom": "12px"
                    }}>🔧 Community</h3>
                    <p style={{"color": "#666", "margin": "0"}}>
                        GitHub repository
                    </p>
                </a>
            </div>

            <footer
            style={{
                "borderTop": "1px solid #eaeaea",
                "paddingTop": "40px",
                "textAlign": "center",
                "color": "#999"
            }}>
                <p>
                    Get started by editing
                    <code
                    style={{
                        "backgroundColor": "#f5f5f5",
                        "padding": "2px 6px",
                        "borderRadius": "3px"
                    }}>app.jac</code>
                </p>
            </footer>
        </main>
    </div>;
}


# Main App component with declarative router
cl def App() -> any {

    home_route = {
        "path": "/",
        "component": lambda -> any { return HomeView(); },
        "guard": None
    };

    routes = [home_route];
    router = initRouter(routes, "/");

    # add all the wrapper components here
    return <div class="app-container">
        {router.render()}
    </div>;
}

# Main SPA entry point - simplified with reactive routing
cl def jac_app() -> any {
    return App();
}
