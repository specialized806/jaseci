// Runtime module:
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
    let children = node.get("children", []);
    if (children && children.length > 0) {
      props["children"] = children;
    }
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
      element.style[styleKey] = value[styleKey];
    }
  } else if (key !== "children") {
    element.setAttribute(key, String(value));
  }
}
const __jacReactiveContext = {"signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "currentComponent": null, "currentEffect": null, "router": null};
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
  let rootEl = document.getElementById("__jac_root");
  if (!rootEl) {
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
    renderJsxTree(component, rootEl);
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
function createRouter(routes, defaultRoute) {
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
  return __jacJsx("a", {"href": "#" + href, "onclick": handleClick}, children);
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
  let value = __jacReactiveContext.rootComponent();
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
// Client module: js_import
import { formatMessage, calculateSum, JS_CONSTANT, MessageFormatter } from "./utils.js";
const JS_IMPORT_LABEL = "JavaScript Import Test";
function JsImportTest() {
  let greeting = formatMessage("Jac");
  let sum = calculateSum(5, 3);
  let formatter = MessageFormatter("JS");
  let formatted = formatter.format("Hello from JS class");
  return __jacJsx("div", {"class": "js-import-test"}, [__jacJsx("h1", {}, [JS_IMPORT_LABEL]), __jacJsx("p", {}, ["Greeting: ", greeting]), __jacJsx("p", {}, ["Sum (5 + 3): ", sum]), __jacJsx("p", {}, ["Constant: ", JS_CONSTANT]), __jacJsx("p", {}, ["Formatted: ", formatted])]);
}
function Main() {
  return __jacJsx(JsImportTest, {}, []);
}


            // --- GLOBAL EXPOSURE FOR VITE IIFE ---
            // Expose functions globally so they're available on globalThis
            const globalClientFunctions = ['JsImportTest', 'Main'];
            const globalFunctionMap = {
    "JsImportTest": JsImportTest,
    "Main": Main
};
            for (const funcName of globalClientFunctions) {
                globalThis[funcName] = globalFunctionMap[funcName];
            }
            // --- END GLOBAL EXPOSURE ---
        

            // --- JAC CLIENT INITIALIZATION SCRIPT ---
            // Expose functions globally for Jac runtime registration
            const clientFunctions = ['JsImportTest', 'Main'];
            const functionMap = {
    "JsImportTest": JsImportTest,
    "Main": Main
};
            for (const funcName of clientFunctions) {
                globalThis[funcName] = functionMap[funcName];
            }
            __jacRegisterClientModule("js_import", clientFunctions, { "JS_IMPORT_LABEL": "JavaScript Import Test" });
            globalThis.start_app = jac_app;
            // Call the start function immediately if we're not hydrating from the server
            if (!document.getElementById('__jac_init__')) {
                globalThis.start_app();
            }
            // --- END JAC CLIENT INITIALIZATION SCRIPT ---
        