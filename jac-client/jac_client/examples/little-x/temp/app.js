// Runtime module:
import * as React from "react";
import * as ReactDOM from "react-dom/client";
function __jacJsx(tag, props, children) {
  let childrenArray = [];
  if (children !== null) {
    if (Array.isArray(children)) {
      childrenArray = children;
    } else {
      childrenArray = [children];
    }
  }
  let reactChildren = [];
  for (const child of childrenArray) {
    if (child !== null) {
      reactChildren.push(child);
    }
  }
  if (reactChildren.length > 0) {
    let args = [tag, props];
    for (const child of reactChildren) {
      args.push(child);
    }
    return React.createElement.apply(React, args);
  } else {
    return React.createElement(tag, props);
  }
}
function renderJsxTree(node, container) {
  try {
    ReactDOM.createRoot(container).render(node);
  } catch (err) {
    console.error("[Jac] Error in renderJsxTree:", err);
  }
}
const __jacReactiveContext = {"signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "reactRoot": null, "currentComponent": null, "currentEffect": null, "router": null};
function createSignal(initialValue) {
  let signalId = __jacReactiveContext.signals.length;
  let signalData = {"value": initialValue, "subscribers": []};
  __jacReactiveContext.signals.push(signalData);
  function getter() {
    __jacTrackDependency(signalData.subscribers);
    return signalData.value;
  }
  function setter(newValue) {
    if (newValue !== signalData.value) {
      signalData.value = newValue;
      __jacNotifySubscribers(signalData.subscribers);
    }
  }
  return [getter, setter];
}
function createState(initialState) {
  let signalId = __jacReactiveContext.signals.length;
  let signalData = {"value": initialState, "subscribers": []};
  __jacReactiveContext.signals.push(signalData);
  function getter() {
    __jacTrackDependency(signalData.subscribers);
    return signalData.value;
  }
  function setter(updates) {
    let newState = {};
    let stateValue = signalData.value;
    for (const key of __objectKeys(stateValue)) {
      newState[key] = stateValue[key];
    }
    for (const key of __objectKeys(updates)) {
      newState[key] = updates[key];
    }
    signalData.value = newState;
    __jacNotifySubscribers(signalData.subscribers);
  }
  return [getter, setter];
}
function createEffect(effectFn) {
  __jacRunEffect(effectFn);
}
function __jacTrackDependency(subscribers) {
  let currentEffect = __jacReactiveContext.currentEffect;
  if (currentEffect) {
    let alreadySubscribed = false;
    for (const sub of subscribers) {
      if (sub === currentEffect) {
        alreadySubscribed = true;
      }
    }
    if (!alreadySubscribed) {
      subscribers.push(currentEffect);
    }
  }
  let currentComponent = __jacReactiveContext.currentComponent;
  if (currentComponent) {
    let alreadySubscribed = false;
    for (const sub of subscribers) {
      if (sub === currentComponent) {
        alreadySubscribed = true;
      }
    }
    if (!alreadySubscribed) {
      subscribers.push(currentComponent);
    }
  }
}
function __jacNotifySubscribers(subscribers) {
  for (const subscriber of subscribers) {
    if (__isFunction(subscriber)) {
      __jacRunEffect(subscriber);
    } else {
      __jacScheduleRerender(subscriber);
    }
  }
}
function __jacRunEffect(effectFn) {
  let previousEffect = __jacReactiveContext.currentEffect;
  __jacReactiveContext.currentEffect = effectFn;
  try {
    effectFn();
  } catch (err) {
    console.error("[Jac] Error in effect:", err);
  }
  __jacReactiveContext.currentEffect = previousEffect;
}
function __jacScheduleRerender(componentId) {
  let pending = __jacReactiveContext.pendingRenders;
  let alreadyScheduled = false;
  for (const item of pending) {
    if (item === componentId) {
      alreadyScheduled = true;
    }
  }
  if (!alreadyScheduled) {
    pending.push(componentId);
    __jacScheduleFlush();
  }
}
function __jacScheduleFlush() {
  if (!__jacReactiveContext.flushScheduled) {
    __jacReactiveContext.flushScheduled = true;
    try {
      requestAnimationFrame(__jacFlushRenders);
    } catch {
      setTimeout(__jacFlushRenders, 0);
    }
  }
}
function __jacFlushRenders() {
  let pending = __jacReactiveContext.pendingRenders;
  __jacReactiveContext.pendingRenders = [];
  __jacReactiveContext.flushScheduled = false;
  for (const componentId of pending) {
    __jacRerenderComponent(componentId);
  }
}
function __jacRerenderComponent(componentId) {
  let reactRoot = __jacReactiveContext.reactRoot;
  if (!reactRoot) {
    console.error("[Jac] React root not initialized. Cannot re-render.");
    return;
  }
  let rootComponent = __jacReactiveContext.rootComponent;
  if (!rootComponent) {
    return;
  }
  try {
    let previousComponent = __jacReactiveContext.currentComponent;
    __jacReactiveContext.currentComponent = componentId;
    let component = rootComponent();
    reactRoot.render(component);
    __jacReactiveContext.currentComponent = previousComponent;
  } catch (err) {
    console.error("[Jac] Error re-rendering component:", err);
  }
}
class RouteConfig {
  constructor(props = {}) {
    this.path = props.hasOwnProperty("path") ? props.path : null;
    this.component = props.hasOwnProperty("component") ? props.component : null;
    this.guard = props.hasOwnProperty("guard") ? props.guard : null;
  }
}
function initRouter(routes, defaultRoute) {
  let initialPath = __jacGetHashPath();
  if (!initialPath) {
    initialPath = defaultRoute;
  }
  let [currentPath, setCurrentPath] = createSignal(initialPath);
  window.addEventListener("hashchange", event => {
    let newPath = __jacGetHashPath();
    if (!newPath) {
      newPath = defaultRoute;
    }
    setCurrentPath(newPath);
  });
  window.addEventListener("popstate", event => {
    let newPath = __jacGetHashPath();
    if (!newPath) {
      newPath = defaultRoute;
    }
    setCurrentPath(newPath);
  });
  function render() {
    let path = currentPath();
    for (const route of routes) {
      if (route.path === path) {
        if (route.guard && !route.guard()) {
          return __jacJsx("div", {}, ["Access Denied"]);
        }
        return route.component();
      }
    }
    return __jacJsx("div", {}, ["404 - Route not found: ", path]);
  }
  function navigateTo(path) {
    window.location.hash = "#" + path;
    setCurrentPath(path);
  }
  let router = {"path": currentPath, "render": render, "navigate": navigateTo};
  __jacReactiveContext.router = router;
  return router;
}
function Route(path, component, guard) {
  return {"path": path, "component": component, "guard": guard};
}
function Link(props) {
  let href = "href" in props ? props["href"] : "/";
  let children = "children" in props ? props["children"] : [];
  function handleClick(event) {
    console.log("Link clicked, navigating to:", href);
    event.preventDefault();
    navigate(href);
  }
  let childrenArray = [];
  if (children !== null) {
    if (Array.isArray(children)) {
      childrenArray = children;
    } else {
      childrenArray = [children];
    }
  }
  return __jacJsx("a", {"href": "#" + href, "onclick": handleClick}, childrenArray);
}
function navigate(path) {
  console.log("navigate() called with path:", path);
  let router = __jacReactiveContext.router;
  if (router) {
    console.log("Router found, calling router.navigate()");
    router.navigate(path);
  } else {
    console.log("No router, setting hash directly");
    window.location.hash = "#" + path;
  }
}
function useRouter() {
  return __jacReactiveContext.router;
}
function __jacGetHashPath() {
  let hash = window.location.hash;
  if (hash) {
    return hash.slice(1);
  }
  return "";
}
async function __jacSpawn(walker, fields) {
  let token = __getLocalStorage("jac_token");
  let response = await fetch(`/walker/${walker}`, {"method": "POST", "headers": {"Content-Type": "application/json", "Authorization": token ? `Bearer ${token}` : ""}, "body": JSON.stringify({"nd": "root", ...fields})});
  if (!response.ok) {
    let error_text = await response.text();
    throw new Error(`Walker ${walker} failed: ${error_text}`);
  }
  return JSON.parse(await response.text());
}
async function __jacCallFunction(function_name, args) {
  let token = __getLocalStorage("jac_token");
  let response = await fetch(`/function/${function_name}`, {"method": "POST", "headers": {"Content-Type": "application/json", "Authorization": token ? `Bearer ${token}` : ""}, "body": JSON.stringify({"args": args})});
  if (!response.ok) {
    let error_text = await response.text();
    throw new Error(`Function ${function_name} failed: ${error_text}`);
  }
  let data = JSON.parse(await response.text());
  return data["result"];
}
async function jacSignup(username, password) {
  let response = await fetch("/user/create", {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"username": username, "password": password})});
  if (response.ok) {
    let data = JSON.parse(await response.text());
    let token = data["token"];
    if (token) {
      __setLocalStorage("jac_token", token);
      return {"success": true, "token": token, "username": username};
    }
    return {"success": false, "error": "No token received"};
  } else {
    let error_text = await response.text();
    try {
      let error_data = JSON.parse(error_text);
      return {"success": false, "error": error_data["error"] !== null ? error_data["error"] : "Signup failed"};
    } catch {
      return {"success": false, "error": error_text};
    }
  }
}
async function jacLogin(username, password) {
  let response = await fetch("/user/login", {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"username": username, "password": password})});
  if (response.ok) {
    let data = JSON.parse(await response.text());
    let token = data["token"];
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
  return;
}
function __jacGetDocument(scope) {
  try {
    return scope.document;
  } catch {}
  try {
    return window.document;
  } catch {}
  return null;
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
    result.push(values[name]);
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
  if (!container) {
    return;
  }
  try {
    if (renderer) {
      renderer(node, container);
    } else {
      console.warn("[Jac] No JSX renderer available.");
    }
  } catch (err) {
    console.error("[Jac] Failed to render JSX tree (fallback path)", err);
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
  let targetName = payload["function"];
  if (!targetName) {
    return;
  }
  let fallbackModule = defaultModuleName ? defaultModuleName : "";
  let moduleCandidate = payload["module"];
  let moduleName = moduleCandidate ? moduleCandidate : fallbackModule;
  let registry = __jacEnsureRegistry();
  let modulesStore = registry.modules ? registry.modules : {};
  let moduleRecord = __jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
  if (!moduleRecord) {
    console.error("[Jac] Client module not registered: " + moduleName);
    return;
  }
  let argOrderRaw = payload["argOrder"] !== null ? payload["argOrder"] : [];
  let argOrder = Array.isArray(argOrderRaw) ? argOrderRaw : [];
  let argsDictRaw = payload["args"] !== null ? payload["args"] : {};
  let argsDict = __isObject(argsDictRaw) ? argsDictRaw : {};
  let orderedArgs = __jacBuildOrderedArgs(argOrder, argsDict);
  let payloadGlobalsRaw = payload["globals"] !== null ? payload["globals"] : {};
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
  __jacReactiveContext.rootComponent = () => {
    __jacReactiveContext.currentComponent = "__root__";
    let result = target.apply(scope, orderedArgs);
    __jacReactiveContext.currentComponent = null;
    return result;
  };
  let renderer = __jacResolveRenderer(scope);
  if (!renderer) {
    console.warn("[Jac] renderJsxTree is not available in client bundle");
  }
  let reactRoot = null;
  try {
    reactRoot = ReactDOM.createRoot(rootEl);
    __jacReactiveContext.reactRoot = reactRoot;
  } catch (err) {
    console.error("[Jac] Failed to create React root for hydration:", err);
    return;
  }
  let value = __jacReactiveContext.rootComponent();
  if (value && __isObject(value) && __isFunction(value.then)) {
    value.then(node => {
      reactRoot.render(node);
    }).catch(err => {
      console.error("[Jac] Error resolving client function promise", err);
    });
  } else {
    reactRoot.render(value);
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
// Client module: app
import * as _ from "lodash";
import { Button, Input, Card, Typography, Space } from "antd";
import pluralize from "pluralize";
import { Rotate } from "react-animated-components";
const [appState, setAppState] = createState({"tweets": [], "loading": false});
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
  let suggestions = ["good luck", "have fun", "enjoy the ride"];
  let randomSuggestion = _.sample(suggestions);
  let result = "Good luck with your journey!";
  return __jacJsx(Card, {"title": "Login to LittleX", "style": {"maxWidth": "400px", "margin": "50px auto"}}, [__jacJsx(Card.Meta, {"title": randomSuggestion, "description": result}, []), __jacJsx("form", {"onSubmit": handle_login}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "username", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "password", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx(Button, {"htmlType": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Login"]), __jacJsx(Button, {"color": "default", "variant": "dashed"}, ["Dashed"]), __jacJsx(Button, {"color": "default", "variant": "filled"}, ["Filled"]), __jacJsx(Button, {"color": "default", "variant": "text"}, ["Text"]), __jacJsx(Button, {"color": "default", "variant": "link"}, ["Link"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx(Link, {"href": "/signup"}, ["Don't have an account? Sign up"])])]);
}
async function handle_login(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let success = await jacLogin(username, password);
  if (success) {
    navigate("/home");
  } else {
    alert("Login failed. Please try again.");
  }
}
function SignupForm() {
  return __jacJsx("div", {"class": "signup-container", "style": {"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}, [__jacJsx(Typography.Title, {"level": 2, "style": {"marginTop": "0"}}, ["Sign Up for LittleX"]), __jacJsx("form", {"onSubmit": handle_signup}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "signup-username", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Confirm Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password-confirm", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Sign Up"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx(Link, {"href": "/login"}, ["Already have an account? Login"])])]);
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
  if ("success" in result ? result["success"] : false) {
    alert("Account created successfully! Welcome to LittleX!");
    navigate("/home");
  } else {
    alert("error" in result ? result["error"] : "Signup failed");
  }
}
function logout_action() {
  jacLogout();
  navigate("/login");
}
function App() {
  let login_route = {"path": "/login", "component": () => {
    return LoginForm();
  }, "guard": null};
  let signup_route = {"path": "/signup", "component": () => {
    return SignupForm();
  }, "guard": null};
  let home_route = {"path": "/home", "component": () => {
    return HomeView();
  }, "guard": jacIsLoggedIn};
  let profile_route = {"path": "/profile", "component": () => {
    return ProfileView();
  }, "guard": jacIsLoggedIn};
  let routes = [login_route, signup_route, home_route, profile_route];
  let router = initRouter(routes, "/login");
  let currentPath = router.path();
  return __jacJsx("div", {"class": "app-container"}, [build_nav_bar(currentPath), __jacJsx(Rotate, {}, [__jacJsx("span", {}, ["😂"])]), router.render()]);
}
function build_nav_bar(route) {
  if (!jacIsLoggedIn() || route === "/login" || route === "/signup") {
    return null;
  }
  return __jacJsx("nav", {"style": {"backgroundColor": "#1da1f2", "padding": "15px", "marginBottom": "20px"}}, [__jacJsx("div", {"style": {"maxWidth": "600px", "margin": "0 auto", "display": "flex", "gap": "20px", "alignItems": "center"}}, [__jacJsx(Link, {"href": "/home"}, [__jacJsx("span", {"style": {"color": "white", "textDecoration": "none", "fontWeight": "bold"}}, ["Home"])]), __jacJsx(Link, {"href": "/profile"}, [__jacJsx("span", {"style": {"color": "white", "textDecoration": "none", "fontWeight": "bold"}}, ["Profile"])]), __jacJsx("button", {"onClick": logout_action, "style": {"marginLeft": "auto", "padding": "5px 15px", "backgroundColor": "white", "color": "#1da1f2", "border": "none", "borderRadius": "4px", "cursor": "pointer", "fontWeight": "bold"}}, ["Logout"])])]);
}
function HomeView() {
  if (!jacIsLoggedIn()) {
    navigate("/login");
    return __jacJsx("div", {}, []);
  }
  return __jacJsx("div", {"style": {"textAlign": "center", "padding": "50px", "fontFamily": "sans-serif"}}, [__jacJsx("h1", {}, ["Home Feed"]), __jacJsx("p", {}, ["Welcome to LittleX! This is the home page."]), __jacJsx("p", {}, ["The reactive router is working!"])]);
}
function ProfileView() {
  if (!jacIsLoggedIn()) {
    navigate("/login");
    return __jacJsx("div", {}, []);
  }
  return __jacJsx("div", {"class": "profile-container", "style": {"maxWidth": "600px", "margin": "20px auto", "padding": "20px", "fontFamily": "sans-serif"}}, [__jacJsx("h1", {}, ["Profile"]), __jacJsx("div", {"style": {"padding": "15px", "border": "1px solid #e1e8ed", "borderRadius": "8px"}}, [__jacJsx("p", {}, ["Profile information will be displayed here."])])]);
}
function jac_app() {
  return App();
}


            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['App', 'ClientProfile', 'ClientTweet', 'FeedView', 'HomeView', 'LoginForm', 'ProfileView', 'SignupForm', 'TweetCard', 'build_nav_bar', 'handle_login', 'handle_signup', 'jac_app', 'like_tweet_action', 'logout_action'];
            const globalFunctionMap = {
    "App": App,
    "ClientProfile": ClientProfile,
    "ClientTweet": ClientTweet,
    "FeedView": FeedView,
    "HomeView": HomeView,
    "LoginForm": LoginForm,
    "ProfileView": ProfileView,
    "SignupForm": SignupForm,
    "TweetCard": TweetCard,
    "build_nav_bar": build_nav_bar,
    "handle_login": handle_login,
    "handle_signup": handle_signup,
    "jac_app": jac_app,
    "like_tweet_action": like_tweet_action,
    "logout_action": logout_action
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---


            // --- JAC CLIENT INITIALIZATION SCRIPT ---
            // Expose functions globally for Jac runtime registration
            const clientFunctions = ['App', 'ClientProfile', 'ClientTweet', 'FeedView', 'HomeView', 'LoginForm', 'ProfileView', 'SignupForm', 'TweetCard', 'build_nav_bar', 'handle_login', 'handle_signup', 'jac_app', 'like_tweet_action', 'logout_action'];
            const functionMap = {
    "App": App,
    "ClientProfile": ClientProfile,
    "ClientTweet": ClientTweet,
    "FeedView": FeedView,
    "HomeView": HomeView,
    "LoginForm": LoginForm,
    "ProfileView": ProfileView,
    "SignupForm": SignupForm,
    "TweetCard": TweetCard,
    "build_nav_bar": build_nav_bar,
    "handle_login": handle_login,
    "handle_signup": handle_signup,
    "jac_app": jac_app,
    "like_tweet_action": like_tweet_action,
    "logout_action": logout_action
};
            for (const funcName of clientFunctions) {
                globalThis[funcName] = functionMap[funcName];
            }
            __jacRegisterClientModule("app", clientFunctions, { "[ListVal]": null });
            globalThis.start_app = jac_app;
            // Call the start function immediately if we're not hydrating from the server
            if (!document.getElementById('__jac_init__')) {
                globalThis.start_app();
            }
            // --- END JAC CLIENT INITIALIZATION SCRIPT ---
