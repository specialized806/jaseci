import * as JacRuntime from "@client_runtime.js";
// Client module: jac_app
import { Feed } from "./feed";
function HomeView() {
  return __jacJsx("div", {"style": {"minHeight": "100vh", "fontFamily": "-apple-system, BlinkMacSystemFont, sans-serif"}}, [__jacJsx("main", {"style": {"maxWidth": "1200px", "margin": "0 auto", "padding": "60px 40px"}}, [__jacJsx("div", {"style": {"textAlign": "center", "marginBottom": "80px"}}, [__jacJsx("h1", {"style": {"fontSize": "56px", "marginBottom": "20px"}}, ["Welcome to"]), __jacJsx("p", {"style": {"fontSize": "20px", "color": "#666"}}, ["One Language. One Stack. Zero Friction."]), __jacJsx(Feed, {}, [])]), __jacJsx("div", {"style": {"display": "grid", "gridTemplateColumns": "repeat(2, 1fr)", "gap": "24px", "marginBottom": "60px"}}, [__jacJsx("a", {"href": "https://docs.jaseci.org", "target": "_blank", "style": {"padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000"}}, [__jacJsx("h3", {"style": {"marginTop": "0", "marginBottom": "12px"}}, ["📖 Documentation"]), __jacJsx("p", {"style": {"color": "#666", "margin": "0"}}, ["Learn how to build with OneLang"])]), __jacJsx("a", {"href": "https://docs.jaseci.org/learn", "target": "_blank", "style": {"padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000"}}, [__jacJsx("h3", {"style": {"marginTop": "0", "marginBottom": "12px"}}, ["🎓 Learn"]), __jacJsx("p", {"style": {"color": "#666", "margin": "0"}}, ["Tutorials and guides"])]), __jacJsx("a", {"href": "/examples", "style": {"padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000"}}, [__jacJsx("h3", {"style": {"marginTop": "0", "marginBottom": "12px"}}, ["💡 Examples"]), __jacJsx("p", {"style": {"color": "#666", "margin": "0"}}, ["Sample applications"])]), __jacJsx("a", {"href": "https://github.com/Jaseci-Labs/jaseci", "target": "_blank", "style": {"padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000"}}, [__jacJsx("h3", {"style": {"marginTop": "0", "marginBottom": "12px"}}, ["🔧 Community"]), __jacJsx("p", {"style": {"color": "#666", "margin": "0"}}, ["GitHub repository"])])]), __jacJsx("footer", {"style": {"borderTop": "1px solid #eaeaea", "paddingTop": "40px", "textAlign": "center", "color": "#999"}}, [__jacJsx("p", {}, ["Get started by editing", __jacJsx("code", {"style": {"backgroundColor": "#f5f5f5", "padding": "2px 6px", "borderRadius": "3px"}}, ["app.jac"])])])])]);
}
function App() {
  let home_route = {"path": "/", "component": () => {
    return HomeView();
  }, "guard": null};
  let routes = [home_route];
  let router = initRouter(routes, "/");
  return __jacJsx("div", {"class": "app-container"}, [router.render()]);
}
function jac_app() {
  return App();
}


            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['App', 'Feed', 'HomeView', 'Post', 'jac_app'];
            const globalFunctionMap = {
    "App": App,
    "Feed": Feed,
    "HomeView": HomeView,
    "Post": Post,
    "jac_app": jac_app
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        

            // --- JAC CLIENT INITIALIZATION SCRIPT ---
            // Expose functions globally for Jac runtime registration
            const clientFunctions = ['App', 'Feed', 'HomeView', 'Post', 'jac_app'];
            const functionMap = {
    "App": App,
    "Feed": Feed,
    "HomeView": HomeView,
    "Post": Post,
    "jac_app": jac_app
};
            for (const funcName of clientFunctions) {
                globalThis[funcName] = functionMap[funcName];
            }
            JacRuntime.__jacRegisterClientModule("jac_app", clientFunctions, {});
            globalThis.start_app = jac_app;
            // Call the start function immediately if we're not hydrating from the server
            if (!document.getElementById('__jac_init__')) {
                globalThis.start_app();
            }
            // --- END JAC CLIENT INITIALIZATION SCRIPT ---
        