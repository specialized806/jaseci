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
  JacRuntime.__jacEnsureObjectGetPolyfill();
  let scope = __jacGlobalScope();
  let documentRef = JacRuntime.__jacGetDocument(scope);
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
  let payload = JacRuntime.__jacParseJsonObject(payloadText);
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
  let moduleRecord = JacRuntime.__jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
  if (!moduleRecord) {
    console.error("[Jac] Client module not registered: " + moduleName);
    return;
  }
  let argOrderRaw = payload.get("argOrder", []);
  let argOrder = Array.isArray(argOrderRaw) ? argOrderRaw : [];
  let argsDictRaw = payload.get("args", {});
  let argsDict = JacRuntime.__isObject(argsDictRaw) ? argsDictRaw : {};
  let orderedArgs = JacRuntime.__jacBuildOrderedArgs(argOrder, argsDict);
  let payloadGlobalsRaw = payload.get("globals", {});
  let payloadGlobals = JacRuntime.__isObject(payloadGlobalsRaw) ? payloadGlobalsRaw : {};
  registry.state.globals[moduleName] = payloadGlobals;
  for (const gName of JacRuntime.__objectKeys(payloadGlobals)) {
    let gValue = payloadGlobals[gName];
    scope[gName] = gValue;
    registry.globals[gName] = gValue;
  }
  let target = JacRuntime.__jacResolveTarget(moduleRecord, registry, targetName);
  if (!target) {
    console.error("[Jac] Client function not found: " + targetName);
    return;
  }
  JacRuntime.__jacReactiveContext.rootComponent = () => {
    JacRuntime.__jacReactiveContext.currentComponent = "__root__";
    let result = target.apply(scope, orderedArgs);
    JacRuntime.__jacReactiveContext.currentComponent = null;
    return result;
  };
  let renderer = JacRuntime.__jacResolveRenderer(scope);
  if (!renderer) {
    console.warn("[Jac] renderJsxTree is not available in client bundle");
  }
  let value = JacRuntime.__jacReactiveContext.rootComponent();
  if (value && JacRuntime.__isObject(value) && JacRuntime.__isFunction(value.then)) {
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
  JacRuntime.__jacEnsureObjectGetPolyfill();
  let registry = __jacEnsureRegistry();
  registry.lastModule = moduleName;
  let existingHydration = registry.__hydration ? registry.__hydration : null;
  let hydration = existingHydration ? existingHydration : {"registered": false};
  registry.__hydration = hydration;
  let scope = __jacGlobalScope();
  let documentRef = JacRuntime.__jacGetDocument(scope);
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
  JacRuntime.__jacEnsureObjectGetPolyfill();
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
  for (const gName of JacRuntime.__objectKeys(globalsMap)) {
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
  let existingRecord = JacRuntime.__jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
  let moduleRecord = existingRecord ? existingRecord : {};
  moduleRecord.moduleFunctions = moduleFunctions;
  moduleRecord.moduleGlobals = moduleGlobals;
  moduleRecord.functions = registeredFunctions;
  moduleRecord.globals = globalNames;
  moduleRecord.defaults = globalsMap;
  registry.modules[moduleName] = moduleRecord;
  let stateGlobals = registry.state.globals;
  if (!JacRuntime.__jacHasOwn(stateGlobals, moduleName)) {
    stateGlobals[moduleName] = {};
  }
  __jacEnsureHydration(moduleName);
}
