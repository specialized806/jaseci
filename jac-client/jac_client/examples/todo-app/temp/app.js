// Runtime module:
import * as React from "react";
import * as ReactDOM from "react-dom/client";
function __jacJsx(tag, props, children) {
  if (tag === null) {
    tag = React.Fragment;
  }
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
const __jacReactiveContext = {"signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "reactRoot": null, "currentComponent": null, "currentEffect": null, "router": null, "mountedComponents": {}};
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
function onMount(mountFn) {
  let currentComponent = __jacReactiveContext.currentComponent;
  if (!currentComponent) {
    __jacRunEffect(mountFn);
    return;
  }
  if (!__jacReactiveContext.mountedComponents) {
    __jacReactiveContext.mountedComponents = {};
  }
  let componentId = `${currentComponent}`;
  if (!__jacHasOwn(__jacReactiveContext.mountedComponents, componentId)) {
    __jacReactiveContext.mountedComponents[componentId] = true;
    try {
      setTimeout(() => {
        __jacRunEffect(mountFn);
      }, 0);
    } catch {
      __jacRunEffect(mountFn);
    }
  }
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
async function __jacSpawn(walker, fields, nd) {
  let token = __getLocalStorage("jac_token");
  let response = await fetch(`/walker/${walker}`, {"method": "POST", "headers": {"Content-Type": "application/json", "Authorization": token ? `Bearer ${token}` : ""}, "body": JSON.stringify({"nd": nd ? nd : "root", ...fields})});
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
const [todoState, setTodoState] = createState({"items": [], "filter": "all", "input": ""});
function onInputChange(e) {
  setTodoState({"input": e.target.value});
}
async function onAddTodo(e) {
  e.preventDefault();
  let inputEl = document.getElementById("todo-input");
  let text = inputEl && inputEl.value ? inputEl.value : "".trim();
  if (!text) {
    return;
  }
  let new_todo = await __jacSpawn("create_todo", {"text": text});
  let s = todoState();
  let newItem = {"id": new_todo._jac_id, "text": new_todo.text, "done": new_todo.done};
  setTodoState({"items": s.items.concat([newItem])});
  if (inputEl) {
    inputEl.value = "";
  }
}
function setFilter(next) {
  setTodoState({"filter": next});
}
async function toggleTodo(id) {
  let toggled_todo = await __jacSpawn("toggle_todo", {}, id);
  let s = todoState();
  let updated = [];
  for (const item of s.items) {
    if (item.id === id) {
      updated.push({"id": item.id, "text": item.text, "done": !item.done});
    } else {
      updated.push(item);
    }
  }
  setTodoState({"items": updated});
}
function removeTodo(id) {
  let s = todoState();
  let remaining = [];
  for (const item of s.items) {
    if (item.id !== id) {
      remaining.push(item);
    }
  }
  setTodoState({"items": remaining});
}
function clearCompleted() {
  let s = todoState();
  let remaining = [];
  for (const item of s.items) {
    if (!item.done) {
      remaining.push(item);
    }
  }
  setTodoState({"items": remaining});
}
function filteredItems() {
  let s = todoState();
  let result = [];
  if (s.filter === "active") {
    for (const it of s.items) {
      if (!it.done) {
        result.push(it);
      }
    }
    return result;
  } else if (s.filter === "completed") {
    for (const it of s.items) {
      if (it.done) {
        result.push(it);
      }
    }
    return result;
  }
  return s.items;
}
function TodoItem(item) {
  console.log(item.text, "-", typeof(item.done) === "boolean");
  return __jacJsx("li", {"key": item.id, "style": {"display": "flex", "gap": "12px", "alignItems": "center", "background": "#FFFFFF", "padding": "12px 16px", "borderRadius": "10px", "marginBottom": "8px", "boxShadow": "0 1px 2px rgba(17,24,39,0.06)", "border": "1px solid #E5E7EB"}}, [__jacJsx("input", {"type": "checkbox", "checked": item.done, "onChange": () => {
    toggleTodo(item.id);
  }, "style": {"width": "18px", "height": "18px", "accentColor": "#7C3AED", "cursor": "pointer"}}, []), __jacJsx("span", {"style": {"textDecoration": item.done ? "line-through" : "none", "flex": "1", "fontSize": "16px", "color": item.done ? "#9CA3AF" : "#111827"}}, [item.text]), __jacJsx("button", {"style": {"marginLeft": "auto", "padding": "6px 12px", "background": "#FFFFFF", "color": "#EF4444", "border": "1px solid #FCA5A5", "borderRadius": "6px", "fontSize": "12px", "fontWeight": "600", "cursor": "pointer", "boxShadow": "none", "transition": "all 0.2s ease"}, "onClick": () => {
    removeTodo(item.id);
  }}, ["Remove"])]);
}
function RenderUl(children, style) {
  return __jacJsx("ul", {"style": style}, children);
}
async function read_todos_action() {
  let todos = await __jacSpawn("read_todos");
  for (const todo of todos.reports) {
    console.log("Todo read:", todo);
    setTodoState({"items": todoState().items.concat([{"id": todo._jac_id, "text": todo.text, "done": todo.done}])});
  }
}
function TodoApp() {
  let s = todoState();
  onMount(() => {
    read_todos_action();
  });
  let itemsArr = filteredItems();
  if (!Array.isArray(itemsArr)) {
    console.warn("filteredItems() did not return an array; coercing to []", itemsArr);
    itemsArr = [];
  }
  let activeCount = 0;
  for (const it of s.items) {
    if (!it.done) {
      activeCount += 1;
    }
  }
  let children = [];
  for (const it of itemsArr) {
    children.push(TodoItem(it));
  }
  return __jacJsx("div", {"style": {"maxWidth": "640px", "margin": "24px auto", "padding": "24px", "background": "#FFFFFF", "borderRadius": "12px", "fontFamily": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", "boxShadow": "0 10px 20px rgba(17,24,39,0.06)", "border": "1px solid #E5E7EB", "color": "#111827"}}, [__jacJsx("h2", {"style": {"marginTop": "0", "color": "#111827", "textAlign": "left", "fontSize": "1.5rem", "fontWeight": "700", "marginBottom": "16px"}}, ["My Todos"]), __jacJsx("form", {"id": "todo_submit", "onSubmit": onAddTodo, "style": {"display": "flex", "gap": "12px", "marginBottom": "16px", "background": "#FFFFFF", "padding": "16px", "borderRadius": "10px", "border": "1px solid #E5E7EB", "boxShadow": "0 1px 2px rgba(17,24,39,0.04)"}}, [__jacJsx("input", {"id": "todo-input", "type": "text", "placeholder": "What needs to be done?", "style": {"flex": "1", "padding": "12px 14px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "outline": "none", "background": "#FFFFFF", "color": "#111827"}}, []), __jacJsx("button", {"type": "submit", "style": {"padding": "12px 18px", "background": "#7C3AED", "color": "#FFFFFF", "border": "1px solid #6D28D9", "borderRadius": "8px", "fontSize": "15px", "fontWeight": "600", "cursor": "pointer", "boxShadow": "0 1px 2px rgba(124,58,237,0.3)", "transition": "all 0.2s ease"}}, ["Add Todo"])]), __jacJsx("div", {"style": {"display": "flex", "gap": "8px", "marginTop": "8px", "background": "#FFFFFF", "padding": "10px", "borderRadius": "10px", "border": "1px solid #E5E7EB", "flexWrap": "wrap"}}, [__jacJsx("button", {"onClick": () => {
    setFilter("all");
  }, "style": {"padding": "8px 14px", "background": s.filter === "all" ? "#7C3AED" : "#FFFFFF", "color": s.filter === "all" ? "#FFFFFF" : "#7C3AED", "border": s.filter === "all" ? "1px solid #6D28D9" : "1px solid #E5E7EB", "borderRadius": "20px", "fontSize": "14px", "fontWeight": s.filter === "all" ? "700" : "500", "cursor": "pointer", "boxShadow": s.filter === "all" ? "0 1px 2px rgba(124,58,237,0.25)" : "none", "transition": "all 0.2s ease"}}, ["All"]), __jacJsx("button", {"onClick": () => {
    setFilter("active");
  }, "style": {"padding": "8px 14px", "background": s.filter === "active" ? "#7C3AED" : "#FFFFFF", "color": s.filter === "active" ? "#FFFFFF" : "#7C3AED", "border": s.filter === "active" ? "1px solid #6D28D9" : "1px solid #E5E7EB", "borderRadius": "20px", "fontSize": "14px", "fontWeight": s.filter === "active" ? "700" : "500", "cursor": "pointer", "boxShadow": s.filter === "active" ? "0 1px 2px rgba(124,58,237,0.25)" : "none", "transition": "all 0.2s ease"}}, ["Active"]), __jacJsx("button", {"onClick": () => {
    setFilter("completed");
  }, "style": {"padding": "8px 14px", "background": s.filter === "completed" ? "#7C3AED" : "#FFFFFF", "color": s.filter === "completed" ? "#FFFFFF" : "#7C3AED", "border": s.filter === "completed" ? "1px solid #6D28D9" : "1px solid #E5E7EB", "borderRadius": "20px", "fontSize": "14px", "fontWeight": s.filter === "completed" ? "700" : "500", "cursor": "pointer", "boxShadow": s.filter === "completed" ? "0 1px 2px rgba(124,58,237,0.25)" : "none", "transition": "all 0.2s ease"}}, ["Completed"]), __jacJsx("button", {"style": {"marginLeft": "auto", "padding": "8px 14px", "background": "#F9FAFB", "color": "#374151", "border": "1px solid #E5E7EB", "borderRadius": "20px", "fontSize": "14px", "fontWeight": "600", "cursor": "pointer", "boxShadow": "none", "transition": "all 0.2s ease"}, "onClick": clearCompleted}, ["Clear Completed"])]), RenderUl(children, {"listStyle": "none", "padding": "0", "marginTop": "12px", "background": "#FFFFFF", "borderRadius": "12px", "padding": "12px", "border": "1px solid #E5E7EB", "max-height": "366px", "overflowY": "auto"}), null, __jacJsx("div", {"style": {"marginTop": "12px", "color": "#374151", "textAlign": "center", "fontSize": "14px", "fontWeight": "500", "background": "#F3F4F6", "padding": "8px 12px", "borderRadius": "10px", "border": "1px solid #E5E7EB"}}, [s.items.length, " total, ", activeCount, " active"])]);
}
function LoginForm() {
  return __jacJsx("div", {"style": {"maxWidth": "420px", "margin": "60px auto", "padding": "28px", "background": "#FFFFFF", "borderRadius": "12px", "fontFamily": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", "boxShadow": "0 10px 20px rgba(17,24,39,0.06)", "border": "1px solid #E5E7EB", "color": "#111827"}}, [__jacJsx("h2", {"style": {"marginTop": "0", "color": "#111827", "textAlign": "center", "fontSize": "1.5rem", "fontWeight": "700", "marginBottom": "20px"}}, ["Welcome Back"]), __jacJsx("form", {"onSubmit": handle_login}, [__jacJsx("div", {"style": {"marginBottom": "20px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "8px", "color": "#374151", "fontSize": "14px", "fontWeight": "600"}}, ["Username"]), __jacJsx("input", {"id": "login-username", "type": "text", "style": {"width": "100%", "padding": "12px 16px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "background": "#FFFFFF", "color": "#111827", "outline": "none", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "24px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "8px", "color": "#374151", "fontSize": "14px", "fontWeight": "600"}}, ["Password"]), __jacJsx("input", {"id": "login-password", "type": "password", "style": {"width": "100%", "padding": "12px 16px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "background": "#FFFFFF", "color": "#111827", "outline": "none", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "12px", "background": "#7C3AED", "color": "#FFFFFF", "border": "1px solid #6D28D9", "borderRadius": "8px", "fontSize": "15px", "fontWeight": "600", "cursor": "pointer", "boxShadow": "0 1px 2px rgba(124,58,237,0.3)", "transition": "all 0.2s ease"}}, ["Sign In"])]), __jacJsx("div", {"style": {"marginTop": "16px", "textAlign": "center", "background": "#F9FAFB", "padding": "10px", "borderRadius": "8px", "border": "1px solid #E5E7EB"}}, [__jacJsx(Link, {"href": "/signup", "style": {"color": "#7C3AED", "textDecoration": "none", "fontWeight": "500"}}, ["Create an account"])])]);
}
async function handle_login(e) {
  e.preventDefault();
  let username = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;
  let success = await jacLogin(username, password);
  if (success) {
    navigate("/todos");
  } else {
    alert("Login failed");
  }
}
function SignupForm() {
  return __jacJsx("div", {"style": {"maxWidth": "420px", "margin": "60px auto", "padding": "28px", "background": "#FFFFFF", "borderRadius": "12px", "fontFamily": "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", "boxShadow": "0 10px 20px rgba(17,24,39,0.06)", "border": "1px solid #E5E7EB", "color": "#111827"}}, [__jacJsx("h2", {"style": {"marginTop": "0", "color": "#111827", "textAlign": "center", "fontSize": "1.5rem", "fontWeight": "700", "marginBottom": "20px"}}, ["Join Us"]), __jacJsx("form", {"onSubmit": handle_signup}, [__jacJsx("div", {"style": {"marginBottom": "20px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "8px", "color": "#374151", "fontSize": "14px", "fontWeight": "600"}}, ["Username"]), __jacJsx("input", {"id": "signup-username", "type": "text", "required": true, "style": {"width": "100%", "padding": "12px 16px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "background": "#FFFFFF", "color": "#111827", "outline": "none", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "20px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "8px", "color": "#374151", "fontSize": "14px", "fontWeight": "600"}}, ["Password"]), __jacJsx("input", {"id": "signup-password", "type": "password", "required": true, "style": {"width": "100%", "padding": "12px 16px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "background": "#FFFFFF", "color": "#111827", "outline": "none", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "24px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "8px", "color": "#374151", "fontSize": "14px", "fontWeight": "600"}}, ["Confirm Password"]), __jacJsx("input", {"id": "signup-password-confirm", "type": "password", "required": true, "style": {"width": "100%", "padding": "12px 16px", "border": "1px solid #E5E7EB", "borderRadius": "8px", "fontSize": "16px", "background": "#FFFFFF", "color": "#111827", "outline": "none", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "12px", "background": "#7C3AED", "color": "#FFFFFF", "border": "1px solid #6D28D9", "borderRadius": "8px", "fontSize": "15px", "fontWeight": "600", "cursor": "pointer", "boxShadow": "0 1px 2px rgba(124,58,237,0.3)", "transition": "all 0.2s ease"}}, ["Create Account"])]), __jacJsx("div", {"style": {"marginTop": "16px", "textAlign": "center", "background": "#F9FAFB", "padding": "10px", "borderRadius": "8px", "border": "1px solid #E5E7EB"}}, [__jacJsx(Link, {"href": "/login", "style": {"color": "#7C3AED", "textDecoration": "none", "fontWeight": "500"}}, ["Already have an account? Login"])])]);
}
async function handle_signup(e) {
  e.preventDefault();
  let username = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;
  let confirm = document.getElementById("signup-password-confirm").value;
  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }
  if (username.length < 3) {
    alert("Username must be at least 3 characters");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }
  let result = await jacSignup(username, password);
  if ("success" in result ? result["success"] : false) {
    alert("Account created successfully! Welcome to My Todo!");
    navigate("/todos");
  } else {
    alert("error" in result ? result["error"] : "Signup failed");
  }
}
function logout_action() {
  jacLogout();
  setTodoState({"items": [{"id": 1, "text": "Sign up for an account", "done": false}, {"id": 2, "text": "Log in", "done": false}, {"id": 3, "text": "Add a new todo", "done": false}, {"id": 4, "text": "Toggle a todo", "done": false}, {"id": 5, "text": "Filter active/completed", "done": false}, {"id": 6, "text": "Clear completed", "done": false}], "filter": "all", "input": ""});
  navigate("/login");
}
function Nav(route) {
  if (!jacIsLoggedIn() || route === "/login" || route === "/signup") {
    return null;
  }
  return __jacJsx("nav", {"style": {"background": "#FFFFFF", "padding": "12px", "boxShadow": "0 1px 2px rgba(17,24,39,0.06)", "border": "1px solid #E5E7EB", "borderRadius": "10px"}}, [__jacJsx("div", {"style": {"maxWidth": "960px", "margin": "0 auto", "display": "flex", "gap": "16px", "alignItems": "center", "padding": "0 12px"}}, [__jacJsx(Link, {"href": "/todos", "style": {"textDecoration": "none"}}, [__jacJsx("span", {"style": {"color": "#111827", "fontWeight": "800", "fontSize": "18px"}}, ["📝 My Todos"])]), __jacJsx("button", {"onClick": logout_action, "style": {"marginLeft": "auto", "padding": "8px 12px", "background": "#FFFFFF", "color": "#374151", "border": "1px solid #E5E7EB", "borderRadius": "18px", "cursor": "pointer", "fontSize": "14px", "fontWeight": "600", "boxShadow": "none", "transition": "all 0.2s ease"}}, ["Logout"])])]);
}
function App() {
  let login_route = {"path": "/login", "component": () => {
    return LoginForm();
  }, "guard": null};
  let signup_route = {"path": "/signup", "component": () => {
    return SignupForm();
  }, "guard": null};
  let todos_route = {"path": "/todos", "component": () => {
    return TodoApp();
  }, "guard": jacIsLoggedIn};
  let routes = [login_route, signup_route, todos_route];
  let router = initRouter(routes, "/login");
  let currentPath = router.path();
  return __jacJsx("div", {"style": {"minHeight": "95vh", "background": "#F7F8FA", "padding": "24px"}}, [Nav(currentPath), __jacJsx("div", {"style": {"maxWidth": "960px", "margin": "0 auto", "padding": "20px"}}, [router.render()])]);
}
function jac_app() {
  return App();
}


            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['App', 'LoginForm', 'Nav', 'RenderUl', 'SignupForm', 'TodoApp', 'TodoItem', 'clearCompleted', 'filteredItems', 'handle_login', 'handle_signup', 'jac_app', 'logout_action', 'onAddTodo', 'onInputChange', 'read_todos_action', 'removeTodo', 'setFilter', 'toggleTodo'];
            const globalFunctionMap = {
    "App": App,
    "LoginForm": LoginForm,
    "Nav": Nav,
    "RenderUl": RenderUl,
    "SignupForm": SignupForm,
    "TodoApp": TodoApp,
    "TodoItem": TodoItem,
    "clearCompleted": clearCompleted,
    "filteredItems": filteredItems,
    "handle_login": handle_login,
    "handle_signup": handle_signup,
    "jac_app": jac_app,
    "logout_action": logout_action,
    "onAddTodo": onAddTodo,
    "onInputChange": onInputChange,
    "read_todos_action": read_todos_action,
    "removeTodo": removeTodo,
    "setFilter": setFilter,
    "toggleTodo": toggleTodo
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        

            // --- JAC CLIENT INITIALIZATION SCRIPT ---
            // Expose functions globally for Jac runtime registration
            const clientFunctions = ['App', 'LoginForm', 'Nav', 'RenderUl', 'SignupForm', 'TodoApp', 'TodoItem', 'clearCompleted', 'filteredItems', 'handle_login', 'handle_signup', 'jac_app', 'logout_action', 'onAddTodo', 'onInputChange', 'read_todos_action', 'removeTodo', 'setFilter', 'toggleTodo'];
            const functionMap = {
    "App": App,
    "LoginForm": LoginForm,
    "Nav": Nav,
    "RenderUl": RenderUl,
    "SignupForm": SignupForm,
    "TodoApp": TodoApp,
    "TodoItem": TodoItem,
    "clearCompleted": clearCompleted,
    "filteredItems": filteredItems,
    "handle_login": handle_login,
    "handle_signup": handle_signup,
    "jac_app": jac_app,
    "logout_action": logout_action,
    "onAddTodo": onAddTodo,
    "onInputChange": onInputChange,
    "read_todos_action": read_todos_action,
    "removeTodo": removeTodo,
    "setFilter": setFilter,
    "toggleTodo": toggleTodo
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
        