// Imported .jac module: client_runtime
function __jacJsx(tag, props, children) {
  return {"tag": tag, "props": props, "children": children};
}
function renderJsxTree(node, container) {
  container.replaceChildren(__buildDom(node));
}
function __buildDom(node) {
  if (node === null) {
    return document.createTextNode("");
  }
  if (!__isObject(node)) {
    return document.createTextNode(String(node));
  }
  let tag = node.get("tag");
  if (__isFunction(tag)) {
    let props = node.get("props", {});
    return __buildDom(tag(props));
  }
  let element = document.createElement(tag ? tag : "div");
  let props = node.get("props", {});
  for (const key of __objectKeys(props)) {
    let value = props.get(key);
    __applyProp(element, key, value);
  }
  let children = node.get("children", []);
  for (const child of children) {
    let childDom = __buildDom(child);
    if (childDom) {
      element.appendChild(childDom);
    }
  }
  return element;
}
function __applyProp(element, key, value) {
  if (key.startsWith("on")) {
    let event = key.slice(2).toLowerCase();
    element.addEventListener(event, value);
  } else if (key === "className" || key === "class") {
    element.className = value;
  } else if (key === "style" && __isObject(value)) {
    for (const styleKey of __objectKeys(value)) {
      element.style[styleKey] = value.get(styleKey);
    }
  } else if (key !== "children") {
    element.setAttribute(key, String(value));
  }
}
async function __jacSpawn(walker, fields) {
  let token = __getLocalStorage("jac_token");
  let response = await fetch("/walker/", {"method": "POST", "headers": {"Content-Type": "application/json", "Authorization": token ? "Bearer " : ""}, "body": JSON.stringify({"nd": "root", ...fields})});
  if (!response.ok) {
    let error_text = await response.text();
    throw new Error("Walker " + " failed: ");
  }
  return JSON.parse(await response.text());
}
async function __jacCallFunction(function_name, args) {
  let token = __getLocalStorage("jac_token");
  let response = await fetch("/function/", {"method": "POST", "headers": {"Content-Type": "application/json", "Authorization": token ? "Bearer " : ""}, "body": JSON.stringify({"args": args})});
  if (!response.ok) {
    let error_text = await response.text();
    throw new Error("Function " + " failed: ");
  }
  let data = JSON.parse(await response.text());
  return data.get("result");
}
async function jacSignup(username, password) {
  let response = await fetch("/user/create", {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"username": username, "password": password})});
  if (response.ok) {
    let data = JSON.parse(await response.text());
    let token = data.get("token");
    if (token) {
      __setLocalStorage("jac_token", token);
      return {"success": true, "token": token, "username": username};
    }
    return {"success": false, "error": "No token received"};
  } else {
    let error_text = await response.text();
    try {
      let error_data = JSON.parse(error_text);
      return {"success": false, "error": error_data.get("error", "Signup failed")};
    } catch {
      return {"success": false, "error": error_text};
    }
  }
}
async function jacLogin(username, password) {
  let response = await fetch("/user/login", {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"username": username, "password": password})});
  if (response.ok) {
    let data = JSON.parse(await response.text());
    let token = data.get("token");
    if (token) {
      __setLocalStorage("jac_token", token);
      return true;
    }
  }
  return false;
}
function jacLogout() {
  __removeLocalStorage("jac_token");
}
function jacIsLoggedIn() {
  let token = __getLocalStorage("jac_token");
  return token !== null && token !== "";
}
function __getLocalStorage(key) {
  let storage = globalThis.localStorage;
  return storage ? storage.getItem(key) : "";
}
function __setLocalStorage(key, value) {
  let storage = globalThis.localStorage;
  if (storage) {
    storage.setItem(key, value);
  }
}
function __removeLocalStorage(key) {
  let storage = globalThis.localStorage;
  if (storage) {
    storage.removeItem(key);
  }
}
function __isObject(value) {
  if (value === null) {
    return false;
  }
  return Object.prototype.toString.call(value) === "[object Object]";
}
function __isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}
function __objectKeys(obj) {
  if (obj === null) {
    return [];
  }
  return Object.keys(obj);
}
function __jacHasOwn(obj, key) {
  try {
    return Object.prototype.hasOwnProperty.call(obj, key);
  } catch {
    return false;
  }
}
function __jacEnsureObjectGetPolyfill() {
  let proto = Object.prototype;
  if (proto.get) {
    return;
  }
  function get_polyfill(key, defaultValue) {
    if (__jacHasOwn(this, key)) {
      return this[key];
    }
    if (defaultValue !== null) {
      return defaultValue;
    }
    return null;
  }
  Object.defineProperty(proto, "get", {"value": get_polyfill, "configurable": true, "writable": true});
}
function __jacGetDocument(scope) {
  try {
    return scope.document;
  } catch {
    return null;
  }
}
function __jacParseJsonObject(text) {
  try {
    let parsed = JSON.parse(text);
    if (__isObject(parsed)) {
      return parsed;
    }
    console.error("[Jac] Hydration payload is not an object");
    return null;
  } catch (err) {
    console.error("[Jac] Failed to parse hydration payload", err);
    return null;
  }
}
function __jacBuildOrderedArgs(order, argsDict) {
  let result = [];
  if (!order) {
    return result;
  }
  let values = __isObject(argsDict) ? argsDict : {};
  for (const name of order) {
    result.push(values.get(name));
  }
  return result;
}
function __jacResolveRenderer(scope) {
  if (scope.renderJsxTree) {
    return scope.renderJsxTree;
  }
  if (__isFunction(renderJsxTree)) {
    return renderJsxTree;
  }
  return null;
}
function __jacResolveTarget(moduleRecord, registry, name) {
  let moduleFunctions = moduleRecord && moduleRecord.moduleFunctions ? moduleRecord.moduleFunctions : {};
  if (__jacHasOwn(moduleFunctions, name)) {
    return moduleFunctions[name];
  }
  let registryFunctions = registry && registry.functions ? registry.functions : {};
  if (__jacHasOwn(registryFunctions, name)) {
    return registryFunctions[name];
  }
  return null;
}
function __jacSafeCallTarget(target, scope, orderedArgs, targetName) {
  try {
    let result = target.apply(scope, orderedArgs);
    return {"ok": true, "value": result};
  } catch (err) {
    console.error("[Jac] Error executing client function " + targetName, err);
    return {"ok": false, "value": null};
  }
}
function __jacGlobalScope() {
  try {
    return globalThis;
  } catch {}
  try {
    return window;
  } catch {}
  try {
    return;
  } catch {}
  return {};
}
function __jacEnsureRegistry() {
  let scope = __jacGlobalScope();
  let registry = scope.__jacClient;
  if (!registry) {
    registry = {"functions": {}, "globals": {}, "modules": {}, "state": {"globals": {}}, "__hydration": {"registered": false}, "lastModule": null};
    scope.__jacClient = registry;
    return registry;
  }
  if (!registry.functions) {
    registry.functions = {};
  }
  if (!registry.globals) {
    registry.globals = {};
  }
  if (!registry.modules) {
    registry.modules = {};
  }
  if (!registry.state) {
    registry.state = {"globals": {}};
  } else if (!registry.state.globals) {
    registry.state.globals = {};
  }
  if (!registry.__hydration) {
    registry.__hydration = {"registered": false};
  }
  return registry;
}
function __jacApplyRender(renderer, container, node) {
  if (!renderer || !container) {
    return;
  }
  try {
    renderer(node, container);
  } catch (err) {
    console.error("[Jac] Failed to render JSX tree", err);
  }
}
function __jacHydrateFromDom(defaultModuleName) {
  __jacEnsureObjectGetPolyfill();
  let scope = __jacGlobalScope();
  let documentRef = __jacGetDocument(scope);
  if (!documentRef) {
    return;
  }
  let initEl = documentRef.getElementById("__jac_init__");
  let rootEl = documentRef.getElementById("__jac_root");
  if (!initEl || !rootEl) {
    return;
  }
  let dataset = initEl.dataset ? initEl.dataset : null;
  if (dataset && dataset.jacHydrated === "true") {
    return;
  }
  if (dataset) {
    dataset.jacHydrated = "true";
  }
  let payloadText = initEl.textContent ? initEl.textContent : "{}";
  let payload = __jacParseJsonObject(payloadText);
  if (!payload) {
    return;
  }
  let targetName = payload.get("function");
  if (!targetName) {
    return;
  }
  let fallbackModule = defaultModuleName ? defaultModuleName : "";
  let moduleCandidate = payload.get("module");
  let moduleName = moduleCandidate ? moduleCandidate : fallbackModule;
  let registry = __jacEnsureRegistry();
  let modulesStore = registry.modules ? registry.modules : {};
  let moduleRecord = __jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
  if (!moduleRecord) {
    console.error("[Jac] Client module not registered: " + moduleName);
    return;
  }
  let argOrderRaw = payload.get("argOrder", []);
  let argOrder = Array.isArray(argOrderRaw) ? argOrderRaw : [];
  let argsDictRaw = payload.get("args", {});
  let argsDict = __isObject(argsDictRaw) ? argsDictRaw : {};
  let orderedArgs = __jacBuildOrderedArgs(argOrder, argsDict);
  let payloadGlobalsRaw = payload.get("globals", {});
  let payloadGlobals = __isObject(payloadGlobalsRaw) ? payloadGlobalsRaw : {};
  registry.state.globals[moduleName] = payloadGlobals;
  for (const gName of __objectKeys(payloadGlobals)) {
    let gValue = payloadGlobals[gName];
    scope[gName] = gValue;
    registry.globals[gName] = gValue;
  }
  let target = __jacResolveTarget(moduleRecord, registry, targetName);
  if (!target) {
    console.error("[Jac] Client function not found: " + targetName);
    return;
  }
  let renderer = __jacResolveRenderer(scope);
  if (!renderer) {
    console.warn("[Jac] renderJsxTree is not available in client bundle");
  }
  let callOutcome = __jacSafeCallTarget(target, scope, orderedArgs, targetName);
  if (!callOutcome || !callOutcome.get("ok")) {
    return;
  }
  let value = callOutcome.get("value");
  if (value && __isObject(value) && __isFunction(value.then)) {
    value.then(node => {
      __jacApplyRender(renderer, rootEl, node);
    }).catch(err => {
      console.error("[Jac] Error resolving client function promise", err);
    });
  } else {
    __jacApplyRender(renderer, rootEl, value);
  }
}
function __jacExecuteHydration() {
  let registry = __jacEnsureRegistry();
  let defaultModule = registry.lastModule ? registry.lastModule : "";
  __jacHydrateFromDom(defaultModule);
}
function __jacEnsureHydration(moduleName) {
  __jacEnsureObjectGetPolyfill();
  let registry = __jacEnsureRegistry();
  registry.lastModule = moduleName;
  let existingHydration = registry.__hydration ? registry.__hydration : null;
  let hydration = existingHydration ? existingHydration : {"registered": false};
  registry.__hydration = hydration;
  let scope = __jacGlobalScope();
  let documentRef = __jacGetDocument(scope);
  if (!documentRef) {
    return;
  }
  let alreadyRegistered = hydration.registered ? hydration.registered : false;
  if (!alreadyRegistered) {
    hydration.registered = true;
    documentRef.addEventListener("DOMContentLoaded", _event => {
      __jacExecuteHydration();
    }, {"once": true});
  }
  if (documentRef.readyState !== "loading") {
    __jacExecuteHydration();
  }
}
function __jacRegisterClientModule(moduleName, clientFunctions, clientGlobals) {
  __jacEnsureObjectGetPolyfill();
  let scope = __jacGlobalScope();
  let registry = __jacEnsureRegistry();
  let moduleFunctions = {};
  let registeredFunctions = [];
  if (clientFunctions) {
    for (const funcName of clientFunctions) {
      let funcRef = scope[funcName];
      if (!funcRef) {
        console.error("[Jac] Client function not found during registration: " + funcName);
        continue;
      }
      moduleFunctions[funcName] = funcRef;
      registry.functions[funcName] = funcRef;
      scope[funcName] = funcRef;
      registeredFunctions.push(funcName);
    }
  }
  let moduleGlobals = {};
  let globalNames = [];
  let globalsMap = clientGlobals ? clientGlobals : {};
  for (const gName of __objectKeys(globalsMap)) {
    globalNames.push(gName);
    let defaultValue = globalsMap[gName];
    let existing = scope[gName];
    if (existing === null) {
      scope[gName] = defaultValue;
      moduleGlobals[gName] = defaultValue;
    } else {
      moduleGlobals[gName] = existing;
    }
    registry.globals[gName] = scope[gName];
  }
  let modulesStore = registry.modules ? registry.modules : {};
  let existingRecord = __jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
  let moduleRecord = existingRecord ? existingRecord : {};
  moduleRecord.moduleFunctions = moduleFunctions;
  moduleRecord.moduleGlobals = moduleGlobals;
  moduleRecord.functions = registeredFunctions;
  moduleRecord.globals = globalNames;
  moduleRecord.defaults = globalsMap;
  registry.modules[moduleName] = moduleRecord;
  let stateGlobals = registry.state.globals;
  if (!__jacHasOwn(stateGlobals, moduleName)) {
    stateGlobals[moduleName] = {};
  }
  __jacEnsureHydration(moduleName);
}

