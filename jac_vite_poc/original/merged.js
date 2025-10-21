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
      let props2 = node.get("props", {});
      return __buildDom(tag(props2));
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
  async function jacSignup(username, password) {
    let response = await fetch("/user/create", { "method": "POST", "headers": { "Content-Type": "application/json" }, "body": JSON.stringify({ "username": username, "password": password }) });
    if (response.ok) {
      let data = JSON.parse(await response.text());
      let token = data.get("token");
      if (token) {
        __setLocalStorage("jac_token", token);
        return { "success": true, "token": token, "username": username };
      }
      return { "success": false, "error": "No token received" };
    } else {
      let error_text = await response.text();
      try {
        let error_data = JSON.parse(error_text);
        return { "success": false, "error": error_data.get("error", "Signup failed") };
      } catch {
        return { "success": false, "error": error_text };
      }
    }
  }
  async function jacLogin(username, password) {
    let response = await fetch("/user/login", { "method": "POST", "headers": { "Content-Type": "application/json" }, "body": JSON.stringify({ "username": username, "password": password }) });
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
    Object.defineProperty(proto, "get", { "value": get_polyfill, "configurable": true, "writable": true });
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
      return { "ok": true, "value": result };
    } catch (err) {
      console.error("[Jac] Error executing client function " + targetName, err);
      return { "ok": false, "value": null };
    }
  }
  function __jacGlobalScope() {
    try {
      return globalThis;
    } catch {
    }
    try {
      return window;
    } catch {
    }
    try {
      return;
    } catch {
    }
    return {};
  }
  function __jacEnsureRegistry() {
    let scope = __jacGlobalScope();
    let registry = scope.__jacClient;
    if (!registry) {
      let registry2 = { "functions": {}, "globals": {}, "modules": {}, "state": { "globals": {} }, "__hydration": { "registered": false }, "lastModule": null };
      scope.__jacClient = registry2;
      return registry2;
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
      registry.state = { "globals": {} };
    } else if (!registry.state.globals) {
      registry.state.globals = {};
    }
    if (!registry.__hydration) {
      registry.__hydration = { "registered": false };
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
      value.then((node) => {
        __jacApplyRender(renderer, rootEl, node);
      }).catch((err) => {
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
  const appState = { "current_route": "login" };
  function App() {
    return __jacJsx("div", {}, ["Hello from App. Current route: ", appState.current_route]);
  }
  function littlex_app() {
    console.log("littlex_app running...");
    return App();
  }
  window.littlex_app = littlex_app;
  window.jacSignup = jacSignup;
  window.jacLogin = jacLogin;
  window.jacLogout = jacLogout;
  window.jacIsLoggedIn = jacIsLoggedIn;
  littlex_app();
  __jacExecuteHydration();
  //# sourceMappingURL=client.js.map
  