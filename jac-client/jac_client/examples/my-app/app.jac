cl import from .utils {
    formatMessage,
    calculateSum,
    JS_CONSTANT,
    MessageFormatter
}
cl import from .button {
    CustomButton
}
# Pages
cl def HomeView() -> any {
    let greeting = formatMessage("Jac");
    let sum = calculateSum(5, 3);
    let formatter = MessageFormatter("JS");
    let formatted = formatter.format("Hello from JS class");    
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
        }}
        >
            <CustomButton />
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