// Client module: littleX_single_nodeps
import * as _ from "lodash";
import { Button, Input, Card, Typography, Space } from "antd";
import pluralize from "pluralize";
const appState = {"current_route": "login", "tweets": [], "loading": false};
function navigate_to(route) {
  console.log("Navigating to:", route);
  appState["current_route"] = route;
  window.history.pushState({}, "", "#" + route);
  render_app();
}
function render_app() {
  console.log("render_app called, route:", appState.get("current_route", "unknown"));
  let root_element = document.getElementById("__jac_root");
  if (root_element) {
    let component = App();
    console.log("Rendering component to root");
    renderJsxTree(component, root_element);
    console.log("Render complete");
  }
}
function get_current_route() {
  return appState.get("current_route", "login");
}
function handle_popstate(event) {
  let hash = window.location.hash;
  if (hash) {
    appState["current_route"] = hash.slice(1);
  } else {
    appState["current_route"] = "login";
  }
  render_app();
}
function init_router() {
  let hash = window.location.hash;
  if (hash) {
    appState["current_route"] = hash.slice(1);
  } else {
    if (jacIsLoggedIn()) {
      appState["current_route"] = "home";
    } else {
      appState["current_route"] = "login";
    }
  }
  window.addEventListener("popstate", handle_popstate);
}
class ClientTweet {
  constructor(props = {}) {
    this.username = props.hasOwnProperty("username") ? props.username : "";
    this.id = props.hasOwnProperty("id") ? props.id : "";
    this.content = props.hasOwnProperty("content") ? props.content : "";
    this.likes = props.hasOwnProperty("likes") ? props.likes : [];
    this.comments = props.hasOwnProperty("comments") ? props.comments : [];
  }
}
class ClientProfile {
  constructor(props = {}) {
    this.username = props.hasOwnProperty("username") ? props.username : "";
    this.id = props.hasOwnProperty("id") ? props.id : "";
  }
}
function TweetCard(tweet) {
  return __jacJsx("div", {"class": "tweet-card", "style": {"border": "1px solid #e1e8ed", "padding": "15px", "margin": "10px 0", "borderRadius": "8px"}}, [__jacJsx("div", {"class": "tweet-header", "style": {"fontWeight": "bold", "marginBottom": "80px"}}, ["@", tweet.username]), __jacJsx("div", {"class": "tweet-content", "style": {"marginBottom": "12px"}}, [tweet.content]), __jacJsx("div", {"class": "tweet-actions", "style": {"display": "flex", "gap": "15px"}}, [__jacJsx("button", {"onclick": like_tweet_action(tweet.id), "style": {"padding": "5px 10px", "cursor": "pointer"}}, ["Like (", tweet.likes.length, ")"]), __jacJsx("button", {"style": {"padding": "5px 10px"}}, ["Comment (", tweet.comments.length, ")"])])]);
}
async function like_tweet_action(tweet_id) {
  try {
    let result = await like_tweet(tweet_id);
    print("Tweet liked:", result);
    window.location.reload();
  } catch (e) {
    print("Error liking tweet:", e);
  }
}
function FeedView(tweets) {
  return __jacJsx("div", {"class": "feed-container", "style": {"maxWidth": "600px", "margin": "0 auto", "fontFamily": "sans-serif"}}, [__jacJsx("div", {"class": "feed-header", "style": {"padding": "20px", "borderBottom": "1px solid #e1e8ed"}}, [__jacJsx("h1", {"style": {"margin": "0"}}, ["LittleX Feed"])]), __jacJsx("div", {"class": "feed-content"}, [null])]);
}
function LoginForm() {
  let suggestions = ["alice", "bob", "charlie", "diana", "eve"];
  let randomSuggestion = _.sample(suggestions);
  let item = "apple";
  let count = 5;
  let result = pluralize(item, count, true);
  return __jacJsx("div", {"class": "login-container", "style": {"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {"style": {"marginTop": "0"}}, ["Login to LittleX"]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [randomSuggestion]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [result]), __jacJsx("form", {"onsubmit": handle_login}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "username", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "password", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Login"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx("a", {"href": "#signup", "onclick": go_to_signup, "style": {"color": "#1da1f2", "textDecoration": "none", "cursor": "pointer"}}, ["Don't have an account? Sign up"])])]);
}
async function handle_login(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let success = await jacLogin(username, password);
  if (success) {
    navigate_to("home");
  } else {
    alert("Login failed. Please try again.");
  }
}
function SignupForm() {
  return __jacJsx("div", {"class": "signup-container", "style": {"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {"style": {"marginTop": "0"}}, ["Sign Up for LittleX"]), __jacJsx("form", {"onsubmit": handle_signup}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "signup-username", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Confirm Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password-confirm", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Sign Up"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx("a", {"href": "#login", "onclick": go_to_login, "style": {"color": "#1da1f2", "textDecoration": "none", "cursor": "pointer"}}, ["Already have an account? Login"])])]);
}
function go_to_login(event) {
  event.preventDefault();
  navigate_to("login");
}
function go_to_signup(event) {
  event.preventDefault();
  navigate_to("signup");
}
function go_to_home(event) {
  event.preventDefault();
  navigate_to("home");
}
function go_to_profile(event) {
  event.preventDefault();
  navigate_to("profile");
}
async function handle_signup(event) {
  event.preventDefault();
  let username = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;
  let password_confirm = document.getElementById("signup-password-confirm").value;
  if (password !== password_confirm) {
    alert("Passwords do not match!");
    return;
  }
  if (username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }
  let result = await jacSignup(username, password);
  if (result.get("success")) {
    alert("Account created successfully! Welcome to LittleX!");
    navigate_to("home");
  } else {
    alert(result.get("error", "Signup failed"));
  }
}
function logout_action() {
  jacLogout();
  navigate_to("login");
}
function App() {
  let route = get_current_route();
  let nav_bar = build_nav_bar(route);
  let content_view = get_view_for_route(route);
  return __jacJsx("div", {"class": "app-container"}, [nav_bar, content_view]);
}
function get_view_for_route(route) {
  if (route === "signup") {
    return SignupForm();
  }
  if (route === "home") {
    return HomeViewLoader();
  }
  if (route === "profile") {
    return ProfileView();
  }
  return LoginForm();
}
function HomeViewLoader() {
  load_home_view();
  return __jacJsx("div", {"style": {"textAlign": "center", "padding": "50px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {}, ["Loading feed..."])]);
}
async function load_home_view() {
  let view = await HomeView();
  let root = document.getElementById("__jac_root");
  if (true) {
    renderJsxTree(__jacJsx("div", {"class": "app-container"}, [build_nav_bar("home"), view]));
  }
}
function build_nav_bar(route) {
  if (!jacIsLoggedIn() || route === "login" || route === "signup") {
    return null;
  }
  return __jacJsx("nav", {"style": {"backgroundColor": "#1da1f2", "padding": "15px", "marginBottom": "20px"}}, [__jacJsx("div", {"style": {"maxWidth": "600px", "margin": "0 auto", "display": "flex", "gap": "20px", "alignItems": "center"}}, [__jacJsx("a", {"href": "#home", "onclick": go_to_home, "style": {"color": "white", "textDecoration": "none", "fontWeight": "bold", "cursor": "pointer"}}, ["Home"]), __jacJsx("a", {"href": "#profile", "onclick": go_to_profile, "style": {"color": "white", "textDecoration": "none", "fontWeight": "bold", "cursor": "pointer"}}, ["Profile"]), __jacJsx("button", {"onclick": logout_action, "style": {"marginLeft": "auto", "padding": "5px 15px", "backgroundColor": "white", "color": "#1da1f2", "border": "none", "borderRadius": "4px", "cursor": "pointer", "fontWeight": "bold"}}, ["Logout"])])]);
}
async function HomeView() {
  if (!jacIsLoggedIn()) {
    navigate_to("login");
    return __jacJsx("div", {}, []);
  }
  try {
    let result = await load_feed();
    let tweets = [];
    if (result && result.reports && result.reports.length > 0) {
      let feed_data = result.reports[0];
      for (const item of feed_data) {
        if (item.Tweet_Info) {
          let tweet_info = item.Tweet_Info;
          tweets.append(ClientTweet());
        }
      }
    }
    return FeedView(tweets);
  } catch (e) {
    return __jacJsx("div", {"style": {"padding": "20px", "color": "red"}}, ["Error loading feed:", String(e)]);
  }
}
function ProfileView() {
  if (!jacIsLoggedIn()) {
    navigate_to("login");
    return __jacJsx("div", {}, []);
  }
  return __jacJsx("div", {"class": "profile-container", "style": {"maxWidth": "600px", "margin": "20px auto", "padding": "20px", "fontFamily": "sans-serif"}}, [__jacJsx("h1", {}, ["Profile"]), __jacJsx("div", {"style": {"padding": "15px", "border": "1px solid #e1e8ed", "borderRadius": "8px"}}, [__jacJsx("p", {}, ["Profile information will be displayed here."])])]);
}
function littlex_app() {
  init_router();
  return App();
}


            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['App', 'ClientProfile', 'ClientTweet', 'FeedView', 'HomeView', 'HomeViewLoader', 'LoginForm', 'ProfileView', 'SignupForm', 'TweetCard', 'build_nav_bar', 'get_current_route', 'get_view_for_route', 'go_to_home', 'go_to_login', 'go_to_profile', 'go_to_signup', 'handle_login', 'handle_popstate', 'handle_signup', 'init_router', 'like_tweet_action', 'littlex_app', 'load_home_view', 'logout_action', 'navigate_to', 'render_app'];
            const globalFunctionMap = {
    "App": App,
    "ClientProfile": ClientProfile,
    "ClientTweet": ClientTweet,
    "FeedView": FeedView,
    "HomeView": HomeView,
    "HomeViewLoader": HomeViewLoader,
    "LoginForm": LoginForm,
    "ProfileView": ProfileView,
    "SignupForm": SignupForm,
    "TweetCard": TweetCard,
    "build_nav_bar": build_nav_bar,
    "get_current_route": get_current_route,
    "get_view_for_route": get_view_for_route,
    "go_to_home": go_to_home,
    "go_to_login": go_to_login,
    "go_to_profile": go_to_profile,
    "go_to_signup": go_to_signup,
    "handle_login": handle_login,
    "handle_popstate": handle_popstate,
    "handle_signup": handle_signup,
    "init_router": init_router,
    "like_tweet_action": like_tweet_action,
    "littlex_app": littlex_app,
    "load_home_view": load_home_view,
    "logout_action": logout_action,
    "navigate_to": navigate_to,
    "render_app": render_app
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        

            // --- JAC CLIENT INITIALIZATION SCRIPT ---
            // Expose functions globally for Jac runtime registration
            const clientFunctions = ['App', 'ClientProfile', 'ClientTweet', 'FeedView', 'HomeView', 'HomeViewLoader', 'LoginForm', 'ProfileView', 'SignupForm', 'TweetCard', 'build_nav_bar', 'get_current_route', 'get_view_for_route', 'go_to_home', 'go_to_login', 'go_to_profile', 'go_to_signup', 'handle_login', 'handle_popstate', 'handle_signup', 'init_router', 'like_tweet_action', 'littlex_app', 'load_home_view', 'logout_action', 'navigate_to', 'render_app'];
            const functionMap = {
    "App": App,
    "ClientProfile": ClientProfile,
    "ClientTweet": ClientTweet,
    "FeedView": FeedView,
    "HomeView": HomeView,
    "HomeViewLoader": HomeViewLoader,
    "LoginForm": LoginForm,
    "ProfileView": ProfileView,
    "SignupForm": SignupForm,
    "TweetCard": TweetCard,
    "build_nav_bar": build_nav_bar,
    "get_current_route": get_current_route,
    "get_view_for_route": get_view_for_route,
    "go_to_home": go_to_home,
    "go_to_login": go_to_login,
    "go_to_profile": go_to_profile,
    "go_to_signup": go_to_signup,
    "handle_login": handle_login,
    "handle_popstate": handle_popstate,
    "handle_signup": handle_signup,
    "init_router": init_router,
    "like_tweet_action": like_tweet_action,
    "littlex_app": littlex_app,
    "load_home_view": load_home_view,
    "logout_action": logout_action,
    "navigate_to": navigate_to,
    "render_app": render_app
};
            for (const funcName of clientFunctions) {
                globalThis[funcName] = functionMap[funcName];
            }
            __jacRegisterClientModule("littleX_single_nodeps", clientFunctions, { "appState": {"current_route": "login", "tweets": [], "loading": false} });
            globalThis.start_app = littlex_app;
            // Call the start function immediately if we're not hydrating from the server
            if (!document.getElementById('__jac_init__')) {
                globalThis.start_app();
            }
            // --- END JAC CLIENT INITIALIZATION SCRIPT ---
        