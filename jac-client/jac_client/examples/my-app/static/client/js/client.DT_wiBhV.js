(function() {
  "use strict";
  function _mergeNamespaces(n2, m2) {
    for (var i = 0; i < m2.length; i++) {
      const e2 = m2[i];
      if (typeof e2 !== "string" && !Array.isArray(e2)) {
        for (const k2 in e2) {
          if (k2 !== "default" && !(k2 in n2)) {
            const d2 = Object.getOwnPropertyDescriptor(e2, k2);
            if (d2) {
              Object.defineProperty(n2, k2, d2.get ? d2 : {
                enumerable: true,
                get: () => e2[k2]
              });
            }
          }
        }
      }
    }
    return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
  }
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var react = { exports: {} };
  var react_production_min = {};
  /**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t$1 = Symbol.for("react.provider"), u$1 = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
  function A$1(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z$1 && a[z$1] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B$1 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C$1 = Object.assign, D$1 = {};
  function E$1(a, b2, e2) {
    this.props = a;
    this.context = b2;
    this.refs = D$1;
    this.updater = e2 || B$1;
  }
  E$1.prototype.isReactComponent = {};
  E$1.prototype.setState = function(a, b2) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b2, "setState");
  };
  E$1.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  F.prototype = E$1.prototype;
  function G$1(a, b2, e2) {
    this.props = a;
    this.context = b2;
    this.refs = D$1;
    this.updater = e2 || B$1;
  }
  var H$1 = G$1.prototype = new F();
  H$1.constructor = G$1;
  C$1(H$1, E$1.prototype);
  H$1.isPureReactComponent = true;
  var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
  function M$1(a, b2, e2) {
    var d2, c2 = {}, k2 = null, h2 = null;
    if (null != b2) for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2) J.call(b2, d2) && !L$1.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
    var g2 = arguments.length - 2;
    if (1 === g2) c2.children = e2;
    else if (1 < g2) {
      for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++) f2[m2] = arguments[m2 + 2];
      c2.children = f2;
    }
    if (a && a.defaultProps) for (d2 in g2 = a.defaultProps, g2) void 0 === c2[d2] && (c2[d2] = g2[d2]);
    return { $$typeof: l$1, type: a, key: k2, ref: h2, props: c2, _owner: K$1.current };
  }
  function N$1(a, b2) {
    return { $$typeof: l$1, type: a.type, key: b2, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O$1(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l$1;
  }
  function escape(a) {
    var b2 = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b2[a2];
    });
  }
  var P$1 = /\/+/g;
  function Q$1(a, b2) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b2.toString(36);
  }
  function R$1(a, b2, e2, d2, c2) {
    var k2 = typeof a;
    if ("undefined" === k2 || "boolean" === k2) a = null;
    var h2 = false;
    if (null === a) h2 = true;
    else switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l$1:
          case n$1:
            h2 = true;
        }
    }
    if (h2) return h2 = a, c2 = c2(h2), a = "" === d2 ? "." + Q$1(h2, 0) : d2, I$1(c2) ? (e2 = "", null != a && (e2 = a.replace(P$1, "$&/") + "/"), R$1(c2, b2, e2, "", function(a2) {
      return a2;
    })) : null != c2 && (O$1(c2) && (c2 = N$1(c2, e2 + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$1, "$&/") + "/") + a)), b2.push(c2)), 1;
    h2 = 0;
    d2 = "" === d2 ? "." : d2 + ":";
    if (I$1(a)) for (var g2 = 0; g2 < a.length; g2++) {
      k2 = a[g2];
      var f2 = d2 + Q$1(k2, g2);
      h2 += R$1(k2, b2, e2, f2, c2);
    }
    else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g2 = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d2 + Q$1(k2, g2++), h2 += R$1(k2, b2, e2, f2, c2);
    else if ("object" === k2) throw b2 = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
    return h2;
  }
  function S$1(a, b2, e2) {
    if (null == a) return a;
    var d2 = [], c2 = 0;
    R$1(a, d2, "", "", function(a2) {
      return b2.call(e2, a2, c2++);
    });
    return d2;
  }
  function T$1(a) {
    if (-1 === a._status) {
      var b2 = a._result;
      b2 = b2();
      b2.then(function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 1, a._result = b3;
      }, function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 2, a._result = b3;
      });
      -1 === a._status && (a._status = 0, a._result = b2);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
  }
  var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
  function X$1() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S$1, forEach: function(a, b2, e2) {
    S$1(a, function() {
      b2.apply(this, arguments);
    }, e2);
  }, count: function(a) {
    var b2 = 0;
    S$1(a, function() {
      b2++;
    });
    return b2;
  }, toArray: function(a) {
    return S$1(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E$1;
  react_production_min.Fragment = p$2;
  react_production_min.Profiler = r;
  react_production_min.PureComponent = G$1;
  react_production_min.StrictMode = q$1;
  react_production_min.Suspense = w;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
  react_production_min.act = X$1;
  react_production_min.cloneElement = function(a, b2, e2) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d2 = C$1({}, a.props), c2 = a.key, k2 = a.ref, h2 = a._owner;
    if (null != b2) {
      void 0 !== b2.ref && (k2 = b2.ref, h2 = K$1.current);
      void 0 !== b2.key && (c2 = "" + b2.key);
      if (a.type && a.type.defaultProps) var g2 = a.type.defaultProps;
      for (f2 in b2) J.call(b2, f2) && !L$1.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2) d2.children = e2;
    else if (1 < f2) {
      g2 = Array(f2);
      for (var m2 = 0; m2 < f2; m2++) g2[m2] = arguments[m2 + 2];
      d2.children = g2;
    }
    return { $$typeof: l$1, type: a.type, key: c2, ref: k2, props: d2, _owner: h2 };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u$1, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t$1, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M$1;
  react_production_min.createFactory = function(a) {
    var b2 = M$1.bind(null, a);
    b2.type = a;
    return b2;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v$2, render: a };
  };
  react_production_min.isValidElement = O$1;
  react_production_min.lazy = function(a) {
    return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
  };
  react_production_min.memo = function(a, b2) {
    return { $$typeof: x, type: a, compare: void 0 === b2 ? null : b2 };
  };
  react_production_min.startTransition = function(a) {
    var b2 = V$1.transition;
    V$1.transition = {};
    try {
      a();
    } finally {
      V$1.transition = b2;
    }
  };
  react_production_min.unstable_act = X$1;
  react_production_min.useCallback = function(a, b2) {
    return U$1.current.useCallback(a, b2);
  };
  react_production_min.useContext = function(a) {
    return U$1.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U$1.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b2) {
    return U$1.current.useEffect(a, b2);
  };
  react_production_min.useId = function() {
    return U$1.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b2, e2) {
    return U$1.current.useImperativeHandle(a, b2, e2);
  };
  react_production_min.useInsertionEffect = function(a, b2) {
    return U$1.current.useInsertionEffect(a, b2);
  };
  react_production_min.useLayoutEffect = function(a, b2) {
    return U$1.current.useLayoutEffect(a, b2);
  };
  react_production_min.useMemo = function(a, b2) {
    return U$1.current.useMemo(a, b2);
  };
  react_production_min.useReducer = function(a, b2, e2) {
    return U$1.current.useReducer(a, b2, e2);
  };
  react_production_min.useRef = function(a) {
    return U$1.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U$1.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b2, e2) {
    return U$1.current.useSyncExternalStore(a, b2, e2);
  };
  react_production_min.useTransition = function() {
    return U$1.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  {
    react.exports = react_production_min;
  }
  var reactExports = react.exports;
  const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
  const React$1 = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: React
  }, [reactExports]);
  var reactDom = { exports: {} };
  var reactDom_production_min = {};
  var scheduler = { exports: {} };
  var scheduler_production_min = {};
  /**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  (function(exports) {
    function f2(a, b2) {
      var c2 = a.length;
      a.push(b2);
      a: for (; 0 < c2; ) {
        var d2 = c2 - 1 >>> 1, e2 = a[d2];
        if (0 < g2(e2, b2)) a[d2] = b2, a[c2] = e2, c2 = d2;
        else break a;
      }
    }
    function h2(a) {
      return 0 === a.length ? null : a[0];
    }
    function k2(a) {
      if (0 === a.length) return null;
      var b2 = a[0], c2 = a.pop();
      if (c2 !== b2) {
        a[0] = c2;
        a: for (var d2 = 0, e2 = a.length, w2 = e2 >>> 1; d2 < w2; ) {
          var m2 = 2 * (d2 + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
          if (0 > g2(C2, c2)) n2 < e2 && 0 > g2(x2, C2) ? (a[d2] = x2, a[n2] = c2, d2 = n2) : (a[d2] = C2, a[m2] = c2, d2 = m2);
          else if (n2 < e2 && 0 > g2(x2, c2)) a[d2] = x2, a[n2] = c2, d2 = n2;
          else break a;
        }
      }
      return b2;
    }
    function g2(a, b2) {
      var c2 = a.sortIndex - b2.sortIndex;
      return 0 !== c2 ? c2 : a.id - b2.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var l2 = performance;
      exports.unstable_now = function() {
        return l2.now();
      };
    } else {
      var p2 = Date, q2 = p2.now();
      exports.unstable_now = function() {
        return p2.now() - q2;
      };
    }
    var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G2(a) {
      for (var b2 = h2(t2); null !== b2; ) {
        if (null === b2.callback) k2(t2);
        else if (b2.startTime <= a) k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
        else break;
        b2 = h2(t2);
      }
    }
    function H2(a) {
      B2 = false;
      G2(a);
      if (!A2) if (null !== h2(r2)) A2 = true, I2(J2);
      else {
        var b2 = h2(t2);
        null !== b2 && K2(H2, b2.startTime - a);
      }
    }
    function J2(a, b2) {
      A2 = false;
      B2 && (B2 = false, E2(L2), L2 = -1);
      z2 = true;
      var c2 = y2;
      try {
        G2(b2);
        for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a && !M2()); ) {
          var d2 = v2.callback;
          if ("function" === typeof d2) {
            v2.callback = null;
            y2 = v2.priorityLevel;
            var e2 = d2(v2.expirationTime <= b2);
            b2 = exports.unstable_now();
            "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
            G2(b2);
          } else k2(r2);
          v2 = h2(r2);
        }
        if (null !== v2) var w2 = true;
        else {
          var m2 = h2(t2);
          null !== m2 && K2(H2, m2.startTime - b2);
          w2 = false;
        }
        return w2;
      } finally {
        v2 = null, y2 = c2, z2 = false;
      }
    }
    var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
    function M2() {
      return exports.unstable_now() - Q2 < P2 ? false : true;
    }
    function R2() {
      if (null !== O2) {
        var a = exports.unstable_now();
        Q2 = a;
        var b2 = true;
        try {
          b2 = O2(true, a);
        } finally {
          b2 ? S2() : (N2 = false, O2 = null);
        }
      } else N2 = false;
    }
    var S2;
    if ("function" === typeof F2) S2 = function() {
      F2(R2);
    };
    else if ("undefined" !== typeof MessageChannel) {
      var T2 = new MessageChannel(), U2 = T2.port2;
      T2.port1.onmessage = R2;
      S2 = function() {
        U2.postMessage(null);
      };
    } else S2 = function() {
      D2(R2, 0);
    };
    function I2(a) {
      O2 = a;
      N2 || (N2 = true, S2());
    }
    function K2(a, b2) {
      L2 = D2(function() {
        a(exports.unstable_now());
      }, b2);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A2 || z2 || (A2 = true, I2(J2));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y2;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h2(r2);
    };
    exports.unstable_next = function(a) {
      switch (y2) {
        case 1:
        case 2:
        case 3:
          var b2 = 3;
          break;
        default:
          b2 = y2;
      }
      var c2 = y2;
      y2 = b2;
      try {
        return a();
      } finally {
        y2 = c2;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b2) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c2 = y2;
      y2 = a;
      try {
        return b2();
      } finally {
        y2 = c2;
      }
    };
    exports.unstable_scheduleCallback = function(a, b2, c2) {
      var d2 = exports.unstable_now();
      "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
      switch (a) {
        case 1:
          var e2 = -1;
          break;
        case 2:
          e2 = 250;
          break;
        case 5:
          e2 = 1073741823;
          break;
        case 4:
          e2 = 1e4;
          break;
        default:
          e2 = 5e3;
      }
      e2 = c2 + e2;
      a = { id: u2++, callback: b2, priorityLevel: a, startTime: c2, expirationTime: e2, sortIndex: -1 };
      c2 > d2 ? (a.sortIndex = c2, f2(t2, a), null === h2(r2) && a === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a.sortIndex = e2, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
      return a;
    };
    exports.unstable_shouldYield = M2;
    exports.unstable_wrapCallback = function(a) {
      var b2 = y2;
      return function() {
        var c2 = y2;
        y2 = b2;
        try {
          return a.apply(this, arguments);
        } finally {
          y2 = c2;
        }
      };
    };
  })(scheduler_production_min);
  {
    scheduler.exports = scheduler_production_min;
  }
  var schedulerExports = scheduler.exports;
  /**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var aa = reactExports, ca = schedulerExports;
  function p$1(a) {
    for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c2 = 1; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
    return "Minified React error #" + a + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a, b2) {
    ha(a, b2);
    ha(a + "Capture", b2);
  }
  function ha(a, b2) {
    ea[a] = b2;
    for (a = 0; a < b2.length; a++) da.add(b2[a]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a) {
    if (ja.call(ma, a)) return true;
    if (ja.call(la, a)) return false;
    if (ka.test(a)) return ma[a] = true;
    la[a] = true;
    return false;
  }
  function pa(a, b2, c2, d2) {
    if (null !== c2 && 0 === c2.type) return false;
    switch (typeof b2) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d2) return false;
        if (null !== c2) return !c2.acceptsBooleans;
        a = a.toLowerCase().slice(0, 5);
        return "data-" !== a && "aria-" !== a;
      default:
        return false;
    }
  }
  function qa(a, b2, c2, d2) {
    if (null === b2 || "undefined" === typeof b2 || pa(a, b2, c2, d2)) return true;
    if (d2) return false;
    if (null !== c2) switch (c2.type) {
      case 3:
        return !b2;
      case 4:
        return false === b2;
      case 5:
        return isNaN(b2);
      case 6:
        return isNaN(b2) || 1 > b2;
    }
    return false;
  }
  function v$1(a, b2, c2, d2, e2, f2, g2) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d2;
    this.attributeNamespace = e2;
    this.mustUseProperty = c2;
    this.propertyName = a;
    this.type = b2;
    this.sanitizeURL = f2;
    this.removeEmptyString = g2;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z[a] = new v$1(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b2 = a[0];
    z[b2] = new v$1(b2, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z[a] = new v$1(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z[a] = new v$1(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z[a] = new v$1(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z[a] = new v$1(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ra = /[\-:]([a-z])/g;
  function sa(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b2 = a.replace(
      ra,
      sa
    );
    z[b2] = new v$1(b2, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z[b2] = new v$1(b2, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z[b2] = new v$1(b2, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
  });
  function ta(a, b2, c2, d2) {
    var e2 = z.hasOwnProperty(b2) ? z[b2] : null;
    if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1]) qa(b2, c2, e2, d2) && (c2 = null), d2 || null === e2 ? oa(b2) && (null === c2 ? a.removeAttribute(b2) : a.setAttribute(b2, "" + c2)) : e2.mustUseProperty ? a[e2.propertyName] = null === c2 ? 3 === e2.type ? false : "" : c2 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c2 ? a.removeAttribute(b2) : (e2 = e2.type, c2 = 3 === e2 || 4 === e2 && true === c2 ? "" : "" + c2, d2 ? a.setAttributeNS(d2, b2, c2) : a.setAttribute(b2, c2)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a) {
    if (null === a || "object" !== typeof a) return null;
    a = Ja && a[Ja] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var A = Object.assign, La;
  function Ma(a) {
    if (void 0 === La) try {
      throw Error();
    } catch (c2) {
      var b2 = c2.stack.trim().match(/\n( *(at )?)/);
      La = b2 && b2[1] || "";
    }
    return "\n" + La + a;
  }
  var Na = false;
  function Oa(a, b2) {
    if (!a || Na) return "";
    Na = true;
    var c2 = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b2) if (b2 = function() {
        throw Error();
      }, Object.defineProperty(b2.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b2, []);
        } catch (l2) {
          var d2 = l2;
        }
        Reflect.construct(a, [], b2);
      } else {
        try {
          b2.call();
        } catch (l2) {
          d2 = l2;
        }
        a.call(b2.prototype);
      }
      else {
        try {
          throw Error();
        } catch (l2) {
          d2 = l2;
        }
        a();
      }
    } catch (l2) {
      if (l2 && d2 && "string" === typeof l2.stack) {
        for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; ) h2--;
        for (; 1 <= g2 && 0 <= h2; g2--, h2--) if (e2[g2] !== f2[h2]) {
          if (1 !== g2 || 1 !== h2) {
            do
              if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
                var k2 = "\n" + e2[g2].replace(" at new ", " at ");
                a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
                return k2;
              }
            while (1 <= g2 && 0 <= h2);
          }
          break;
        }
      }
    } finally {
      Na = false, Error.prepareStackTrace = c2;
    }
    return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
  }
  function Pa(a) {
    switch (a.tag) {
      case 5:
        return Ma(a.type);
      case 16:
        return Ma("Lazy");
      case 13:
        return Ma("Suspense");
      case 19:
        return Ma("SuspenseList");
      case 0:
      case 2:
      case 15:
        return a = Oa(a.type, false), a;
      case 11:
        return a = Oa(a.type.render, false), a;
      case 1:
        return a = Oa(a.type, true), a;
      default:
        return "";
    }
  }
  function Qa(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case ya:
        return "Fragment";
      case wa:
        return "Portal";
      case Aa:
        return "Profiler";
      case za:
        return "StrictMode";
      case Ea:
        return "Suspense";
      case Fa:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b2 = a.render;
        a = a.displayName;
        a || (a = b2.displayName || b2.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b2 = a.displayName || null, null !== b2 ? b2 : Qa(a.type) || "Memo";
      case Ha:
        b2 = a._payload;
        a = a._init;
        try {
          return Qa(a(b2));
        } catch (c2) {
        }
    }
    return null;
  }
  function Ra(a) {
    var b2 = a.type;
    switch (a.tag) {
      case 24:
        return "Cache";
      case 9:
        return (b2.displayName || "Context") + ".Consumer";
      case 10:
        return (b2._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return a = b2.render, a = a.displayName || a.name || "", b2.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return b2;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Qa(b2);
      case 8:
        return b2 === za ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof b2) return b2.displayName || b2.name || null;
        if ("string" === typeof b2) return b2;
    }
    return null;
  }
  function Sa(a) {
    switch (typeof a) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a;
      case "object":
        return a;
      default:
        return "";
    }
  }
  function Ta(a) {
    var b2 = a.type;
    return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
  }
  function Ua(a) {
    var b2 = Ta(a) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a.constructor.prototype, b2), d2 = "" + a[b2];
    if (!a.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
      var e2 = c2.get, f2 = c2.set;
      Object.defineProperty(a, b2, { configurable: true, get: function() {
        return e2.call(this);
      }, set: function(a2) {
        d2 = "" + a2;
        f2.call(this, a2);
      } });
      Object.defineProperty(a, b2, { enumerable: c2.enumerable });
      return { getValue: function() {
        return d2;
      }, setValue: function(a2) {
        d2 = "" + a2;
      }, stopTracking: function() {
        a._valueTracker = null;
        delete a[b2];
      } };
    }
  }
  function Va(a) {
    a._valueTracker || (a._valueTracker = Ua(a));
  }
  function Wa(a) {
    if (!a) return false;
    var b2 = a._valueTracker;
    if (!b2) return true;
    var c2 = b2.getValue();
    var d2 = "";
    a && (d2 = Ta(a) ? a.checked ? "true" : "false" : a.value);
    a = d2;
    return a !== c2 ? (b2.setValue(a), true) : false;
  }
  function Xa(a) {
    a = a || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a) return null;
    try {
      return a.activeElement || a.body;
    } catch (b2) {
      return a.body;
    }
  }
  function Ya(a, b2) {
    var c2 = b2.checked;
    return A({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a._wrapperState.initialChecked });
  }
  function Za(a, b2) {
    var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
    c2 = Sa(null != b2.value ? b2.value : c2);
    a._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
  }
  function ab(a, b2) {
    b2 = b2.checked;
    null != b2 && ta(a, "checked", b2, false);
  }
  function bb(a, b2) {
    ab(a, b2);
    var c2 = Sa(b2.value), d2 = b2.type;
    if (null != c2) if ("number" === d2) {
      if (0 === c2 && "" === a.value || a.value != c2) a.value = "" + c2;
    } else a.value !== "" + c2 && (a.value = "" + c2);
    else if ("submit" === d2 || "reset" === d2) {
      a.removeAttribute("value");
      return;
    }
    b2.hasOwnProperty("value") ? cb(a, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a, b2.type, Sa(b2.defaultValue));
    null == b2.checked && null != b2.defaultChecked && (a.defaultChecked = !!b2.defaultChecked);
  }
  function db(a, b2, c2) {
    if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
      var d2 = b2.type;
      if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value)) return;
      b2 = "" + a._wrapperState.initialValue;
      c2 || b2 === a.value || (a.value = b2);
      a.defaultValue = b2;
    }
    c2 = a.name;
    "" !== c2 && (a.name = "");
    a.defaultChecked = !!a._wrapperState.initialChecked;
    "" !== c2 && (a.name = c2);
  }
  function cb(a, b2, c2) {
    if ("number" !== b2 || Xa(a.ownerDocument) !== a) null == c2 ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c2 && (a.defaultValue = "" + c2);
  }
  var eb = Array.isArray;
  function fb(a, b2, c2, d2) {
    a = a.options;
    if (b2) {
      b2 = {};
      for (var e2 = 0; e2 < c2.length; e2++) b2["$" + c2[e2]] = true;
      for (c2 = 0; c2 < a.length; c2++) e2 = b2.hasOwnProperty("$" + a[c2].value), a[c2].selected !== e2 && (a[c2].selected = e2), e2 && d2 && (a[c2].defaultSelected = true);
    } else {
      c2 = "" + Sa(c2);
      b2 = null;
      for (e2 = 0; e2 < a.length; e2++) {
        if (a[e2].value === c2) {
          a[e2].selected = true;
          d2 && (a[e2].defaultSelected = true);
          return;
        }
        null !== b2 || a[e2].disabled || (b2 = a[e2]);
      }
      null !== b2 && (b2.selected = true);
    }
  }
  function gb(a, b2) {
    if (null != b2.dangerouslySetInnerHTML) throw Error(p$1(91));
    return A({}, b2, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
  }
  function hb(a, b2) {
    var c2 = b2.value;
    if (null == c2) {
      c2 = b2.children;
      b2 = b2.defaultValue;
      if (null != c2) {
        if (null != b2) throw Error(p$1(92));
        if (eb(c2)) {
          if (1 < c2.length) throw Error(p$1(93));
          c2 = c2[0];
        }
        b2 = c2;
      }
      null == b2 && (b2 = "");
      c2 = b2;
    }
    a._wrapperState = { initialValue: Sa(c2) };
  }
  function ib(a, b2) {
    var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
    null != c2 && (c2 = "" + c2, c2 !== a.value && (a.value = c2), null == b2.defaultValue && a.defaultValue !== c2 && (a.defaultValue = c2));
    null != d2 && (a.defaultValue = "" + d2);
  }
  function jb(a) {
    var b2 = a.textContent;
    b2 === a._wrapperState.initialValue && "" !== b2 && null !== b2 && (a.value = b2);
  }
  function kb(a) {
    switch (a) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function lb(a, b2) {
    return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b2) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a;
  }
  var mb, nb = function(a) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e2) {
      MSApp.execUnsafeLocalFunction(function() {
        return a(b2, c2, d2, e2);
      });
    } : a;
  }(function(a, b2) {
    if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b2;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
      for (b2 = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
      for (; b2.firstChild; ) a.appendChild(b2.firstChild);
    }
  });
  function ob(a, b2) {
    if (b2) {
      var c2 = a.firstChild;
      if (c2 && c2 === a.lastChild && 3 === c2.nodeType) {
        c2.nodeValue = b2;
        return;
      }
    }
    a.textContent = b2;
  }
  var pb = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, qb = ["Webkit", "ms", "Moz", "O"];
  Object.keys(pb).forEach(function(a) {
    qb.forEach(function(b2) {
      b2 = b2 + a.charAt(0).toUpperCase() + a.substring(1);
      pb[b2] = pb[a];
    });
  });
  function rb(a, b2, c2) {
    return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a) && pb[a] ? ("" + b2).trim() : b2 + "px";
  }
  function sb(a, b2) {
    a = a.style;
    for (var c2 in b2) if (b2.hasOwnProperty(c2)) {
      var d2 = 0 === c2.indexOf("--"), e2 = rb(c2, b2[c2], d2);
      "float" === c2 && (c2 = "cssFloat");
      d2 ? a.setProperty(c2, e2) : a[c2] = e2;
    }
  }
  var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a, b2) {
    if (b2) {
      if (tb[a] && (null != b2.children || null != b2.dangerouslySetInnerHTML)) throw Error(p$1(137, a));
      if (null != b2.dangerouslySetInnerHTML) {
        if (null != b2.children) throw Error(p$1(60));
        if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML)) throw Error(p$1(61));
      }
      if (null != b2.style && "object" !== typeof b2.style) throw Error(p$1(62));
    }
  }
  function vb(a, b2) {
    if (-1 === a.indexOf("-")) return "string" === typeof b2.is;
    switch (a) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var wb = null;
  function xb(a) {
    a = a.target || a.srcElement || window;
    a.correspondingUseElement && (a = a.correspondingUseElement);
    return 3 === a.nodeType ? a.parentNode : a;
  }
  var yb = null, zb = null, Ab = null;
  function Bb(a) {
    if (a = Cb(a)) {
      if ("function" !== typeof yb) throw Error(p$1(280));
      var b2 = a.stateNode;
      b2 && (b2 = Db(b2), yb(a.stateNode, a.type, b2));
    }
  }
  function Eb(a) {
    zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
  }
  function Fb() {
    if (zb) {
      var a = zb, b2 = Ab;
      Ab = zb = null;
      Bb(a);
      if (b2) for (a = 0; a < b2.length; a++) Bb(b2[a]);
    }
  }
  function Gb(a, b2) {
    return a(b2);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a, b2, c2) {
    if (Ib) return a(b2, c2);
    Ib = true;
    try {
      return Gb(a, b2, c2);
    } finally {
      if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
    }
  }
  function Kb(a, b2) {
    var c2 = a.stateNode;
    if (null === c2) return null;
    var d2 = Db(c2);
    if (null === d2) return null;
    c2 = d2[b2];
    a: switch (b2) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d2 = !d2.disabled) || (a = a.type, d2 = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d2;
        break a;
      default:
        a = false;
    }
    if (a) return null;
    if (c2 && "function" !== typeof c2) throw Error(p$1(231, b2, typeof c2));
    return c2;
  }
  var Lb = false;
  if (ia) try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
  function Nb(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    var l2 = Array.prototype.slice.call(arguments, 3);
    try {
      b2.apply(c2, l2);
    } catch (m2) {
      this.onError(m2);
    }
  }
  var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
    Ob = true;
    Pb = a;
  } };
  function Tb(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l2 = Pb;
        Ob = false;
        Pb = null;
      } else throw Error(p$1(198));
      Qb || (Qb = true, Rb = l2);
    }
  }
  function Vb(a) {
    var b2 = a, c2 = a;
    if (a.alternate) for (; b2.return; ) b2 = b2.return;
    else {
      a = b2;
      do
        b2 = a, 0 !== (b2.flags & 4098) && (c2 = b2.return), a = b2.return;
      while (a);
    }
    return 3 === b2.tag ? c2 : null;
  }
  function Wb(a) {
    if (13 === a.tag) {
      var b2 = a.memoizedState;
      null === b2 && (a = a.alternate, null !== a && (b2 = a.memoizedState));
      if (null !== b2) return b2.dehydrated;
    }
    return null;
  }
  function Xb(a) {
    if (Vb(a) !== a) throw Error(p$1(188));
  }
  function Yb(a) {
    var b2 = a.alternate;
    if (!b2) {
      b2 = Vb(a);
      if (null === b2) throw Error(p$1(188));
      return b2 !== a ? null : a;
    }
    for (var c2 = a, d2 = b2; ; ) {
      var e2 = c2.return;
      if (null === e2) break;
      var f2 = e2.alternate;
      if (null === f2) {
        d2 = e2.return;
        if (null !== d2) {
          c2 = d2;
          continue;
        }
        break;
      }
      if (e2.child === f2.child) {
        for (f2 = e2.child; f2; ) {
          if (f2 === c2) return Xb(e2), a;
          if (f2 === d2) return Xb(e2), b2;
          f2 = f2.sibling;
        }
        throw Error(p$1(188));
      }
      if (c2.return !== d2.return) c2 = e2, d2 = f2;
      else {
        for (var g2 = false, h2 = e2.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = e2;
            d2 = f2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = e2;
            c2 = f2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2) {
          for (h2 = f2.child; h2; ) {
            if (h2 === c2) {
              g2 = true;
              c2 = f2;
              d2 = e2;
              break;
            }
            if (h2 === d2) {
              g2 = true;
              d2 = f2;
              c2 = e2;
              break;
            }
            h2 = h2.sibling;
          }
          if (!g2) throw Error(p$1(189));
        }
      }
      if (c2.alternate !== d2) throw Error(p$1(190));
    }
    if (3 !== c2.tag) throw Error(p$1(188));
    return c2.stateNode.current === c2 ? a : b2;
  }
  function Zb(a) {
    a = Yb(a);
    return null !== a ? $b(a) : null;
  }
  function $b(a) {
    if (5 === a.tag || 6 === a.tag) return a;
    for (a = a.child; null !== a; ) {
      var b2 = $b(a);
      if (null !== b2) return b2;
      a = a.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a) {
    if (lc && "function" === typeof lc.onCommitFiberRoot) try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b2) {
    }
  }
  var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
  function nc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
  }
  var rc = 64, sc = 4194304;
  function tc(a) {
    switch (a & -a) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return a & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return a;
    }
  }
  function uc(a, b2) {
    var c2 = a.pendingLanes;
    if (0 === c2) return 0;
    var d2 = 0, e2 = a.suspendedLanes, f2 = a.pingedLanes, g2 = c2 & 268435455;
    if (0 !== g2) {
      var h2 = g2 & ~e2;
      0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
    } else g2 = c2 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
    if (0 === d2) return 0;
    if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240))) return b2;
    0 !== (d2 & 4) && (d2 |= c2 & 16);
    b2 = a.entangledLanes;
    if (0 !== b2) for (a = a.entanglements, b2 &= d2; 0 < b2; ) c2 = 31 - oc(b2), e2 = 1 << c2, d2 |= a[c2], b2 &= ~e2;
    return d2;
  }
  function vc(a, b2) {
    switch (a) {
      case 1:
      case 2:
      case 4:
        return b2 + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return b2 + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function wc(a, b2) {
    for (var c2 = a.suspendedLanes, d2 = a.pingedLanes, e2 = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
      var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
      if (-1 === k2) {
        if (0 === (h2 & c2) || 0 !== (h2 & d2)) e2[g2] = vc(h2, b2);
      } else k2 <= b2 && (a.expiredLanes |= h2);
      f2 &= ~h2;
    }
  }
  function xc(a) {
    a = a.pendingLanes & -1073741825;
    return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
  }
  function yc() {
    var a = rc;
    rc <<= 1;
    0 === (rc & 4194240) && (rc = 64);
    return a;
  }
  function zc(a) {
    for (var b2 = [], c2 = 0; 31 > c2; c2++) b2.push(a);
    return b2;
  }
  function Ac(a, b2, c2) {
    a.pendingLanes |= b2;
    536870912 !== b2 && (a.suspendedLanes = 0, a.pingedLanes = 0);
    a = a.eventTimes;
    b2 = 31 - oc(b2);
    a[b2] = c2;
  }
  function Bc(a, b2) {
    var c2 = a.pendingLanes & ~b2;
    a.pendingLanes = b2;
    a.suspendedLanes = 0;
    a.pingedLanes = 0;
    a.expiredLanes &= b2;
    a.mutableReadLanes &= b2;
    a.entangledLanes &= b2;
    b2 = a.entanglements;
    var d2 = a.eventTimes;
    for (a = a.expirationTimes; 0 < c2; ) {
      var e2 = 31 - oc(c2), f2 = 1 << e2;
      b2[e2] = 0;
      d2[e2] = -1;
      a[e2] = -1;
      c2 &= ~f2;
    }
  }
  function Cc(a, b2) {
    var c2 = a.entangledLanes |= b2;
    for (a = a.entanglements; c2; ) {
      var d2 = 31 - oc(c2), e2 = 1 << d2;
      e2 & b2 | a[d2] & b2 && (a[d2] |= b2);
      c2 &= ~e2;
    }
  }
  var C = 0;
  function Dc(a) {
    a &= -a;
    return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
  }
  var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Sc(a, b2) {
    switch (a) {
      case "focusin":
      case "focusout":
        Lc = null;
        break;
      case "dragenter":
      case "dragleave":
        Mc = null;
        break;
      case "mouseover":
      case "mouseout":
        Nc = null;
        break;
      case "pointerover":
      case "pointerout":
        Oc.delete(b2.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pc.delete(b2.pointerId);
    }
  }
  function Tc(a, b2, c2, d2, e2, f2) {
    if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a;
    a.eventSystemFlags |= d2;
    b2 = a.targetContainers;
    null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
    return a;
  }
  function Uc(a, b2, c2, d2, e2) {
    switch (b2) {
      case "focusin":
        return Lc = Tc(Lc, a, b2, c2, d2, e2), true;
      case "dragenter":
        return Mc = Tc(Mc, a, b2, c2, d2, e2), true;
      case "mouseover":
        return Nc = Tc(Nc, a, b2, c2, d2, e2), true;
      case "pointerover":
        var f2 = e2.pointerId;
        Oc.set(f2, Tc(Oc.get(f2) || null, a, b2, c2, d2, e2));
        return true;
      case "gotpointercapture":
        return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b2, c2, d2, e2)), true;
    }
    return false;
  }
  function Vc(a) {
    var b2 = Wc(a.target);
    if (null !== b2) {
      var c2 = Vb(b2);
      if (null !== c2) {
        if (b2 = c2.tag, 13 === b2) {
          if (b2 = Wb(c2), null !== b2) {
            a.blockedOn = b2;
            Ic(a.priority, function() {
              Gc(c2);
            });
            return;
          }
        } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
          a.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a.blockedOn = null;
  }
  function Xc(a) {
    if (null !== a.blockedOn) return false;
    for (var b2 = a.targetContainers; 0 < b2.length; ) {
      var c2 = Yc(a.domEventName, a.eventSystemFlags, b2[0], a.nativeEvent);
      if (null === c2) {
        c2 = a.nativeEvent;
        var d2 = new c2.constructor(c2.type, c2);
        wb = d2;
        c2.target.dispatchEvent(d2);
        wb = null;
      } else return b2 = Cb(c2), null !== b2 && Fc(b2), a.blockedOn = c2, false;
      b2.shift();
    }
    return true;
  }
  function Zc(a, b2, c2) {
    Xc(a) && c2.delete(b2);
  }
  function $c() {
    Jc = false;
    null !== Lc && Xc(Lc) && (Lc = null);
    null !== Mc && Xc(Mc) && (Mc = null);
    null !== Nc && Xc(Nc) && (Nc = null);
    Oc.forEach(Zc);
    Pc.forEach(Zc);
  }
  function ad(a, b2) {
    a.blockedOn === b2 && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
  }
  function bd(a) {
    function b2(b3) {
      return ad(b3, a);
    }
    if (0 < Kc.length) {
      ad(Kc[0], a);
      for (var c2 = 1; c2 < Kc.length; c2++) {
        var d2 = Kc[c2];
        d2.blockedOn === a && (d2.blockedOn = null);
      }
    }
    null !== Lc && ad(Lc, a);
    null !== Mc && ad(Mc, a);
    null !== Nc && ad(Nc, a);
    Oc.forEach(b2);
    Pc.forEach(b2);
    for (c2 = 0; c2 < Qc.length; c2++) d2 = Qc[c2], d2.blockedOn === a && (d2.blockedOn = null);
    for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); ) Vc(c2), null === c2.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a, b2, c2, d2) {
    var e2 = C, f2 = cd.transition;
    cd.transition = null;
    try {
      C = 1, fd(a, b2, c2, d2);
    } finally {
      C = e2, cd.transition = f2;
    }
  }
  function gd(a, b2, c2, d2) {
    var e2 = C, f2 = cd.transition;
    cd.transition = null;
    try {
      C = 4, fd(a, b2, c2, d2);
    } finally {
      C = e2, cd.transition = f2;
    }
  }
  function fd(a, b2, c2, d2) {
    if (dd) {
      var e2 = Yc(a, b2, c2, d2);
      if (null === e2) hd(a, b2, d2, id, c2), Sc(a, d2);
      else if (Uc(e2, a, b2, c2, d2)) d2.stopPropagation();
      else if (Sc(a, d2), b2 & 4 && -1 < Rc.indexOf(a)) {
        for (; null !== e2; ) {
          var f2 = Cb(e2);
          null !== f2 && Ec(f2);
          f2 = Yc(a, b2, c2, d2);
          null === f2 && hd(a, b2, d2, id, c2);
          if (f2 === e2) break;
          e2 = f2;
        }
        null !== e2 && d2.stopPropagation();
      } else hd(a, b2, d2, null, c2);
    }
  }
  var id = null;
  function Yc(a, b2, c2, d2) {
    id = null;
    a = xb(d2);
    a = Wc(a);
    if (null !== a) if (b2 = Vb(a), null === b2) a = null;
    else if (c2 = b2.tag, 13 === c2) {
      a = Wb(b2);
      if (null !== a) return a;
      a = null;
    } else if (3 === c2) {
      if (b2.stateNode.current.memoizedState.isDehydrated) return 3 === b2.tag ? b2.stateNode.containerInfo : null;
      a = null;
    } else b2 !== a && (a = null);
    id = a;
    return null;
  }
  function jd(a) {
    switch (a) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ec()) {
          case fc:
            return 1;
          case gc:
            return 4;
          case hc:
          case ic:
            return 16;
          case jc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kd = null, ld = null, md = null;
  function nd() {
    if (md) return md;
    var a, b2 = ld, c2 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
    for (a = 0; a < c2 && b2[a] === e2[a]; a++) ;
    var g2 = c2 - a;
    for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e2[f2 - d2]; d2++) ;
    return md = e2.slice(a, 1 < d2 ? 1 - d2 : void 0);
  }
  function od(a) {
    var b2 = a.keyCode;
    "charCode" in a ? (a = a.charCode, 0 === a && 13 === b2 && (a = 13)) : a = b2;
    10 === a && (a = 13);
    return 32 <= a || 13 === a ? a : 0;
  }
  function pd() {
    return true;
  }
  function qd() {
    return false;
  }
  function rd(a) {
    function b2(b3, d2, e2, f2, g2) {
      this._reactName = b3;
      this._targetInst = e2;
      this.type = d2;
      this.nativeEvent = f2;
      this.target = g2;
      this.currentTarget = null;
      for (var c2 in a) a.hasOwnProperty(c2) && (b3 = a[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
      this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
      this.isPropagationStopped = qd;
      return this;
    }
    A(b2.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var a2 = this.nativeEvent;
      a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
    }, stopPropagation: function() {
      var a2 = this.nativeEvent;
      a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
    }, persist: function() {
    }, isPersistent: pd });
    return b2;
  }
  var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
    return a.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
    return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
  }, movementX: function(a) {
    if ("movementX" in a) return a.movementX;
    a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
    return wd;
  }, movementY: function(a) {
    return "movementY" in a ? a.movementY : xd;
  } }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
    return "clipboardData" in a ? a.clipboardData : window.clipboardData;
  } }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Pd(a) {
    var b2 = this.nativeEvent;
    return b2.getModifierState ? b2.getModifierState(a) : (a = Od[a]) ? !!b2[a] : false;
  }
  function zd() {
    return Pd;
  }
  var Qd = A({}, ud, { key: function(a) {
    if (a.key) {
      var b2 = Md[a.key] || a.key;
      if ("Unidentified" !== b2) return b2;
    }
    return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
    return "keypress" === a.type ? od(a) : 0;
  }, keyCode: function(a) {
    return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  }, which: function(a) {
    return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  } }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
    deltaX: function(a) {
      return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
    },
    deltaY: function(a) {
      return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
  ia && "documentMode" in document && (be = document.documentMode);
  var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
  function ge(a, b2) {
    switch (a) {
      case "keyup":
        return -1 !== $d.indexOf(b2.keyCode);
      case "keydown":
        return 229 !== b2.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function he(a) {
    a = a.detail;
    return "object" === typeof a && "data" in a ? a.data : null;
  }
  var ie = false;
  function je(a, b2) {
    switch (a) {
      case "compositionend":
        return he(b2);
      case "keypress":
        if (32 !== b2.which) return null;
        fe = true;
        return ee;
      case "textInput":
        return a = b2.data, a === ee && fe ? null : a;
      default:
        return null;
    }
  }
  function ke(a, b2) {
    if (ie) return "compositionend" === a || !ae && ge(a, b2) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
          if (b2.char && 1 < b2.char.length) return b2.char;
          if (b2.which) return String.fromCharCode(b2.which);
        }
        return null;
      case "compositionend":
        return de && "ko" !== b2.locale ? null : b2.data;
      default:
        return null;
    }
  }
  var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function me(a) {
    var b2 = a && a.nodeName && a.nodeName.toLowerCase();
    return "input" === b2 ? !!le[a.type] : "textarea" === b2 ? true : false;
  }
  function ne(a, b2, c2, d2) {
    Eb(d2);
    b2 = oe(b2, "onChange");
    0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a.push({ event: c2, listeners: b2 }));
  }
  var pe = null, qe = null;
  function re(a) {
    se(a, 0);
  }
  function te(a) {
    var b2 = ue(a);
    if (Wa(b2)) return a;
  }
  function ve(a, b2) {
    if ("change" === a) return b2;
  }
  var we = false;
  if (ia) {
    var xe;
    if (ia) {
      var ye = "oninput" in document;
      if (!ye) {
        var ze = document.createElement("div");
        ze.setAttribute("oninput", "return;");
        ye = "function" === typeof ze.oninput;
      }
      xe = ye;
    } else xe = false;
    we = xe && (!document.documentMode || 9 < document.documentMode);
  }
  function Ae() {
    pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
  }
  function Be(a) {
    if ("value" === a.propertyName && te(qe)) {
      var b2 = [];
      ne(b2, qe, a, xb(a));
      Jb(re, b2);
    }
  }
  function Ce(a, b2, c2) {
    "focusin" === a ? (Ae(), pe = b2, qe = c2, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
  }
  function De(a) {
    if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
  }
  function Ee(a, b2) {
    if ("click" === a) return te(b2);
  }
  function Fe(a, b2) {
    if ("input" === a || "change" === a) return te(b2);
  }
  function Ge(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var He = "function" === typeof Object.is ? Object.is : Ge;
  function Ie(a, b2) {
    if (He(a, b2)) return true;
    if ("object" !== typeof a || null === a || "object" !== typeof b2 || null === b2) return false;
    var c2 = Object.keys(a), d2 = Object.keys(b2);
    if (c2.length !== d2.length) return false;
    for (d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      if (!ja.call(b2, e2) || !He(a[e2], b2[e2])) return false;
    }
    return true;
  }
  function Je(a) {
    for (; a && a.firstChild; ) a = a.firstChild;
    return a;
  }
  function Ke(a, b2) {
    var c2 = Je(a);
    a = 0;
    for (var d2; c2; ) {
      if (3 === c2.nodeType) {
        d2 = a + c2.textContent.length;
        if (a <= b2 && d2 >= b2) return { node: c2, offset: b2 - a };
        a = d2;
      }
      a: {
        for (; c2; ) {
          if (c2.nextSibling) {
            c2 = c2.nextSibling;
            break a;
          }
          c2 = c2.parentNode;
        }
        c2 = void 0;
      }
      c2 = Je(c2);
    }
  }
  function Le(a, b2) {
    return a && b2 ? a === b2 ? true : a && 3 === a.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a, b2.parentNode) : "contains" in a ? a.contains(b2) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b2) & 16) : false : false;
  }
  function Me() {
    for (var a = window, b2 = Xa(); b2 instanceof a.HTMLIFrameElement; ) {
      try {
        var c2 = "string" === typeof b2.contentWindow.location.href;
      } catch (d2) {
        c2 = false;
      }
      if (c2) a = b2.contentWindow;
      else break;
      b2 = Xa(a.document);
    }
    return b2;
  }
  function Ne(a) {
    var b2 = a && a.nodeName && a.nodeName.toLowerCase();
    return b2 && ("input" === b2 && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b2 || "true" === a.contentEditable);
  }
  function Oe(a) {
    var b2 = Me(), c2 = a.focusedElem, d2 = a.selectionRange;
    if (b2 !== c2 && c2 && c2.ownerDocument && Le(c2.ownerDocument.documentElement, c2)) {
      if (null !== d2 && Ne(c2)) {
        if (b2 = d2.start, a = d2.end, void 0 === a && (a = b2), "selectionStart" in c2) c2.selectionStart = b2, c2.selectionEnd = Math.min(a, c2.value.length);
        else if (a = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var e2 = c2.textContent.length, f2 = Math.min(d2.start, e2);
          d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
          !a.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
          e2 = Ke(c2, f2);
          var g2 = Ke(
            c2,
            d2
          );
          e2 && g2 && (1 !== a.rangeCount || a.anchorNode !== e2.node || a.anchorOffset !== e2.offset || a.focusNode !== g2.node || a.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a.removeAllRanges(), f2 > d2 ? (a.addRange(b2), a.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a.addRange(b2)));
        }
      }
      b2 = [];
      for (a = c2; a = a.parentNode; ) 1 === a.nodeType && b2.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
      "function" === typeof c2.focus && c2.focus();
      for (c2 = 0; c2 < b2.length; c2++) a = b2[c2], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
    }
  }
  var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
  function Ue(a, b2, c2) {
    var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
    Te || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie(Se, d2) || (Se = d2, d2 = oe(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a.push({ event: b2, listeners: d2 }), b2.target = Qe)));
  }
  function Ve(a, b2) {
    var c2 = {};
    c2[a.toLowerCase()] = b2.toLowerCase();
    c2["Webkit" + a] = "webkit" + b2;
    c2["Moz" + a] = "moz" + b2;
    return c2;
  }
  var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
  ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
  function Ze(a) {
    if (Xe[a]) return Xe[a];
    if (!We[a]) return a;
    var b2 = We[a], c2;
    for (c2 in b2) if (b2.hasOwnProperty(c2) && c2 in Ye) return Xe[a] = b2[c2];
    return a;
  }
  var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ff(a, b2) {
    df.set(a, b2);
    fa(b2, [a]);
  }
  for (var gf = 0; gf < ef.length; gf++) {
    var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
    ff(jf, "on" + kf);
  }
  ff($e, "onAnimationEnd");
  ff(af, "onAnimationIteration");
  ff(bf, "onAnimationStart");
  ff("dblclick", "onDoubleClick");
  ff("focusin", "onFocus");
  ff("focusout", "onBlur");
  ff(cf, "onTransitionEnd");
  ha("onMouseEnter", ["mouseout", "mouseover"]);
  ha("onMouseLeave", ["mouseout", "mouseover"]);
  ha("onPointerEnter", ["pointerout", "pointerover"]);
  ha("onPointerLeave", ["pointerout", "pointerover"]);
  fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
  function nf(a, b2, c2) {
    var d2 = a.type || "unknown-event";
    a.currentTarget = c2;
    Ub(d2, b2, void 0, a);
    a.currentTarget = null;
  }
  function se(a, b2) {
    b2 = 0 !== (b2 & 4);
    for (var c2 = 0; c2 < a.length; c2++) {
      var d2 = a[c2], e2 = d2.event;
      d2 = d2.listeners;
      a: {
        var f2 = void 0;
        if (b2) for (var g2 = d2.length - 1; 0 <= g2; g2--) {
          var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
        else for (g2 = 0; g2 < d2.length; g2++) {
          h2 = d2[g2];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
      }
    }
    if (Qb) throw a = Rb, Qb = false, Rb = null, a;
  }
  function D(a, b2) {
    var c2 = b2[of];
    void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
    var d2 = a + "__bubble";
    c2.has(d2) || (pf(b2, a, 2, false), c2.add(d2));
  }
  function qf(a, b2, c2) {
    var d2 = 0;
    b2 && (d2 |= 4);
    pf(c2, a, d2, b2);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(a) {
    if (!a[rf]) {
      a[rf] = true;
      da.forEach(function(b3) {
        "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a), qf(b3, true, a));
      });
      var b2 = 9 === a.nodeType ? a : a.ownerDocument;
      null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
    }
  }
  function pf(a, b2, c2, d2) {
    switch (jd(b2)) {
      case 1:
        var e2 = ed;
        break;
      case 4:
        e2 = gd;
        break;
      default:
        e2 = fd;
    }
    c2 = e2.bind(null, b2, c2, a);
    e2 = void 0;
    !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
    d2 ? void 0 !== e2 ? a.addEventListener(b2, c2, { capture: true, passive: e2 }) : a.addEventListener(b2, c2, true) : void 0 !== e2 ? a.addEventListener(b2, c2, { passive: e2 }) : a.addEventListener(b2, c2, false);
  }
  function hd(a, b2, c2, d2, e2) {
    var f2 = d2;
    if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2) a: for (; ; ) {
      if (null === d2) return;
      var g2 = d2.tag;
      if (3 === g2 || 4 === g2) {
        var h2 = d2.stateNode.containerInfo;
        if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2) break;
        if (4 === g2) for (g2 = d2.return; null !== g2; ) {
          var k2 = g2.tag;
          if (3 === k2 || 4 === k2) {
            if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2) return;
          }
          g2 = g2.return;
        }
        for (; null !== h2; ) {
          g2 = Wc(h2);
          if (null === g2) return;
          k2 = g2.tag;
          if (5 === k2 || 6 === k2) {
            d2 = f2 = g2;
            continue a;
          }
          h2 = h2.parentNode;
        }
      }
      d2 = d2.return;
    }
    Jb(function() {
      var d3 = f2, e3 = xb(c2), g3 = [];
      a: {
        var h3 = df.get(a);
        if (void 0 !== h3) {
          var k3 = td, n2 = a;
          switch (a) {
            case "keypress":
              if (0 === od(c2)) break a;
            case "keydown":
            case "keyup":
              k3 = Rd;
              break;
            case "focusin":
              n2 = "focus";
              k3 = Fd;
              break;
            case "focusout":
              n2 = "blur";
              k3 = Fd;
              break;
            case "beforeblur":
            case "afterblur":
              k3 = Fd;
              break;
            case "click":
              if (2 === c2.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k3 = Bd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k3 = Dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k3 = Vd;
              break;
            case $e:
            case af:
            case bf:
              k3 = Hd;
              break;
            case cf:
              k3 = Xd;
              break;
            case "scroll":
              k3 = vd;
              break;
            case "wheel":
              k3 = Zd;
              break;
            case "copy":
            case "cut":
            case "paste":
              k3 = Jd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k3 = Td;
          }
          var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
          t2 = [];
          for (var w2 = d3, u2; null !== w2; ) {
            u2 = w2;
            var F2 = u2.stateNode;
            5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
            if (J2) break;
            w2 = w2.return;
          }
          0 < t2.length && (h3 = new k3(h3, n2, null, c2, e3), g3.push({ event: h3, listeners: t2 }));
        }
      }
      if (0 === (b2 & 7)) {
        a: {
          h3 = "mouseover" === a || "pointerover" === a;
          k3 = "mouseout" === a || "pointerout" === a;
          if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf])) break a;
          if (k3 || h3) {
            h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
            if (k3) {
              if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
            } else k3 = null, n2 = d3;
            if (k3 !== n2) {
              t2 = Bd;
              F2 = "onMouseLeave";
              x2 = "onMouseEnter";
              w2 = "mouse";
              if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
              J2 = null == k3 ? h3 : ue(k3);
              u2 = null == n2 ? h3 : ue(n2);
              h3 = new t2(F2, w2 + "leave", k3, c2, e3);
              h3.target = J2;
              h3.relatedTarget = u2;
              F2 = null;
              Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
              J2 = F2;
              if (k3 && n2) b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2)) w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2)) u2++;
                for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
              else t2 = null;
              null !== k3 && wf(g3, h3, k3, t2, false);
              null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
            }
          }
        }
        a: {
          h3 = d3 ? ue(d3) : window;
          k3 = h3.nodeName && h3.nodeName.toLowerCase();
          if ("select" === k3 || "input" === k3 && "file" === h3.type) var na = ve;
          else if (me(h3)) if (we) na = Fe;
          else {
            na = De;
            var xa = Ce;
          }
          else (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
          if (na && (na = na(a, d3))) {
            ne(g3, na, c2, e3);
            break a;
          }
          xa && xa(a, h3, d3);
          "focusout" === a && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
        }
        xa = d3 ? ue(d3) : window;
        switch (a) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d3, Se = null;
            break;
          case "focusout":
            Se = Re = Qe = null;
            break;
          case "mousedown":
            Te = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Te = false;
            Ue(g3, c2, e3);
            break;
          case "selectionchange":
            if (Pe) break;
          case "keydown":
          case "keyup":
            Ue(g3, c2, e3);
        }
        var $a;
        if (ae) b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
        else ie ? ge(a, c2) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c2.keyCode && (ba = "onCompositionStart");
        ba && (de && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c2, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c2), null !== $a && (ba.data = $a))));
        if ($a = ce ? je(a, c2) : ke(a, c2)) d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c2, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
      }
      se(g3, b2);
    });
  }
  function tf(a, b2, c2) {
    return { instance: a, listener: b2, currentTarget: c2 };
  }
  function oe(a, b2) {
    for (var c2 = b2 + "Capture", d2 = []; null !== a; ) {
      var e2 = a, f2 = e2.stateNode;
      5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a, c2), null != f2 && d2.unshift(tf(a, f2, e2)), f2 = Kb(a, b2), null != f2 && d2.push(tf(a, f2, e2)));
      a = a.return;
    }
    return d2;
  }
  function vf(a) {
    if (null === a) return null;
    do
      a = a.return;
    while (a && 5 !== a.tag);
    return a ? a : null;
  }
  function wf(a, b2, c2, d2, e2) {
    for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
      var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
      if (null !== k2 && k2 === d2) break;
      5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e2 || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
      c2 = c2.return;
    }
    0 !== g2.length && a.push({ event: b2, listeners: g2 });
  }
  var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
  function zf(a) {
    return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
  }
  function Af(a, b2, c2) {
    b2 = zf(b2);
    if (zf(a) !== b2 && c2) throw Error(p$1(425));
  }
  function Bf() {
  }
  var Cf = null, Df = null;
  function Ef(a, b2) {
    return "textarea" === a || "noscript" === a || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
  }
  var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
    return Hf.resolve(null).then(a).catch(If);
  } : Ff;
  function If(a) {
    setTimeout(function() {
      throw a;
    });
  }
  function Kf(a, b2) {
    var c2 = b2, d2 = 0;
    do {
      var e2 = c2.nextSibling;
      a.removeChild(c2);
      if (e2 && 8 === e2.nodeType) if (c2 = e2.data, "/$" === c2) {
        if (0 === d2) {
          a.removeChild(e2);
          bd(b2);
          return;
        }
        d2--;
      } else "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
      c2 = e2;
    } while (c2);
    bd(b2);
  }
  function Lf(a) {
    for (; null != a; a = a.nextSibling) {
      var b2 = a.nodeType;
      if (1 === b2 || 3 === b2) break;
      if (8 === b2) {
        b2 = a.data;
        if ("$" === b2 || "$!" === b2 || "$?" === b2) break;
        if ("/$" === b2) return null;
      }
    }
    return a;
  }
  function Mf(a) {
    a = a.previousSibling;
    for (var b2 = 0; a; ) {
      if (8 === a.nodeType) {
        var c2 = a.data;
        if ("$" === c2 || "$!" === c2 || "$?" === c2) {
          if (0 === b2) return a;
          b2--;
        } else "/$" === c2 && b2++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a) {
    var b2 = a[Of];
    if (b2) return b2;
    for (var c2 = a.parentNode; c2; ) {
      if (b2 = c2[uf] || c2[Of]) {
        c2 = b2.alternate;
        if (null !== b2.child || null !== c2 && null !== c2.child) for (a = Mf(a); null !== a; ) {
          if (c2 = a[Of]) return c2;
          a = Mf(a);
        }
        return b2;
      }
      a = c2;
      c2 = a.parentNode;
    }
    return null;
  }
  function Cb(a) {
    a = a[Of] || a[uf];
    return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
  }
  function ue(a) {
    if (5 === a.tag || 6 === a.tag) return a.stateNode;
    throw Error(p$1(33));
  }
  function Db(a) {
    return a[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a) {
    return { current: a };
  }
  function E(a) {
    0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G(a, b2) {
    Tf++;
    Sf[Tf] = a.current;
    a.current = b2;
  }
  var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a, b2) {
    var c2 = a.type.contextTypes;
    if (!c2) return Vf;
    var d2 = a.stateNode;
    if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2) return d2.__reactInternalMemoizedMaskedChildContext;
    var e2 = {}, f2;
    for (f2 in c2) e2[f2] = b2[f2];
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b2, a.__reactInternalMemoizedMaskedChildContext = e2);
    return e2;
  }
  function Zf(a) {
    a = a.childContextTypes;
    return null !== a && void 0 !== a;
  }
  function $f() {
    E(Wf);
    E(H);
  }
  function ag(a, b2, c2) {
    if (H.current !== Vf) throw Error(p$1(168));
    G(H, b2);
    G(Wf, c2);
  }
  function bg(a, b2, c2) {
    var d2 = a.stateNode;
    b2 = b2.childContextTypes;
    if ("function" !== typeof d2.getChildContext) return c2;
    d2 = d2.getChildContext();
    for (var e2 in d2) if (!(e2 in b2)) throw Error(p$1(108, Ra(a) || "Unknown", e2));
    return A({}, c2, d2);
  }
  function cg(a) {
    a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H.current;
    G(H, a);
    G(Wf, Wf.current);
    return true;
  }
  function dg(a, b2, c2) {
    var d2 = a.stateNode;
    if (!d2) throw Error(p$1(169));
    c2 ? (a = bg(a, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
    G(Wf, c2);
  }
  var eg = null, fg = false, gg = false;
  function hg(a) {
    null === eg ? eg = [a] : eg.push(a);
  }
  function ig(a) {
    fg = true;
    hg(a);
  }
  function jg() {
    if (!gg && null !== eg) {
      gg = true;
      var a = 0, b2 = C;
      try {
        var c2 = eg;
        for (C = 1; a < c2.length; a++) {
          var d2 = c2[a];
          do
            d2 = d2(true);
          while (null !== d2);
        }
        eg = null;
        fg = false;
      } catch (e2) {
        throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e2;
      } finally {
        C = b2, gg = false;
      }
    }
    return null;
  }
  var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
  function tg(a, b2) {
    kg[lg++] = ng;
    kg[lg++] = mg;
    mg = a;
    ng = b2;
  }
  function ug(a, b2, c2) {
    og[pg++] = rg;
    og[pg++] = sg;
    og[pg++] = qg;
    qg = a;
    var d2 = rg;
    a = sg;
    var e2 = 32 - oc(d2) - 1;
    d2 &= ~(1 << e2);
    c2 += 1;
    var f2 = 32 - oc(b2) + e2;
    if (30 < f2) {
      var g2 = e2 - e2 % 5;
      f2 = (d2 & (1 << g2) - 1).toString(32);
      d2 >>= g2;
      e2 -= g2;
      rg = 1 << 32 - oc(b2) + e2 | c2 << e2 | d2;
      sg = f2 + a;
    } else rg = 1 << f2 | c2 << e2 | d2, sg = a;
  }
  function vg(a) {
    null !== a.return && (tg(a, 1), ug(a, 1, 0));
  }
  function wg(a) {
    for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I = false, zg = null;
  function Ag(a, b2) {
    var c2 = Bg(5, null, null, 0);
    c2.elementType = "DELETED";
    c2.stateNode = b2;
    c2.return = a;
    b2 = a.deletions;
    null === b2 ? (a.deletions = [c2], a.flags |= 16) : b2.push(c2);
  }
  function Cg(a, b2) {
    switch (a.tag) {
      case 5:
        var c2 = a.type;
        b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
        return null !== b2 ? (a.stateNode = b2, xg = a, yg = Lf(b2.firstChild), true) : false;
      case 6:
        return b2 = "" === a.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a.stateNode = b2, xg = a, yg = null, true) : false;
      case 13:
        return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a, a.child = c2, xg = a, yg = null, true) : false;
      default:
        return false;
    }
  }
  function Dg(a) {
    return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
  }
  function Eg(a) {
    if (I) {
      var b2 = yg;
      if (b2) {
        var c2 = b2;
        if (!Cg(a, b2)) {
          if (Dg(a)) throw Error(p$1(418));
          b2 = Lf(c2.nextSibling);
          var d2 = xg;
          b2 && Cg(a, b2) ? Ag(d2, c2) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
        }
      } else {
        if (Dg(a)) throw Error(p$1(418));
        a.flags = a.flags & -4097 | 2;
        I = false;
        xg = a;
      }
    }
  }
  function Fg(a) {
    for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
    xg = a;
  }
  function Gg(a) {
    if (a !== xg) return false;
    if (!I) return Fg(a), I = true, false;
    var b2;
    (b2 = 3 !== a.tag) && !(b2 = 5 !== a.tag) && (b2 = a.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a.type, a.memoizedProps));
    if (b2 && (b2 = yg)) {
      if (Dg(a)) throw Hg(), Error(p$1(418));
      for (; b2; ) Ag(a, b2), b2 = Lf(b2.nextSibling);
    }
    Fg(a);
    if (13 === a.tag) {
      a = a.memoizedState;
      a = null !== a ? a.dehydrated : null;
      if (!a) throw Error(p$1(317));
      a: {
        a = a.nextSibling;
        for (b2 = 0; a; ) {
          if (8 === a.nodeType) {
            var c2 = a.data;
            if ("/$" === c2) {
              if (0 === b2) {
                yg = Lf(a.nextSibling);
                break a;
              }
              b2--;
            } else "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
          }
          a = a.nextSibling;
        }
        yg = null;
      }
    } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a = yg; a; ) a = Lf(a.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I = false;
  }
  function Jg(a) {
    null === zg ? zg = [a] : zg.push(a);
  }
  var Kg = ua.ReactCurrentBatchConfig;
  function Lg(a, b2, c2) {
    a = c2.ref;
    if (null !== a && "function" !== typeof a && "object" !== typeof a) {
      if (c2._owner) {
        c2 = c2._owner;
        if (c2) {
          if (1 !== c2.tag) throw Error(p$1(309));
          var d2 = c2.stateNode;
        }
        if (!d2) throw Error(p$1(147, a));
        var e2 = d2, f2 = "" + a;
        if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2) return b2.ref;
        b2 = function(a2) {
          var b3 = e2.refs;
          null === a2 ? delete b3[f2] : b3[f2] = a2;
        };
        b2._stringRef = f2;
        return b2;
      }
      if ("string" !== typeof a) throw Error(p$1(284));
      if (!c2._owner) throw Error(p$1(290, a));
    }
    return a;
  }
  function Mg(a, b2) {
    a = Object.prototype.toString.call(b2);
    throw Error(p$1(31, "[object Object]" === a ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a));
  }
  function Ng(a) {
    var b2 = a._init;
    return b2(a._payload);
  }
  function Og(a) {
    function b2(b3, c3) {
      if (a) {
        var d3 = b3.deletions;
        null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
      }
    }
    function c2(c3, d3) {
      if (!a) return null;
      for (; null !== d3; ) b2(c3, d3), d3 = d3.sibling;
      return null;
    }
    function d2(a2, b3) {
      for (a2 = /* @__PURE__ */ new Map(); null !== b3; ) null !== b3.key ? a2.set(b3.key, b3) : a2.set(b3.index, b3), b3 = b3.sibling;
      return a2;
    }
    function e2(a2, b3) {
      a2 = Pg(a2, b3);
      a2.index = 0;
      a2.sibling = null;
      return a2;
    }
    function f2(b3, c3, d3) {
      b3.index = d3;
      if (!a) return b3.flags |= 1048576, c3;
      d3 = b3.alternate;
      if (null !== d3) return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
      b3.flags |= 2;
      return c3;
    }
    function g2(b3) {
      a && null === b3.alternate && (b3.flags |= 2);
      return b3;
    }
    function h2(a2, b3, c3, d3) {
      if (null === b3 || 6 !== b3.tag) return b3 = Qg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e2(b3, c3);
      b3.return = a2;
      return b3;
    }
    function k2(a2, b3, c3, d3) {
      var f3 = c3.type;
      if (f3 === ya) return m2(a2, b3, c3.props.children, d3, c3.key);
      if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type)) return d3 = e2(b3, c3.props), d3.ref = Lg(a2, b3, c3), d3.return = a2, d3;
      d3 = Rg(c3.type, c3.key, c3.props, null, a2.mode, d3);
      d3.ref = Lg(a2, b3, c3);
      d3.return = a2;
      return d3;
    }
    function l2(a2, b3, c3, d3) {
      if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation) return b3 = Sg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e2(b3, c3.children || []);
      b3.return = a2;
      return b3;
    }
    function m2(a2, b3, c3, d3, f3) {
      if (null === b3 || 7 !== b3.tag) return b3 = Tg(c3, a2.mode, d3, f3), b3.return = a2, b3;
      b3 = e2(b3, c3);
      b3.return = a2;
      return b3;
    }
    function q2(a2, b3, c3) {
      if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3) return b3 = Qg("" + b3, a2.mode, c3), b3.return = a2, b3;
      if ("object" === typeof b3 && null !== b3) {
        switch (b3.$$typeof) {
          case va:
            return c3 = Rg(b3.type, b3.key, b3.props, null, a2.mode, c3), c3.ref = Lg(a2, null, b3), c3.return = a2, c3;
          case wa:
            return b3 = Sg(b3, a2.mode, c3), b3.return = a2, b3;
          case Ha:
            var d3 = b3._init;
            return q2(a2, d3(b3._payload), c3);
        }
        if (eb(b3) || Ka(b3)) return b3 = Tg(b3, a2.mode, c3, null), b3.return = a2, b3;
        Mg(a2, b3);
      }
      return null;
    }
    function r2(a2, b3, c3, d3) {
      var e3 = null !== b3 ? b3.key : null;
      if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3) return null !== e3 ? null : h2(a2, b3, "" + c3, d3);
      if ("object" === typeof c3 && null !== c3) {
        switch (c3.$$typeof) {
          case va:
            return c3.key === e3 ? k2(a2, b3, c3, d3) : null;
          case wa:
            return c3.key === e3 ? l2(a2, b3, c3, d3) : null;
          case Ha:
            return e3 = c3._init, r2(
              a2,
              b3,
              e3(c3._payload),
              d3
            );
        }
        if (eb(c3) || Ka(c3)) return null !== e3 ? null : m2(a2, b3, c3, d3, null);
        Mg(a2, c3);
      }
      return null;
    }
    function y2(a2, b3, c3, d3, e3) {
      if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3) return a2 = a2.get(c3) || null, h2(b3, a2, "" + d3, e3);
      if ("object" === typeof d3 && null !== d3) {
        switch (d3.$$typeof) {
          case va:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a2, d3, e3);
          case wa:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a2, d3, e3);
          case Ha:
            var f3 = d3._init;
            return y2(a2, b3, c3, f3(d3._payload), e3);
        }
        if (eb(d3) || Ka(d3)) return a2 = a2.get(c3) || null, m2(b3, a2, d3, e3, null);
        Mg(b3, d3);
      }
      return null;
    }
    function n2(e3, g3, h3, k3) {
      for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
        u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
        var n3 = r2(e3, u2, h3[w2], k3);
        if (null === n3) {
          null === u2 && (u2 = x2);
          break;
        }
        a && u2 && null === n3.alternate && b2(e3, u2);
        g3 = f2(n3, g3, w2);
        null === m3 ? l3 = n3 : m3.sibling = n3;
        m3 = n3;
        u2 = x2;
      }
      if (w2 === h3.length) return c2(e3, u2), I && tg(e3, w2), l3;
      if (null === u2) {
        for (; w2 < h3.length; w2++) u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
        I && tg(e3, w2);
        return l3;
      }
      for (u2 = d2(e3, u2); w2 < h3.length; w2++) x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
      a && u2.forEach(function(a2) {
        return b2(e3, a2);
      });
      I && tg(e3, w2);
      return l3;
    }
    function t2(e3, g3, h3, k3) {
      var l3 = Ka(h3);
      if ("function" !== typeof l3) throw Error(p$1(150));
      h3 = l3.call(h3);
      if (null == h3) throw Error(p$1(151));
      for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
        m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
        var t3 = r2(e3, m3, n3.value, k3);
        if (null === t3) {
          null === m3 && (m3 = x2);
          break;
        }
        a && m3 && null === t3.alternate && b2(e3, m3);
        g3 = f2(t3, g3, w2);
        null === u2 ? l3 = t3 : u2.sibling = t3;
        u2 = t3;
        m3 = x2;
      }
      if (n3.done) return c2(
        e3,
        m3
      ), I && tg(e3, w2), l3;
      if (null === m3) {
        for (; !n3.done; w2++, n3 = h3.next()) n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
        I && tg(e3, w2);
        return l3;
      }
      for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next()) n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      a && m3.forEach(function(a2) {
        return b2(e3, a2);
      });
      I && tg(e3, w2);
      return l3;
    }
    function J2(a2, d3, f3, h3) {
      "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
      if ("object" === typeof f3 && null !== f3) {
        switch (f3.$$typeof) {
          case va:
            a: {
              for (var k3 = f3.key, l3 = d3; null !== l3; ) {
                if (l3.key === k3) {
                  k3 = f3.type;
                  if (k3 === ya) {
                    if (7 === l3.tag) {
                      c2(a2, l3.sibling);
                      d3 = e2(l3, f3.props.children);
                      d3.return = a2;
                      a2 = d3;
                      break a;
                    }
                  } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                    c2(a2, l3.sibling);
                    d3 = e2(l3, f3.props);
                    d3.ref = Lg(a2, l3, f3);
                    d3.return = a2;
                    a2 = d3;
                    break a;
                  }
                  c2(a2, l3);
                  break;
                } else b2(a2, l3);
                l3 = l3.sibling;
              }
              f3.type === ya ? (d3 = Tg(f3.props.children, a2.mode, h3, f3.key), d3.return = a2, a2 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h3), h3.ref = Lg(a2, d3, f3), h3.return = a2, a2 = h3);
            }
            return g2(a2);
          case wa:
            a: {
              for (l3 = f3.key; null !== d3; ) {
                if (d3.key === l3) if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                  c2(a2, d3.sibling);
                  d3 = e2(d3, f3.children || []);
                  d3.return = a2;
                  a2 = d3;
                  break a;
                } else {
                  c2(a2, d3);
                  break;
                }
                else b2(a2, d3);
                d3 = d3.sibling;
              }
              d3 = Sg(f3, a2.mode, h3);
              d3.return = a2;
              a2 = d3;
            }
            return g2(a2);
          case Ha:
            return l3 = f3._init, J2(a2, d3, l3(f3._payload), h3);
        }
        if (eb(f3)) return n2(a2, d3, f3, h3);
        if (Ka(f3)) return t2(a2, d3, f3, h3);
        Mg(a2, f3);
      }
      return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a2, d3.sibling), d3 = e2(d3, f3), d3.return = a2, a2 = d3) : (c2(a2, d3), d3 = Qg(f3, a2.mode, h3), d3.return = a2, a2 = d3), g2(a2)) : c2(a2, d3);
    }
    return J2;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a) {
    var b2 = Wg.current;
    E(Wg);
    a._currentValue = b2;
  }
  function bh(a, b2, c2) {
    for (; null !== a; ) {
      var d2 = a.alternate;
      (a.childLanes & b2) !== b2 ? (a.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
      if (a === c2) break;
      a = a.return;
    }
  }
  function ch(a, b2) {
    Xg = a;
    Zg = Yg = null;
    a = a.dependencies;
    null !== a && null !== a.firstContext && (0 !== (a.lanes & b2) && (dh = true), a.firstContext = null);
  }
  function eh(a) {
    var b2 = a._currentValue;
    if (Zg !== a) if (a = { context: a, memoizedValue: b2, next: null }, null === Yg) {
      if (null === Xg) throw Error(p$1(308));
      Yg = a;
      Xg.dependencies = { lanes: 0, firstContext: a };
    } else Yg = Yg.next = a;
    return b2;
  }
  var fh = null;
  function gh(a) {
    null === fh ? fh = [a] : fh.push(a);
  }
  function hh(a, b2, c2, d2) {
    var e2 = b2.interleaved;
    null === e2 ? (c2.next = c2, gh(b2)) : (c2.next = e2.next, e2.next = c2);
    b2.interleaved = c2;
    return ih(a, d2);
  }
  function ih(a, b2) {
    a.lanes |= b2;
    var c2 = a.alternate;
    null !== c2 && (c2.lanes |= b2);
    c2 = a;
    for (a = a.return; null !== a; ) a.childLanes |= b2, c2 = a.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a, a = a.return;
    return 3 === c2.tag ? c2.stateNode : null;
  }
  var jh = false;
  function kh(a) {
    a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lh(a, b2) {
    a = a.updateQueue;
    b2.updateQueue === a && (b2.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
  }
  function mh(a, b2) {
    return { eventTime: a, lane: b2, tag: 0, payload: null, callback: null, next: null };
  }
  function nh(a, b2, c2) {
    var d2 = a.updateQueue;
    if (null === d2) return null;
    d2 = d2.shared;
    if (0 !== (K & 2)) {
      var e2 = d2.pending;
      null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
      d2.pending = b2;
      return ih(a, c2);
    }
    e2 = d2.interleaved;
    null === e2 ? (b2.next = b2, gh(d2)) : (b2.next = e2.next, e2.next = b2);
    d2.interleaved = b2;
    return ih(a, c2);
  }
  function oh(a, b2, c2) {
    b2 = b2.updateQueue;
    if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
      var d2 = b2.lanes;
      d2 &= a.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a, c2);
    }
  }
  function ph(a, b2) {
    var c2 = a.updateQueue, d2 = a.alternate;
    if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
      var e2 = null, f2 = null;
      c2 = c2.firstBaseUpdate;
      if (null !== c2) {
        do {
          var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
          null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
          c2 = c2.next;
        } while (null !== c2);
        null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
      } else e2 = f2 = b2;
      c2 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
      a.updateQueue = c2;
      return;
    }
    a = c2.lastBaseUpdate;
    null === a ? c2.firstBaseUpdate = b2 : a.next = b2;
    c2.lastBaseUpdate = b2;
  }
  function qh(a, b2, c2, d2) {
    var e2 = a.updateQueue;
    jh = false;
    var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
    if (null !== h2) {
      e2.shared.pending = null;
      var k2 = h2, l2 = k2.next;
      k2.next = null;
      null === g2 ? f2 = l2 : g2.next = l2;
      g2 = k2;
      var m2 = a.alternate;
      null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
    }
    if (null !== f2) {
      var q2 = e2.baseState;
      g2 = 0;
      m2 = l2 = k2 = null;
      h2 = f2;
      do {
        var r2 = h2.lane, y2 = h2.eventTime;
        if ((d2 & r2) === r2) {
          null !== m2 && (m2 = m2.next = {
            eventTime: y2,
            lane: 0,
            tag: h2.tag,
            payload: h2.payload,
            callback: h2.callback,
            next: null
          });
          a: {
            var n2 = a, t2 = h2;
            r2 = b2;
            y2 = c2;
            switch (t2.tag) {
              case 1:
                n2 = t2.payload;
                if ("function" === typeof n2) {
                  q2 = n2.call(y2, q2, r2);
                  break a;
                }
                q2 = n2;
                break a;
              case 3:
                n2.flags = n2.flags & -65537 | 128;
              case 0:
                n2 = t2.payload;
                r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
                if (null === r2 || void 0 === r2) break a;
                q2 = A({}, q2, r2);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h2.callback && 0 !== h2.lane && (a.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
        } else y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
        h2 = h2.next;
        if (null === h2) if (h2 = e2.shared.pending, null === h2) break;
        else r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
      } while (1);
      null === m2 && (k2 = q2);
      e2.baseState = k2;
      e2.firstBaseUpdate = l2;
      e2.lastBaseUpdate = m2;
      b2 = e2.shared.interleaved;
      if (null !== b2) {
        e2 = b2;
        do
          g2 |= e2.lane, e2 = e2.next;
        while (e2 !== b2);
      } else null === f2 && (e2.shared.lanes = 0);
      rh |= g2;
      a.lanes = g2;
      a.memoizedState = q2;
    }
  }
  function sh(a, b2, c2) {
    a = b2.effects;
    b2.effects = null;
    if (null !== a) for (b2 = 0; b2 < a.length; b2++) {
      var d2 = a[b2], e2 = d2.callback;
      if (null !== e2) {
        d2.callback = null;
        d2 = c2;
        if ("function" !== typeof e2) throw Error(p$1(191, e2));
        e2.call(d2);
      }
    }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a) {
    if (a === th) throw Error(p$1(174));
    return a;
  }
  function yh(a, b2) {
    G(wh, b2);
    G(vh, a);
    G(uh, th);
    a = b2.nodeType;
    switch (a) {
      case 9:
      case 11:
        b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
        break;
      default:
        a = 8 === a ? b2.parentNode : b2, b2 = a.namespaceURI || null, a = a.tagName, b2 = lb(b2, a);
    }
    E(uh);
    G(uh, b2);
  }
  function zh() {
    E(uh);
    E(vh);
    E(wh);
  }
  function Ah(a) {
    xh(wh.current);
    var b2 = xh(uh.current);
    var c2 = lb(b2, a.type);
    b2 !== c2 && (G(vh, a), G(uh, c2));
  }
  function Bh(a) {
    vh.current === a && (E(uh), E(vh));
  }
  var L = Uf(0);
  function Ch(a) {
    for (var b2 = a; null !== b2; ) {
      if (13 === b2.tag) {
        var c2 = b2.memoizedState;
        if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data)) return b2;
      } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
        if (0 !== (b2.flags & 128)) return b2;
      } else if (null !== b2.child) {
        b2.child.return = b2;
        b2 = b2.child;
        continue;
      }
      if (b2 === a) break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a) return null;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P() {
    throw Error(p$1(321));
  }
  function Mh(a, b2) {
    if (null === b2) return false;
    for (var c2 = 0; c2 < b2.length && c2 < a.length; c2++) if (!He(a[c2], b2[c2])) return false;
    return true;
  }
  function Nh(a, b2, c2, d2, e2, f2) {
    Hh = f2;
    M = b2;
    b2.memoizedState = null;
    b2.updateQueue = null;
    b2.lanes = 0;
    Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
    a = c2(d2, e2);
    if (Jh) {
      f2 = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f2) throw Error(p$1(301));
        f2 += 1;
        O = N = null;
        b2.updateQueue = null;
        Fh.current = Qh;
        a = c2(d2, e2);
      } while (Jh);
    }
    Fh.current = Rh;
    b2 = null !== N && null !== N.next;
    Hh = 0;
    O = N = M = null;
    Ih = false;
    if (b2) throw Error(p$1(300));
    return a;
  }
  function Sh() {
    var a = 0 !== Kh;
    Kh = 0;
    return a;
  }
  function Th() {
    var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
    return O;
  }
  function Uh() {
    if (null === N) {
      var a = M.alternate;
      a = null !== a ? a.memoizedState : null;
    } else a = N.next;
    var b2 = null === O ? M.memoizedState : O.next;
    if (null !== b2) O = b2, N = a;
    else {
      if (null === a) throw Error(p$1(310));
      N = a;
      a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
    }
    return O;
  }
  function Vh(a, b2) {
    return "function" === typeof b2 ? b2(a) : b2;
  }
  function Wh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$1(311));
    c2.lastRenderedReducer = a;
    var d2 = N, e2 = d2.baseQueue, f2 = c2.pending;
    if (null !== f2) {
      if (null !== e2) {
        var g2 = e2.next;
        e2.next = f2.next;
        f2.next = g2;
      }
      d2.baseQueue = e2 = f2;
      c2.pending = null;
    }
    if (null !== e2) {
      f2 = e2.next;
      d2 = d2.baseState;
      var h2 = g2 = null, k2 = null, l2 = f2;
      do {
        var m2 = l2.lane;
        if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a(d2, l2.action);
        else {
          var q2 = {
            lane: m2,
            action: l2.action,
            hasEagerState: l2.hasEagerState,
            eagerState: l2.eagerState,
            next: null
          };
          null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
          M.lanes |= m2;
          rh |= m2;
        }
        l2 = l2.next;
      } while (null !== l2 && l2 !== f2);
      null === k2 ? g2 = d2 : k2.next = h2;
      He(d2, b2.memoizedState) || (dh = true);
      b2.memoizedState = d2;
      b2.baseState = g2;
      b2.baseQueue = k2;
      c2.lastRenderedState = d2;
    }
    a = c2.interleaved;
    if (null !== a) {
      e2 = a;
      do
        f2 = e2.lane, M.lanes |= f2, rh |= f2, e2 = e2.next;
      while (e2 !== a);
    } else null === e2 && (c2.lanes = 0);
    return [b2.memoizedState, c2.dispatch];
  }
  function Xh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$1(311));
    c2.lastRenderedReducer = a;
    var d2 = c2.dispatch, e2 = c2.pending, f2 = b2.memoizedState;
    if (null !== e2) {
      c2.pending = null;
      var g2 = e2 = e2.next;
      do
        f2 = a(f2, g2.action), g2 = g2.next;
      while (g2 !== e2);
      He(f2, b2.memoizedState) || (dh = true);
      b2.memoizedState = f2;
      null === b2.baseQueue && (b2.baseState = f2);
      c2.lastRenderedState = f2;
    }
    return [f2, d2];
  }
  function Yh() {
  }
  function Zh(a, b2) {
    var c2 = M, d2 = Uh(), e2 = b2(), f2 = !He(d2.memoizedState, e2);
    f2 && (d2.memoizedState = e2, dh = true);
    d2 = d2.queue;
    $h(ai.bind(null, c2, d2, a), [a]);
    if (d2.getSnapshot !== b2 || f2 || null !== O && O.memoizedState.tag & 1) {
      c2.flags |= 2048;
      bi(9, ci.bind(null, c2, d2, e2, b2), void 0, null);
      if (null === Q) throw Error(p$1(349));
      0 !== (Hh & 30) || di(c2, b2, e2);
    }
    return e2;
  }
  function di(a, b2, c2) {
    a.flags |= 16384;
    a = { getSnapshot: b2, value: c2 };
    b2 = M.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.stores = [a]) : (c2 = b2.stores, null === c2 ? b2.stores = [a] : c2.push(a));
  }
  function ci(a, b2, c2, d2) {
    b2.value = c2;
    b2.getSnapshot = d2;
    ei(b2) && fi(a);
  }
  function ai(a, b2, c2) {
    return c2(function() {
      ei(b2) && fi(a);
    });
  }
  function ei(a) {
    var b2 = a.getSnapshot;
    a = a.value;
    try {
      var c2 = b2();
      return !He(a, c2);
    } catch (d2) {
      return true;
    }
  }
  function fi(a) {
    var b2 = ih(a, 1);
    null !== b2 && gi(b2, a, 1, -1);
  }
  function hi(a) {
    var b2 = Th();
    "function" === typeof a && (a = a());
    b2.memoizedState = b2.baseState = a;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
    b2.queue = a;
    a = a.dispatch = ii.bind(null, M, a);
    return [b2.memoizedState, a];
  }
  function bi(a, b2, c2, d2) {
    a = { tag: a, create: b2, destroy: c2, deps: d2, next: null };
    b2 = M.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.lastEffect = a.next = a) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a.next = a : (d2 = c2.next, c2.next = a, a.next = d2, b2.lastEffect = a));
    return a;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a, b2, c2, d2) {
    var e2 = Th();
    M.flags |= a;
    e2.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
  }
  function li(a, b2, c2, d2) {
    var e2 = Uh();
    d2 = void 0 === d2 ? null : d2;
    var f2 = void 0;
    if (null !== N) {
      var g2 = N.memoizedState;
      f2 = g2.destroy;
      if (null !== d2 && Mh(d2, g2.deps)) {
        e2.memoizedState = bi(b2, c2, f2, d2);
        return;
      }
    }
    M.flags |= a;
    e2.memoizedState = bi(1 | b2, c2, f2, d2);
  }
  function mi(a, b2) {
    return ki(8390656, 8, a, b2);
  }
  function $h(a, b2) {
    return li(2048, 8, a, b2);
  }
  function ni(a, b2) {
    return li(4, 2, a, b2);
  }
  function oi(a, b2) {
    return li(4, 4, a, b2);
  }
  function pi(a, b2) {
    if ("function" === typeof b2) return a = a(), b2(a), function() {
      b2(null);
    };
    if (null !== b2 && void 0 !== b2) return a = a(), b2.current = a, function() {
      b2.current = null;
    };
  }
  function qi(a, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a]) : null;
    return li(4, 4, pi.bind(null, b2, a), c2);
  }
  function ri() {
  }
  function si(a, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    c2.memoizedState = [a, b2];
    return a;
  }
  function ti(a, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    a = a();
    c2.memoizedState = [a, b2];
    return a;
  }
  function ui(a, b2, c2) {
    if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c2;
    He(c2, b2) || (c2 = yc(), M.lanes |= c2, rh |= c2, a.baseState = true);
    return b2;
  }
  function vi(a, b2) {
    var c2 = C;
    C = 0 !== c2 && 4 > c2 ? c2 : 4;
    a(true);
    var d2 = Gh.transition;
    Gh.transition = {};
    try {
      a(false), b2();
    } finally {
      C = c2, Gh.transition = d2;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a, b2, c2) {
    var d2 = yi(a);
    c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b2, c2);
    else if (c2 = hh(a, b2, c2, d2), null !== c2) {
      var e2 = R();
      gi(c2, a, d2, e2);
      Bi(c2, b2, d2);
    }
  }
  function ii(a, b2, c2) {
    var d2 = yi(a), e2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b2, e2);
    else {
      var f2 = a.alternate;
      if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2)) try {
        var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He(h2, g2)) {
          var k2 = b2.interleaved;
          null === k2 ? (e2.next = e2, gh(b2)) : (e2.next = k2.next, k2.next = e2);
          b2.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
      c2 = hh(a, b2, e2, d2);
      null !== c2 && (e2 = R(), gi(c2, a, d2, e2), Bi(c2, b2, d2));
    }
  }
  function zi(a) {
    var b2 = a.alternate;
    return a === M || null !== b2 && b2 === M;
  }
  function Ai(a, b2) {
    Jh = Ih = true;
    var c2 = a.pending;
    null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
    a.pending = b2;
  }
  function Bi(a, b2, c2) {
    if (0 !== (c2 & 4194240)) {
      var d2 = b2.lanes;
      d2 &= a.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a, c2);
    }
  }
  var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b2) {
    Th().memoizedState = [a, void 0 === b2 ? null : b2];
    return a;
  }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a]) : null;
    return ki(
      4194308,
      4,
      pi.bind(null, b2, a),
      c2
    );
  }, useLayoutEffect: function(a, b2) {
    return ki(4194308, 4, a, b2);
  }, useInsertionEffect: function(a, b2) {
    return ki(4, 2, a, b2);
  }, useMemo: function(a, b2) {
    var c2 = Th();
    b2 = void 0 === b2 ? null : b2;
    a = a();
    c2.memoizedState = [a, b2];
    return a;
  }, useReducer: function(a, b2, c2) {
    var d2 = Th();
    b2 = void 0 !== c2 ? c2(b2) : b2;
    d2.memoizedState = d2.baseState = b2;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b2 };
    d2.queue = a;
    a = a.dispatch = xi.bind(null, M, a);
    return [d2.memoizedState, a];
  }, useRef: function(a) {
    var b2 = Th();
    a = { current: a };
    return b2.memoizedState = a;
  }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
    return Th().memoizedState = a;
  }, useTransition: function() {
    var a = hi(false), b2 = a[0];
    a = vi.bind(null, a[1]);
    Th().memoizedState = a;
    return [b2, a];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(a, b2, c2) {
    var d2 = M, e2 = Th();
    if (I) {
      if (void 0 === c2) throw Error(p$1(407));
      c2 = c2();
    } else {
      c2 = b2();
      if (null === Q) throw Error(p$1(349));
      0 !== (Hh & 30) || di(d2, b2, c2);
    }
    e2.memoizedState = c2;
    var f2 = { value: c2, getSnapshot: b2 };
    e2.queue = f2;
    mi(ai.bind(
      null,
      d2,
      f2,
      a
    ), [a]);
    d2.flags |= 2048;
    bi(9, ci.bind(null, d2, f2, c2, b2), void 0, null);
    return c2;
  }, useId: function() {
    var a = Th(), b2 = Q.identifierPrefix;
    if (I) {
      var c2 = sg;
      var d2 = rg;
      c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
      b2 = ":" + b2 + "R" + c2;
      c2 = Kh++;
      0 < c2 && (b2 += "H" + c2.toString(32));
      b2 += ":";
    } else c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
    return a.memoizedState = b2;
  }, unstable_isNewReconciler: false }, Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function() {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function(a) {
      var b2 = Uh();
      return ui(b2, N.memoizedState, a);
    },
    useTransition: function() {
      var a = Wh(Vh)[0], b2 = Uh().memoizedState;
      return [a, b2];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: false
  }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
    return Xh(Vh);
  }, useDebugValue: ri, useDeferredValue: function(a) {
    var b2 = Uh();
    return null === N ? b2.memoizedState = a : ui(b2, N.memoizedState, a);
  }, useTransition: function() {
    var a = Xh(Vh)[0], b2 = Uh().memoizedState;
    return [a, b2];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a, b2) {
    if (a && a.defaultProps) {
      b2 = A({}, b2);
      a = a.defaultProps;
      for (var c2 in a) void 0 === b2[c2] && (b2[c2] = a[c2]);
      return b2;
    }
    return b2;
  }
  function Di(a, b2, c2, d2) {
    b2 = a.memoizedState;
    c2 = c2(d2, b2);
    c2 = null === c2 || void 0 === c2 ? b2 : A({}, b2, c2);
    a.memoizedState = c2;
    0 === a.lanes && (a.updateQueue.baseState = c2);
  }
  var Ei = { isMounted: function(a) {
    return (a = a._reactInternals) ? Vb(a) === a : false;
  }, enqueueSetState: function(a, b2, c2) {
    a = a._reactInternals;
    var d2 = R(), e2 = yi(a), f2 = mh(d2, e2);
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e2);
    null !== b2 && (gi(b2, a, e2, d2), oh(b2, a, e2));
  }, enqueueReplaceState: function(a, b2, c2) {
    a = a._reactInternals;
    var d2 = R(), e2 = yi(a), f2 = mh(d2, e2);
    f2.tag = 1;
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e2);
    null !== b2 && (gi(b2, a, e2, d2), oh(b2, a, e2));
  }, enqueueForceUpdate: function(a, b2) {
    a = a._reactInternals;
    var c2 = R(), d2 = yi(a), e2 = mh(c2, d2);
    e2.tag = 2;
    void 0 !== b2 && null !== b2 && (e2.callback = b2);
    b2 = nh(a, e2, d2);
    null !== b2 && (gi(b2, a, d2, c2), oh(b2, a, d2));
  } };
  function Fi(a, b2, c2, d2, e2, f2, g2) {
    a = a.stateNode;
    return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c2, d2) || !Ie(e2, f2) : true;
  }
  function Gi(a, b2, c2) {
    var d2 = false, e2 = Vf;
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e2 = Zf(b2) ? Xf : H.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a, e2) : Vf);
    b2 = new b2(c2, f2);
    a.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
    b2.updater = Ei;
    a.stateNode = b2;
    b2._reactInternals = a;
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e2, a.__reactInternalMemoizedMaskedChildContext = f2);
    return b2;
  }
  function Hi(a, b2, c2, d2) {
    a = b2.state;
    "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
    "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
    b2.state !== a && Ei.enqueueReplaceState(b2, b2.state, null);
  }
  function Ii(a, b2, c2, d2) {
    var e2 = a.stateNode;
    e2.props = c2;
    e2.state = a.memoizedState;
    e2.refs = {};
    kh(a);
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? e2.context = eh(f2) : (f2 = Zf(b2) ? Xf : H.current, e2.context = Yf(a, f2));
    e2.state = a.memoizedState;
    f2 = b2.getDerivedStateFromProps;
    "function" === typeof f2 && (Di(a, b2, f2, c2), e2.state = a.memoizedState);
    "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && Ei.enqueueReplaceState(e2, e2.state, null), qh(a, c2, e2, d2), e2.state = a.memoizedState);
    "function" === typeof e2.componentDidMount && (a.flags |= 4194308);
  }
  function Ji(a, b2) {
    try {
      var c2 = "", d2 = b2;
      do
        c2 += Pa(d2), d2 = d2.return;
      while (d2);
      var e2 = c2;
    } catch (f2) {
      e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
    }
    return { value: a, source: b2, stack: e2, digest: null };
  }
  function Ki(a, b2, c2) {
    return { value: a, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
  }
  function Li(a, b2) {
    try {
      console.error(b2.value);
    } catch (c2) {
      setTimeout(function() {
        throw c2;
      });
    }
  }
  var Mi = "function" === typeof WeakMap ? WeakMap : Map;
  function Ni(a, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    c2.payload = { element: null };
    var d2 = b2.value;
    c2.callback = function() {
      Oi || (Oi = true, Pi = d2);
      Li(a, b2);
    };
    return c2;
  }
  function Qi(a, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    var d2 = a.type.getDerivedStateFromError;
    if ("function" === typeof d2) {
      var e2 = b2.value;
      c2.payload = function() {
        return d2(e2);
      };
      c2.callback = function() {
        Li(a, b2);
      };
    }
    var f2 = a.stateNode;
    null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
      Li(a, b2);
      "function" !== typeof d2 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
      var c3 = b2.stack;
      this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
    });
    return c2;
  }
  function Si(a, b2, c2) {
    var d2 = a.pingCache;
    if (null === d2) {
      d2 = a.pingCache = new Mi();
      var e2 = /* @__PURE__ */ new Set();
      d2.set(b2, e2);
    } else e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
    e2.has(c2) || (e2.add(c2), a = Ti.bind(null, a, b2, c2), b2.then(a, a));
  }
  function Ui(a) {
    do {
      var b2;
      if (b2 = 13 === a.tag) b2 = a.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
      if (b2) return a;
      a = a.return;
    } while (null !== a);
    return null;
  }
  function Vi(a, b2, c2, d2, e2) {
    if (0 === (a.mode & 1)) return a === b2 ? a.flags |= 65536 : (a.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a;
    a.flags |= 65536;
    a.lanes = e2;
    return a;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a, b2, c2, d2) {
    b2.child = null === a ? Vg(b2, null, c2, d2) : Ug(b2, a.child, c2, d2);
  }
  function Yi(a, b2, c2, d2, e2) {
    c2 = c2.render;
    var f2 = b2.ref;
    ch(b2, e2);
    d2 = Nh(a, b2, c2, d2, f2, e2);
    c2 = Sh();
    if (null !== a && !dh) return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e2, Zi(a, b2, e2);
    I && c2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, d2, e2);
    return b2.child;
  }
  function $i(a, b2, c2, d2, e2) {
    if (null === a) {
      var f2 = c2.type;
      if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps) return b2.tag = 15, b2.type = f2, bj(a, b2, f2, d2, e2);
      a = Rg(c2.type, null, d2, b2, b2.mode, e2);
      a.ref = b2.ref;
      a.return = b2;
      return b2.child = a;
    }
    f2 = a.child;
    if (0 === (a.lanes & e2)) {
      var g2 = f2.memoizedProps;
      c2 = c2.compare;
      c2 = null !== c2 ? c2 : Ie;
      if (c2(g2, d2) && a.ref === b2.ref) return Zi(a, b2, e2);
    }
    b2.flags |= 1;
    a = Pg(f2, d2);
    a.ref = b2.ref;
    a.return = b2;
    return b2.child = a;
  }
  function bj(a, b2, c2, d2, e2) {
    if (null !== a) {
      var f2 = a.memoizedProps;
      if (Ie(f2, d2) && a.ref === b2.ref) if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a.lanes & e2)) 0 !== (a.flags & 131072) && (dh = true);
      else return b2.lanes = a.lanes, Zi(a, b2, e2);
    }
    return cj(a, b2, c2, d2, e2);
  }
  function dj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a ? a.memoizedState : null;
    if ("hidden" === d2.mode) if (0 === (b2.mode & 1)) b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c2;
    else {
      if (0 === (c2 & 1073741824)) return a = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b2.updateQueue = null, G(ej, fj), fj |= a, null;
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d2 = null !== f2 ? f2.baseLanes : c2;
      G(ej, fj);
      fj |= d2;
    }
    else null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G(ej, fj), fj |= d2;
    Xi(a, b2, e2, c2);
    return b2.child;
  }
  function gj(a, b2) {
    var c2 = b2.ref;
    if (null === a && null !== c2 || null !== a && a.ref !== c2) b2.flags |= 512, b2.flags |= 2097152;
  }
  function cj(a, b2, c2, d2, e2) {
    var f2 = Zf(c2) ? Xf : H.current;
    f2 = Yf(b2, f2);
    ch(b2, e2);
    c2 = Nh(a, b2, c2, d2, f2, e2);
    d2 = Sh();
    if (null !== a && !dh) return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e2, Zi(a, b2, e2);
    I && d2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, c2, e2);
    return b2.child;
  }
  function hj(a, b2, c2, d2, e2) {
    if (Zf(c2)) {
      var f2 = true;
      cg(b2);
    } else f2 = false;
    ch(b2, e2);
    if (null === b2.stateNode) ij(a, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e2), d2 = true;
    else if (null === a) {
      var g2 = b2.stateNode, h2 = b2.memoizedProps;
      g2.props = h2;
      var k2 = g2.context, l2 = c2.contextType;
      "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H.current, l2 = Yf(b2, l2));
      var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
      q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
      jh = false;
      var r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      k2 = b2.memoizedState;
      h2 !== d2 || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b2, c2, m2, d2), k2 = b2.memoizedState), (h2 = jh || Fi(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
    } else {
      g2 = b2.stateNode;
      lh(a, b2);
      h2 = b2.memoizedProps;
      l2 = b2.type === b2.elementType ? h2 : Ci(b2.type, h2);
      g2.props = l2;
      q2 = b2.pendingProps;
      r2 = g2.context;
      k2 = c2.contextType;
      "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H.current, k2 = Yf(b2, k2));
      var y2 = c2.getDerivedStateFromProps;
      (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
      jh = false;
      r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      var n2 = b2.memoizedState;
      h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), d2 = false);
    }
    return jj(a, b2, c2, d2, f2, e2);
  }
  function jj(a, b2, c2, d2, e2, f2) {
    gj(a, b2);
    var g2 = 0 !== (b2.flags & 128);
    if (!d2 && !g2) return e2 && dg(b2, c2, false), Zi(a, b2, f2);
    d2 = b2.stateNode;
    Wi.current = b2;
    var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
    b2.flags |= 1;
    null !== a && g2 ? (b2.child = Ug(b2, a.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a, b2, h2, f2);
    b2.memoizedState = d2.state;
    e2 && dg(b2, c2, true);
    return b2.child;
  }
  function kj(a) {
    var b2 = a.stateNode;
    b2.pendingContext ? ag(a, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a, b2.context, false);
    yh(a, b2.containerInfo);
  }
  function lj(a, b2, c2, d2, e2) {
    Ig();
    Jg(e2);
    b2.flags |= 256;
    Xi(a, b2, c2, d2);
    return b2.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a) {
    return { baseLanes: a, cachePool: null, transitions: null };
  }
  function oj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = L.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
    (h2 = g2) || (h2 = null !== a && null === a.memoizedState ? false : 0 !== (e2 & 2));
    if (h2) f2 = true, b2.flags &= -129;
    else if (null === a || null !== a.memoizedState) e2 |= 1;
    G(L, e2 & 1);
    if (null === a) {
      Eg(b2);
      a = b2.memoizedState;
      if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
      g2 = d2.children;
      a = d2.fallback;
      return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a = Tg(a, d2, c2, null), f2.return = b2, a.return = b2, f2.sibling = a, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a) : qj(b2, g2);
    }
    e2 = a.memoizedState;
    if (null !== e2 && (h2 = e2.dehydrated, null !== h2)) return rj(a, b2, g2, d2, h2, e2, c2);
    if (f2) {
      f2 = d2.fallback;
      g2 = b2.mode;
      e2 = a.child;
      h2 = e2.sibling;
      var k2 = { mode: "hidden", children: d2.children };
      0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
      null !== h2 ? f2 = Pg(h2, f2) : (f2 = Tg(f2, g2, c2, null), f2.flags |= 2);
      f2.return = b2;
      d2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      d2 = f2;
      f2 = b2.child;
      g2 = a.child.memoizedState;
      g2 = null === g2 ? nj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
      f2.memoizedState = g2;
      f2.childLanes = a.childLanes & ~c2;
      b2.memoizedState = mj;
      return d2;
    }
    f2 = a.child;
    a = f2.sibling;
    d2 = Pg(f2, { mode: "visible", children: d2.children });
    0 === (b2.mode & 1) && (d2.lanes = c2);
    d2.return = b2;
    d2.sibling = null;
    null !== a && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a], b2.flags |= 16) : c2.push(a));
    b2.child = d2;
    b2.memoizedState = null;
    return d2;
  }
  function qj(a, b2) {
    b2 = pj({ mode: "visible", children: b2 }, a.mode, 0, null);
    b2.return = a;
    return a.child = b2;
  }
  function sj(a, b2, c2, d2) {
    null !== d2 && Jg(d2);
    Ug(b2, a.child, null, c2);
    a = qj(b2, b2.pendingProps.children);
    a.flags |= 2;
    b2.memoizedState = null;
    return a;
  }
  function rj(a, b2, c2, d2, e2, f2, g2) {
    if (c2) {
      if (b2.flags & 256) return b2.flags &= -257, d2 = Ki(Error(p$1(422))), sj(a, b2, g2, d2);
      if (null !== b2.memoizedState) return b2.child = a.child, b2.flags |= 128, null;
      f2 = d2.fallback;
      e2 = b2.mode;
      d2 = pj({ mode: "visible", children: d2.children }, e2, 0, null);
      f2 = Tg(f2, e2, g2, null);
      f2.flags |= 2;
      d2.return = b2;
      f2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      0 !== (b2.mode & 1) && Ug(b2, a.child, null, g2);
      b2.child.memoizedState = nj(g2);
      b2.memoizedState = mj;
      return f2;
    }
    if (0 === (b2.mode & 1)) return sj(a, b2, g2, null);
    if ("$!" === e2.data) {
      d2 = e2.nextSibling && e2.nextSibling.dataset;
      if (d2) var h2 = d2.dgst;
      d2 = h2;
      f2 = Error(p$1(419));
      d2 = Ki(f2, d2, void 0);
      return sj(a, b2, g2, d2);
    }
    h2 = 0 !== (g2 & a.childLanes);
    if (dh || h2) {
      d2 = Q;
      if (null !== d2) {
        switch (g2 & -g2) {
          case 4:
            e2 = 2;
            break;
          case 16:
            e2 = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            e2 = 32;
            break;
          case 536870912:
            e2 = 268435456;
            break;
          default:
            e2 = 0;
        }
        e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
        0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, ih(a, e2), gi(d2, a, e2, -1));
      }
      tj();
      d2 = Ki(Error(p$1(421)));
      return sj(a, b2, g2, d2);
    }
    if ("$?" === e2.data) return b2.flags |= 128, b2.child = a.child, b2 = uj.bind(null, a), e2._reactRetry = b2, null;
    a = f2.treeContext;
    yg = Lf(e2.nextSibling);
    xg = b2;
    I = true;
    zg = null;
    null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b2);
    b2 = qj(b2, d2.children);
    b2.flags |= 4096;
    return b2;
  }
  function vj(a, b2, c2) {
    a.lanes |= b2;
    var d2 = a.alternate;
    null !== d2 && (d2.lanes |= b2);
    bh(a.return, b2, c2);
  }
  function wj(a, b2, c2, d2, e2) {
    var f2 = a.memoizedState;
    null === f2 ? a.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e2);
  }
  function xj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
    Xi(a, b2, d2.children, c2);
    d2 = L.current;
    if (0 !== (d2 & 2)) d2 = d2 & 1 | 2, b2.flags |= 128;
    else {
      if (null !== a && 0 !== (a.flags & 128)) a: for (a = b2.child; null !== a; ) {
        if (13 === a.tag) null !== a.memoizedState && vj(a, c2, b2);
        else if (19 === a.tag) vj(a, c2, b2);
        else if (null !== a.child) {
          a.child.return = a;
          a = a.child;
          continue;
        }
        if (a === b2) break a;
        for (; null === a.sibling; ) {
          if (null === a.return || a.return === b2) break a;
          a = a.return;
        }
        a.sibling.return = a.return;
        a = a.sibling;
      }
      d2 &= 1;
    }
    G(L, d2);
    if (0 === (b2.mode & 1)) b2.memoizedState = null;
    else switch (e2) {
      case "forwards":
        c2 = b2.child;
        for (e2 = null; null !== c2; ) a = c2.alternate, null !== a && null === Ch(a) && (e2 = c2), c2 = c2.sibling;
        c2 = e2;
        null === c2 ? (e2 = b2.child, b2.child = null) : (e2 = c2.sibling, c2.sibling = null);
        wj(b2, false, e2, c2, f2);
        break;
      case "backwards":
        c2 = null;
        e2 = b2.child;
        for (b2.child = null; null !== e2; ) {
          a = e2.alternate;
          if (null !== a && null === Ch(a)) {
            b2.child = e2;
            break;
          }
          a = e2.sibling;
          e2.sibling = c2;
          c2 = e2;
          e2 = a;
        }
        wj(b2, true, c2, null, f2);
        break;
      case "together":
        wj(b2, false, null, null, void 0);
        break;
      default:
        b2.memoizedState = null;
    }
    return b2.child;
  }
  function ij(a, b2) {
    0 === (b2.mode & 1) && null !== a && (a.alternate = null, b2.alternate = null, b2.flags |= 2);
  }
  function Zi(a, b2, c2) {
    null !== a && (b2.dependencies = a.dependencies);
    rh |= b2.lanes;
    if (0 === (c2 & b2.childLanes)) return null;
    if (null !== a && b2.child !== a.child) throw Error(p$1(153));
    if (null !== b2.child) {
      a = b2.child;
      c2 = Pg(a, a.pendingProps);
      b2.child = c2;
      for (c2.return = b2; null !== a.sibling; ) a = a.sibling, c2 = c2.sibling = Pg(a, a.pendingProps), c2.return = b2;
      c2.sibling = null;
    }
    return b2.child;
  }
  function yj(a, b2, c2) {
    switch (b2.tag) {
      case 3:
        kj(b2);
        Ig();
        break;
      case 5:
        Ah(b2);
        break;
      case 1:
        Zf(b2.type) && cg(b2);
        break;
      case 4:
        yh(b2, b2.stateNode.containerInfo);
        break;
      case 10:
        var d2 = b2.type._context, e2 = b2.memoizedProps.value;
        G(Wg, d2._currentValue);
        d2._currentValue = e2;
        break;
      case 13:
        d2 = b2.memoizedState;
        if (null !== d2) {
          if (null !== d2.dehydrated) return G(L, L.current & 1), b2.flags |= 128, null;
          if (0 !== (c2 & b2.child.childLanes)) return oj(a, b2, c2);
          G(L, L.current & 1);
          a = Zi(a, b2, c2);
          return null !== a ? a.sibling : null;
        }
        G(L, L.current & 1);
        break;
      case 19:
        d2 = 0 !== (c2 & b2.childLanes);
        if (0 !== (a.flags & 128)) {
          if (d2) return xj(a, b2, c2);
          b2.flags |= 128;
        }
        e2 = b2.memoizedState;
        null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
        G(L, L.current);
        if (d2) break;
        else return null;
      case 22:
      case 23:
        return b2.lanes = 0, dj(a, b2, c2);
    }
    return Zi(a, b2, c2);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a, b2) {
    for (var c2 = b2.child; null !== c2; ) {
      if (5 === c2.tag || 6 === c2.tag) a.appendChild(c2.stateNode);
      else if (4 !== c2.tag && null !== c2.child) {
        c2.child.return = c2;
        c2 = c2.child;
        continue;
      }
      if (c2 === b2) break;
      for (; null === c2.sibling; ) {
        if (null === c2.return || c2.return === b2) return;
        c2 = c2.return;
      }
      c2.sibling.return = c2.return;
      c2 = c2.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a, b2, c2, d2) {
    var e2 = a.memoizedProps;
    if (e2 !== d2) {
      a = b2.stateNode;
      xh(uh.current);
      var f2 = null;
      switch (c2) {
        case "input":
          e2 = Ya(a, e2);
          d2 = Ya(a, d2);
          f2 = [];
          break;
        case "select":
          e2 = A({}, e2, { value: void 0 });
          d2 = A({}, d2, { value: void 0 });
          f2 = [];
          break;
        case "textarea":
          e2 = gb(a, e2);
          d2 = gb(a, d2);
          f2 = [];
          break;
        default:
          "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a.onclick = Bf);
      }
      ub(c2, d2);
      var g2;
      c2 = null;
      for (l2 in e2) if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2]) if ("style" === l2) {
        var h2 = e2[l2];
        for (g2 in h2) h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
      } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
      for (l2 in d2) {
        var k2 = d2[l2];
        h2 = null != e2 ? e2[l2] : void 0;
        if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2)) if ("style" === l2) if (h2) {
          for (g2 in h2) !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
          for (g2 in k2) k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
        } else c2 || (f2 || (f2 = []), f2.push(
          l2,
          c2
        )), c2 = k2;
        else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
      }
      c2 && (f2 = f2 || []).push("style", c2);
      var l2 = f2;
      if (b2.updateQueue = l2) b2.flags |= 4;
    }
  };
  Cj = function(a, b2, c2, d2) {
    c2 !== d2 && (b2.flags |= 4);
  };
  function Dj(a, b2) {
    if (!I) switch (a.tailMode) {
      case "hidden":
        b2 = a.tail;
        for (var c2 = null; null !== b2; ) null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
        null === c2 ? a.tail = null : c2.sibling = null;
        break;
      case "collapsed":
        c2 = a.tail;
        for (var d2 = null; null !== c2; ) null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
        null === d2 ? b2 || null === a.tail ? a.tail = null : a.tail.sibling = null : d2.sibling = null;
    }
  }
  function S(a) {
    var b2 = null !== a.alternate && a.alternate.child === a.child, c2 = 0, d2 = 0;
    if (b2) for (var e2 = a.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a, e2 = e2.sibling;
    else for (e2 = a.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a, e2 = e2.sibling;
    a.subtreeFlags |= d2;
    a.childLanes = c2;
    return b2;
  }
  function Ej(a, b2, c2) {
    var d2 = b2.pendingProps;
    wg(b2);
    switch (b2.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return S(b2), null;
      case 1:
        return Zf(b2.type) && $f(), S(b2), null;
      case 3:
        d2 = b2.stateNode;
        zh();
        E(Wf);
        E(H);
        Eh();
        d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
        if (null === a || null === a.child) Gg(b2) ? b2.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a, b2);
        S(b2);
        return null;
      case 5:
        Bh(b2);
        var e2 = xh(wh.current);
        c2 = b2.type;
        if (null !== a && null != b2.stateNode) Bj(a, b2, c2, d2, e2), a.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        else {
          if (!d2) {
            if (null === b2.stateNode) throw Error(p$1(166));
            S(b2);
            return null;
          }
          a = xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.type;
            var f2 = b2.memoizedProps;
            d2[Of] = b2;
            d2[Pf] = f2;
            a = 0 !== (b2.mode & 1);
            switch (c2) {
              case "dialog":
                D("cancel", d2);
                D("close", d2);
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", d2);
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], d2);
                break;
              case "source":
                D("error", d2);
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  d2
                );
                D("load", d2);
                break;
              case "details":
                D("toggle", d2);
                break;
              case "input":
                Za(d2, f2);
                D("invalid", d2);
                break;
              case "select":
                d2._wrapperState = { wasMultiple: !!f2.multiple };
                D("invalid", d2);
                break;
              case "textarea":
                hb(d2, f2), D("invalid", d2);
            }
            ub(c2, f2);
            e2 = null;
            for (var g2 in f2) if (f2.hasOwnProperty(g2)) {
              var h2 = f2[g2];
              "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                d2.textContent,
                h2,
                a
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D("scroll", d2);
            }
            switch (c2) {
              case "input":
                Va(d2);
                db(d2, f2, true);
                break;
              case "textarea":
                Va(d2);
                jb(d2);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof f2.onClick && (d2.onclick = Bf);
            }
            d2 = e2;
            b2.updateQueue = d2;
            null !== d2 && (b2.flags |= 4);
          } else {
            g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
            "http://www.w3.org/1999/xhtml" === a && (a = kb(c2));
            "http://www.w3.org/1999/xhtml" === a ? "script" === c2 ? (a = g2.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d2.is ? a = g2.createElement(c2, { is: d2.is }) : (a = g2.createElement(c2), "select" === c2 && (g2 = a, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a = g2.createElementNS(a, c2);
            a[Of] = b2;
            a[Pf] = d2;
            zj(a, b2, false, false);
            b2.stateNode = a;
            a: {
              g2 = vb(c2, d2);
              switch (c2) {
                case "dialog":
                  D("cancel", a);
                  D("close", a);
                  e2 = d2;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", a);
                  e2 = d2;
                  break;
                case "video":
                case "audio":
                  for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], a);
                  e2 = d2;
                  break;
                case "source":
                  D("error", a);
                  e2 = d2;
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    a
                  );
                  D("load", a);
                  e2 = d2;
                  break;
                case "details":
                  D("toggle", a);
                  e2 = d2;
                  break;
                case "input":
                  Za(a, d2);
                  e2 = Ya(a, d2);
                  D("invalid", a);
                  break;
                case "option":
                  e2 = d2;
                  break;
                case "select":
                  a._wrapperState = { wasMultiple: !!d2.multiple };
                  e2 = A({}, d2, { value: void 0 });
                  D("invalid", a);
                  break;
                case "textarea":
                  hb(a, d2);
                  e2 = gb(a, d2);
                  D("invalid", a);
                  break;
                default:
                  e2 = d2;
              }
              ub(c2, e2);
              h2 = e2;
              for (f2 in h2) if (h2.hasOwnProperty(f2)) {
                var k2 = h2[f2];
                "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g2));
              }
              switch (c2) {
                case "input":
                  Va(a);
                  db(a, d2, false);
                  break;
                case "textarea":
                  Va(a);
                  jb(a);
                  break;
                case "option":
                  null != d2.value && a.setAttribute("value", "" + Sa(d2.value));
                  break;
                case "select":
                  a.multiple = !!d2.multiple;
                  f2 = d2.value;
                  null != f2 ? fb(a, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                    a,
                    !!d2.multiple,
                    d2.defaultValue,
                    true
                  );
                  break;
                default:
                  "function" === typeof e2.onClick && (a.onclick = Bf);
              }
              switch (c2) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d2 = !!d2.autoFocus;
                  break a;
                case "img":
                  d2 = true;
                  break a;
                default:
                  d2 = false;
              }
            }
            d2 && (b2.flags |= 4);
          }
          null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        }
        S(b2);
        return null;
      case 6:
        if (a && null != b2.stateNode) Cj(a, b2, a.memoizedProps, d2);
        else {
          if ("string" !== typeof d2 && null === b2.stateNode) throw Error(p$1(166));
          c2 = xh(wh.current);
          xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.memoizedProps;
            d2[Of] = b2;
            if (f2 = d2.nodeValue !== c2) {
              if (a = xg, null !== a) switch (a.tag) {
                case 3:
                  Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
              }
            }
            f2 && (b2.flags |= 4);
          } else d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
        }
        S(b2);
        return null;
      case 13:
        E(L);
        d2 = b2.memoizedState;
        if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
          if (I && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128)) Hg(), Ig(), b2.flags |= 98560, f2 = false;
          else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
            if (null === a) {
              if (!f2) throw Error(p$1(318));
              f2 = b2.memoizedState;
              f2 = null !== f2 ? f2.dehydrated : null;
              if (!f2) throw Error(p$1(317));
              f2[Of] = b2;
            } else Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
            S(b2);
            f2 = false;
          } else null !== zg && (Fj(zg), zg = null), f2 = true;
          if (!f2) return b2.flags & 65536 ? b2 : null;
        }
        if (0 !== (b2.flags & 128)) return b2.lanes = c2, b2;
        d2 = null !== d2;
        d2 !== (null !== a && null !== a.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
        null !== b2.updateQueue && (b2.flags |= 4);
        S(b2);
        return null;
      case 4:
        return zh(), Aj(a, b2), null === a && sf(b2.stateNode.containerInfo), S(b2), null;
      case 10:
        return ah(b2.type._context), S(b2), null;
      case 17:
        return Zf(b2.type) && $f(), S(b2), null;
      case 19:
        E(L);
        f2 = b2.memoizedState;
        if (null === f2) return S(b2), null;
        d2 = 0 !== (b2.flags & 128);
        g2 = f2.rendering;
        if (null === g2) if (d2) Dj(f2, false);
        else {
          if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b2.child; null !== a; ) {
            g2 = Ch(a);
            if (null !== g2) {
              b2.flags |= 128;
              Dj(f2, false);
              d2 = g2.updateQueue;
              null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
              b2.subtreeFlags = 0;
              d2 = c2;
              for (c2 = b2.child; null !== c2; ) f2 = c2, a = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a = g2.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c2 = c2.sibling;
              G(L, L.current & 1 | 2);
              return b2.child;
            }
            a = a.sibling;
          }
          null !== f2.tail && B() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        }
        else {
          if (!d2) if (a = Ch(g2), null !== a) {
            if (b2.flags |= 128, d2 = true, c2 = a.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I) return S(b2), null;
          } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
          f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
        }
        if (null !== f2.tail) return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B(), b2.sibling = null, c2 = L.current, G(L, d2 ? c2 & 1 | 2 : c2 & 1), b2;
        S(b2);
        return null;
      case 22:
      case 23:
        return Hj(), d2 = null !== b2.memoizedState, null !== a && null !== a.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S(b2), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p$1(156, b2.tag));
  }
  function Ij(a, b2) {
    wg(b2);
    switch (b2.tag) {
      case 1:
        return Zf(b2.type) && $f(), a = b2.flags, a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 3:
        return zh(), E(Wf), E(H), Eh(), a = b2.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b2.flags = a & -65537 | 128, b2) : null;
      case 5:
        return Bh(b2), null;
      case 13:
        E(L);
        a = b2.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          if (null === b2.alternate) throw Error(p$1(340));
          Ig();
        }
        a = b2.flags;
        return a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 19:
        return E(L), null;
      case 4:
        return zh(), null;
      case 10:
        return ah(b2.type._context), null;
      case 22:
      case 23:
        return Hj(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
  function Lj(a, b2) {
    var c2 = a.ref;
    if (null !== c2) if ("function" === typeof c2) try {
      c2(null);
    } catch (d2) {
      W(a, b2, d2);
    }
    else c2.current = null;
  }
  function Mj(a, b2, c2) {
    try {
      c2();
    } catch (d2) {
      W(a, b2, d2);
    }
  }
  var Nj = false;
  function Oj(a, b2) {
    Cf = dd;
    a = Me();
    if (Ne(a)) {
      if ("selectionStart" in a) var c2 = { start: a.selectionStart, end: a.selectionEnd };
      else a: {
        c2 = (c2 = a.ownerDocument) && c2.defaultView || window;
        var d2 = c2.getSelection && c2.getSelection();
        if (d2 && 0 !== d2.rangeCount) {
          c2 = d2.anchorNode;
          var e2 = d2.anchorOffset, f2 = d2.focusNode;
          d2 = d2.focusOffset;
          try {
            c2.nodeType, f2.nodeType;
          } catch (F2) {
            c2 = null;
            break a;
          }
          var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
          b: for (; ; ) {
            for (var y2; ; ) {
              q2 !== c2 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
              q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
              3 === q2.nodeType && (g2 += q2.nodeValue.length);
              if (null === (y2 = q2.firstChild)) break;
              r2 = q2;
              q2 = y2;
            }
            for (; ; ) {
              if (q2 === a) break b;
              r2 === c2 && ++l2 === e2 && (h2 = g2);
              r2 === f2 && ++m2 === d2 && (k2 = g2);
              if (null !== (y2 = q2.nextSibling)) break;
              q2 = r2;
              r2 = q2.parentNode;
            }
            q2 = y2;
          }
          c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else c2 = null;
      }
      c2 = c2 || { start: 0, end: 0 };
    } else c2 = null;
    Df = { focusedElem: a, selectionRange: c2 };
    dd = false;
    for (V = b2; null !== V; ) if (b2 = V, a = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a) a.return = b2, V = a;
    else for (; null !== V; ) {
      b2 = V;
      try {
        var n2 = b2.alternate;
        if (0 !== (b2.flags & 1024)) switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== n2) {
              var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Ci(b2.type, t2), J2);
              x2.__reactInternalSnapshotBeforeUpdate = w2;
            }
            break;
          case 3:
            var u2 = b2.stateNode.containerInfo;
            1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(p$1(163));
        }
      } catch (F2) {
        W(b2, b2.return, F2);
      }
      a = b2.sibling;
      if (null !== a) {
        a.return = b2.return;
        V = a;
        break;
      }
      V = b2.return;
    }
    n2 = Nj;
    Nj = false;
    return n2;
  }
  function Pj(a, b2, c2) {
    var d2 = b2.updateQueue;
    d2 = null !== d2 ? d2.lastEffect : null;
    if (null !== d2) {
      var e2 = d2 = d2.next;
      do {
        if ((e2.tag & a) === a) {
          var f2 = e2.destroy;
          e2.destroy = void 0;
          void 0 !== f2 && Mj(b2, c2, f2);
        }
        e2 = e2.next;
      } while (e2 !== d2);
    }
  }
  function Qj(a, b2) {
    b2 = b2.updateQueue;
    b2 = null !== b2 ? b2.lastEffect : null;
    if (null !== b2) {
      var c2 = b2 = b2.next;
      do {
        if ((c2.tag & a) === a) {
          var d2 = c2.create;
          c2.destroy = d2();
        }
        c2 = c2.next;
      } while (c2 !== b2);
    }
  }
  function Rj(a) {
    var b2 = a.ref;
    if (null !== b2) {
      var c2 = a.stateNode;
      switch (a.tag) {
        case 5:
          a = c2;
          break;
        default:
          a = c2;
      }
      "function" === typeof b2 ? b2(a) : b2.current = a;
    }
  }
  function Sj(a) {
    var b2 = a.alternate;
    null !== b2 && (a.alternate = null, Sj(b2));
    a.child = null;
    a.deletions = null;
    a.sibling = null;
    5 === a.tag && (b2 = a.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
    a.stateNode = null;
    a.return = null;
    a.dependencies = null;
    a.memoizedProps = null;
    a.memoizedState = null;
    a.pendingProps = null;
    a.stateNode = null;
    a.updateQueue = null;
  }
  function Tj(a) {
    return 5 === a.tag || 3 === a.tag || 4 === a.tag;
  }
  function Uj(a) {
    a: for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Tj(a.return)) return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2) continue a;
        if (null === a.child || 4 === a.tag) continue a;
        else a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2)) return a.stateNode;
    }
  }
  function Vj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2) a = a.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a, b2) : c2.insertBefore(a, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a, c2)) : (b2 = c2, b2.appendChild(a)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
    else if (4 !== d2 && (a = a.child, null !== a)) for (Vj(a, b2, c2), a = a.sibling; null !== a; ) Vj(a, b2, c2), a = a.sibling;
  }
  function Wj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2) a = a.stateNode, b2 ? c2.insertBefore(a, b2) : c2.appendChild(a);
    else if (4 !== d2 && (a = a.child, null !== a)) for (Wj(a, b2, c2), a = a.sibling; null !== a; ) Wj(a, b2, c2), a = a.sibling;
  }
  var X = null, Xj = false;
  function Yj(a, b2, c2) {
    for (c2 = c2.child; null !== c2; ) Zj(a, b2, c2), c2 = c2.sibling;
  }
  function Zj(a, b2, c2) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
      lc.onCommitFiberUnmount(kc, c2);
    } catch (h2) {
    }
    switch (c2.tag) {
      case 5:
        U || Lj(c2, b2);
      case 6:
        var d2 = X, e2 = Xj;
        X = null;
        Yj(a, b2, c2);
        X = d2;
        Xj = e2;
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c2) : a.removeChild(c2)) : X.removeChild(c2.stateNode));
        break;
      case 18:
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c2) : 1 === a.nodeType && Kf(a, c2), bd(a)) : Kf(X, c2.stateNode));
        break;
      case 4:
        d2 = X;
        e2 = Xj;
        X = c2.stateNode.containerInfo;
        Xj = true;
        Yj(a, b2, c2);
        X = d2;
        Xj = e2;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
          e2 = d2 = d2.next;
          do {
            var f2 = e2, g2 = f2.destroy;
            f2 = f2.tag;
            void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
            e2 = e2.next;
          } while (e2 !== d2);
        }
        Yj(a, b2, c2);
        break;
      case 1:
        if (!U && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount)) try {
          d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
        } catch (h2) {
          W(c2, b2, h2);
        }
        Yj(a, b2, c2);
        break;
      case 21:
        Yj(a, b2, c2);
        break;
      case 22:
        c2.mode & 1 ? (U = (d2 = U) || null !== c2.memoizedState, Yj(a, b2, c2), U = d2) : Yj(a, b2, c2);
        break;
      default:
        Yj(a, b2, c2);
    }
  }
  function ak(a) {
    var b2 = a.updateQueue;
    if (null !== b2) {
      a.updateQueue = null;
      var c2 = a.stateNode;
      null === c2 && (c2 = a.stateNode = new Kj());
      b2.forEach(function(b3) {
        var d2 = bk.bind(null, a, b3);
        c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
      });
    }
  }
  function ck(a, b2) {
    var c2 = b2.deletions;
    if (null !== c2) for (var d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      try {
        var f2 = a, g2 = b2, h2 = g2;
        a: for (; null !== h2; ) {
          switch (h2.tag) {
            case 5:
              X = h2.stateNode;
              Xj = false;
              break a;
            case 3:
              X = h2.stateNode.containerInfo;
              Xj = true;
              break a;
            case 4:
              X = h2.stateNode.containerInfo;
              Xj = true;
              break a;
          }
          h2 = h2.return;
        }
        if (null === X) throw Error(p$1(160));
        Zj(f2, g2, e2);
        X = null;
        Xj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W(e2, b2, l2);
      }
    }
    if (b2.subtreeFlags & 12854) for (b2 = b2.child; null !== b2; ) dk(b2, a), b2 = b2.sibling;
  }
  function dk(a, b2) {
    var c2 = a.alternate, d2 = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ck(b2, a);
        ek(a);
        if (d2 & 4) {
          try {
            Pj(3, a, a.return), Qj(3, a);
          } catch (t2) {
            W(a, a.return, t2);
          }
          try {
            Pj(5, a, a.return);
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 1:
        ck(b2, a);
        ek(a);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        break;
      case 5:
        ck(b2, a);
        ek(a);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        if (a.flags & 32) {
          var e2 = a.stateNode;
          try {
            ob(e2, "");
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        if (d2 & 4 && (e2 = a.stateNode, null != e2)) {
          var f2 = a.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a.type, k2 = a.updateQueue;
          a.updateQueue = null;
          if (null !== k2) try {
            "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
            vb(h2, g2);
            var l2 = vb(h2, f2);
            for (g2 = 0; g2 < k2.length; g2 += 2) {
              var m2 = k2[g2], q2 = k2[g2 + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f2);
                break;
              case "textarea":
                ib(e2, f2);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e2,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e2[Pf] = f2;
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 6:
        ck(b2, a);
        ek(a);
        if (d2 & 4) {
          if (null === a.stateNode) throw Error(p$1(162));
          e2 = a.stateNode;
          f2 = a.memoizedProps;
          try {
            e2.nodeValue = f2;
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 3:
        ck(b2, a);
        ek(a);
        if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated) try {
          bd(b2.containerInfo);
        } catch (t2) {
          W(a, a.return, t2);
        }
        break;
      case 4:
        ck(b2, a);
        ek(a);
        break;
      case 13:
        ck(b2, a);
        ek(a);
        e2 = a.child;
        e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (fk = B()));
        d2 & 4 && ak(a);
        break;
      case 22:
        m2 = null !== c2 && null !== c2.memoizedState;
        a.mode & 1 ? (U = (l2 = U) || m2, ck(b2, a), U = l2) : ck(b2, a);
        ek(a);
        if (d2 & 8192) {
          l2 = null !== a.memoizedState;
          if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r2, r2.return);
                  break;
                case 1:
                  Lj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d2 = r2;
                    c2 = r2.return;
                    try {
                      b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W(d2, c2, t2);
                    }
                  }
                  break;
                case 5:
                  Lj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    gk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
            }
            m2 = m2.sibling;
          }
          a: for (m2 = null, q2 = a; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                } catch (t2) {
                  W(a, a.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2) try {
                q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
              } catch (t2) {
                W(a, a.return, t2);
              }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a) break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a) break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
        }
        break;
      case 19:
        ck(b2, a);
        ek(a);
        d2 & 4 && ak(a);
        break;
      case 21:
        break;
      default:
        ck(
          b2,
          a
        ), ek(a);
    }
  }
  function ek(a) {
    var b2 = a.flags;
    if (b2 & 2) {
      try {
        a: {
          for (var c2 = a.return; null !== c2; ) {
            if (Tj(c2)) {
              var d2 = c2;
              break a;
            }
            c2 = c2.return;
          }
          throw Error(p$1(160));
        }
        switch (d2.tag) {
          case 5:
            var e2 = d2.stateNode;
            d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
            var f2 = Uj(a);
            Wj(a, f2, e2);
            break;
          case 3:
          case 4:
            var g2 = d2.stateNode.containerInfo, h2 = Uj(a);
            Vj(a, h2, g2);
            break;
          default:
            throw Error(p$1(161));
        }
      } catch (k2) {
        W(a, a.return, k2);
      }
      a.flags &= -3;
    }
    b2 & 4096 && (a.flags &= -4097);
  }
  function hk(a, b2, c2) {
    V = a;
    ik(a);
  }
  function ik(a, b2, c2) {
    for (var d2 = 0 !== (a.mode & 1); null !== V; ) {
      var e2 = V, f2 = e2.child;
      if (22 === e2.tag && d2) {
        var g2 = null !== e2.memoizedState || Jj;
        if (!g2) {
          var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U;
          h2 = Jj;
          var l2 = U;
          Jj = g2;
          if ((U = k2) && !l2) for (V = e2; null !== V; ) g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e2) : null !== k2 ? (k2.return = g2, V = k2) : jk(e2);
          for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
          V = e2;
          Jj = h2;
          U = l2;
        }
        kk(a);
      } else 0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V = f2) : kk(a);
    }
  }
  function kk(a) {
    for (; null !== V; ) {
      var b2 = V;
      if (0 !== (b2.flags & 8772)) {
        var c2 = b2.alternate;
        try {
          if (0 !== (b2.flags & 8772)) switch (b2.tag) {
            case 0:
            case 11:
            case 15:
              U || Qj(5, b2);
              break;
            case 1:
              var d2 = b2.stateNode;
              if (b2.flags & 4 && !U) if (null === c2) d2.componentDidMount();
              else {
                var e2 = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
                d2.componentDidUpdate(e2, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
              }
              var f2 = b2.updateQueue;
              null !== f2 && sh(b2, f2, d2);
              break;
            case 3:
              var g2 = b2.updateQueue;
              if (null !== g2) {
                c2 = null;
                if (null !== b2.child) switch (b2.child.tag) {
                  case 5:
                    c2 = b2.child.stateNode;
                    break;
                  case 1:
                    c2 = b2.child.stateNode;
                }
                sh(b2, g2, c2);
              }
              break;
            case 5:
              var h2 = b2.stateNode;
              if (null === c2 && b2.flags & 4) {
                c2 = h2;
                var k2 = b2.memoizedProps;
                switch (b2.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c2.focus();
                    break;
                  case "img":
                    k2.src && (c2.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b2.memoizedState) {
                var l2 = b2.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$1(163));
          }
          U || b2.flags & 512 && Rj(b2);
        } catch (r2) {
          W(b2, b2.return, r2);
        }
      }
      if (b2 === a) {
        V = null;
        break;
      }
      c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function gk(a) {
    for (; null !== V; ) {
      var b2 = V;
      if (b2 === a) {
        V = null;
        break;
      }
      var c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function jk(a) {
    for (; null !== V; ) {
      var b2 = V;
      try {
        switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            var c2 = b2.return;
            try {
              Qj(4, b2);
            } catch (k2) {
              W(b2, c2, k2);
            }
            break;
          case 1:
            var d2 = b2.stateNode;
            if ("function" === typeof d2.componentDidMount) {
              var e2 = b2.return;
              try {
                d2.componentDidMount();
              } catch (k2) {
                W(b2, e2, k2);
              }
            }
            var f2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W(b2, f2, k2);
            }
            break;
          case 5:
            var g2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W(b2, g2, k2);
            }
        }
      } catch (k2) {
        W(b2, b2.return, k2);
      }
      if (b2 === a) {
        V = null;
        break;
      }
      var h2 = b2.sibling;
      if (null !== h2) {
        h2.return = b2.return;
        V = h2;
        break;
      }
      V = b2.return;
    }
  }
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R() {
    return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
  }
  function yi(a) {
    if (0 === (a.mode & 1)) return 1;
    if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
    if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
    a = C;
    if (0 !== a) return a;
    a = window.event;
    a = void 0 === a ? 16 : jd(a.type);
    return a;
  }
  function gi(a, b2, c2, d2) {
    if (50 < yk) throw yk = 0, zk = null, Error(p$1(185));
    Ac(a, c2, d2);
    if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c2), 4 === T && Ck(a, Z)), Dk(a, d2), 1 === c2 && 0 === K && 0 === (b2.mode & 1) && (Gj = B() + 500, fg && jg());
  }
  function Dk(a, b2) {
    var c2 = a.callbackNode;
    wc(a, b2);
    var d2 = uc(a, a === Q ? Z : 0);
    if (0 === d2) null !== c2 && bc(c2), a.callbackNode = null, a.callbackPriority = 0;
    else if (b2 = d2 & -d2, a.callbackPriority !== b2) {
      null != c2 && bc(c2);
      if (1 === b2) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
        0 === (K & 6) && jg();
      }), c2 = null;
      else {
        switch (Dc(d2)) {
          case 1:
            c2 = fc;
            break;
          case 4:
            c2 = gc;
            break;
          case 16:
            c2 = hc;
            break;
          case 536870912:
            c2 = jc;
            break;
          default:
            c2 = hc;
        }
        c2 = Fk(c2, Gk.bind(null, a));
      }
      a.callbackPriority = b2;
      a.callbackNode = c2;
    }
  }
  function Gk(a, b2) {
    Ak = -1;
    Bk = 0;
    if (0 !== (K & 6)) throw Error(p$1(327));
    var c2 = a.callbackNode;
    if (Hk() && a.callbackNode !== c2) return null;
    var d2 = uc(a, a === Q ? Z : 0);
    if (0 === d2) return null;
    if (0 !== (d2 & 30) || 0 !== (d2 & a.expiredLanes) || b2) b2 = Ik(a, d2);
    else {
      b2 = d2;
      var e2 = K;
      K |= 2;
      var f2 = Jk();
      if (Q !== a || Z !== b2) uk = null, Gj = B() + 500, Kk(a, b2);
      do
        try {
          Lk();
          break;
        } catch (h2) {
          Mk(a, h2);
        }
      while (1);
      $g();
      mk.current = f2;
      K = e2;
      null !== Y ? b2 = 0 : (Q = null, Z = 0, b2 = T);
    }
    if (0 !== b2) {
      2 === b2 && (e2 = xc(a), 0 !== e2 && (d2 = e2, b2 = Nk(a, e2)));
      if (1 === b2) throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B()), c2;
      if (6 === b2) Ck(a, d2);
      else {
        e2 = a.current.alternate;
        if (0 === (d2 & 30) && !Ok(e2) && (b2 = Ik(a, d2), 2 === b2 && (f2 = xc(a), 0 !== f2 && (d2 = f2, b2 = Nk(a, f2))), 1 === b2)) throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B()), c2;
        a.finishedWork = e2;
        a.finishedLanes = d2;
        switch (b2) {
          case 0:
          case 1:
            throw Error(p$1(345));
          case 2:
            Pk(a, tk, uk);
            break;
          case 3:
            Ck(a, d2);
            if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B(), 10 < b2)) {
              if (0 !== uc(a, 0)) break;
              e2 = a.suspendedLanes;
              if ((e2 & d2) !== d2) {
                R();
                a.pingedLanes |= a.suspendedLanes & e2;
                break;
              }
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b2);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 4:
            Ck(a, d2);
            if ((d2 & 4194240) === d2) break;
            b2 = a.eventTimes;
            for (e2 = -1; 0 < d2; ) {
              var g2 = 31 - oc(d2);
              f2 = 1 << g2;
              g2 = b2[g2];
              g2 > e2 && (e2 = g2);
              d2 &= ~f2;
            }
            d2 = e2;
            d2 = B() - d2;
            d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * lk(d2 / 1960)) - d2;
            if (10 < d2) {
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d2);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 5:
            Pk(a, tk, uk);
            break;
          default:
            throw Error(p$1(329));
        }
      }
    }
    Dk(a, B());
    return a.callbackNode === c2 ? Gk.bind(null, a) : null;
  }
  function Nk(a, b2) {
    var c2 = sk;
    a.current.memoizedState.isDehydrated && (Kk(a, b2).flags |= 256);
    a = Ik(a, b2);
    2 !== a && (b2 = tk, tk = c2, null !== b2 && Fj(b2));
    return a;
  }
  function Fj(a) {
    null === tk ? tk = a : tk.push.apply(tk, a);
  }
  function Ok(a) {
    for (var b2 = a; ; ) {
      if (b2.flags & 16384) {
        var c2 = b2.updateQueue;
        if (null !== c2 && (c2 = c2.stores, null !== c2)) for (var d2 = 0; d2 < c2.length; d2++) {
          var e2 = c2[d2], f2 = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He(f2(), e2)) return false;
          } catch (g2) {
            return false;
          }
        }
      }
      c2 = b2.child;
      if (b2.subtreeFlags & 16384 && null !== c2) c2.return = b2, b2 = c2;
      else {
        if (b2 === a) break;
        for (; null === b2.sibling; ) {
          if (null === b2.return || b2.return === a) return true;
          b2 = b2.return;
        }
        b2.sibling.return = b2.return;
        b2 = b2.sibling;
      }
    }
    return true;
  }
  function Ck(a, b2) {
    b2 &= ~rk;
    b2 &= ~qk;
    a.suspendedLanes |= b2;
    a.pingedLanes &= ~b2;
    for (a = a.expirationTimes; 0 < b2; ) {
      var c2 = 31 - oc(b2), d2 = 1 << c2;
      a[c2] = -1;
      b2 &= ~d2;
    }
  }
  function Ek(a) {
    if (0 !== (K & 6)) throw Error(p$1(327));
    Hk();
    var b2 = uc(a, 0);
    if (0 === (b2 & 1)) return Dk(a, B()), null;
    var c2 = Ik(a, b2);
    if (0 !== a.tag && 2 === c2) {
      var d2 = xc(a);
      0 !== d2 && (b2 = d2, c2 = Nk(a, d2));
    }
    if (1 === c2) throw c2 = pk, Kk(a, 0), Ck(a, b2), Dk(a, B()), c2;
    if (6 === c2) throw Error(p$1(345));
    a.finishedWork = a.current.alternate;
    a.finishedLanes = b2;
    Pk(a, tk, uk);
    Dk(a, B());
    return null;
  }
  function Qk(a, b2) {
    var c2 = K;
    K |= 1;
    try {
      return a(b2);
    } finally {
      K = c2, 0 === K && (Gj = B() + 500, fg && jg());
    }
  }
  function Rk(a) {
    null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
    var b2 = K;
    K |= 1;
    var c2 = ok.transition, d2 = C;
    try {
      if (ok.transition = null, C = 1, a) return a();
    } finally {
      C = d2, ok.transition = c2, K = b2, 0 === (K & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E(ej);
  }
  function Kk(a, b2) {
    a.finishedWork = null;
    a.finishedLanes = 0;
    var c2 = a.timeoutHandle;
    -1 !== c2 && (a.timeoutHandle = -1, Gf(c2));
    if (null !== Y) for (c2 = Y.return; null !== c2; ) {
      var d2 = c2;
      wg(d2);
      switch (d2.tag) {
        case 1:
          d2 = d2.type.childContextTypes;
          null !== d2 && void 0 !== d2 && $f();
          break;
        case 3:
          zh();
          E(Wf);
          E(H);
          Eh();
          break;
        case 5:
          Bh(d2);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(d2.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c2 = c2.return;
    }
    Q = a;
    Y = a = Pg(a.current, null);
    Z = fj = b2;
    T = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b2 = 0; b2 < fh.length; b2++) if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
        c2.interleaved = null;
        var e2 = d2.next, f2 = c2.pending;
        if (null !== f2) {
          var g2 = f2.next;
          f2.next = e2;
          d2.next = g2;
        }
        c2.pending = d2;
      }
      fh = null;
    }
    return a;
  }
  function Mk(a, b2) {
    do {
      var c2 = Y;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d2 = M.memoizedState; null !== d2; ) {
            var e2 = d2.queue;
            null !== e2 && (e2.pending = null);
            d2 = d2.next;
          }
          Ih = false;
        }
        Hh = 0;
        O = N = M = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c2 || null === c2.return) {
          T = 1;
          pk = b2;
          Y = null;
          break;
        }
        a: {
          var f2 = a, g2 = c2.return, h2 = c2, k2 = b2;
          b2 = Z;
          h2.flags |= 32768;
          if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
            var l2 = k2, m2 = h2, q2 = m2.tag;
            if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
              var r2 = m2.alternate;
              r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
            }
            var y2 = Ui(g2);
            if (null !== y2) {
              y2.flags &= -257;
              Vi(y2, g2, h2, f2, b2);
              y2.mode & 1 && Si(f2, l2, b2);
              b2 = y2;
              k2 = l2;
              var n2 = b2.updateQueue;
              if (null === n2) {
                var t2 = /* @__PURE__ */ new Set();
                t2.add(k2);
                b2.updateQueue = t2;
              } else n2.add(k2);
              break a;
            } else {
              if (0 === (b2 & 1)) {
                Si(f2, l2, b2);
                tj();
                break a;
              }
              k2 = Error(p$1(426));
            }
          } else if (I && h2.mode & 1) {
            var J2 = Ui(g2);
            if (null !== J2) {
              0 === (J2.flags & 65536) && (J2.flags |= 256);
              Vi(J2, g2, h2, f2, b2);
              Jg(Ji(k2, h2));
              break a;
            }
          }
          f2 = k2 = Ji(k2, h2);
          4 !== T && (T = 2);
          null === sk ? sk = [f2] : sk.push(f2);
          f2 = g2;
          do {
            switch (f2.tag) {
              case 3:
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var x2 = Ni(f2, k2, b2);
                ph(f2, x2);
                break a;
              case 1:
                h2 = k2;
                var w2 = f2.type, u2 = f2.stateNode;
                if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                  f2.flags |= 65536;
                  b2 &= -b2;
                  f2.lanes |= b2;
                  var F2 = Qi(f2, h2, b2);
                  ph(f2, F2);
                  break a;
                }
            }
            f2 = f2.return;
          } while (null !== f2);
        }
        Sk(c2);
      } catch (na) {
        b2 = na;
        Y === c2 && null !== c2 && (Y = c2 = c2.return);
        continue;
      }
      break;
    } while (1);
  }
  function Jk() {
    var a = mk.current;
    mk.current = Rh;
    return null === a ? Rh : a;
  }
  function tj() {
    if (0 === T || 3 === T || 2 === T) T = 4;
    null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
  }
  function Ik(a, b2) {
    var c2 = K;
    K |= 2;
    var d2 = Jk();
    if (Q !== a || Z !== b2) uk = null, Kk(a, b2);
    do
      try {
        Tk();
        break;
      } catch (e2) {
        Mk(a, e2);
      }
    while (1);
    $g();
    K = c2;
    mk.current = d2;
    if (null !== Y) throw Error(p$1(261));
    Q = null;
    Z = 0;
    return T;
  }
  function Tk() {
    for (; null !== Y; ) Uk(Y);
  }
  function Lk() {
    for (; null !== Y && !cc(); ) Uk(Y);
  }
  function Uk(a) {
    var b2 = Vk(a.alternate, a, fj);
    a.memoizedProps = a.pendingProps;
    null === b2 ? Sk(a) : Y = b2;
    nk.current = null;
  }
  function Sk(a) {
    var b2 = a;
    do {
      var c2 = b2.alternate;
      a = b2.return;
      if (0 === (b2.flags & 32768)) {
        if (c2 = Ej(c2, b2, fj), null !== c2) {
          Y = c2;
          return;
        }
      } else {
        c2 = Ij(c2, b2);
        if (null !== c2) {
          c2.flags &= 32767;
          Y = c2;
          return;
        }
        if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
        else {
          T = 6;
          Y = null;
          return;
        }
      }
      b2 = b2.sibling;
      if (null !== b2) {
        Y = b2;
        return;
      }
      Y = b2 = a;
    } while (null !== b2);
    0 === T && (T = 5);
  }
  function Pk(a, b2, c2) {
    var d2 = C, e2 = ok.transition;
    try {
      ok.transition = null, C = 1, Wk(a, b2, c2, d2);
    } finally {
      ok.transition = e2, C = d2;
    }
    return null;
  }
  function Wk(a, b2, c2, d2) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K & 6)) throw Error(p$1(327));
    c2 = a.finishedWork;
    var e2 = a.finishedLanes;
    if (null === c2) return null;
    a.finishedWork = null;
    a.finishedLanes = 0;
    if (c2 === a.current) throw Error(p$1(177));
    a.callbackNode = null;
    a.callbackPriority = 0;
    var f2 = c2.lanes | c2.childLanes;
    Bc(a, f2);
    a === Q && (Y = Q = null, Z = 0);
    0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f2 = 0 !== (c2.flags & 15990);
    if (0 !== (c2.subtreeFlags & 15990) || f2) {
      f2 = ok.transition;
      ok.transition = null;
      var g2 = C;
      C = 1;
      var h2 = K;
      K |= 4;
      nk.current = null;
      Oj(a, c2);
      dk(c2, a);
      Oe(Df);
      dd = !!Cf;
      Df = Cf = null;
      a.current = c2;
      hk(c2);
      dc();
      K = h2;
      C = g2;
      ok.transition = f2;
    } else a.current = c2;
    vk && (vk = false, wk = a, xk = e2);
    f2 = a.pendingLanes;
    0 === f2 && (Ri = null);
    mc(c2.stateNode);
    Dk(a, B());
    if (null !== b2) for (d2 = a.onRecoverableError, c2 = 0; c2 < b2.length; c2++) e2 = b2[c2], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
    if (Oi) throw Oi = false, a = Pi, Pi = null, a;
    0 !== (xk & 1) && 0 !== a.tag && Hk();
    f2 = a.pendingLanes;
    0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a = Dc(xk), b2 = ok.transition, c2 = C;
      try {
        ok.transition = null;
        C = 16 > a ? 16 : a;
        if (null === wk) var d2 = false;
        else {
          a = wk;
          wk = null;
          xk = 0;
          if (0 !== (K & 6)) throw Error(p$1(331));
          var e2 = K;
          K |= 4;
          for (V = a.current; null !== V; ) {
            var f2 = V, g2 = f2.child;
            if (0 !== (V.flags & 16)) {
              var h2 = f2.deletions;
              if (null !== h2) {
                for (var k2 = 0; k2 < h2.length; k2++) {
                  var l2 = h2[k2];
                  for (V = l2; null !== V; ) {
                    var m2 = V;
                    switch (m2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pj(8, m2, f2);
                    }
                    var q2 = m2.child;
                    if (null !== q2) q2.return = m2, V = q2;
                    else for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Sj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                  }
                }
                var n2 = f2.alternate;
                if (null !== n2) {
                  var t2 = n2.child;
                  if (null !== t2) {
                    n2.child = null;
                    do {
                      var J2 = t2.sibling;
                      t2.sibling = null;
                      t2 = J2;
                    } while (null !== t2);
                  }
                }
                V = f2;
              }
            }
            if (0 !== (f2.subtreeFlags & 2064) && null !== g2) g2.return = f2, V = g2;
            else b: for (; null !== V; ) {
              f2 = V;
              if (0 !== (f2.flags & 2048)) switch (f2.tag) {
                case 0:
                case 11:
                case 15:
                  Pj(9, f2, f2.return);
              }
              var x2 = f2.sibling;
              if (null !== x2) {
                x2.return = f2.return;
                V = x2;
                break b;
              }
              V = f2.return;
            }
          }
          var w2 = a.current;
          for (V = w2; null !== V; ) {
            g2 = V;
            var u2 = g2.child;
            if (0 !== (g2.subtreeFlags & 2064) && null !== u2) u2.return = g2, V = u2;
            else b: for (g2 = w2; null !== V; ) {
              h2 = V;
              if (0 !== (h2.flags & 2048)) try {
                switch (h2.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qj(9, h2);
                }
              } catch (na) {
                W(h2, h2.return, na);
              }
              if (h2 === g2) {
                V = null;
                break b;
              }
              var F2 = h2.sibling;
              if (null !== F2) {
                F2.return = h2.return;
                V = F2;
                break b;
              }
              V = h2.return;
            }
          }
          K = e2;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
          d2 = true;
        }
        return d2;
      } finally {
        C = c2, ok.transition = b2;
      }
    }
    return false;
  }
  function Xk(a, b2, c2) {
    b2 = Ji(c2, b2);
    b2 = Ni(a, b2, 1);
    a = nh(a, b2, 1);
    b2 = R();
    null !== a && (Ac(a, 1, b2), Dk(a, b2));
  }
  function W(a, b2, c2) {
    if (3 === a.tag) Xk(a, a, c2);
    else for (; null !== b2; ) {
      if (3 === b2.tag) {
        Xk(b2, a, c2);
        break;
      } else if (1 === b2.tag) {
        var d2 = b2.stateNode;
        if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
          a = Ji(c2, a);
          a = Qi(b2, a, 1);
          b2 = nh(b2, a, 1);
          a = R();
          null !== b2 && (Ac(b2, 1, a), Dk(b2, a));
          break;
        }
      }
      b2 = b2.return;
    }
  }
  function Ti(a, b2, c2) {
    var d2 = a.pingCache;
    null !== d2 && d2.delete(b2);
    b2 = R();
    a.pingedLanes |= a.suspendedLanes & c2;
    Q === a && (Z & c2) === c2 && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c2);
    Dk(a, b2);
  }
  function Yk(a, b2) {
    0 === b2 && (0 === (a.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c2 = R();
    a = ih(a, b2);
    null !== a && (Ac(a, b2, c2), Dk(a, c2));
  }
  function uj(a) {
    var b2 = a.memoizedState, c2 = 0;
    null !== b2 && (c2 = b2.retryLane);
    Yk(a, c2);
  }
  function bk(a, b2) {
    var c2 = 0;
    switch (a.tag) {
      case 13:
        var d2 = a.stateNode;
        var e2 = a.memoizedState;
        null !== e2 && (c2 = e2.retryLane);
        break;
      case 19:
        d2 = a.stateNode;
        break;
      default:
        throw Error(p$1(314));
    }
    null !== d2 && d2.delete(b2);
    Yk(a, c2);
  }
  var Vk;
  Vk = function(a, b2, c2) {
    if (null !== a) if (a.memoizedProps !== b2.pendingProps || Wf.current) dh = true;
    else {
      if (0 === (a.lanes & c2) && 0 === (b2.flags & 128)) return dh = false, yj(a, b2, c2);
      dh = 0 !== (a.flags & 131072) ? true : false;
    }
    else dh = false, I && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
    b2.lanes = 0;
    switch (b2.tag) {
      case 2:
        var d2 = b2.type;
        ij(a, b2);
        a = b2.pendingProps;
        var e2 = Yf(b2, H.current);
        ch(b2, c2);
        e2 = Nh(null, b2, d2, a, e2, c2);
        var f2 = Sh();
        b2.flags |= 1;
        "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, kh(b2), e2.updater = Ei, b2.stateNode = e2, e2._reactInternals = b2, Ii(b2, d2, a, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I && f2 && vg(b2), Xi(null, b2, e2, c2), b2 = b2.child);
        return b2;
      case 16:
        d2 = b2.elementType;
        a: {
          ij(a, b2);
          a = b2.pendingProps;
          e2 = d2._init;
          d2 = e2(d2._payload);
          b2.type = d2;
          e2 = b2.tag = Zk(d2);
          a = Ci(d2, a);
          switch (e2) {
            case 0:
              b2 = cj(null, b2, d2, a, c2);
              break a;
            case 1:
              b2 = hj(null, b2, d2, a, c2);
              break a;
            case 11:
              b2 = Yi(null, b2, d2, a, c2);
              break a;
            case 14:
              b2 = $i(null, b2, d2, Ci(d2.type, a), c2);
              break a;
          }
          throw Error(p$1(
            306,
            d2,
            ""
          ));
        }
        return b2;
      case 0:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), cj(a, b2, d2, e2, c2);
      case 1:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), hj(a, b2, d2, e2, c2);
      case 3:
        a: {
          kj(b2);
          if (null === a) throw Error(p$1(387));
          d2 = b2.pendingProps;
          f2 = b2.memoizedState;
          e2 = f2.element;
          lh(a, b2);
          qh(b2, d2, null, c2);
          var g2 = b2.memoizedState;
          d2 = g2.element;
          if (f2.isDehydrated) if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
            e2 = Ji(Error(p$1(423)), b2);
            b2 = lj(a, b2, d2, c2, e2);
            break a;
          } else if (d2 !== e2) {
            e2 = Ji(Error(p$1(424)), b2);
            b2 = lj(a, b2, d2, c2, e2);
            break a;
          } else for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; ) c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
          else {
            Ig();
            if (d2 === e2) {
              b2 = Zi(a, b2, c2);
              break a;
            }
            Xi(a, b2, d2, c2);
          }
          b2 = b2.child;
        }
        return b2;
      case 5:
        return Ah(b2), null === a && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a ? a.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a, b2), Xi(a, b2, g2, c2), b2.child;
      case 6:
        return null === a && Eg(b2), null;
      case 13:
        return oj(a, b2, c2);
      case 4:
        return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a ? b2.child = Ug(b2, null, d2, c2) : Xi(a, b2, d2, c2), b2.child;
      case 11:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), Yi(a, b2, d2, e2, c2);
      case 7:
        return Xi(a, b2, b2.pendingProps, c2), b2.child;
      case 8:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 12:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 10:
        a: {
          d2 = b2.type._context;
          e2 = b2.pendingProps;
          f2 = b2.memoizedProps;
          g2 = e2.value;
          G(Wg, d2._currentValue);
          d2._currentValue = g2;
          if (null !== f2) if (He(f2.value, g2)) {
            if (f2.children === e2.children && !Wf.current) {
              b2 = Zi(a, b2, c2);
              break a;
            }
          } else for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
            var h2 = f2.dependencies;
            if (null !== h2) {
              g2 = f2.child;
              for (var k2 = h2.firstContext; null !== k2; ) {
                if (k2.context === d2) {
                  if (1 === f2.tag) {
                    k2 = mh(-1, c2 & -c2);
                    k2.tag = 2;
                    var l2 = f2.updateQueue;
                    if (null !== l2) {
                      l2 = l2.shared;
                      var m2 = l2.pending;
                      null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                      l2.pending = k2;
                    }
                  }
                  f2.lanes |= c2;
                  k2 = f2.alternate;
                  null !== k2 && (k2.lanes |= c2);
                  bh(
                    f2.return,
                    c2,
                    b2
                  );
                  h2.lanes |= c2;
                  break;
                }
                k2 = k2.next;
              }
            } else if (10 === f2.tag) g2 = f2.type === b2.type ? null : f2.child;
            else if (18 === f2.tag) {
              g2 = f2.return;
              if (null === g2) throw Error(p$1(341));
              g2.lanes |= c2;
              h2 = g2.alternate;
              null !== h2 && (h2.lanes |= c2);
              bh(g2, c2, b2);
              g2 = f2.sibling;
            } else g2 = f2.child;
            if (null !== g2) g2.return = f2;
            else for (g2 = f2; null !== g2; ) {
              if (g2 === b2) {
                g2 = null;
                break;
              }
              f2 = g2.sibling;
              if (null !== f2) {
                f2.return = g2.return;
                g2 = f2;
                break;
              }
              g2 = g2.return;
            }
            f2 = g2;
          }
          Xi(a, b2, e2.children, c2);
          b2 = b2.child;
        }
        return b2;
      case 9:
        return e2 = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e2 = eh(e2), d2 = d2(e2), b2.flags |= 1, Xi(a, b2, d2, c2), b2.child;
      case 14:
        return d2 = b2.type, e2 = Ci(d2, b2.pendingProps), e2 = Ci(d2.type, e2), $i(a, b2, d2, e2, c2);
      case 15:
        return bj(a, b2, b2.type, b2.pendingProps, c2);
      case 17:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), ij(a, b2), b2.tag = 1, Zf(d2) ? (a = true, cg(b2)) : a = false, ch(b2, c2), Gi(b2, d2, e2), Ii(b2, d2, e2, c2), jj(null, b2, d2, true, a, c2);
      case 19:
        return xj(a, b2, c2);
      case 22:
        return dj(a, b2, c2);
    }
    throw Error(p$1(156, b2.tag));
  };
  function Fk(a, b2) {
    return ac(a, b2);
  }
  function $k(a, b2, c2, d2) {
    this.tag = a;
    this.key = c2;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = b2;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = d2;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function Bg(a, b2, c2, d2) {
    return new $k(a, b2, c2, d2);
  }
  function aj(a) {
    a = a.prototype;
    return !(!a || !a.isReactComponent);
  }
  function Zk(a) {
    if ("function" === typeof a) return aj(a) ? 1 : 0;
    if (void 0 !== a && null !== a) {
      a = a.$$typeof;
      if (a === Da) return 11;
      if (a === Ga) return 14;
    }
    return 2;
  }
  function Pg(a, b2) {
    var c2 = a.alternate;
    null === c2 ? (c2 = Bg(a.tag, b2, a.key, a.mode), c2.elementType = a.elementType, c2.type = a.type, c2.stateNode = a.stateNode, c2.alternate = a, a.alternate = c2) : (c2.pendingProps = b2, c2.type = a.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
    c2.flags = a.flags & 14680064;
    c2.childLanes = a.childLanes;
    c2.lanes = a.lanes;
    c2.child = a.child;
    c2.memoizedProps = a.memoizedProps;
    c2.memoizedState = a.memoizedState;
    c2.updateQueue = a.updateQueue;
    b2 = a.dependencies;
    c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
    c2.sibling = a.sibling;
    c2.index = a.index;
    c2.ref = a.ref;
    return c2;
  }
  function Rg(a, b2, c2, d2, e2, f2) {
    var g2 = 2;
    d2 = a;
    if ("function" === typeof a) aj(a) && (g2 = 1);
    else if ("string" === typeof a) g2 = 5;
    else a: switch (a) {
      case ya:
        return Tg(c2.children, e2, f2, b2);
      case za:
        g2 = 8;
        e2 |= 8;
        break;
      case Aa:
        return a = Bg(12, c2, b2, e2 | 2), a.elementType = Aa, a.lanes = f2, a;
      case Ea:
        return a = Bg(13, c2, b2, e2), a.elementType = Ea, a.lanes = f2, a;
      case Fa:
        return a = Bg(19, c2, b2, e2), a.elementType = Fa, a.lanes = f2, a;
      case Ia:
        return pj(c2, e2, f2, b2);
      default:
        if ("object" === typeof a && null !== a) switch (a.$$typeof) {
          case Ba:
            g2 = 10;
            break a;
          case Ca:
            g2 = 9;
            break a;
          case Da:
            g2 = 11;
            break a;
          case Ga:
            g2 = 14;
            break a;
          case Ha:
            g2 = 16;
            d2 = null;
            break a;
        }
        throw Error(p$1(130, null == a ? a : typeof a, ""));
    }
    b2 = Bg(g2, c2, b2, e2);
    b2.elementType = a;
    b2.type = d2;
    b2.lanes = f2;
    return b2;
  }
  function Tg(a, b2, c2, d2) {
    a = Bg(7, a, d2, b2);
    a.lanes = c2;
    return a;
  }
  function pj(a, b2, c2, d2) {
    a = Bg(22, a, d2, b2);
    a.elementType = Ia;
    a.lanes = c2;
    a.stateNode = { isHidden: false };
    return a;
  }
  function Qg(a, b2, c2) {
    a = Bg(6, a, null, b2);
    a.lanes = c2;
    return a;
  }
  function Sg(a, b2, c2) {
    b2 = Bg(4, null !== a.children ? a.children : [], a.key, b2);
    b2.lanes = c2;
    b2.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
    return b2;
  }
  function al(a, b2, c2, d2, e2) {
    this.tag = b2;
    this.containerInfo = a;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = zc(0);
    this.expirationTimes = zc(-1);
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = zc(0);
    this.identifierPrefix = d2;
    this.onRecoverableError = e2;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    a = new al(a, b2, c2, h2, k2);
    1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
    f2 = Bg(3, null, null, b2);
    a.current = f2;
    f2.stateNode = a;
    f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
    kh(f2);
    return a;
  }
  function cl(a, b2, c2) {
    var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a, containerInfo: b2, implementation: c2 };
  }
  function dl(a) {
    if (!a) return Vf;
    a = a._reactInternals;
    a: {
      if (Vb(a) !== a || 1 !== a.tag) throw Error(p$1(170));
      var b2 = a;
      do {
        switch (b2.tag) {
          case 3:
            b2 = b2.stateNode.context;
            break a;
          case 1:
            if (Zf(b2.type)) {
              b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
              break a;
            }
        }
        b2 = b2.return;
      } while (null !== b2);
      throw Error(p$1(171));
    }
    if (1 === a.tag) {
      var c2 = a.type;
      if (Zf(c2)) return bg(a, c2, b2);
    }
    return b2;
  }
  function el(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    a = bl(c2, d2, true, a, e2, f2, g2, h2, k2);
    a.context = dl(null);
    c2 = a.current;
    d2 = R();
    e2 = yi(c2);
    f2 = mh(d2, e2);
    f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
    nh(c2, f2, e2);
    a.current.lanes = e2;
    Ac(a, e2, d2);
    Dk(a, d2);
    return a;
  }
  function fl(a, b2, c2, d2) {
    var e2 = b2.current, f2 = R(), g2 = yi(e2);
    c2 = dl(c2);
    null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
    b2 = mh(f2, g2);
    b2.payload = { element: a };
    d2 = void 0 === d2 ? null : d2;
    null !== d2 && (b2.callback = d2);
    a = nh(e2, b2, g2);
    null !== a && (gi(a, e2, g2, f2), oh(a, e2, g2));
    return g2;
  }
  function gl(a) {
    a = a.current;
    if (!a.child) return null;
    switch (a.child.tag) {
      case 5:
        return a.child.stateNode;
      default:
        return a.child.stateNode;
    }
  }
  function hl(a, b2) {
    a = a.memoizedState;
    if (null !== a && null !== a.dehydrated) {
      var c2 = a.retryLane;
      a.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
    }
  }
  function il(a, b2) {
    hl(a, b2);
    (a = a.alternate) && hl(a, b2);
  }
  function jl() {
    return null;
  }
  var kl = "function" === typeof reportError ? reportError : function(a) {
    console.error(a);
  };
  function ll(a) {
    this._internalRoot = a;
  }
  ml.prototype.render = ll.prototype.render = function(a) {
    var b2 = this._internalRoot;
    if (null === b2) throw Error(p$1(409));
    fl(a, b2, null, null);
  };
  ml.prototype.unmount = ll.prototype.unmount = function() {
    var a = this._internalRoot;
    if (null !== a) {
      this._internalRoot = null;
      var b2 = a.containerInfo;
      Rk(function() {
        fl(null, a, null, null);
      });
      b2[uf] = null;
    }
  };
  function ml(a) {
    this._internalRoot = a;
  }
  ml.prototype.unstable_scheduleHydration = function(a) {
    if (a) {
      var b2 = Hc();
      a = { blockedOn: null, target: a, priority: b2 };
      for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++) ;
      Qc.splice(c2, 0, a);
      0 === c2 && Vc(a);
    }
  };
  function nl(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
  }
  function ol(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
  }
  function pl() {
  }
  function ql(a, b2, c2, d2, e2) {
    if (e2) {
      if ("function" === typeof d2) {
        var f2 = d2;
        d2 = function() {
          var a2 = gl(g2);
          f2.call(a2);
        };
      }
      var g2 = el(b2, d2, a, 0, null, false, false, "", pl);
      a._reactRootContainer = g2;
      a[uf] = g2.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk();
      return g2;
    }
    for (; e2 = a.lastChild; ) a.removeChild(e2);
    if ("function" === typeof d2) {
      var h2 = d2;
      d2 = function() {
        var a2 = gl(k2);
        h2.call(a2);
      };
    }
    var k2 = bl(a, 0, false, null, null, false, false, "", pl);
    a._reactRootContainer = k2;
    a[uf] = k2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk(function() {
      fl(b2, k2, c2, d2);
    });
    return k2;
  }
  function rl(a, b2, c2, d2, e2) {
    var f2 = c2._reactRootContainer;
    if (f2) {
      var g2 = f2;
      if ("function" === typeof e2) {
        var h2 = e2;
        e2 = function() {
          var a2 = gl(g2);
          h2.call(a2);
        };
      }
      fl(b2, g2, a, e2);
    } else g2 = ql(c2, b2, a, e2, d2);
    return gl(g2);
  }
  Ec = function(a) {
    switch (a.tag) {
      case 3:
        var b2 = a.stateNode;
        if (b2.current.memoizedState.isDehydrated) {
          var c2 = tc(b2.pendingLanes);
          0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b3 = ih(a, 1);
          if (null !== b3) {
            var c3 = R();
            gi(b3, a, 1, c3);
          }
        }), il(a, 1);
    }
  };
  Fc = function(a) {
    if (13 === a.tag) {
      var b2 = ih(a, 134217728);
      if (null !== b2) {
        var c2 = R();
        gi(b2, a, 134217728, c2);
      }
      il(a, 134217728);
    }
  };
  Gc = function(a) {
    if (13 === a.tag) {
      var b2 = yi(a), c2 = ih(a, b2);
      if (null !== c2) {
        var d2 = R();
        gi(c2, a, b2, d2);
      }
      il(a, b2);
    }
  };
  Hc = function() {
    return C;
  };
  Ic = function(a, b2) {
    var c2 = C;
    try {
      return C = a, b2();
    } finally {
      C = c2;
    }
  };
  yb = function(a, b2, c2) {
    switch (b2) {
      case "input":
        bb(a, c2);
        b2 = c2.name;
        if ("radio" === c2.type && null != b2) {
          for (c2 = a; c2.parentNode; ) c2 = c2.parentNode;
          c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
          for (b2 = 0; b2 < c2.length; b2++) {
            var d2 = c2[b2];
            if (d2 !== a && d2.form === a.form) {
              var e2 = Db(d2);
              if (!e2) throw Error(p$1(90));
              Wa(d2);
              bb(d2, e2);
            }
          }
        }
        break;
      case "textarea":
        ib(a, c2);
        break;
      case "select":
        b2 = c2.value, null != b2 && fb(a, !!c2.multiple, b2, false);
    }
  };
  Gb = Qk;
  Hb = Rk;
  var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
  var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
    a = Zb(a);
    return null === a ? null : a.stateNode;
  }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vl.isDisabled && vl.supportsFiber) try {
      kc = vl.inject(ul), lc = vl;
    } catch (a) {
    }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
  reactDom_production_min.createPortal = function(a, b2) {
    var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl(b2)) throw Error(p$1(200));
    return cl(a, b2, null, c2);
  };
  reactDom_production_min.createRoot = function(a, b2) {
    if (!nl(a)) throw Error(p$1(299));
    var c2 = false, d2 = "", e2 = kl;
    null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
    b2 = bl(a, 1, false, null, null, c2, false, d2, e2);
    a[uf] = b2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    return new ll(b2);
  };
  reactDom_production_min.findDOMNode = function(a) {
    if (null == a) return null;
    if (1 === a.nodeType) return a;
    var b2 = a._reactInternals;
    if (void 0 === b2) {
      if ("function" === typeof a.render) throw Error(p$1(188));
      a = Object.keys(a).join(",");
      throw Error(p$1(268, a));
    }
    a = Zb(b2);
    a = null === a ? null : a.stateNode;
    return a;
  };
  reactDom_production_min.flushSync = function(a) {
    return Rk(a);
  };
  reactDom_production_min.hydrate = function(a, b2, c2) {
    if (!ol(b2)) throw Error(p$1(200));
    return rl(null, a, b2, true, c2);
  };
  reactDom_production_min.hydrateRoot = function(a, b2, c2) {
    if (!nl(a)) throw Error(p$1(405));
    var d2 = null != c2 && c2.hydratedSources || null, e2 = false, f2 = "", g2 = kl;
    null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e2 = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
    b2 = el(b2, null, a, 1, null != c2 ? c2 : null, e2, false, f2, g2);
    a[uf] = b2.current;
    sf(a);
    if (d2) for (a = 0; a < d2.length; a++) c2 = d2[a], e2 = c2._getVersion, e2 = e2(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e2] : b2.mutableSourceEagerHydrationData.push(
      c2,
      e2
    );
    return new ml(b2);
  };
  reactDom_production_min.render = function(a, b2, c2) {
    if (!ol(b2)) throw Error(p$1(200));
    return rl(null, a, b2, false, c2);
  };
  reactDom_production_min.unmountComponentAtNode = function(a) {
    if (!ol(a)) throw Error(p$1(40));
    return a._reactRootContainer ? (Rk(function() {
      rl(null, null, a, false, function() {
        a._reactRootContainer = null;
        a[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b2, c2, d2) {
    if (!ol(c2)) throw Error(p$1(200));
    if (null == a || void 0 === a._reactInternals) throw Error(p$1(38));
    return rl(a, b2, c2, false, d2);
  };
  reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = reactDom_production_min;
  }
  var reactDomExports = reactDom.exports;
  const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
  const ReactDOM$1 = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: ReactDOM
  }, [reactDomExports]);
  var createRoot$1;
  var m$1 = reactDomExports;
  {
    createRoot$1 = m$1.createRoot;
    m$1.hydrateRoot;
  }
  function Feed$1() {
    return __jacJsx$2("div", {}, [__jacJsx$2("h1", {}, ["Feed"])]);
  }
  const globalClientFunctions$2 = ["Feed"];
  const globalFunctionMap$2 = {
    "Feed": Feed$1
  };
  for (const funcName of globalClientFunctions$2) {
    globalThis[funcName] = globalFunctionMap$2[funcName];
  }
  __jacRegisterClientModule$2("feed", ["Feed"], {});
  function __jacJsx$2(tag, props, children) {
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
      return reactExports.createElement.apply(React$1, args);
    } else {
      return reactExports.createElement(tag, props);
    }
  }
  function renderJsxTree$2(node2, container) {
    try {
      createRoot$1(container).render(node2);
    } catch (err) {
      console.error("[Jac] Error in renderJsxTree:", err);
    }
  }
  const __jacReactiveContext$2 = { "signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "reactRoot": null, "currentComponent": null, "currentEffect": null, "router": null };
  function __isObject$2(value) {
    if (value === null) {
      return false;
    }
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function __isFunction$2(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
  }
  function __objectKeys$2(obj) {
    if (obj === null) {
      return [];
    }
    return Object.keys(obj);
  }
  function __jacHasOwn$2(obj, key) {
    try {
      return Object.prototype.hasOwnProperty.call(obj, key);
    } catch {
      return false;
    }
  }
  function __jacGetDocument$2(scope) {
    try {
      return scope.document;
    } catch {
    }
    try {
      return window.document;
    } catch {
    }
    return null;
  }
  function __jacParseJsonObject$2(text) {
    try {
      let parsed = JSON.parse(text);
      if (__isObject$2(parsed)) {
        return parsed;
      }
      console.error("[Jac] Hydration payload is not an object");
      return null;
    } catch (err) {
      console.error("[Jac] Failed to parse hydration payload", err);
      return null;
    }
  }
  function __jacBuildOrderedArgs$2(order, argsDict) {
    let result = [];
    if (!order) {
      return result;
    }
    let values = __isObject$2(argsDict) ? argsDict : {};
    for (const name of order) {
      result.push(values[name]);
    }
    return result;
  }
  function __jacResolveRenderer$2(scope) {
    if (scope.renderJsxTree) {
      return scope.renderJsxTree;
    }
    if (__isFunction$2(renderJsxTree$2)) {
      return renderJsxTree$2;
    }
    return null;
  }
  function __jacResolveTarget$2(moduleRecord, registry, name) {
    let moduleFunctions = moduleRecord && moduleRecord.moduleFunctions ? moduleRecord.moduleFunctions : {};
    if (__jacHasOwn$2(moduleFunctions, name)) {
      return moduleFunctions[name];
    }
    let registryFunctions = registry && registry.functions ? registry.functions : {};
    if (__jacHasOwn$2(registryFunctions, name)) {
      return registryFunctions[name];
    }
    return null;
  }
  function __jacGlobalScope$2() {
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
  function __jacEnsureRegistry$2() {
    let scope = __jacGlobalScope$2();
    let registry = scope.__jacClient;
    if (!registry) {
      registry = { "functions": {}, "globals": {}, "modules": {}, "state": { "globals": {} }, "__hydration": { "registered": false }, "lastModule": null };
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
      registry.state = { "globals": {} };
    } else if (!registry.state.globals) {
      registry.state.globals = {};
    }
    if (!registry.__hydration) {
      registry.__hydration = { "registered": false };
    }
    return registry;
  }
  function __jacHydrateFromDom$2(defaultModuleName) {
    let scope = __jacGlobalScope$2();
    let documentRef = __jacGetDocument$2(scope);
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
    let payload = __jacParseJsonObject$2(payloadText);
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
    let registry = __jacEnsureRegistry$2();
    let modulesStore = registry.modules ? registry.modules : {};
    console.log("moduleName", moduleName);
    console.log("modulesStore", modulesStore);
    console.log("modulesStoreSnapshot", JSON.stringify(modulesStore));
    let moduleRecord = __jacHasOwn$2(modulesStore, moduleName) ? modulesStore[moduleName] : null;
    console.log("moduleRecord", moduleRecord);
    if (!moduleRecord) {
      console.error("[Jac] Client module not registered: " + moduleName);
      return;
    }
    let argOrderRaw = payload["argOrder"] !== null ? payload["argOrder"] : [];
    let argOrder = Array.isArray(argOrderRaw) ? argOrderRaw : [];
    let argsDictRaw = payload["args"] !== null ? payload["args"] : {};
    let argsDict = __isObject$2(argsDictRaw) ? argsDictRaw : {};
    let orderedArgs = __jacBuildOrderedArgs$2(argOrder, argsDict);
    let payloadGlobalsRaw = payload["globals"] !== null ? payload["globals"] : {};
    let payloadGlobals = __isObject$2(payloadGlobalsRaw) ? payloadGlobalsRaw : {};
    registry.state.globals[moduleName] = payloadGlobals;
    for (const gName of __objectKeys$2(payloadGlobals)) {
      let gValue = payloadGlobals[gName];
      scope[gName] = gValue;
      registry.globals[gName] = gValue;
    }
    let target = __jacResolveTarget$2(moduleRecord, registry, targetName);
    if (!target) {
      console.error("[Jac] Client function not found: " + targetName);
      return;
    }
    __jacReactiveContext$2.rootComponent = () => {
      __jacReactiveContext$2.currentComponent = "__root__";
      let result = target.apply(scope, orderedArgs);
      __jacReactiveContext$2.currentComponent = null;
      return result;
    };
    let renderer = __jacResolveRenderer$2(scope);
    if (!renderer) {
      console.warn("[Jac] renderJsxTree is not available in client bundle");
    }
    let reactRoot = null;
    try {
      reactRoot = createRoot$1(rootEl);
      __jacReactiveContext$2.reactRoot = reactRoot;
    } catch (err) {
      console.error("[Jac] Failed to create React root for hydration:", err);
      return;
    }
    let value = __jacReactiveContext$2.rootComponent();
    if (value && __isObject$2(value) && __isFunction$2(value.then)) {
      value.then((node2) => {
        reactRoot.render(node2);
      }).catch((err) => {
        console.error("[Jac] Error resolving client function promise", err);
      });
    } else {
      reactRoot.render(value);
    }
  }
  function __jacExecuteHydration$2() {
    let registry = __jacEnsureRegistry$2();
    let defaultModule = registry.lastModule ? registry.lastModule : "";
    __jacHydrateFromDom$2(defaultModule);
  }
  function __jacEnsureHydration$2(moduleName) {
    let registry = __jacEnsureRegistry$2();
    registry.lastModule = moduleName;
    let existingHydration = registry.__hydration ? registry.__hydration : null;
    let hydration = existingHydration ? existingHydration : { "registered": false };
    registry.__hydration = hydration;
    let scope = __jacGlobalScope$2();
    let documentRef = __jacGetDocument$2(scope);
    if (!documentRef) {
      return;
    }
    let alreadyRegistered = hydration.registered ? hydration.registered : false;
    if (!alreadyRegistered) {
      hydration.registered = true;
      documentRef.addEventListener("DOMContentLoaded", (_event) => {
        __jacExecuteHydration$2();
      }, { "once": true });
    }
  }
  function __jacRegisterClientModule$2(moduleName, clientFunctions2, clientGlobals) {
    let scope = __jacGlobalScope$2();
    let registry = __jacEnsureRegistry$2();
    let moduleFunctions = {};
    let registeredFunctions = [];
    if (clientFunctions2) {
      for (const funcName of clientFunctions2) {
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
    for (const gName of __objectKeys$2(globalsMap)) {
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
    let existingRecord = __jacHasOwn$2(modulesStore, moduleName) ? modulesStore[moduleName] : null;
    let moduleRecord = existingRecord ? existingRecord : {};
    moduleRecord.moduleFunctions = moduleFunctions;
    moduleRecord.moduleGlobals = moduleGlobals;
    moduleRecord.functions = registeredFunctions;
    moduleRecord.globals = globalNames;
    moduleRecord.defaults = globalsMap;
    registry.modules[moduleName] = moduleRecord;
    let stateGlobals = registry.state.globals;
    if (!__jacHasOwn$2(stateGlobals, moduleName)) {
      stateGlobals[moduleName] = {};
    }
    __jacEnsureHydration$2(moduleName);
  }
  var classnames = { exports: {} };
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function(module) {
    (function() {
      var hasOwn = {}.hasOwnProperty;
      function classNames2() {
        var classes = "";
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames2.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (module.exports) {
        classNames2.default = classNames2;
        module.exports = classNames2;
      } else {
        window.classNames = classNames2;
      }
    })();
  })(classnames);
  var classnamesExports = classnames.exports;
  const classNames = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var t2 = arguments[e2];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
      }
      return n2;
    }, _extends.apply(null, arguments);
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  var REACT_ELEMENT_TYPE_18 = Symbol.for("react.element");
  var REACT_ELEMENT_TYPE_19 = Symbol.for("react.transitional.element");
  var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
  function isFragment$1(object) {
    return (
      // Base object type
      object && _typeof(object) === "object" && // React Element type
      (object.$$typeof === REACT_ELEMENT_TYPE_18 || object.$$typeof === REACT_ELEMENT_TYPE_19) && // React Fragment type
      object.type === REACT_FRAGMENT_TYPE
    );
  }
  var warned = {};
  var preMessage = function preMessage2(fn) {
  };
  function warning$1(valid, message) {
  }
  function note(valid, message) {
  }
  function resetWarned() {
    warned = {};
  }
  function call(method, valid, message) {
    if (!valid && !warned[message]) {
      method(false, message);
      warned[message] = true;
    }
  }
  function warningOnce(valid, message) {
    call(warning$1, valid, message);
  }
  function noteOnce(valid, message) {
    call(note, valid, message);
  }
  warningOnce.preMessage = preMessage;
  warningOnce.resetWarned = resetWarned;
  warningOnce.noteOnce = noteOnce;
  function toPrimitive(t2, r2) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i = e2.call(t2, r2);
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i = toPrimitive(t2, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  function _defineProperty(e2, r2, t2) {
    return (r2 = toPropertyKey(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function ownKeys(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e2);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
      })), t2.push.apply(t2, o);
    }
    return t2;
  }
  function _objectSpread2(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
        _defineProperty(e2, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e2;
  }
  function isDOM(node2) {
    return node2 instanceof HTMLElement || node2 instanceof SVGElement;
  }
  function getDOM(node2) {
    if (node2 && _typeof(node2) === "object" && isDOM(node2.nativeElement)) {
      return node2.nativeElement;
    }
    if (isDOM(node2)) {
      return node2;
    }
    return null;
  }
  function findDOMNode(node2) {
    var domNode = getDOM(node2);
    if (domNode) {
      return domNode;
    }
    if (node2 instanceof React.Component) {
      var _ReactDOM$findDOMNode;
      return (_ReactDOM$findDOMNode = ReactDOM.findDOMNode) === null || _ReactDOM$findDOMNode === void 0 ? void 0 : _ReactDOM$findDOMNode.call(ReactDOM, node2);
    }
    return null;
  }
  var reactIs = { exports: {} };
  var reactIs_production_min = {};
  /**
   * @license React
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = Symbol.for("react.element"), c = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), h = Symbol.for("react.context"), k = Symbol.for("react.server_context"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), t = Symbol.for("react.offscreen"), u;
  u = Symbol.for("react.module.reference");
  function v(a) {
    if ("object" === typeof a && null !== a) {
      var r2 = a.$$typeof;
      switch (r2) {
        case b:
          switch (a = a.type, a) {
            case d:
            case f:
            case e:
            case m:
            case n:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case h:
                case l:
                case q:
                case p:
                case g:
                  return a;
                default:
                  return r2;
              }
          }
        case c:
          return r2;
      }
    }
  }
  reactIs_production_min.ContextConsumer = h;
  reactIs_production_min.ContextProvider = g;
  reactIs_production_min.Element = b;
  reactIs_production_min.ForwardRef = l;
  reactIs_production_min.Fragment = d;
  reactIs_production_min.Lazy = q;
  reactIs_production_min.Memo = p;
  reactIs_production_min.Portal = c;
  reactIs_production_min.Profiler = f;
  reactIs_production_min.StrictMode = e;
  reactIs_production_min.Suspense = m;
  reactIs_production_min.SuspenseList = n;
  reactIs_production_min.isAsyncMode = function() {
    return false;
  };
  reactIs_production_min.isConcurrentMode = function() {
    return false;
  };
  reactIs_production_min.isContextConsumer = function(a) {
    return v(a) === h;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return v(a) === g;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === b;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return v(a) === l;
  };
  reactIs_production_min.isFragment = function(a) {
    return v(a) === d;
  };
  reactIs_production_min.isLazy = function(a) {
    return v(a) === q;
  };
  reactIs_production_min.isMemo = function(a) {
    return v(a) === p;
  };
  reactIs_production_min.isPortal = function(a) {
    return v(a) === c;
  };
  reactIs_production_min.isProfiler = function(a) {
    return v(a) === f;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return v(a) === e;
  };
  reactIs_production_min.isSuspense = function(a) {
    return v(a) === m;
  };
  reactIs_production_min.isSuspenseList = function(a) {
    return v(a) === n;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === d || a === f || a === e || a === m || a === n || a === t || "object" === typeof a && null !== a && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || void 0 !== a.getModuleId) ? true : false;
  };
  reactIs_production_min.typeOf = v;
  {
    reactIs.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs.exports;
  function useMemo(getValue2, condition, shouldUpdate) {
    var cacheRef = reactExports.useRef({});
    if (!("value" in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
      cacheRef.current.value = getValue2();
      cacheRef.current.condition = condition;
    }
    return cacheRef.current.value;
  }
  var ReactMajorVersion = Number(reactExports.version.split(".")[0]);
  var fillRef = function fillRef2(ref, node2) {
    if (typeof ref === "function") {
      ref(node2);
    } else if (_typeof(ref) === "object" && ref && "current" in ref) {
      ref.current = node2;
    }
  };
  var composeRef = function composeRef2() {
    for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
      refs[_key] = arguments[_key];
    }
    var refList = refs.filter(Boolean);
    if (refList.length <= 1) {
      return refList[0];
    }
    return function(node2) {
      refs.forEach(function(ref) {
        fillRef(ref, node2);
      });
    };
  };
  var useComposeRef = function useComposeRef2() {
    for (var _len2 = arguments.length, refs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      refs[_key2] = arguments[_key2];
    }
    return useMemo(function() {
      return composeRef.apply(void 0, refs);
    }, refs, function(prev2, next2) {
      return prev2.length !== next2.length || prev2.every(function(ref, i) {
        return ref !== next2[i];
      });
    });
  };
  var supportRef = function supportRef2(nodeOrComponent) {
    var _type$prototype, _nodeOrComponent$prot;
    if (!nodeOrComponent) {
      return false;
    }
    if (isReactElement(nodeOrComponent) && ReactMajorVersion >= 19) {
      return true;
    }
    var type = reactIsExports.isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;
    if (typeof type === "function" && !((_type$prototype = type.prototype) !== null && _type$prototype !== void 0 && _type$prototype.render) && type.$$typeof !== reactIsExports.ForwardRef) {
      return false;
    }
    if (typeof nodeOrComponent === "function" && !((_nodeOrComponent$prot = nodeOrComponent.prototype) !== null && _nodeOrComponent$prot !== void 0 && _nodeOrComponent$prot.render) && nodeOrComponent.$$typeof !== reactIsExports.ForwardRef) {
      return false;
    }
    return true;
  };
  function isReactElement(node2) {
    return /* @__PURE__ */ reactExports.isValidElement(node2) && !isFragment$1(node2);
  }
  var getNodeRef = function getNodeRef2(node2) {
    if (node2 && isReactElement(node2)) {
      var ele = node2;
      return ele.props.propertyIsEnumerable("ref") ? ele.props.ref : ele.ref;
    }
    return null;
  };
  function _classCallCheck(a, n2) {
    if (!(a instanceof n2)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e2, r2) {
    for (var t2 = 0; t2 < r2.length; t2++) {
      var o = r2[t2];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e2, toPropertyKey(o.key), o);
    }
  }
  function _createClass(e2, r2, t2) {
    return r2 && _defineProperties(e2.prototype, r2), t2 && _defineProperties(e2, t2), Object.defineProperty(e2, "prototype", {
      writable: false
    }), e2;
  }
  function _setPrototypeOf(t2, e2) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
      return t3.__proto__ = e3, t3;
    }, _setPrototypeOf(t2, e2);
  }
  function _inherits(t2, e2) {
    if ("function" != typeof e2 && null !== e2) throw new TypeError("Super expression must either be null or a function");
    t2.prototype = Object.create(e2 && e2.prototype, {
      constructor: {
        value: t2,
        writable: true,
        configurable: true
      }
    }), Object.defineProperty(t2, "prototype", {
      writable: false
    }), e2 && _setPrototypeOf(t2, e2);
  }
  function _getPrototypeOf(t2) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
      return t3.__proto__ || Object.getPrototypeOf(t3);
    }, _getPrototypeOf(t2);
  }
  function _isNativeReflectConstruct() {
    try {
      var t2 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t3) {
    }
    return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
      return !!t2;
    })();
  }
  function _assertThisInitialized(e2) {
    if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e2;
  }
  function _possibleConstructorReturn(t2, e2) {
    if (e2 && ("object" == _typeof(e2) || "function" == typeof e2)) return e2;
    if (void 0 !== e2) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t2);
  }
  function _createSuper(t2) {
    var r2 = _isNativeReflectConstruct();
    return function() {
      var e2, o = _getPrototypeOf(t2);
      if (r2) {
        var s = _getPrototypeOf(this).constructor;
        e2 = Reflect.construct(o, arguments, s);
      } else e2 = o.apply(this, arguments);
      return _possibleConstructorReturn(this, e2);
    };
  }
  function _arrayLikeToArray(r2, a) {
    (null == a || a > r2.length) && (a = r2.length);
    for (var e2 = 0, n2 = Array(a); e2 < a; e2++) n2[e2] = r2[e2];
    return n2;
  }
  function _arrayWithoutHoles(r2) {
    if (Array.isArray(r2)) return _arrayLikeToArray(r2);
  }
  function _iterableToArray(r2) {
    if ("undefined" != typeof Symbol && null != r2[Symbol.iterator] || null != r2["@@iterator"]) return Array.from(r2);
  }
  function _unsupportedIterableToArray(r2, a) {
    if (r2) {
      if ("string" == typeof r2) return _arrayLikeToArray(r2, a);
      var t2 = {}.toString.call(r2).slice(8, -1);
      return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a) : void 0;
    }
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toConsumableArray(r2) {
    return _arrayWithoutHoles(r2) || _iterableToArray(r2) || _unsupportedIterableToArray(r2) || _nonIterableSpread();
  }
  var raf = function raf2(callback) {
    return +setTimeout(callback, 16);
  };
  var caf = function caf2(num) {
    return clearTimeout(num);
  };
  if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
    raf = function raf3(callback) {
      return window.requestAnimationFrame(callback);
    };
    caf = function caf3(handle) {
      return window.cancelAnimationFrame(handle);
    };
  }
  var rafUUID = 0;
  var rafIds = /* @__PURE__ */ new Map();
  function cleanup(id2) {
    rafIds.delete(id2);
  }
  var wrapperRaf = function wrapperRaf2(callback) {
    var times = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    rafUUID += 1;
    var id2 = rafUUID;
    function callRef(leftTimes) {
      if (leftTimes === 0) {
        cleanup(id2);
        callback();
      } else {
        var realId = raf(function() {
          callRef(leftTimes - 1);
        });
        rafIds.set(id2, realId);
      }
    }
    callRef(times);
    return id2;
  };
  wrapperRaf.cancel = function(id2) {
    var realId = rafIds.get(id2);
    cleanup(id2);
    return caf(realId);
  };
  function _arrayWithHoles(r2) {
    if (Array.isArray(r2)) return r2;
  }
  function _iterableToArrayLimit(r2, l2) {
    var t2 = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t2) {
      var e2, n2, i, u2, a = [], f2 = true, o = false;
      try {
        if (i = (t2 = t2.call(r2)).next, 0 === l2) {
          if (Object(t2) !== t2) return;
          f2 = false;
        } else for (; !(f2 = (e2 = i.call(t2)).done) && (a.push(e2.value), a.length !== l2); f2 = true) ;
      } catch (r3) {
        o = true, n2 = r3;
      } finally {
        try {
          if (!f2 && null != t2["return"] && (u2 = t2["return"](), Object(u2) !== u2)) return;
        } finally {
          if (o) throw n2;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r2, e2) {
    return _arrayWithHoles(r2) || _iterableToArrayLimit(r2, e2) || _unsupportedIterableToArray(r2, e2) || _nonIterableRest();
  }
  function murmur2(str) {
    var h2 = 0;
    var k2, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k2 = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= /* k >>> r: */
      k2 >>> 24;
      h2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i) & 255;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = /* Math.imul(h, m): */
    (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  function canUseDom() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }
  function contains(root, n2) {
    if (!root) {
      return false;
    }
    if (root.contains) {
      return root.contains(n2);
    }
    var node2 = n2;
    while (node2) {
      if (node2 === root) {
        return true;
      }
      node2 = node2.parentNode;
    }
    return false;
  }
  var APPEND_ORDER = "data-rc-order";
  var APPEND_PRIORITY = "data-rc-priority";
  var MARK_KEY = "rc-util-key";
  var containerCache = /* @__PURE__ */ new Map();
  function getMark() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
    if (mark) {
      return mark.startsWith("data-") ? mark : "data-".concat(mark);
    }
    return MARK_KEY;
  }
  function getContainer(option) {
    if (option.attachTo) {
      return option.attachTo;
    }
    var head = document.querySelector("head");
    return head || document.body;
  }
  function getOrder(prepend) {
    if (prepend === "queue") {
      return "prependQueue";
    }
    return prepend ? "prepend" : "append";
  }
  function findStyles(container) {
    return Array.from((containerCache.get(container) || container).children).filter(function(node2) {
      return node2.tagName === "STYLE";
    });
  }
  function injectCSS(css) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!canUseDom()) {
      return null;
    }
    var csp = option.csp, prepend = option.prepend, _option$priority = option.priority, priority = _option$priority === void 0 ? 0 : _option$priority;
    var mergedOrder = getOrder(prepend);
    var isPrependQueue = mergedOrder === "prependQueue";
    var styleNode = document.createElement("style");
    styleNode.setAttribute(APPEND_ORDER, mergedOrder);
    if (isPrependQueue && priority) {
      styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
    }
    if (csp !== null && csp !== void 0 && csp.nonce) {
      styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
    }
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
      if (isPrependQueue) {
        var existStyle = (option.styles || findStyles(container)).filter(function(node2) {
          if (!["prepend", "prependQueue"].includes(node2.getAttribute(APPEND_ORDER))) {
            return false;
          }
          var nodePriority = Number(node2.getAttribute(APPEND_PRIORITY) || 0);
          return priority >= nodePriority;
        });
        if (existStyle.length) {
          container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
          return styleNode;
        }
      }
      container.insertBefore(styleNode, firstChild);
    } else {
      container.appendChild(styleNode);
    }
    return styleNode;
  }
  function findExistNode(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var container = getContainer(option);
    return (option.styles || findStyles(container)).find(function(node2) {
      return node2.getAttribute(getMark(option)) === key;
    });
  }
  function removeCSS(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var existNode = findExistNode(key, option);
    if (existNode) {
      var container = getContainer(option);
      container.removeChild(existNode);
    }
  }
  function syncRealContainer(container, option) {
    var cachedRealContainer = containerCache.get(container);
    if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
      var placeholderStyle = injectCSS("", option);
      var parentNode = placeholderStyle.parentNode;
      containerCache.set(container, parentNode);
      container.removeChild(placeholderStyle);
    }
  }
  function updateCSS(css, key) {
    var originOption = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var container = getContainer(originOption);
    var styles = findStyles(container);
    var option = _objectSpread2(_objectSpread2({}, originOption), {}, {
      styles
    });
    syncRealContainer(container, option);
    var existNode = findExistNode(key, option);
    if (existNode) {
      var _option$csp, _option$csp2;
      if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
        var _option$csp3;
        existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
      }
      if (existNode.innerHTML !== css) {
        existNode.innerHTML = css;
      }
      return existNode;
    }
    var newNode = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
  }
  function _objectWithoutPropertiesLoose(r2, e2) {
    if (null == r2) return {};
    var t2 = {};
    for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
      if (-1 !== e2.indexOf(n2)) continue;
      t2[n2] = r2[n2];
    }
    return t2;
  }
  function _objectWithoutProperties(e2, t2) {
    if (null == e2) return {};
    var o, r2, i = _objectWithoutPropertiesLoose(e2, t2);
    if (Object.getOwnPropertySymbols) {
      var n2 = Object.getOwnPropertySymbols(e2);
      for (r2 = 0; r2 < n2.length; r2++) o = n2[r2], -1 === t2.indexOf(o) && {}.propertyIsEnumerable.call(e2, o) && (i[o] = e2[o]);
    }
    return i;
  }
  var SPLIT = "%";
  function pathKey(keys) {
    return keys.join(SPLIT);
  }
  var Entity = /* @__PURE__ */ function() {
    function Entity2(instanceId) {
      _classCallCheck(this, Entity2);
      _defineProperty(this, "instanceId", void 0);
      _defineProperty(this, "cache", /* @__PURE__ */ new Map());
      _defineProperty(this, "extracted", /* @__PURE__ */ new Set());
      this.instanceId = instanceId;
    }
    _createClass(Entity2, [{
      key: "get",
      value: function get(keys) {
        return this.opGet(pathKey(keys));
      }
      /** A fast get cache with `get` concat. */
    }, {
      key: "opGet",
      value: function opGet(keyPathStr) {
        return this.cache.get(keyPathStr) || null;
      }
    }, {
      key: "update",
      value: function update(keys, valueFn) {
        return this.opUpdate(pathKey(keys), valueFn);
      }
      /** A fast get cache with `get` concat. */
    }, {
      key: "opUpdate",
      value: function opUpdate(keyPathStr, valueFn) {
        var prevValue = this.cache.get(keyPathStr);
        var nextValue = valueFn(prevValue);
        if (nextValue === null) {
          this.cache.delete(keyPathStr);
        } else {
          this.cache.set(keyPathStr, nextValue);
        }
      }
    }]);
    return Entity2;
  }();
  var ATTR_TOKEN = "data-token-hash";
  var ATTR_MARK = "data-css-hash";
  var CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
  function createCache() {
    var cssinjsInstanceId = Math.random().toString(12).slice(2);
    if (typeof document !== "undefined" && document.head && document.body) {
      var styles = document.body.querySelectorAll("style[".concat(ATTR_MARK, "]")) || [];
      var firstChild = document.head.firstChild;
      Array.from(styles).forEach(function(style2) {
        style2[CSS_IN_JS_INSTANCE] = style2[CSS_IN_JS_INSTANCE] || cssinjsInstanceId;
        if (style2[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
          document.head.insertBefore(style2, firstChild);
        }
      });
      var styleHash = {};
      Array.from(document.querySelectorAll("style[".concat(ATTR_MARK, "]"))).forEach(function(style2) {
        var hash = style2.getAttribute(ATTR_MARK);
        if (styleHash[hash]) {
          if (style2[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
            var _style$parentNode;
            (_style$parentNode = style2.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style2);
          }
        } else {
          styleHash[hash] = true;
        }
      });
    }
    return new Entity(cssinjsInstanceId);
  }
  var StyleContext = /* @__PURE__ */ reactExports.createContext({
    hashPriority: "low",
    cache: createCache(),
    defaultCache: true
  });
  function sameDerivativeOption(left, right) {
    if (left.length !== right.length) {
      return false;
    }
    for (var i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) {
        return false;
      }
    }
    return true;
  }
  var ThemeCache = /* @__PURE__ */ function() {
    function ThemeCache2() {
      _classCallCheck(this, ThemeCache2);
      _defineProperty(this, "cache", void 0);
      _defineProperty(this, "keys", void 0);
      _defineProperty(this, "cacheCallTimes", void 0);
      this.cache = /* @__PURE__ */ new Map();
      this.keys = [];
      this.cacheCallTimes = 0;
    }
    _createClass(ThemeCache2, [{
      key: "size",
      value: function size() {
        return this.keys.length;
      }
    }, {
      key: "internalGet",
      value: function internalGet(derivativeOption) {
        var _cache2, _cache3;
        var updateCallTimes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var cache = {
          map: this.cache
        };
        derivativeOption.forEach(function(derivative2) {
          if (!cache) {
            cache = void 0;
          } else {
            var _cache;
            cache = (_cache = cache) === null || _cache === void 0 || (_cache = _cache.map) === null || _cache === void 0 ? void 0 : _cache.get(derivative2);
          }
        });
        if ((_cache2 = cache) !== null && _cache2 !== void 0 && _cache2.value && updateCallTimes) {
          cache.value[1] = this.cacheCallTimes++;
        }
        return (_cache3 = cache) === null || _cache3 === void 0 ? void 0 : _cache3.value;
      }
    }, {
      key: "get",
      value: function get(derivativeOption) {
        var _this$internalGet;
        return (_this$internalGet = this.internalGet(derivativeOption, true)) === null || _this$internalGet === void 0 ? void 0 : _this$internalGet[0];
      }
    }, {
      key: "has",
      value: function has(derivativeOption) {
        return !!this.internalGet(derivativeOption);
      }
    }, {
      key: "set",
      value: function set(derivativeOption, value) {
        var _this = this;
        if (!this.has(derivativeOption)) {
          if (this.size() + 1 > ThemeCache2.MAX_CACHE_SIZE + ThemeCache2.MAX_CACHE_OFFSET) {
            var _this$keys$reduce = this.keys.reduce(function(result, key) {
              var _result = _slicedToArray(result, 2), callTimes = _result[1];
              if (_this.internalGet(key)[1] < callTimes) {
                return [key, _this.internalGet(key)[1]];
              }
              return result;
            }, [this.keys[0], this.cacheCallTimes]), _this$keys$reduce2 = _slicedToArray(_this$keys$reduce, 1), targetKey = _this$keys$reduce2[0];
            this.delete(targetKey);
          }
          this.keys.push(derivativeOption);
        }
        var cache = this.cache;
        derivativeOption.forEach(function(derivative2, index) {
          if (index === derivativeOption.length - 1) {
            cache.set(derivative2, {
              value: [value, _this.cacheCallTimes++]
            });
          } else {
            var cacheValue = cache.get(derivative2);
            if (!cacheValue) {
              cache.set(derivative2, {
                map: /* @__PURE__ */ new Map()
              });
            } else if (!cacheValue.map) {
              cacheValue.map = /* @__PURE__ */ new Map();
            }
            cache = cache.get(derivative2).map;
          }
        });
      }
    }, {
      key: "deleteByPath",
      value: function deleteByPath(currentCache, derivatives) {
        var cache = currentCache.get(derivatives[0]);
        if (derivatives.length === 1) {
          var _cache$value;
          if (!cache.map) {
            currentCache.delete(derivatives[0]);
          } else {
            currentCache.set(derivatives[0], {
              map: cache.map
            });
          }
          return (_cache$value = cache.value) === null || _cache$value === void 0 ? void 0 : _cache$value[0];
        }
        var result = this.deleteByPath(cache.map, derivatives.slice(1));
        if ((!cache.map || cache.map.size === 0) && !cache.value) {
          currentCache.delete(derivatives[0]);
        }
        return result;
      }
    }, {
      key: "delete",
      value: function _delete(derivativeOption) {
        if (this.has(derivativeOption)) {
          this.keys = this.keys.filter(function(item) {
            return !sameDerivativeOption(item, derivativeOption);
          });
          return this.deleteByPath(this.cache, derivativeOption);
        }
        return void 0;
      }
    }]);
    return ThemeCache2;
  }();
  _defineProperty(ThemeCache, "MAX_CACHE_SIZE", 20);
  _defineProperty(ThemeCache, "MAX_CACHE_OFFSET", 5);
  var uuid = 0;
  var Theme = /* @__PURE__ */ function() {
    function Theme2(derivatives) {
      _classCallCheck(this, Theme2);
      _defineProperty(this, "derivatives", void 0);
      _defineProperty(this, "id", void 0);
      this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
      this.id = uuid;
      if (derivatives.length === 0) {
        warning$1(derivatives.length > 0);
      }
      uuid += 1;
    }
    _createClass(Theme2, [{
      key: "getDerivativeToken",
      value: function getDerivativeToken(token2) {
        return this.derivatives.reduce(function(result, derivative2) {
          return derivative2(token2, result);
        }, void 0);
      }
    }]);
    return Theme2;
  }();
  var cacheThemes = new ThemeCache();
  function createTheme(derivatives) {
    var derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
    if (!cacheThemes.has(derivativeArr)) {
      cacheThemes.set(derivativeArr, new Theme(derivativeArr));
    }
    return cacheThemes.get(derivativeArr);
  }
  var resultCache = /* @__PURE__ */ new WeakMap();
  var RESULT_VALUE = {};
  function memoResult(callback, deps) {
    var current = resultCache;
    for (var i = 0; i < deps.length; i += 1) {
      var dep = deps[i];
      if (!current.has(dep)) {
        current.set(dep, /* @__PURE__ */ new WeakMap());
      }
      current = current.get(dep);
    }
    if (!current.has(RESULT_VALUE)) {
      current.set(RESULT_VALUE, callback());
    }
    return current.get(RESULT_VALUE);
  }
  var flattenTokenCache = /* @__PURE__ */ new WeakMap();
  function flattenToken(token2) {
    var str = flattenTokenCache.get(token2) || "";
    if (!str) {
      Object.keys(token2).forEach(function(key) {
        var value = token2[key];
        str += key;
        if (value instanceof Theme) {
          str += value.id;
        } else if (value && _typeof(value) === "object") {
          str += flattenToken(value);
        } else {
          str += value;
        }
      });
      str = murmur2(str);
      flattenTokenCache.set(token2, str);
    }
    return str;
  }
  function token2key(token2, salt) {
    return murmur2("".concat(salt, "_").concat(flattenToken(token2)));
  }
  var isClientSide = canUseDom();
  function unit$1(num) {
    if (typeof num === "number") {
      return "".concat(num, "px");
    }
    return num;
  }
  function toStyleStr(style2, tokenKey, styleId) {
    var customizeAttrs = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var plain = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
    if (plain) {
      return style2;
    }
    var attrs = _objectSpread2(_objectSpread2({}, customizeAttrs), {}, _defineProperty(_defineProperty({}, ATTR_TOKEN, tokenKey), ATTR_MARK, styleId));
    var attrStr = Object.keys(attrs).map(function(attr) {
      var val = attrs[attr];
      return val ? "".concat(attr, '="').concat(val, '"') : null;
    }).filter(function(v2) {
      return v2;
    }).join(" ");
    return "<style ".concat(attrStr, ">").concat(style2, "</style>");
  }
  var token2CSSVar = function token2CSSVar2(token2) {
    var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return "--".concat(prefix ? "".concat(prefix, "-") : "").concat(token2).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2").replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
  };
  var serializeCSSVar = function serializeCSSVar2(cssVars, hashId, options) {
    if (!Object.keys(cssVars).length) {
      return "";
    }
    return ".".concat(hashId).concat(options !== null && options !== void 0 && options.scope ? ".".concat(options.scope) : "", "{").concat(Object.entries(cssVars).map(function(_ref) {
      var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
      return "".concat(key, ":").concat(value, ";");
    }).join(""), "}");
  };
  var transformToken = function transformToken2(token2, themeKey, config) {
    var cssVars = {};
    var result = {};
    Object.entries(token2).forEach(function(_ref3) {
      var _config$preserve, _config$ignore;
      var _ref4 = _slicedToArray(_ref3, 2), key = _ref4[0], value = _ref4[1];
      if (config !== null && config !== void 0 && (_config$preserve = config.preserve) !== null && _config$preserve !== void 0 && _config$preserve[key]) {
        result[key] = value;
      } else if ((typeof value === "string" || typeof value === "number") && !(config !== null && config !== void 0 && (_config$ignore = config.ignore) !== null && _config$ignore !== void 0 && _config$ignore[key])) {
        var _config$unitless;
        var cssVar = token2CSSVar(key, config === null || config === void 0 ? void 0 : config.prefix);
        cssVars[cssVar] = typeof value === "number" && !(config !== null && config !== void 0 && (_config$unitless = config.unitless) !== null && _config$unitless !== void 0 && _config$unitless[key]) ? "".concat(value, "px") : String(value);
        result[key] = "var(".concat(cssVar, ")");
      }
    });
    return [result, serializeCSSVar(cssVars, themeKey, {
      scope: config === null || config === void 0 ? void 0 : config.scope
    })];
  };
  var useInternalLayoutEffect = canUseDom() ? reactExports.useLayoutEffect : reactExports.useEffect;
  var useLayoutEffect = function useLayoutEffect2(callback, deps) {
    var firstMountRef = reactExports.useRef(true);
    useInternalLayoutEffect(function() {
      return callback(firstMountRef.current);
    }, deps);
    useInternalLayoutEffect(function() {
      firstMountRef.current = false;
      return function() {
        firstMountRef.current = true;
      };
    }, []);
  };
  var fullClone$2 = _objectSpread2({}, React$1);
  var useInsertionEffect$1 = fullClone$2.useInsertionEffect;
  var useInsertionEffectPolyfill = function useInsertionEffectPolyfill2(renderEffect, effect, deps) {
    reactExports.useMemo(renderEffect, deps);
    useLayoutEffect(function() {
      return effect(true);
    }, deps);
  };
  var useCompatibleInsertionEffect = useInsertionEffect$1 ? function(renderEffect, effect, deps) {
    return useInsertionEffect$1(function() {
      renderEffect();
      return effect();
    }, deps);
  } : useInsertionEffectPolyfill;
  var fullClone$1 = _objectSpread2({}, React$1);
  var useInsertionEffect = fullClone$1.useInsertionEffect;
  var useCleanupRegister = function useCleanupRegister2(deps) {
    var effectCleanups = [];
    var cleanupFlag = false;
    function register(fn) {
      if (cleanupFlag) {
        return;
      }
      effectCleanups.push(fn);
    }
    reactExports.useEffect(function() {
      cleanupFlag = false;
      return function() {
        cleanupFlag = true;
        if (effectCleanups.length) {
          effectCleanups.forEach(function(fn) {
            return fn();
          });
        }
      };
    }, deps);
    return register;
  };
  var useRun = function useRun2() {
    return function(fn) {
      fn();
    };
  };
  var useEffectCleanupRegister = typeof useInsertionEffect !== "undefined" ? useCleanupRegister : useRun;
  function useGlobalCache(prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect) {
    var _React$useContext = reactExports.useContext(StyleContext), globalCache = _React$useContext.cache;
    var fullPath = [prefix].concat(_toConsumableArray(keyPath));
    var fullPathStr = pathKey(fullPath);
    var register = useEffectCleanupRegister([fullPathStr]);
    var buildCache = function buildCache2(updater) {
      globalCache.opUpdate(fullPathStr, function(prevCache) {
        var _ref = prevCache || [void 0, void 0], _ref2 = _slicedToArray(_ref, 2), _ref2$ = _ref2[0], times = _ref2$ === void 0 ? 0 : _ref2$, cache = _ref2[1];
        var tmpCache = cache;
        var mergedCache = tmpCache || cacheFn();
        var data = [times, mergedCache];
        return updater ? updater(data) : data;
      });
    };
    reactExports.useMemo(
      function() {
        buildCache();
      },
      /* eslint-disable react-hooks/exhaustive-deps */
      [fullPathStr]
      /* eslint-enable */
    );
    var cacheEntity = globalCache.opGet(fullPathStr);
    var cacheContent = cacheEntity[1];
    useCompatibleInsertionEffect(function() {
      onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
    }, function(polyfill) {
      buildCache(function(_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2), times = _ref4[0], cache = _ref4[1];
        if (polyfill && times === 0) {
          onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
        }
        return [times + 1, cache];
      });
      return function() {
        globalCache.opUpdate(fullPathStr, function(prevCache) {
          var _ref5 = prevCache || [], _ref6 = _slicedToArray(_ref5, 2), _ref6$ = _ref6[0], times = _ref6$ === void 0 ? 0 : _ref6$, cache = _ref6[1];
          var nextCount = times - 1;
          if (nextCount === 0) {
            register(function() {
              if (polyfill || !globalCache.opGet(fullPathStr)) {
                onCacheRemove === null || onCacheRemove === void 0 || onCacheRemove(cache, false);
              }
            });
            return null;
          }
          return [times - 1, cache];
        });
      };
    }, [fullPathStr]);
    return cacheContent;
  }
  var EMPTY_OVERRIDE = {};
  var hashPrefix = "css";
  var tokenKeys = /* @__PURE__ */ new Map();
  function recordCleanToken(tokenKey) {
    tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
  }
  function removeStyleTags(key, instanceId) {
    if (typeof document !== "undefined") {
      var styles = document.querySelectorAll("style[".concat(ATTR_TOKEN, '="').concat(key, '"]'));
      styles.forEach(function(style2) {
        if (style2[CSS_IN_JS_INSTANCE] === instanceId) {
          var _style$parentNode;
          (_style$parentNode = style2.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style2);
        }
      });
    }
  }
  var TOKEN_THRESHOLD = 0;
  function cleanTokenStyle(tokenKey, instanceId) {
    tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
    var cleanableKeyList = /* @__PURE__ */ new Set();
    tokenKeys.forEach(function(value, key) {
      if (value <= 0) cleanableKeyList.add(key);
    });
    if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) {
      cleanableKeyList.forEach(function(key) {
        removeStyleTags(key, instanceId);
        tokenKeys.delete(key);
      });
    }
  }
  var getComputedToken$1 = function getComputedToken2(originToken, overrideToken, theme, format) {
    var derivativeToken = theme.getDerivativeToken(originToken);
    var mergedDerivativeToken = _objectSpread2(_objectSpread2({}, derivativeToken), overrideToken);
    if (format) {
      mergedDerivativeToken = format(mergedDerivativeToken);
    }
    return mergedDerivativeToken;
  };
  var TOKEN_PREFIX = "token";
  function useCacheToken(theme, tokens) {
    var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var _useContext = reactExports.useContext(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
    var _option$salt = option.salt, salt = _option$salt === void 0 ? "" : _option$salt, _option$override = option.override, override = _option$override === void 0 ? EMPTY_OVERRIDE : _option$override, formatToken2 = option.formatToken, compute = option.getComputedToken, cssVar = option.cssVar;
    var mergedToken = memoResult(function() {
      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(tokens)));
    }, tokens);
    var tokenStr = flattenToken(mergedToken);
    var overrideTokenStr = flattenToken(override);
    var cssVarStr = cssVar ? flattenToken(cssVar) : "";
    var cachedToken = useGlobalCache(TOKEN_PREFIX, [salt, theme.id, tokenStr, overrideTokenStr, cssVarStr], function() {
      var _cssVar$key;
      var mergedDerivativeToken = compute ? compute(mergedToken, override, theme) : getComputedToken$1(mergedToken, override, theme, formatToken2);
      var actualToken = _objectSpread2({}, mergedDerivativeToken);
      var cssVarsStr = "";
      if (!!cssVar) {
        var _transformToken = transformToken(mergedDerivativeToken, cssVar.key, {
          prefix: cssVar.prefix,
          ignore: cssVar.ignore,
          unitless: cssVar.unitless,
          preserve: cssVar.preserve
        });
        var _transformToken2 = _slicedToArray(_transformToken, 2);
        mergedDerivativeToken = _transformToken2[0];
        cssVarsStr = _transformToken2[1];
      }
      var tokenKey = token2key(mergedDerivativeToken, salt);
      mergedDerivativeToken._tokenKey = tokenKey;
      actualToken._tokenKey = token2key(actualToken, salt);
      var themeKey = (_cssVar$key = cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) !== null && _cssVar$key !== void 0 ? _cssVar$key : tokenKey;
      mergedDerivativeToken._themeKey = themeKey;
      recordCleanToken(themeKey);
      var hashId = "".concat(hashPrefix, "-").concat(murmur2(tokenKey));
      mergedDerivativeToken._hashId = hashId;
      return [mergedDerivativeToken, hashId, actualToken, cssVarsStr, (cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) || ""];
    }, function(cache) {
      cleanTokenStyle(cache[0]._themeKey, instanceId);
    }, function(_ref) {
      var _ref2 = _slicedToArray(_ref, 4), token2 = _ref2[0], cssVarsStr = _ref2[3];
      if (cssVar && cssVarsStr) {
        var style2 = updateCSS(cssVarsStr, murmur2("css-variables-".concat(token2._themeKey)), {
          mark: ATTR_MARK,
          prepend: "queue",
          attachTo: container,
          priority: -999
        });
        style2[CSS_IN_JS_INSTANCE] = instanceId;
        style2.setAttribute(ATTR_TOKEN, token2._themeKey);
      }
    });
    return cachedToken;
  }
  var extract$2 = function extract2(cache, effectStyles, options) {
    var _cache = _slicedToArray(cache, 5), realToken = _cache[2], styleStr = _cache[3], cssVarKey = _cache[4];
    var _ref3 = options || {}, plain = _ref3.plain;
    if (!styleStr) {
      return null;
    }
    var styleId = realToken._tokenKey;
    var order = -999;
    var sharedAttrs = {
      "data-rc-order": "prependQueue",
      "data-rc-priority": "".concat(order)
    };
    var styleText = toStyleStr(styleStr, cssVarKey, styleId, sharedAttrs, plain);
    return [order, styleId, styleText];
  };
  var unitlessKeys = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var COMMENT = "comm";
  var RULESET = "rule";
  var DECLARATION = "decl";
  var IMPORT = "@import";
  var NAMESPACE = "@namespace";
  var KEYFRAMES = "@keyframes";
  var LAYER = "@layer";
  var abs = Math.abs;
  var from = String.fromCharCode;
  function trim(value) {
    return value.trim();
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search, position2) {
    return value.indexOf(search, position2);
  }
  function charat(value, index) {
    return value.charCodeAt(index) | 0;
  }
  function substr(value, begin, end) {
    return value.slice(begin, end);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position = 0;
  var character = 0;
  var characters = "";
  function node(value, root, parent, type, props, children, length2, siblings) {
    return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end) {
    return substr(characters, begin, end);
  }
  function token(type) {
    switch (type) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index, count) {
    while (--count && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position;
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index) {
    while (!token(peek()))
      next();
    return slice(index, position);
  }
  function compile(value) {
    return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1)
              ampersand = -1;
            break;
          }
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        case 47:
          switch (peek()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
              if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters2) && substr(characters2, -1, void 0) !== " ") characters2 += " ";
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && (strlen(characters2) - length2 || variable === 0 && previous === 47))
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
                else {
                  switch (atrule) {
                    case 99:
                      if (charat(characters2, 3) === 110) break;
                    case 108:
                      if (charat(characters2, 2) === 97) break;
                    default:
                      offset = 0;
                    case 100:
                    case 109:
                    case 115:
                  }
                  if (offset) parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                  else parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
          }
          index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2, siblings) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k2 = 0; i < index; ++i)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x2 < size; ++x2)
        if (z2 = trim(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
  }
  function comment(value, root, parent, siblings) {
    return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
  }
  function declaration(value, root, parent, length2, siblings) {
    return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
  }
  function serialize(children, callback) {
    var output = "";
    for (var i = 0; i < children.length; i++)
      output += callback(children[i], i, children, callback) || "";
    return output;
  }
  function stringify(element, index, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length) break;
      case IMPORT:
      case NAMESPACE:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        if (!strlen(element.value = element.props.join(","))) return "";
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  var ATTR_CACHE_MAP = "data-ant-cssinjs-cache-path";
  var CSS_FILE_STYLE = "_FILE_STYLE__";
  var cachePathMap;
  var fromCSSFile = true;
  function prepare() {
    if (!cachePathMap) {
      cachePathMap = {};
      if (canUseDom()) {
        var div = document.createElement("div");
        div.className = ATTR_CACHE_MAP;
        div.style.position = "fixed";
        div.style.visibility = "hidden";
        div.style.top = "-9999px";
        document.body.appendChild(div);
        var content = getComputedStyle(div).content || "";
        content = content.replace(/^"/, "").replace(/"$/, "");
        content.split(";").forEach(function(item) {
          var _item$split = item.split(":"), _item$split2 = _slicedToArray(_item$split, 2), path = _item$split2[0], hash = _item$split2[1];
          cachePathMap[path] = hash;
        });
        var inlineMapStyle = document.querySelector("style[".concat(ATTR_CACHE_MAP, "]"));
        if (inlineMapStyle) {
          var _inlineMapStyle$paren;
          fromCSSFile = false;
          (_inlineMapStyle$paren = inlineMapStyle.parentNode) === null || _inlineMapStyle$paren === void 0 || _inlineMapStyle$paren.removeChild(inlineMapStyle);
        }
        document.body.removeChild(div);
      }
    }
  }
  function existPath(path) {
    prepare();
    return !!cachePathMap[path];
  }
  function getStyleAndHash(path) {
    var hash = cachePathMap[path];
    var styleStr = null;
    if (hash && canUseDom()) {
      if (fromCSSFile) {
        styleStr = CSS_FILE_STYLE;
      } else {
        var _style = document.querySelector("style[".concat(ATTR_MARK, '="').concat(cachePathMap[path], '"]'));
        if (_style) {
          styleStr = _style.innerHTML;
        } else {
          delete cachePathMap[path];
        }
      }
    }
    return [styleStr, hash];
  }
  var SKIP_CHECK = "_skip_check_";
  var MULTI_VALUE = "_multi_value_";
  function normalizeStyle(styleStr) {
    var serialized = serialize(compile(styleStr), stringify);
    return serialized.replace(/\{%%%\:[^;];}/g, ";");
  }
  function isCompoundCSSProperty(value) {
    return _typeof(value) === "object" && value && (SKIP_CHECK in value || MULTI_VALUE in value);
  }
  function injectSelectorHash(key, hashId, hashPriority) {
    if (!hashId) {
      return key;
    }
    var hashClassName = ".".concat(hashId);
    var hashSelector = hashPriority === "low" ? ":where(".concat(hashClassName, ")") : hashClassName;
    var keys = key.split(",").map(function(k2) {
      var _firstPath$match;
      var fullPath = k2.trim().split(/\s+/);
      var firstPath = fullPath[0] || "";
      var htmlElement = ((_firstPath$match = firstPath.match(/^\w+/)) === null || _firstPath$match === void 0 ? void 0 : _firstPath$match[0]) || "";
      firstPath = "".concat(htmlElement).concat(hashSelector).concat(firstPath.slice(htmlElement.length));
      return [firstPath].concat(_toConsumableArray(fullPath.slice(1))).join(" ");
    });
    return keys.join(",");
  }
  var parseStyle = function parseStyle2(interpolation) {
    var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
      root: true,
      parentSelectors: []
    }, root = _ref.root, injectHash = _ref.injectHash, parentSelectors = _ref.parentSelectors;
    var hashId = config.hashId, layer = config.layer;
    config.path;
    var hashPriority = config.hashPriority, _config$transformers = config.transformers, transformers = _config$transformers === void 0 ? [] : _config$transformers;
    config.linters;
    var styleStr = "";
    var effectStyle = {};
    function parseKeyframes(keyframes) {
      var animationName = keyframes.getName(hashId);
      if (!effectStyle[animationName]) {
        var _parseStyle = parseStyle2(keyframes.style, config, {
          root: false,
          parentSelectors
        }), _parseStyle2 = _slicedToArray(_parseStyle, 1), _parsedStr = _parseStyle2[0];
        effectStyle[animationName] = "@keyframes ".concat(keyframes.getName(hashId)).concat(_parsedStr);
      }
    }
    function flattenList(list) {
      var fullList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      list.forEach(function(item) {
        if (Array.isArray(item)) {
          flattenList(item, fullList);
        } else if (item) {
          fullList.push(item);
        }
      });
      return fullList;
    }
    var flattenStyleList = flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]);
    flattenStyleList.forEach(function(originStyle) {
      var style2 = typeof originStyle === "string" && !root ? {} : originStyle;
      if (typeof style2 === "string") {
        styleStr += "".concat(style2, "\n");
      } else if (style2._keyframe) {
        parseKeyframes(style2);
      } else {
        var mergedStyle = transformers.reduce(function(prev2, trans) {
          var _trans$visit;
          return (trans === null || trans === void 0 || (_trans$visit = trans.visit) === null || _trans$visit === void 0 ? void 0 : _trans$visit.call(trans, prev2)) || prev2;
        }, style2);
        Object.keys(mergedStyle).forEach(function(key) {
          var value = mergedStyle[key];
          if (_typeof(value) === "object" && value && (key !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
            var subInjectHash = false;
            var mergedKey = key.trim();
            var nextRoot = false;
            if ((root || injectHash) && hashId) {
              if (mergedKey.startsWith("@")) {
                subInjectHash = true;
              } else if (mergedKey === "&") {
                mergedKey = injectSelectorHash("", hashId, hashPriority);
              } else {
                mergedKey = injectSelectorHash(key, hashId, hashPriority);
              }
            } else if (root && !hashId && (mergedKey === "&" || mergedKey === "")) {
              mergedKey = "";
              nextRoot = true;
            }
            var _parseStyle3 = parseStyle2(value, config, {
              root: nextRoot,
              injectHash: subInjectHash,
              parentSelectors: [].concat(_toConsumableArray(parentSelectors), [mergedKey])
            }), _parseStyle4 = _slicedToArray(_parseStyle3, 2), _parsedStr2 = _parseStyle4[0], childEffectStyle = _parseStyle4[1];
            effectStyle = _objectSpread2(_objectSpread2({}, effectStyle), childEffectStyle);
            styleStr += "".concat(mergedKey).concat(_parsedStr2);
          } else {
            let appendStyle = function(cssKey, cssValue) {
              var styleName = cssKey.replace(/[A-Z]/g, function(match) {
                return "-".concat(match.toLowerCase());
              });
              var formatValue = cssValue;
              if (!unitlessKeys[cssKey] && typeof formatValue === "number" && formatValue !== 0) {
                formatValue = "".concat(formatValue, "px");
              }
              if (cssKey === "animationName" && cssValue !== null && cssValue !== void 0 && cssValue._keyframe) {
                parseKeyframes(cssValue);
                formatValue = cssValue.getName(hashId);
              }
              styleStr += "".concat(styleName, ":").concat(formatValue, ";");
            };
            var _value;
            var actualValue = (_value = value === null || value === void 0 ? void 0 : value.value) !== null && _value !== void 0 ? _value : value;
            if (_typeof(value) === "object" && value !== null && value !== void 0 && value[MULTI_VALUE] && Array.isArray(actualValue)) {
              actualValue.forEach(function(item) {
                appendStyle(key, item);
              });
            } else {
              appendStyle(key, actualValue);
            }
          }
        });
      }
    });
    if (!root) {
      styleStr = "{".concat(styleStr, "}");
    } else if (layer) {
      if (styleStr) {
        styleStr = "@layer ".concat(layer.name, " {").concat(styleStr, "}");
      }
      if (layer.dependencies) {
        effectStyle["@layer ".concat(layer.name)] = layer.dependencies.map(function(deps) {
          return "@layer ".concat(deps, ", ").concat(layer.name, ";");
        }).join("\n");
      }
    }
    return [styleStr, effectStyle];
  };
  function uniqueHash(path, styleStr) {
    return murmur2("".concat(path.join("%")).concat(styleStr));
  }
  function Empty() {
    return null;
  }
  var STYLE_PREFIX = "style";
  function useStyleRegister(info, styleFn) {
    var token2 = info.token, path = info.path, hashId = info.hashId, layer = info.layer, nonce = info.nonce, clientOnly = info.clientOnly, _info$order = info.order, order = _info$order === void 0 ? 0 : _info$order;
    var _React$useContext = reactExports.useContext(StyleContext), autoClear = _React$useContext.autoClear;
    _React$useContext.mock;
    var defaultCache = _React$useContext.defaultCache, hashPriority = _React$useContext.hashPriority, container = _React$useContext.container, ssrInline = _React$useContext.ssrInline, transformers = _React$useContext.transformers, linters = _React$useContext.linters, cache = _React$useContext.cache, enableLayer = _React$useContext.layer;
    var tokenKey = token2._tokenKey;
    var fullPath = [tokenKey];
    if (enableLayer) {
      fullPath.push("layer");
    }
    fullPath.push.apply(fullPath, _toConsumableArray(path));
    var isMergedClientSide = isClientSide;
    var _useGlobalCache = useGlobalCache(
      STYLE_PREFIX,
      fullPath,
      // Create cache if needed
      function() {
        var cachePath = fullPath.join("|");
        if (existPath(cachePath)) {
          var _getStyleAndHash = getStyleAndHash(cachePath), _getStyleAndHash2 = _slicedToArray(_getStyleAndHash, 2), inlineCacheStyleStr = _getStyleAndHash2[0], styleHash = _getStyleAndHash2[1];
          if (inlineCacheStyleStr) {
            return [inlineCacheStyleStr, tokenKey, styleHash, {}, clientOnly, order];
          }
        }
        var styleObj = styleFn();
        var _parseStyle5 = parseStyle(styleObj, {
          hashId,
          hashPriority,
          layer: enableLayer ? layer : void 0,
          path: path.join("-"),
          transformers,
          linters
        }), _parseStyle6 = _slicedToArray(_parseStyle5, 2), parsedStyle = _parseStyle6[0], effectStyle = _parseStyle6[1];
        var styleStr = normalizeStyle(parsedStyle);
        var styleId = uniqueHash(fullPath, styleStr);
        return [styleStr, tokenKey, styleId, effectStyle, clientOnly, order];
      },
      // Remove cache if no need
      function(_ref2, fromHMR) {
        var _ref3 = _slicedToArray(_ref2, 3), styleId = _ref3[2];
        if ((fromHMR || autoClear) && isClientSide) {
          removeCSS(styleId, {
            mark: ATTR_MARK,
            attachTo: container
          });
        }
      },
      // Effect: Inject style here
      function(_ref4) {
        var _ref5 = _slicedToArray(_ref4, 4), styleStr = _ref5[0];
        _ref5[1];
        var styleId = _ref5[2], effectStyle = _ref5[3];
        if (isMergedClientSide && styleStr !== CSS_FILE_STYLE) {
          var mergedCSSConfig = {
            mark: ATTR_MARK,
            prepend: enableLayer ? false : "queue",
            attachTo: container,
            priority: order
          };
          var nonceStr = typeof nonce === "function" ? nonce() : nonce;
          if (nonceStr) {
            mergedCSSConfig.csp = {
              nonce: nonceStr
            };
          }
          var effectLayerKeys = [];
          var effectRestKeys = [];
          Object.keys(effectStyle).forEach(function(key) {
            if (key.startsWith("@layer")) {
              effectLayerKeys.push(key);
            } else {
              effectRestKeys.push(key);
            }
          });
          effectLayerKeys.forEach(function(effectKey) {
            updateCSS(normalizeStyle(effectStyle[effectKey]), "_layer-".concat(effectKey), _objectSpread2(_objectSpread2({}, mergedCSSConfig), {}, {
              prepend: true
            }));
          });
          var style2 = updateCSS(styleStr, styleId, mergedCSSConfig);
          style2[CSS_IN_JS_INSTANCE] = cache.instanceId;
          style2.setAttribute(ATTR_TOKEN, tokenKey);
          effectRestKeys.forEach(function(effectKey) {
            updateCSS(normalizeStyle(effectStyle[effectKey]), "_effect-".concat(effectKey), mergedCSSConfig);
          });
        }
      }
    ), _useGlobalCache2 = _slicedToArray(_useGlobalCache, 3), cachedStyleStr = _useGlobalCache2[0], cachedTokenKey = _useGlobalCache2[1], cachedStyleId = _useGlobalCache2[2];
    return function(node2) {
      var styleNode;
      if (!ssrInline || isMergedClientSide || !defaultCache) {
        styleNode = /* @__PURE__ */ reactExports.createElement(Empty, null);
      } else {
        styleNode = /* @__PURE__ */ reactExports.createElement("style", _extends({}, _defineProperty(_defineProperty({}, ATTR_TOKEN, cachedTokenKey), ATTR_MARK, cachedStyleId), {
          dangerouslySetInnerHTML: {
            __html: cachedStyleStr
          }
        }));
      }
      return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, styleNode, node2);
    };
  }
  var extract$1 = function extract2(cache, effectStyles, options) {
    var _cache = _slicedToArray(cache, 6), styleStr = _cache[0], tokenKey = _cache[1], styleId = _cache[2], effectStyle = _cache[3], clientOnly = _cache[4], order = _cache[5];
    var _ref7 = options || {}, plain = _ref7.plain;
    if (clientOnly) {
      return null;
    }
    var keyStyleText = styleStr;
    var sharedAttrs = {
      "data-rc-order": "prependQueue",
      "data-rc-priority": "".concat(order)
    };
    keyStyleText = toStyleStr(styleStr, tokenKey, styleId, sharedAttrs, plain);
    if (effectStyle) {
      Object.keys(effectStyle).forEach(function(effectKey) {
        if (!effectStyles[effectKey]) {
          effectStyles[effectKey] = true;
          var effectStyleStr = normalizeStyle(effectStyle[effectKey]);
          var effectStyleHTML = toStyleStr(effectStyleStr, tokenKey, "_effect-".concat(effectKey), sharedAttrs, plain);
          if (effectKey.startsWith("@layer")) {
            keyStyleText = effectStyleHTML + keyStyleText;
          } else {
            keyStyleText += effectStyleHTML;
          }
        }
      });
    }
    return [order, styleId, keyStyleText];
  };
  var CSS_VAR_PREFIX = "cssVar";
  var useCSSVarRegister = function useCSSVarRegister2(config, fn) {
    var key = config.key, prefix = config.prefix, unitless2 = config.unitless, ignore2 = config.ignore, token2 = config.token, _config$scope = config.scope, scope = _config$scope === void 0 ? "" : _config$scope;
    var _useContext = reactExports.useContext(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
    var tokenKey = token2._tokenKey;
    var stylePath = [].concat(_toConsumableArray(config.path), [key, scope, tokenKey]);
    var cache = useGlobalCache(CSS_VAR_PREFIX, stylePath, function() {
      var originToken = fn();
      var _transformToken = transformToken(originToken, key, {
        prefix,
        unitless: unitless2,
        ignore: ignore2,
        scope
      }), _transformToken2 = _slicedToArray(_transformToken, 2), mergedToken = _transformToken2[0], cssVarsStr = _transformToken2[1];
      var styleId = uniqueHash(stylePath, cssVarsStr);
      return [mergedToken, cssVarsStr, styleId, key];
    }, function(_ref) {
      var _ref2 = _slicedToArray(_ref, 3), styleId = _ref2[2];
      if (isClientSide) {
        removeCSS(styleId, {
          mark: ATTR_MARK,
          attachTo: container
        });
      }
    }, function(_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3), cssVarsStr = _ref4[1], styleId = _ref4[2];
      if (!cssVarsStr) {
        return;
      }
      var style2 = updateCSS(cssVarsStr, styleId, {
        mark: ATTR_MARK,
        prepend: "queue",
        attachTo: container,
        priority: -999
      });
      style2[CSS_IN_JS_INSTANCE] = instanceId;
      style2.setAttribute(ATTR_TOKEN, key);
    });
    return cache;
  };
  var extract = function extract2(cache, effectStyles, options) {
    var _cache = _slicedToArray(cache, 4), styleStr = _cache[1], styleId = _cache[2], cssVarKey = _cache[3];
    var _ref5 = options || {}, plain = _ref5.plain;
    if (!styleStr) {
      return null;
    }
    var order = -999;
    var sharedAttrs = {
      "data-rc-order": "prependQueue",
      "data-rc-priority": "".concat(order)
    };
    var styleText = toStyleStr(styleStr, cssVarKey, styleId, sharedAttrs, plain);
    return [order, styleId, styleText];
  };
  _defineProperty(_defineProperty(_defineProperty({}, STYLE_PREFIX, extract$1), TOKEN_PREFIX, extract$2), CSS_VAR_PREFIX, extract);
  function noSplit(list) {
    list.notSplit = true;
    return list;
  }
  ({
    // Border
    borderBlock: noSplit(["borderTop", "borderBottom"]),
    borderBlockStart: noSplit(["borderTop"]),
    borderBlockEnd: noSplit(["borderBottom"]),
    borderInline: noSplit(["borderLeft", "borderRight"]),
    borderInlineStart: noSplit(["borderLeft"]),
    borderInlineEnd: noSplit(["borderRight"])
  });
  var IconContext = /* @__PURE__ */ reactExports.createContext({});
  const defaultPresetColors = {
    blue: "#1677FF",
    purple: "#722ED1",
    cyan: "#13C2C2",
    green: "#52C41A",
    magenta: "#EB2F96",
    /**
     * @deprecated Use magenta instead
     */
    pink: "#EB2F96",
    red: "#F5222D",
    orange: "#FA8C16",
    yellow: "#FADB14",
    volcano: "#FA541C",
    geekblue: "#2F54EB",
    gold: "#FAAD14",
    lime: "#A0D911"
  };
  const seedToken = Object.assign(Object.assign({}, defaultPresetColors), {
    // Color
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorLink: "",
    colorTextBase: "",
    colorBgBase: "",
    // Font
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'`,
    fontFamilyCode: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    fontSize: 14,
    // Line
    lineWidth: 1,
    lineType: "solid",
    // Motion
    motionUnit: 0.1,
    motionBase: 0,
    motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
    motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
    motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
    motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
    motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
    // Radius
    borderRadius: 6,
    // Size
    sizeUnit: 4,
    sizeStep: 4,
    sizePopupArrow: 16,
    // Control Base
    controlHeight: 32,
    // zIndex
    zIndexBase: 0,
    zIndexPopupBase: 1e3,
    // Image
    opacityImage: 1,
    // Wireframe
    wireframe: false,
    // Motion
    motion: true
  });
  const round = Math.round;
  function splitColorStr(str, parseNum) {
    const match = str.replace(/^[^(]*\((.*)/, "$1").replace(/\).*/, "").match(/\d*\.?\d+%?/g) || [];
    const numList = match.map((item) => parseFloat(item));
    for (let i = 0; i < 3; i += 1) {
      numList[i] = parseNum(numList[i] || 0, match[i] || "", i);
    }
    if (match[3]) {
      numList[3] = match[3].includes("%") ? numList[3] / 100 : numList[3];
    } else {
      numList[3] = 1;
    }
    return numList;
  }
  const parseHSVorHSL = (num, _, index) => index === 0 ? num : num / 100;
  function limitRange(value, max) {
    const mergedMax = max || 255;
    if (value > mergedMax) {
      return mergedMax;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  }
  class FastColor {
    constructor(input) {
      _defineProperty(this, "isValid", true);
      _defineProperty(this, "r", 0);
      _defineProperty(this, "g", 0);
      _defineProperty(this, "b", 0);
      _defineProperty(this, "a", 1);
      _defineProperty(this, "_h", void 0);
      _defineProperty(this, "_s", void 0);
      _defineProperty(this, "_l", void 0);
      _defineProperty(this, "_v", void 0);
      _defineProperty(this, "_max", void 0);
      _defineProperty(this, "_min", void 0);
      _defineProperty(this, "_brightness", void 0);
      function matchFormat(str) {
        return str[0] in input && str[1] in input && str[2] in input;
      }
      if (!input) ;
      else if (typeof input === "string") {
        let matchPrefix = function(prefix) {
          return trimStr.startsWith(prefix);
        };
        const trimStr = input.trim();
        if (/^#?[A-F\d]{3,8}$/i.test(trimStr)) {
          this.fromHexString(trimStr);
        } else if (matchPrefix("rgb")) {
          this.fromRgbString(trimStr);
        } else if (matchPrefix("hsl")) {
          this.fromHslString(trimStr);
        } else if (matchPrefix("hsv") || matchPrefix("hsb")) {
          this.fromHsvString(trimStr);
        }
      } else if (input instanceof FastColor) {
        this.r = input.r;
        this.g = input.g;
        this.b = input.b;
        this.a = input.a;
        this._h = input._h;
        this._s = input._s;
        this._l = input._l;
        this._v = input._v;
      } else if (matchFormat("rgb")) {
        this.r = limitRange(input.r);
        this.g = limitRange(input.g);
        this.b = limitRange(input.b);
        this.a = typeof input.a === "number" ? limitRange(input.a, 1) : 1;
      } else if (matchFormat("hsl")) {
        this.fromHsl(input);
      } else if (matchFormat("hsv")) {
        this.fromHsv(input);
      } else {
        throw new Error("@ant-design/fast-color: unsupported input " + JSON.stringify(input));
      }
    }
    // ======================= Setter =======================
    setR(value) {
      return this._sc("r", value);
    }
    setG(value) {
      return this._sc("g", value);
    }
    setB(value) {
      return this._sc("b", value);
    }
    setA(value) {
      return this._sc("a", value, 1);
    }
    setHue(value) {
      const hsv = this.toHsv();
      hsv.h = value;
      return this._c(hsv);
    }
    // ======================= Getter =======================
    /**
     * Returns the perceived luminance of a color, from 0-1.
     * @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     */
    getLuminance() {
      function adjustGamma(raw) {
        const val = raw / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      }
      const R2 = adjustGamma(this.r);
      const G2 = adjustGamma(this.g);
      const B2 = adjustGamma(this.b);
      return 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
    }
    getHue() {
      if (typeof this._h === "undefined") {
        const delta = this.getMax() - this.getMin();
        if (delta === 0) {
          this._h = 0;
        } else {
          this._h = round(60 * (this.r === this.getMax() ? (this.g - this.b) / delta + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / delta + 2 : (this.r - this.g) / delta + 4));
        }
      }
      return this._h;
    }
    getSaturation() {
      if (typeof this._s === "undefined") {
        const delta = this.getMax() - this.getMin();
        if (delta === 0) {
          this._s = 0;
        } else {
          this._s = delta / this.getMax();
        }
      }
      return this._s;
    }
    getLightness() {
      if (typeof this._l === "undefined") {
        this._l = (this.getMax() + this.getMin()) / 510;
      }
      return this._l;
    }
    getValue() {
      if (typeof this._v === "undefined") {
        this._v = this.getMax() / 255;
      }
      return this._v;
    }
    /**
     * Returns the perceived brightness of the color, from 0-255.
     * Note: this is not the b of HSB
     * @see http://www.w3.org/TR/AERT#color-contrast
     */
    getBrightness() {
      if (typeof this._brightness === "undefined") {
        this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1e3;
      }
      return this._brightness;
    }
    // ======================== Func ========================
    darken(amount = 10) {
      const h2 = this.getHue();
      const s = this.getSaturation();
      let l2 = this.getLightness() - amount / 100;
      if (l2 < 0) {
        l2 = 0;
      }
      return this._c({
        h: h2,
        s,
        l: l2,
        a: this.a
      });
    }
    lighten(amount = 10) {
      const h2 = this.getHue();
      const s = this.getSaturation();
      let l2 = this.getLightness() + amount / 100;
      if (l2 > 1) {
        l2 = 1;
      }
      return this._c({
        h: h2,
        s,
        l: l2,
        a: this.a
      });
    }
    /**
     * Mix the current color a given amount with another color, from 0 to 100.
     * 0 means no mixing (return current color).
     */
    mix(input, amount = 50) {
      const color = this._c(input);
      const p2 = amount / 100;
      const calc = (key) => (color[key] - this[key]) * p2 + this[key];
      const rgba = {
        r: round(calc("r")),
        g: round(calc("g")),
        b: round(calc("b")),
        a: round(calc("a") * 100) / 100
      };
      return this._c(rgba);
    }
    /**
     * Mix the color with pure white, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return white.
     */
    tint(amount = 10) {
      return this.mix({
        r: 255,
        g: 255,
        b: 255,
        a: 1
      }, amount);
    }
    /**
     * Mix the color with pure black, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return black.
     */
    shade(amount = 10) {
      return this.mix({
        r: 0,
        g: 0,
        b: 0,
        a: 1
      }, amount);
    }
    onBackground(background) {
      const bg2 = this._c(background);
      const alpha = this.a + bg2.a * (1 - this.a);
      const calc = (key) => {
        return round((this[key] * this.a + bg2[key] * bg2.a * (1 - this.a)) / alpha);
      };
      return this._c({
        r: calc("r"),
        g: calc("g"),
        b: calc("b"),
        a: alpha
      });
    }
    // ======================= Status =======================
    isDark() {
      return this.getBrightness() < 128;
    }
    isLight() {
      return this.getBrightness() >= 128;
    }
    // ======================== MISC ========================
    equals(other) {
      return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
    }
    clone() {
      return this._c(this);
    }
    // ======================= Format =======================
    toHexString() {
      let hex = "#";
      const rHex = (this.r || 0).toString(16);
      hex += rHex.length === 2 ? rHex : "0" + rHex;
      const gHex = (this.g || 0).toString(16);
      hex += gHex.length === 2 ? gHex : "0" + gHex;
      const bHex = (this.b || 0).toString(16);
      hex += bHex.length === 2 ? bHex : "0" + bHex;
      if (typeof this.a === "number" && this.a >= 0 && this.a < 1) {
        const aHex = round(this.a * 255).toString(16);
        hex += aHex.length === 2 ? aHex : "0" + aHex;
      }
      return hex;
    }
    /** CSS support color pattern */
    toHsl() {
      return {
        h: this.getHue(),
        s: this.getSaturation(),
        l: this.getLightness(),
        a: this.a
      };
    }
    /** CSS support color pattern */
    toHslString() {
      const h2 = this.getHue();
      const s = round(this.getSaturation() * 100);
      const l2 = round(this.getLightness() * 100);
      return this.a !== 1 ? `hsla(${h2},${s}%,${l2}%,${this.a})` : `hsl(${h2},${s}%,${l2}%)`;
    }
    /** Same as toHsb */
    toHsv() {
      return {
        h: this.getHue(),
        s: this.getSaturation(),
        v: this.getValue(),
        a: this.a
      };
    }
    toRgb() {
      return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
      };
    }
    toRgbString() {
      return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
    }
    toString() {
      return this.toRgbString();
    }
    // ====================== Privates ======================
    /** Return a new FastColor object with one channel changed */
    _sc(rgb, value, max) {
      const clone = this.clone();
      clone[rgb] = limitRange(value, max);
      return clone;
    }
    _c(input) {
      return new this.constructor(input);
    }
    getMax() {
      if (typeof this._max === "undefined") {
        this._max = Math.max(this.r, this.g, this.b);
      }
      return this._max;
    }
    getMin() {
      if (typeof this._min === "undefined") {
        this._min = Math.min(this.r, this.g, this.b);
      }
      return this._min;
    }
    fromHexString(trimStr) {
      const withoutPrefix = trimStr.replace("#", "");
      function connectNum(index1, index2) {
        return parseInt(withoutPrefix[index1] + withoutPrefix[index2 || index1], 16);
      }
      if (withoutPrefix.length < 6) {
        this.r = connectNum(0);
        this.g = connectNum(1);
        this.b = connectNum(2);
        this.a = withoutPrefix[3] ? connectNum(3) / 255 : 1;
      } else {
        this.r = connectNum(0, 1);
        this.g = connectNum(2, 3);
        this.b = connectNum(4, 5);
        this.a = withoutPrefix[6] ? connectNum(6, 7) / 255 : 1;
      }
    }
    fromHsl({
      h: h2,
      s,
      l: l2,
      a
    }) {
      this._h = h2 % 360;
      this._s = s;
      this._l = l2;
      this.a = typeof a === "number" ? a : 1;
      if (s <= 0) {
        const rgb = round(l2 * 255);
        this.r = rgb;
        this.g = rgb;
        this.b = rgb;
      }
      let r2 = 0, g2 = 0, b2 = 0;
      const huePrime = h2 / 60;
      const chroma = (1 - Math.abs(2 * l2 - 1)) * s;
      const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
      if (huePrime >= 0 && huePrime < 1) {
        r2 = chroma;
        g2 = secondComponent;
      } else if (huePrime >= 1 && huePrime < 2) {
        r2 = secondComponent;
        g2 = chroma;
      } else if (huePrime >= 2 && huePrime < 3) {
        g2 = chroma;
        b2 = secondComponent;
      } else if (huePrime >= 3 && huePrime < 4) {
        g2 = secondComponent;
        b2 = chroma;
      } else if (huePrime >= 4 && huePrime < 5) {
        r2 = secondComponent;
        b2 = chroma;
      } else if (huePrime >= 5 && huePrime < 6) {
        r2 = chroma;
        b2 = secondComponent;
      }
      const lightnessModification = l2 - chroma / 2;
      this.r = round((r2 + lightnessModification) * 255);
      this.g = round((g2 + lightnessModification) * 255);
      this.b = round((b2 + lightnessModification) * 255);
    }
    fromHsv({
      h: h2,
      s,
      v: v2,
      a
    }) {
      this._h = h2 % 360;
      this._s = s;
      this._v = v2;
      this.a = typeof a === "number" ? a : 1;
      const vv = round(v2 * 255);
      this.r = vv;
      this.g = vv;
      this.b = vv;
      if (s <= 0) {
        return;
      }
      const hh2 = h2 / 60;
      const i = Math.floor(hh2);
      const ff2 = hh2 - i;
      const p2 = round(v2 * (1 - s) * 255);
      const q2 = round(v2 * (1 - s * ff2) * 255);
      const t2 = round(v2 * (1 - s * (1 - ff2)) * 255);
      switch (i) {
        case 0:
          this.g = t2;
          this.b = p2;
          break;
        case 1:
          this.r = q2;
          this.b = p2;
          break;
        case 2:
          this.r = p2;
          this.b = t2;
          break;
        case 3:
          this.r = p2;
          this.g = q2;
          break;
        case 4:
          this.r = t2;
          this.g = p2;
          break;
        case 5:
        default:
          this.g = p2;
          this.b = q2;
          break;
      }
    }
    fromHsvString(trimStr) {
      const cells = splitColorStr(trimStr, parseHSVorHSL);
      this.fromHsv({
        h: cells[0],
        s: cells[1],
        v: cells[2],
        a: cells[3]
      });
    }
    fromHslString(trimStr) {
      const cells = splitColorStr(trimStr, parseHSVorHSL);
      this.fromHsl({
        h: cells[0],
        s: cells[1],
        l: cells[2],
        a: cells[3]
      });
    }
    fromRgbString(trimStr) {
      const cells = splitColorStr(trimStr, (num, txt) => (
        // Convert percentage to number. e.g. 50% -> 128
        txt.includes("%") ? round(num / 100 * 255) : num
      ));
      this.r = cells[0];
      this.g = cells[1];
      this.b = cells[2];
      this.a = cells[3];
    }
  }
  var hueStep = 2;
  var saturationStep = 0.16;
  var saturationStep2 = 0.05;
  var brightnessStep1 = 0.05;
  var brightnessStep2 = 0.15;
  var lightColorCount = 5;
  var darkColorCount = 4;
  var darkColorMap = [{
    index: 7,
    amount: 15
  }, {
    index: 6,
    amount: 25
  }, {
    index: 5,
    amount: 30
  }, {
    index: 5,
    amount: 45
  }, {
    index: 5,
    amount: 65
  }, {
    index: 5,
    amount: 85
  }, {
    index: 4,
    amount: 90
  }, {
    index: 3,
    amount: 95
  }, {
    index: 2,
    amount: 97
  }, {
    index: 1,
    amount: 98
  }];
  function getHue(hsv, i, light) {
    var hue;
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  function getSaturation(hsv, i, light) {
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    var saturation;
    if (light) {
      saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
      saturation = hsv.s + saturationStep;
    } else {
      saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Math.round(saturation * 100) / 100;
  }
  function getValue(hsv, i, light) {
    var value;
    if (light) {
      value = hsv.v + brightnessStep1 * i;
    } else {
      value = hsv.v - brightnessStep2 * i;
    }
    value = Math.max(0, Math.min(1, value));
    return Math.round(value * 100) / 100;
  }
  function generate$1(color) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var patterns = [];
    var pColor = new FastColor(color);
    var hsv = pColor.toHsv();
    for (var i = lightColorCount; i > 0; i -= 1) {
      var c2 = new FastColor({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      });
      patterns.push(c2);
    }
    patterns.push(pColor);
    for (var _i = 1; _i <= darkColorCount; _i += 1) {
      var _c = new FastColor({
        h: getHue(hsv, _i),
        s: getSaturation(hsv, _i),
        v: getValue(hsv, _i)
      });
      patterns.push(_c);
    }
    if (opts.theme === "dark") {
      return darkColorMap.map(function(_ref) {
        var index = _ref.index, amount = _ref.amount;
        return new FastColor(opts.backgroundColor || "#141414").mix(patterns[index], amount).toHexString();
      });
    }
    return patterns.map(function(c3) {
      return c3.toHexString();
    });
  }
  var presetPrimaryColors = {
    "red": "#F5222D",
    "volcano": "#FA541C",
    "orange": "#FA8C16",
    "gold": "#FAAD14",
    "yellow": "#FADB14",
    "lime": "#A0D911",
    "green": "#52C41A",
    "cyan": "#13C2C2",
    "blue": "#1677FF",
    "geekblue": "#2F54EB",
    "purple": "#722ED1",
    "magenta": "#EB2F96",
    "grey": "#666666"
  };
  var red = ["#fff1f0", "#ffccc7", "#ffa39e", "#ff7875", "#ff4d4f", "#f5222d", "#cf1322", "#a8071a", "#820014", "#5c0011"];
  red.primary = red[5];
  var volcano = ["#fff2e8", "#ffd8bf", "#ffbb96", "#ff9c6e", "#ff7a45", "#fa541c", "#d4380d", "#ad2102", "#871400", "#610b00"];
  volcano.primary = volcano[5];
  var orange = ["#fff7e6", "#ffe7ba", "#ffd591", "#ffc069", "#ffa940", "#fa8c16", "#d46b08", "#ad4e00", "#873800", "#612500"];
  orange.primary = orange[5];
  var gold = ["#fffbe6", "#fff1b8", "#ffe58f", "#ffd666", "#ffc53d", "#faad14", "#d48806", "#ad6800", "#874d00", "#613400"];
  gold.primary = gold[5];
  var yellow = ["#feffe6", "#ffffb8", "#fffb8f", "#fff566", "#ffec3d", "#fadb14", "#d4b106", "#ad8b00", "#876800", "#614700"];
  yellow.primary = yellow[5];
  var lime = ["#fcffe6", "#f4ffb8", "#eaff8f", "#d3f261", "#bae637", "#a0d911", "#7cb305", "#5b8c00", "#3f6600", "#254000"];
  lime.primary = lime[5];
  var green = ["#f6ffed", "#d9f7be", "#b7eb8f", "#95de64", "#73d13d", "#52c41a", "#389e0d", "#237804", "#135200", "#092b00"];
  green.primary = green[5];
  var cyan = ["#e6fffb", "#b5f5ec", "#87e8de", "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#00474f", "#002329"];
  cyan.primary = cyan[5];
  var blue = ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff", "#0958d9", "#003eb3", "#002c8c", "#001d66"];
  blue.primary = blue[5];
  var geekblue = ["#f0f5ff", "#d6e4ff", "#adc6ff", "#85a5ff", "#597ef7", "#2f54eb", "#1d39c4", "#10239e", "#061178", "#030852"];
  geekblue.primary = geekblue[5];
  var purple = ["#f9f0ff", "#efdbff", "#d3adf7", "#b37feb", "#9254de", "#722ed1", "#531dab", "#391085", "#22075e", "#120338"];
  purple.primary = purple[5];
  var magenta = ["#fff0f6", "#ffd6e7", "#ffadd2", "#ff85c0", "#f759ab", "#eb2f96", "#c41d7f", "#9e1068", "#780650", "#520339"];
  magenta.primary = magenta[5];
  var grey = ["#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#404040", "#1a1a1a", "#000000", "#000000"];
  grey.primary = grey[5];
  var presetPalettes = {
    red,
    volcano,
    orange,
    gold,
    yellow,
    lime,
    green,
    cyan,
    blue,
    geekblue,
    purple,
    magenta,
    grey
  };
  function genColorMapToken(seed, {
    generateColorPalettes: generateColorPalettes2,
    generateNeutralColorPalettes: generateNeutralColorPalettes2
  }) {
    const {
      colorSuccess: colorSuccessBase,
      colorWarning: colorWarningBase,
      colorError: colorErrorBase,
      colorInfo: colorInfoBase,
      colorPrimary: colorPrimaryBase,
      colorBgBase,
      colorTextBase
    } = seed;
    const primaryColors = generateColorPalettes2(colorPrimaryBase);
    const successColors = generateColorPalettes2(colorSuccessBase);
    const warningColors = generateColorPalettes2(colorWarningBase);
    const errorColors = generateColorPalettes2(colorErrorBase);
    const infoColors = generateColorPalettes2(colorInfoBase);
    const neutralColors = generateNeutralColorPalettes2(colorBgBase, colorTextBase);
    const colorLink = seed.colorLink || seed.colorInfo;
    const linkColors = generateColorPalettes2(colorLink);
    const colorErrorBgFilledHover = new FastColor(errorColors[1]).mix(new FastColor(errorColors[3]), 50).toHexString();
    return Object.assign(Object.assign({}, neutralColors), {
      colorPrimaryBg: primaryColors[1],
      colorPrimaryBgHover: primaryColors[2],
      colorPrimaryBorder: primaryColors[3],
      colorPrimaryBorderHover: primaryColors[4],
      colorPrimaryHover: primaryColors[5],
      colorPrimary: primaryColors[6],
      colorPrimaryActive: primaryColors[7],
      colorPrimaryTextHover: primaryColors[8],
      colorPrimaryText: primaryColors[9],
      colorPrimaryTextActive: primaryColors[10],
      colorSuccessBg: successColors[1],
      colorSuccessBgHover: successColors[2],
      colorSuccessBorder: successColors[3],
      colorSuccessBorderHover: successColors[4],
      colorSuccessHover: successColors[4],
      colorSuccess: successColors[6],
      colorSuccessActive: successColors[7],
      colorSuccessTextHover: successColors[8],
      colorSuccessText: successColors[9],
      colorSuccessTextActive: successColors[10],
      colorErrorBg: errorColors[1],
      colorErrorBgHover: errorColors[2],
      colorErrorBgFilledHover,
      colorErrorBgActive: errorColors[3],
      colorErrorBorder: errorColors[3],
      colorErrorBorderHover: errorColors[4],
      colorErrorHover: errorColors[5],
      colorError: errorColors[6],
      colorErrorActive: errorColors[7],
      colorErrorTextHover: errorColors[8],
      colorErrorText: errorColors[9],
      colorErrorTextActive: errorColors[10],
      colorWarningBg: warningColors[1],
      colorWarningBgHover: warningColors[2],
      colorWarningBorder: warningColors[3],
      colorWarningBorderHover: warningColors[4],
      colorWarningHover: warningColors[4],
      colorWarning: warningColors[6],
      colorWarningActive: warningColors[7],
      colorWarningTextHover: warningColors[8],
      colorWarningText: warningColors[9],
      colorWarningTextActive: warningColors[10],
      colorInfoBg: infoColors[1],
      colorInfoBgHover: infoColors[2],
      colorInfoBorder: infoColors[3],
      colorInfoBorderHover: infoColors[4],
      colorInfoHover: infoColors[4],
      colorInfo: infoColors[6],
      colorInfoActive: infoColors[7],
      colorInfoTextHover: infoColors[8],
      colorInfoText: infoColors[9],
      colorInfoTextActive: infoColors[10],
      colorLinkHover: linkColors[4],
      colorLink: linkColors[6],
      colorLinkActive: linkColors[7],
      colorBgMask: new FastColor("#000").setA(0.45).toRgbString(),
      colorWhite: "#fff"
    });
  }
  const genRadius = (radiusBase) => {
    let radiusLG = radiusBase;
    let radiusSM = radiusBase;
    let radiusXS = radiusBase;
    let radiusOuter = radiusBase;
    if (radiusBase < 6 && radiusBase >= 5) {
      radiusLG = radiusBase + 1;
    } else if (radiusBase < 16 && radiusBase >= 6) {
      radiusLG = radiusBase + 2;
    } else if (radiusBase >= 16) {
      radiusLG = 16;
    }
    if (radiusBase < 7 && radiusBase >= 5) {
      radiusSM = 4;
    } else if (radiusBase < 8 && radiusBase >= 7) {
      radiusSM = 5;
    } else if (radiusBase < 14 && radiusBase >= 8) {
      radiusSM = 6;
    } else if (radiusBase < 16 && radiusBase >= 14) {
      radiusSM = 7;
    } else if (radiusBase >= 16) {
      radiusSM = 8;
    }
    if (radiusBase < 6 && radiusBase >= 2) {
      radiusXS = 1;
    } else if (radiusBase >= 6) {
      radiusXS = 2;
    }
    if (radiusBase > 4 && radiusBase < 8) {
      radiusOuter = 4;
    } else if (radiusBase >= 8) {
      radiusOuter = 6;
    }
    return {
      borderRadius: radiusBase,
      borderRadiusXS: radiusXS,
      borderRadiusSM: radiusSM,
      borderRadiusLG: radiusLG,
      borderRadiusOuter: radiusOuter
    };
  };
  function genCommonMapToken(token2) {
    const {
      motionUnit,
      motionBase,
      borderRadius,
      lineWidth
    } = token2;
    return Object.assign({
      // motion
      motionDurationFast: `${(motionBase + motionUnit).toFixed(1)}s`,
      motionDurationMid: `${(motionBase + motionUnit * 2).toFixed(1)}s`,
      motionDurationSlow: `${(motionBase + motionUnit * 3).toFixed(1)}s`,
      // line
      lineWidthBold: lineWidth + 1
    }, genRadius(borderRadius));
  }
  const genControlHeight = (token2) => {
    const {
      controlHeight
    } = token2;
    return {
      controlHeightSM: controlHeight * 0.75,
      controlHeightXS: controlHeight * 0.5,
      controlHeightLG: controlHeight * 1.25
    };
  };
  function getLineHeight(fontSize) {
    return (fontSize + 8) / fontSize;
  }
  function getFontSizes(base) {
    const fontSizes = Array.from({
      length: 10
    }).map((_, index) => {
      const i = index - 1;
      const baseSize = base * Math.pow(Math.E, i / 5);
      const intSize = index > 1 ? Math.floor(baseSize) : Math.ceil(baseSize);
      return Math.floor(intSize / 2) * 2;
    });
    fontSizes[1] = base;
    return fontSizes.map((size) => ({
      size,
      lineHeight: getLineHeight(size)
    }));
  }
  const genFontMapToken = (fontSize) => {
    const fontSizePairs = getFontSizes(fontSize);
    const fontSizes = fontSizePairs.map((pair) => pair.size);
    const lineHeights = fontSizePairs.map((pair) => pair.lineHeight);
    const fontSizeMD = fontSizes[1];
    const fontSizeSM = fontSizes[0];
    const fontSizeLG = fontSizes[2];
    const lineHeight = lineHeights[1];
    const lineHeightSM = lineHeights[0];
    const lineHeightLG = lineHeights[2];
    return {
      fontSizeSM,
      fontSize: fontSizeMD,
      fontSizeLG,
      fontSizeXL: fontSizes[3],
      fontSizeHeading1: fontSizes[6],
      fontSizeHeading2: fontSizes[5],
      fontSizeHeading3: fontSizes[4],
      fontSizeHeading4: fontSizes[3],
      fontSizeHeading5: fontSizes[2],
      lineHeight,
      lineHeightLG,
      lineHeightSM,
      fontHeight: Math.round(lineHeight * fontSizeMD),
      fontHeightLG: Math.round(lineHeightLG * fontSizeLG),
      fontHeightSM: Math.round(lineHeightSM * fontSizeSM),
      lineHeightHeading1: lineHeights[6],
      lineHeightHeading2: lineHeights[5],
      lineHeightHeading3: lineHeights[4],
      lineHeightHeading4: lineHeights[3],
      lineHeightHeading5: lineHeights[2]
    };
  };
  function genSizeMapToken(token2) {
    const {
      sizeUnit,
      sizeStep
    } = token2;
    return {
      sizeXXL: sizeUnit * (sizeStep + 8),
      // 48
      sizeXL: sizeUnit * (sizeStep + 4),
      // 32
      sizeLG: sizeUnit * (sizeStep + 2),
      // 24
      sizeMD: sizeUnit * (sizeStep + 1),
      // 20
      sizeMS: sizeUnit * sizeStep,
      // 16
      size: sizeUnit * sizeStep,
      // 16
      sizeSM: sizeUnit * (sizeStep - 1),
      // 12
      sizeXS: sizeUnit * (sizeStep - 2),
      // 8
      sizeXXS: sizeUnit * (sizeStep - 3)
      // 4
    };
  }
  const getAlphaColor$1 = (baseColor, alpha) => new FastColor(baseColor).setA(alpha).toRgbString();
  const getSolidColor = (baseColor, brightness) => {
    const instance = new FastColor(baseColor);
    return instance.darken(brightness).toHexString();
  };
  const generateColorPalettes = (baseColor) => {
    const colors = generate$1(baseColor);
    return {
      1: colors[0],
      2: colors[1],
      3: colors[2],
      4: colors[3],
      5: colors[4],
      6: colors[5],
      7: colors[6],
      8: colors[4],
      9: colors[5],
      10: colors[6]
      // 8: colors[7],
      // 9: colors[8],
      // 10: colors[9],
    };
  };
  const generateNeutralColorPalettes = (bgBaseColor, textBaseColor) => {
    const colorBgBase = bgBaseColor || "#fff";
    const colorTextBase = textBaseColor || "#000";
    return {
      colorBgBase,
      colorTextBase,
      colorText: getAlphaColor$1(colorTextBase, 0.88),
      colorTextSecondary: getAlphaColor$1(colorTextBase, 0.65),
      colorTextTertiary: getAlphaColor$1(colorTextBase, 0.45),
      colorTextQuaternary: getAlphaColor$1(colorTextBase, 0.25),
      colorFill: getAlphaColor$1(colorTextBase, 0.15),
      colorFillSecondary: getAlphaColor$1(colorTextBase, 0.06),
      colorFillTertiary: getAlphaColor$1(colorTextBase, 0.04),
      colorFillQuaternary: getAlphaColor$1(colorTextBase, 0.02),
      colorBgSolid: getAlphaColor$1(colorTextBase, 1),
      colorBgSolidHover: getAlphaColor$1(colorTextBase, 0.75),
      colorBgSolidActive: getAlphaColor$1(colorTextBase, 0.95),
      colorBgLayout: getSolidColor(colorBgBase, 4),
      colorBgContainer: getSolidColor(colorBgBase, 0),
      colorBgElevated: getSolidColor(colorBgBase, 0),
      colorBgSpotlight: getAlphaColor$1(colorTextBase, 0.85),
      colorBgBlur: "transparent",
      colorBorder: getSolidColor(colorBgBase, 15),
      colorBorderSecondary: getSolidColor(colorBgBase, 6)
    };
  };
  function derivative(token2) {
    presetPrimaryColors.pink = presetPrimaryColors.magenta;
    presetPalettes.pink = presetPalettes.magenta;
    const colorPalettes = Object.keys(defaultPresetColors).map((colorKey) => {
      const colors = token2[colorKey] === presetPrimaryColors[colorKey] ? presetPalettes[colorKey] : generate$1(token2[colorKey]);
      return Array.from({
        length: 10
      }, () => 1).reduce((prev2, _, i) => {
        prev2[`${colorKey}-${i + 1}`] = colors[i];
        prev2[`${colorKey}${i + 1}`] = colors[i];
        return prev2;
      }, {});
    }).reduce((prev2, cur) => {
      prev2 = Object.assign(Object.assign({}, prev2), cur);
      return prev2;
    }, {});
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, token2), colorPalettes), genColorMapToken(token2, {
      generateColorPalettes,
      generateNeutralColorPalettes
    })), genFontMapToken(token2.fontSize)), genSizeMapToken(token2)), genControlHeight(token2)), genCommonMapToken(token2));
  }
  const defaultTheme = createTheme(derivative);
  const defaultConfig = {
    token: seedToken,
    override: {
      override: seedToken
    },
    hashed: true
  };
  const DesignTokenContext = /* @__PURE__ */ React.createContext(defaultConfig);
  const defaultPrefixCls = "ant";
  const defaultIconPrefixCls = "anticon";
  const defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) {
      return customizePrefixCls;
    }
    return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
  };
  const ConfigContext = /* @__PURE__ */ reactExports.createContext({
    // We provide a default function for Context without provider
    getPrefixCls: defaultGetPrefixCls,
    iconPrefixCls: defaultIconPrefixCls
  });
  const {
    Consumer: ConfigConsumer
  } = ConfigContext;
  const EMPTY_OBJECT = {};
  function useComponentConfig(propName) {
    const context = reactExports.useContext(ConfigContext);
    const {
      getPrefixCls,
      direction,
      getPopupContainer
    } = context;
    const propValue = context[propName];
    return Object.assign(Object.assign({
      classNames: EMPTY_OBJECT,
      styles: EMPTY_OBJECT
    }, propValue), {
      getPrefixCls,
      direction,
      getPopupContainer
    });
  }
  const DisabledContext = /* @__PURE__ */ reactExports.createContext(false);
  const SizeContext = /* @__PURE__ */ reactExports.createContext(void 0);
  var AbstractCalculator = /* @__PURE__ */ _createClass(function AbstractCalculator2() {
    _classCallCheck(this, AbstractCalculator2);
  });
  var CALC_UNIT = "CALC_UNIT";
  var regexp = new RegExp(CALC_UNIT, "g");
  function unit(value) {
    if (typeof value === "number") {
      return "".concat(value).concat(CALC_UNIT);
    }
    return value;
  }
  var CSSCalculator = /* @__PURE__ */ function(_AbstractCalculator) {
    _inherits(CSSCalculator2, _AbstractCalculator);
    var _super = _createSuper(CSSCalculator2);
    function CSSCalculator2(num, unitlessCssVar) {
      var _this;
      _classCallCheck(this, CSSCalculator2);
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "result", "");
      _defineProperty(_assertThisInitialized(_this), "unitlessCssVar", void 0);
      _defineProperty(_assertThisInitialized(_this), "lowPriority", void 0);
      var numType = _typeof(num);
      _this.unitlessCssVar = unitlessCssVar;
      if (num instanceof CSSCalculator2) {
        _this.result = "(".concat(num.result, ")");
      } else if (numType === "number") {
        _this.result = unit(num);
      } else if (numType === "string") {
        _this.result = num;
      }
      return _this;
    }
    _createClass(CSSCalculator2, [{
      key: "add",
      value: function add(num) {
        if (num instanceof CSSCalculator2) {
          this.result = "".concat(this.result, " + ").concat(num.getResult());
        } else if (typeof num === "number" || typeof num === "string") {
          this.result = "".concat(this.result, " + ").concat(unit(num));
        }
        this.lowPriority = true;
        return this;
      }
    }, {
      key: "sub",
      value: function sub(num) {
        if (num instanceof CSSCalculator2) {
          this.result = "".concat(this.result, " - ").concat(num.getResult());
        } else if (typeof num === "number" || typeof num === "string") {
          this.result = "".concat(this.result, " - ").concat(unit(num));
        }
        this.lowPriority = true;
        return this;
      }
    }, {
      key: "mul",
      value: function mul(num) {
        if (this.lowPriority) {
          this.result = "(".concat(this.result, ")");
        }
        if (num instanceof CSSCalculator2) {
          this.result = "".concat(this.result, " * ").concat(num.getResult(true));
        } else if (typeof num === "number" || typeof num === "string") {
          this.result = "".concat(this.result, " * ").concat(num);
        }
        this.lowPriority = false;
        return this;
      }
    }, {
      key: "div",
      value: function div(num) {
        if (this.lowPriority) {
          this.result = "(".concat(this.result, ")");
        }
        if (num instanceof CSSCalculator2) {
          this.result = "".concat(this.result, " / ").concat(num.getResult(true));
        } else if (typeof num === "number" || typeof num === "string") {
          this.result = "".concat(this.result, " / ").concat(num);
        }
        this.lowPriority = false;
        return this;
      }
    }, {
      key: "getResult",
      value: function getResult(force) {
        return this.lowPriority || force ? "(".concat(this.result, ")") : this.result;
      }
    }, {
      key: "equal",
      value: function equal(options) {
        var _this2 = this;
        var _ref = options || {}, cssUnit = _ref.unit;
        var mergedUnit = true;
        if (typeof cssUnit === "boolean") {
          mergedUnit = cssUnit;
        } else if (Array.from(this.unitlessCssVar).some(function(cssVar) {
          return _this2.result.includes(cssVar);
        })) {
          mergedUnit = false;
        }
        this.result = this.result.replace(regexp, mergedUnit ? "px" : "");
        if (typeof this.lowPriority !== "undefined") {
          return "calc(".concat(this.result, ")");
        }
        return this.result;
      }
    }]);
    return CSSCalculator2;
  }(AbstractCalculator);
  var NumCalculator = /* @__PURE__ */ function(_AbstractCalculator) {
    _inherits(NumCalculator2, _AbstractCalculator);
    var _super = _createSuper(NumCalculator2);
    function NumCalculator2(num) {
      var _this;
      _classCallCheck(this, NumCalculator2);
      _this = _super.call(this);
      _defineProperty(_assertThisInitialized(_this), "result", 0);
      if (num instanceof NumCalculator2) {
        _this.result = num.result;
      } else if (typeof num === "number") {
        _this.result = num;
      }
      return _this;
    }
    _createClass(NumCalculator2, [{
      key: "add",
      value: function add(num) {
        if (num instanceof NumCalculator2) {
          this.result += num.result;
        } else if (typeof num === "number") {
          this.result += num;
        }
        return this;
      }
    }, {
      key: "sub",
      value: function sub(num) {
        if (num instanceof NumCalculator2) {
          this.result -= num.result;
        } else if (typeof num === "number") {
          this.result -= num;
        }
        return this;
      }
    }, {
      key: "mul",
      value: function mul(num) {
        if (num instanceof NumCalculator2) {
          this.result *= num.result;
        } else if (typeof num === "number") {
          this.result *= num;
        }
        return this;
      }
    }, {
      key: "div",
      value: function div(num) {
        if (num instanceof NumCalculator2) {
          this.result /= num.result;
        } else if (typeof num === "number") {
          this.result /= num;
        }
        return this;
      }
    }, {
      key: "equal",
      value: function equal() {
        return this.result;
      }
    }]);
    return NumCalculator2;
  }(AbstractCalculator);
  var genCalc = function genCalc2(type, unitlessCssVar) {
    var Calculator = type === "css" ? CSSCalculator : NumCalculator;
    return function(num) {
      return new Calculator(num, unitlessCssVar);
    };
  };
  var getCompVarPrefix = function getCompVarPrefix2(component, prefix) {
    return "".concat([prefix, component.replace(/([A-Z]+)([A-Z][a-z]+)/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2")].filter(Boolean).join("-"));
  };
  function useEvent(callback) {
    var fnRef = reactExports.useRef();
    fnRef.current = callback;
    var memoFn = reactExports.useCallback(function() {
      var _fnRef$current;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return (_fnRef$current = fnRef.current) === null || _fnRef$current === void 0 ? void 0 : _fnRef$current.call.apply(_fnRef$current, [fnRef].concat(args));
    }, []);
    return memoFn;
  }
  function useSafeState(defaultValue) {
    var destroyRef = reactExports.useRef(false);
    var _React$useState = reactExports.useState(defaultValue), _React$useState2 = _slicedToArray(_React$useState, 2), value = _React$useState2[0], setValue = _React$useState2[1];
    reactExports.useEffect(function() {
      destroyRef.current = false;
      return function() {
        destroyRef.current = true;
      };
    }, []);
    function safeSetState(updater, ignoreDestroy) {
      if (ignoreDestroy && destroyRef.current) {
        return;
      }
      setValue(updater);
    }
    return [value, safeSetState];
  }
  function getComponentToken(component, token2, defaultToken, options) {
    var customToken = _objectSpread2({}, token2[component]);
    if (options !== null && options !== void 0 && options.deprecatedTokens) {
      var deprecatedTokens = options.deprecatedTokens;
      deprecatedTokens.forEach(function(_ref) {
        var _ref2 = _slicedToArray(_ref, 2), oldTokenKey = _ref2[0], newTokenKey = _ref2[1];
        if (customToken !== null && customToken !== void 0 && customToken[oldTokenKey] || customToken !== null && customToken !== void 0 && customToken[newTokenKey]) {
          var _customToken$newToken;
          (_customToken$newToken = customToken[newTokenKey]) !== null && _customToken$newToken !== void 0 ? _customToken$newToken : customToken[newTokenKey] = customToken === null || customToken === void 0 ? void 0 : customToken[oldTokenKey];
        }
      });
    }
    var mergedToken = _objectSpread2(_objectSpread2({}, defaultToken), customToken);
    Object.keys(mergedToken).forEach(function(key) {
      if (mergedToken[key] === token2[key]) {
        delete mergedToken[key];
      }
    });
    return mergedToken;
  }
  var enableStatistic = typeof CSSINJS_STATISTIC !== "undefined";
  var recording = true;
  function merge() {
    for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
      objs[_key] = arguments[_key];
    }
    if (!enableStatistic) {
      return Object.assign.apply(Object, [{}].concat(objs));
    }
    recording = false;
    var ret = {};
    objs.forEach(function(obj) {
      if (_typeof(obj) !== "object") {
        return;
      }
      var keys = Object.keys(obj);
      keys.forEach(function(key) {
        Object.defineProperty(ret, key, {
          configurable: true,
          enumerable: true,
          get: function get() {
            return obj[key];
          }
        });
      });
    });
    recording = true;
    return ret;
  }
  var statistic = {};
  function noop() {
  }
  var statisticToken = function statisticToken2(token2) {
    var tokenKeys2;
    var proxy = token2;
    var flush = noop;
    if (enableStatistic && typeof Proxy !== "undefined") {
      tokenKeys2 = /* @__PURE__ */ new Set();
      proxy = new Proxy(token2, {
        get: function get(obj, prop) {
          if (recording) {
            var _tokenKeys;
            (_tokenKeys = tokenKeys2) === null || _tokenKeys === void 0 || _tokenKeys.add(prop);
          }
          return obj[prop];
        }
      });
      flush = function flush2(componentName, componentToken) {
        var _statistic$componentN;
        statistic[componentName] = {
          global: Array.from(tokenKeys2),
          component: _objectSpread2(_objectSpread2({}, (_statistic$componentN = statistic[componentName]) === null || _statistic$componentN === void 0 ? void 0 : _statistic$componentN.component), componentToken)
        };
      };
    }
    return {
      token: proxy,
      keys: tokenKeys2,
      flush
    };
  };
  function getDefaultComponentToken(component, token2, getDefaultToken) {
    if (typeof getDefaultToken === "function") {
      var _token$component;
      return getDefaultToken(merge(token2, (_token$component = token2[component]) !== null && _token$component !== void 0 ? _token$component : {}));
    }
    return getDefaultToken !== null && getDefaultToken !== void 0 ? getDefaultToken : {};
  }
  function genMaxMin(type) {
    if (type === "js") {
      return {
        max: Math.max,
        min: Math.min
      };
    }
    return {
      max: function max() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return "max(".concat(args.map(function(value) {
          return unit$1(value);
        }).join(","), ")");
      },
      min: function min() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return "min(".concat(args.map(function(value) {
          return unit$1(value);
        }).join(","), ")");
      }
    };
  }
  var BEAT_LIMIT = 1e3 * 60 * 10;
  var ArrayKeyMap = /* @__PURE__ */ function() {
    function ArrayKeyMap2() {
      _classCallCheck(this, ArrayKeyMap2);
      _defineProperty(this, "map", /* @__PURE__ */ new Map());
      _defineProperty(this, "objectIDMap", /* @__PURE__ */ new WeakMap());
      _defineProperty(this, "nextID", 0);
      _defineProperty(this, "lastAccessBeat", /* @__PURE__ */ new Map());
      _defineProperty(this, "accessBeat", 0);
    }
    _createClass(ArrayKeyMap2, [{
      key: "set",
      value: function set(keys, value) {
        this.clear();
        var compositeKey = this.getCompositeKey(keys);
        this.map.set(compositeKey, value);
        this.lastAccessBeat.set(compositeKey, Date.now());
      }
    }, {
      key: "get",
      value: function get(keys) {
        var compositeKey = this.getCompositeKey(keys);
        var cache = this.map.get(compositeKey);
        this.lastAccessBeat.set(compositeKey, Date.now());
        this.accessBeat += 1;
        return cache;
      }
    }, {
      key: "getCompositeKey",
      value: function getCompositeKey(keys) {
        var _this = this;
        var ids = keys.map(function(key) {
          if (key && _typeof(key) === "object") {
            return "obj_".concat(_this.getObjectID(key));
          }
          return "".concat(_typeof(key), "_").concat(key);
        });
        return ids.join("|");
      }
    }, {
      key: "getObjectID",
      value: function getObjectID(obj) {
        if (this.objectIDMap.has(obj)) {
          return this.objectIDMap.get(obj);
        }
        var id2 = this.nextID;
        this.objectIDMap.set(obj, id2);
        this.nextID += 1;
        return id2;
      }
    }, {
      key: "clear",
      value: function clear() {
        var _this2 = this;
        if (this.accessBeat > 1e4) {
          var now = Date.now();
          this.lastAccessBeat.forEach(function(beat, key) {
            if (now - beat > BEAT_LIMIT) {
              _this2.map.delete(key);
              _this2.lastAccessBeat.delete(key);
            }
          });
          this.accessBeat = 0;
        }
      }
    }]);
    return ArrayKeyMap2;
  }();
  var uniqueMap = new ArrayKeyMap();
  function useUniqueMemo(memoFn, deps) {
    return React.useMemo(function() {
      var cachedValue = uniqueMap.get(deps);
      if (cachedValue) {
        return cachedValue;
      }
      var newValue = memoFn();
      uniqueMap.set(deps, newValue);
      return newValue;
    }, deps);
  }
  var useDefaultCSP = function useDefaultCSP2() {
    return {};
  };
  function genStyleUtils(config) {
    var _config$useCSP = config.useCSP, useCSP = _config$useCSP === void 0 ? useDefaultCSP : _config$useCSP, useToken2 = config.useToken, usePrefix = config.usePrefix, getResetStyles = config.getResetStyles, getCommonStyle = config.getCommonStyle, getCompUnitless = config.getCompUnitless;
    function genStyleHooks2(component, styleFn, getDefaultToken, options) {
      var componentName = Array.isArray(component) ? component[0] : component;
      function prefixToken(key) {
        return "".concat(String(componentName)).concat(key.slice(0, 1).toUpperCase()).concat(key.slice(1));
      }
      var originUnitless = (options === null || options === void 0 ? void 0 : options.unitless) || {};
      var originCompUnitless = typeof getCompUnitless === "function" ? getCompUnitless(component) : {};
      var compUnitless = _objectSpread2(_objectSpread2({}, originCompUnitless), {}, _defineProperty({}, prefixToken("zIndexPopup"), true));
      Object.keys(originUnitless).forEach(function(key) {
        compUnitless[prefixToken(key)] = originUnitless[key];
      });
      var mergedOptions = _objectSpread2(_objectSpread2({}, options), {}, {
        unitless: compUnitless,
        prefixToken
      });
      var useStyle2 = genComponentStyleHook2(component, styleFn, getDefaultToken, mergedOptions);
      var useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);
      return function(prefixCls) {
        var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
        var _useStyle = useStyle2(prefixCls, rootCls), _useStyle2 = _slicedToArray(_useStyle, 2), hashId = _useStyle2[1];
        var _useCSSVar = useCSSVar(rootCls), _useCSSVar2 = _slicedToArray(_useCSSVar, 2), wrapCSSVar = _useCSSVar2[0], cssVarCls = _useCSSVar2[1];
        return [wrapCSSVar, hashId, cssVarCls];
      };
    }
    function genCSSVarRegister(component, getDefaultToken, options) {
      var compUnitless = options.unitless, _options$injectStyle = options.injectStyle, injectStyle = _options$injectStyle === void 0 ? true : _options$injectStyle, prefixToken = options.prefixToken, ignore2 = options.ignore;
      var CSSVarRegister = function CSSVarRegister2(_ref) {
        var rootCls = _ref.rootCls, _ref$cssVar = _ref.cssVar, cssVar = _ref$cssVar === void 0 ? {} : _ref$cssVar;
        var _useToken = useToken2(), realToken = _useToken.realToken;
        useCSSVarRegister({
          path: [component],
          prefix: cssVar.prefix,
          key: cssVar.key,
          unitless: compUnitless,
          ignore: ignore2,
          token: realToken,
          scope: rootCls
        }, function() {
          var defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
          var componentToken = getComponentToken(component, realToken, defaultToken, {
            deprecatedTokens: options === null || options === void 0 ? void 0 : options.deprecatedTokens
          });
          Object.keys(defaultToken).forEach(function(key) {
            componentToken[prefixToken(key)] = componentToken[key];
            delete componentToken[key];
          });
          return componentToken;
        });
        return null;
      };
      var useCSSVar = function useCSSVar2(rootCls) {
        var _useToken2 = useToken2(), cssVar = _useToken2.cssVar;
        return [function(node2) {
          return injectStyle && cssVar ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CSSVarRegister, {
            rootCls,
            cssVar,
            component
          }), node2) : node2;
        }, cssVar === null || cssVar === void 0 ? void 0 : cssVar.key];
      };
      return useCSSVar;
    }
    function genComponentStyleHook2(componentName, styleFn, getDefaultToken) {
      var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      var cells = Array.isArray(componentName) ? componentName : [componentName, componentName];
      var _cells = _slicedToArray(cells, 1), component = _cells[0];
      var concatComponent = cells.join("-");
      var mergedLayer = config.layer || {
        name: "antd"
      };
      return function(prefixCls) {
        var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
        var _useToken3 = useToken2(), theme = _useToken3.theme, realToken = _useToken3.realToken, hashId = _useToken3.hashId, token2 = _useToken3.token, cssVar = _useToken3.cssVar;
        var _usePrefix = usePrefix(), rootPrefixCls = _usePrefix.rootPrefixCls, iconPrefixCls = _usePrefix.iconPrefixCls;
        var csp = useCSP();
        var type = cssVar ? "css" : "js";
        var calc = useUniqueMemo(function() {
          var unitlessCssVar = /* @__PURE__ */ new Set();
          if (cssVar) {
            Object.keys(options.unitless || {}).forEach(function(key) {
              unitlessCssVar.add(token2CSSVar(key, cssVar.prefix));
              unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)));
            });
          }
          return genCalc(type, unitlessCssVar);
        }, [type, component, cssVar === null || cssVar === void 0 ? void 0 : cssVar.prefix]);
        var _genMaxMin = genMaxMin(type), max = _genMaxMin.max, min = _genMaxMin.min;
        var sharedConfig = {
          theme,
          token: token2,
          hashId,
          nonce: function nonce() {
            return csp.nonce;
          },
          clientOnly: options.clientOnly,
          layer: mergedLayer,
          // antd is always at top of styles
          order: options.order || -999
        };
        if (typeof getResetStyles === "function") {
          useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
            clientOnly: false,
            path: ["Shared", rootPrefixCls]
          }), function() {
            return getResetStyles(token2, {
              prefix: {
                rootPrefixCls,
                iconPrefixCls
              },
              csp
            });
          });
        }
        var wrapSSR = useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
          path: [concatComponent, prefixCls, iconPrefixCls]
        }), function() {
          if (options.injectStyle === false) {
            return [];
          }
          var _statisticToken = statisticToken(token2), proxyToken = _statisticToken.token, flush = _statisticToken.flush;
          var defaultComponentToken = getDefaultComponentToken(component, realToken, getDefaultToken);
          var componentCls = ".".concat(prefixCls);
          var componentToken = getComponentToken(component, realToken, defaultComponentToken, {
            deprecatedTokens: options.deprecatedTokens
          });
          if (cssVar && defaultComponentToken && _typeof(defaultComponentToken) === "object") {
            Object.keys(defaultComponentToken).forEach(function(key) {
              defaultComponentToken[key] = "var(".concat(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)), ")");
            });
          }
          var mergedToken = merge(proxyToken, {
            componentCls,
            prefixCls,
            iconCls: ".".concat(iconPrefixCls),
            antCls: ".".concat(rootPrefixCls),
            calc,
            // @ts-ignore
            max,
            // @ts-ignore
            min
          }, cssVar ? defaultComponentToken : componentToken);
          var styleInterpolation = styleFn(mergedToken, {
            hashId,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls
          });
          flush(component, componentToken);
          var commonStyle = typeof getCommonStyle === "function" ? getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont) : null;
          return [options.resetStyle === false ? null : commonStyle, styleInterpolation];
        });
        return [wrapSSR, hashId];
      };
    }
    function genSubStyleComponent2(componentName, styleFn, getDefaultToken) {
      var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      var useStyle2 = genComponentStyleHook2(componentName, styleFn, getDefaultToken, _objectSpread2({
        resetStyle: false,
        // Sub Style should default after root one
        order: -998
      }, options));
      var StyledComponent = function StyledComponent2(_ref2) {
        var prefixCls = _ref2.prefixCls, _ref2$rootCls = _ref2.rootCls, rootCls = _ref2$rootCls === void 0 ? prefixCls : _ref2$rootCls;
        useStyle2(prefixCls, rootCls);
        return null;
      };
      return StyledComponent;
    }
    return {
      genStyleHooks: genStyleHooks2,
      genSubStyleComponent: genSubStyleComponent2,
      genComponentStyleHook: genComponentStyleHook2
    };
  }
  const PresetColors = ["blue", "purple", "cyan", "green", "magenta", "pink", "red", "orange", "yellow", "volcano", "geekblue", "lime", "gold"];
  const version$1 = "5.27.6";
  function isStableColor(color) {
    return color >= 0 && color <= 255;
  }
  function getAlphaColor(frontColor, backgroundColor) {
    const {
      r: fR,
      g: fG,
      b: fB,
      a: originAlpha
    } = new FastColor(frontColor).toRgb();
    if (originAlpha < 1) {
      return frontColor;
    }
    const {
      r: bR,
      g: bG,
      b: bB
    } = new FastColor(backgroundColor).toRgb();
    for (let fA = 0.01; fA <= 1; fA += 0.01) {
      const r2 = Math.round((fR - bR * (1 - fA)) / fA);
      const g2 = Math.round((fG - bG * (1 - fA)) / fA);
      const b2 = Math.round((fB - bB * (1 - fA)) / fA);
      if (isStableColor(r2) && isStableColor(g2) && isStableColor(b2)) {
        return new FastColor({
          r: r2,
          g: g2,
          b: b2,
          a: Math.round(fA * 100) / 100
        }).toRgbString();
      }
    }
    return new FastColor({
      r: fR,
      g: fG,
      b: fB,
      a: 1
    }).toRgbString();
  }
  var __rest$3 = function(s, e2) {
    var t2 = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0) t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i])) t2[p2[i]] = s[p2[i]];
    }
    return t2;
  };
  function formatToken(derivativeToken) {
    const {
      override
    } = derivativeToken, restToken = __rest$3(derivativeToken, ["override"]);
    const overrideTokens = Object.assign({}, override);
    Object.keys(seedToken).forEach((token2) => {
      delete overrideTokens[token2];
    });
    const mergedToken = Object.assign(Object.assign({}, restToken), overrideTokens);
    const screenXS = 480;
    const screenSM = 576;
    const screenMD = 768;
    const screenLG = 992;
    const screenXL = 1200;
    const screenXXL = 1600;
    if (mergedToken.motion === false) {
      const fastDuration = "0s";
      mergedToken.motionDurationFast = fastDuration;
      mergedToken.motionDurationMid = fastDuration;
      mergedToken.motionDurationSlow = fastDuration;
    }
    const aliasToken = Object.assign(Object.assign(Object.assign({}, mergedToken), {
      // ============== Background ============== //
      colorFillContent: mergedToken.colorFillSecondary,
      colorFillContentHover: mergedToken.colorFill,
      colorFillAlter: mergedToken.colorFillQuaternary,
      colorBgContainerDisabled: mergedToken.colorFillTertiary,
      // ============== Split ============== //
      colorBorderBg: mergedToken.colorBgContainer,
      colorSplit: getAlphaColor(mergedToken.colorBorderSecondary, mergedToken.colorBgContainer),
      // ============== Text ============== //
      colorTextPlaceholder: mergedToken.colorTextQuaternary,
      colorTextDisabled: mergedToken.colorTextQuaternary,
      colorTextHeading: mergedToken.colorText,
      colorTextLabel: mergedToken.colorTextSecondary,
      colorTextDescription: mergedToken.colorTextTertiary,
      colorTextLightSolid: mergedToken.colorWhite,
      colorHighlight: mergedToken.colorError,
      colorBgTextHover: mergedToken.colorFillSecondary,
      colorBgTextActive: mergedToken.colorFill,
      colorIcon: mergedToken.colorTextTertiary,
      colorIconHover: mergedToken.colorText,
      colorErrorOutline: getAlphaColor(mergedToken.colorErrorBg, mergedToken.colorBgContainer),
      colorWarningOutline: getAlphaColor(mergedToken.colorWarningBg, mergedToken.colorBgContainer),
      // Font
      fontSizeIcon: mergedToken.fontSizeSM,
      // Line
      lineWidthFocus: mergedToken.lineWidth * 3,
      // Control
      lineWidth: mergedToken.lineWidth,
      controlOutlineWidth: mergedToken.lineWidth * 2,
      // Checkbox size and expand icon size
      controlInteractiveSize: mergedToken.controlHeight / 2,
      controlItemBgHover: mergedToken.colorFillTertiary,
      controlItemBgActive: mergedToken.colorPrimaryBg,
      controlItemBgActiveHover: mergedToken.colorPrimaryBgHover,
      controlItemBgActiveDisabled: mergedToken.colorFill,
      controlTmpOutline: mergedToken.colorFillQuaternary,
      controlOutline: getAlphaColor(mergedToken.colorPrimaryBg, mergedToken.colorBgContainer),
      lineType: mergedToken.lineType,
      borderRadius: mergedToken.borderRadius,
      borderRadiusXS: mergedToken.borderRadiusXS,
      borderRadiusSM: mergedToken.borderRadiusSM,
      borderRadiusLG: mergedToken.borderRadiusLG,
      fontWeightStrong: 600,
      opacityLoading: 0.65,
      linkDecoration: "none",
      linkHoverDecoration: "none",
      linkFocusDecoration: "none",
      controlPaddingHorizontal: 12,
      controlPaddingHorizontalSM: 8,
      paddingXXS: mergedToken.sizeXXS,
      paddingXS: mergedToken.sizeXS,
      paddingSM: mergedToken.sizeSM,
      padding: mergedToken.size,
      paddingMD: mergedToken.sizeMD,
      paddingLG: mergedToken.sizeLG,
      paddingXL: mergedToken.sizeXL,
      paddingContentHorizontalLG: mergedToken.sizeLG,
      paddingContentVerticalLG: mergedToken.sizeMS,
      paddingContentHorizontal: mergedToken.sizeMS,
      paddingContentVertical: mergedToken.sizeSM,
      paddingContentHorizontalSM: mergedToken.size,
      paddingContentVerticalSM: mergedToken.sizeXS,
      marginXXS: mergedToken.sizeXXS,
      marginXS: mergedToken.sizeXS,
      marginSM: mergedToken.sizeSM,
      margin: mergedToken.size,
      marginMD: mergedToken.sizeMD,
      marginLG: mergedToken.sizeLG,
      marginXL: mergedToken.sizeXL,
      marginXXL: mergedToken.sizeXXL,
      boxShadow: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowSecondary: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowTertiary: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
      screenXS,
      screenXSMin: screenXS,
      screenXSMax: screenSM - 1,
      screenSM,
      screenSMMin: screenSM,
      screenSMMax: screenMD - 1,
      screenMD,
      screenMDMin: screenMD,
      screenMDMax: screenLG - 1,
      screenLG,
      screenLGMin: screenLG,
      screenLGMax: screenXL - 1,
      screenXL,
      screenXLMin: screenXL,
      screenXLMax: screenXXL - 1,
      screenXXL,
      screenXXLMin: screenXXL,
      boxShadowPopoverArrow: "2px 2px 5px rgba(0, 0, 0, 0.05)",
      boxShadowCard: `
      0 1px 2px -2px ${new FastColor("rgba(0, 0, 0, 0.16)").toRgbString()},
      0 3px 6px 0 ${new FastColor("rgba(0, 0, 0, 0.12)").toRgbString()},
      0 5px 12px 4px ${new FastColor("rgba(0, 0, 0, 0.09)").toRgbString()}
    `,
      boxShadowDrawerRight: `
      -6px 0 16px 0 rgba(0, 0, 0, 0.08),
      -3px 0 6px -4px rgba(0, 0, 0, 0.12),
      -9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowDrawerLeft: `
      6px 0 16px 0 rgba(0, 0, 0, 0.08),
      3px 0 6px -4px rgba(0, 0, 0, 0.12),
      9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowDrawerUp: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowDrawerDown: `
      0 -6px 16px 0 rgba(0, 0, 0, 0.08),
      0 -3px 6px -4px rgba(0, 0, 0, 0.12),
      0 -9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
      boxShadowTabsOverflowLeft: "inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)",
      boxShadowTabsOverflowRight: "inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)",
      boxShadowTabsOverflowTop: "inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)",
      boxShadowTabsOverflowBottom: "inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)"
    }), overrideTokens);
    return aliasToken;
  }
  var __rest$2 = function(s, e2) {
    var t2 = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0) t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i])) t2[p2[i]] = s[p2[i]];
    }
    return t2;
  };
  const unitless = {
    lineHeight: true,
    lineHeightSM: true,
    lineHeightLG: true,
    lineHeightHeading1: true,
    lineHeightHeading2: true,
    lineHeightHeading3: true,
    lineHeightHeading4: true,
    lineHeightHeading5: true,
    opacityLoading: true,
    fontWeightStrong: true,
    zIndexPopupBase: true,
    zIndexBase: true,
    opacityImage: true
  };
  const ignore = {
    motionBase: true,
    motionUnit: true
  };
  const preserve = {
    screenXS: true,
    screenXSMin: true,
    screenXSMax: true,
    screenSM: true,
    screenSMMin: true,
    screenSMMax: true,
    screenMD: true,
    screenMDMin: true,
    screenMDMax: true,
    screenLG: true,
    screenLGMin: true,
    screenLGMax: true,
    screenXL: true,
    screenXLMin: true,
    screenXLMax: true,
    screenXXL: true,
    screenXXLMin: true
  };
  const getComputedToken = (originToken, overrideToken, theme) => {
    const derivativeToken = theme.getDerivativeToken(originToken);
    const {
      override
    } = overrideToken, components = __rest$2(overrideToken, ["override"]);
    let mergedDerivativeToken = Object.assign(Object.assign({}, derivativeToken), {
      override
    });
    mergedDerivativeToken = formatToken(mergedDerivativeToken);
    if (components) {
      Object.entries(components).forEach(([key, value]) => {
        const {
          theme: componentTheme
        } = value, componentTokens = __rest$2(value, ["theme"]);
        let mergedComponentToken = componentTokens;
        if (componentTheme) {
          mergedComponentToken = getComputedToken(Object.assign(Object.assign({}, mergedDerivativeToken), componentTokens), {
            override: componentTokens
          }, componentTheme);
        }
        mergedDerivativeToken[key] = mergedComponentToken;
      });
    }
    return mergedDerivativeToken;
  };
  function useToken() {
    const {
      token: rootDesignToken,
      hashed,
      theme,
      override,
      cssVar
    } = React.useContext(DesignTokenContext);
    const salt = `${version$1}-${hashed || ""}`;
    const mergedTheme = theme || defaultTheme;
    const [token2, hashId, realToken] = useCacheToken(mergedTheme, [seedToken, rootDesignToken], {
      salt,
      override,
      getComputedToken,
      // formatToken will not be consumed after 1.15.0 with getComputedToken.
      // But token will break if @ant-design/cssinjs is under 1.15.0 without it
      formatToken,
      cssVar: cssVar && {
        prefix: cssVar.prefix,
        key: cssVar.key,
        unitless,
        ignore,
        preserve
      }
    });
    return [mergedTheme, realToken, hashed ? hashId : "", token2, cssVar];
  }
  const resetIcon = () => ({
    display: "inline-flex",
    alignItems: "center",
    color: "inherit",
    fontStyle: "normal",
    lineHeight: 0,
    textAlign: "center",
    textTransform: "none",
    // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
    verticalAlign: "-0.125em",
    textRendering: "optimizeLegibility",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    "> *": {
      lineHeight: 1
    },
    svg: {
      display: "inline-block"
    }
  });
  const genLinkStyle$1 = (token2) => ({
    a: {
      color: token2.colorLink,
      textDecoration: token2.linkDecoration,
      backgroundColor: "transparent",
      // remove the gray background on active links in IE 10.
      outline: "none",
      cursor: "pointer",
      transition: `color ${token2.motionDurationSlow}`,
      "-webkit-text-decoration-skip": "objects",
      // remove gaps in links underline in iOS 8+ and Safari 8+.
      "&:hover": {
        color: token2.colorLinkHover
      },
      "&:active": {
        color: token2.colorLinkActive
      },
      "&:active, &:hover": {
        textDecoration: token2.linkHoverDecoration,
        outline: 0
      },
      // https://github.com/ant-design/ant-design/issues/22503
      "&:focus": {
        textDecoration: token2.linkFocusDecoration,
        outline: 0
      },
      "&[disabled]": {
        color: token2.colorTextDisabled,
        cursor: "not-allowed"
      }
    }
  });
  const genCommonStyle = (token2, componentPrefixCls, rootCls, resetFont) => {
    const prefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
    const rootPrefixSelector = rootCls ? `.${rootCls}` : prefixSelector;
    const resetStyle = {
      boxSizing: "border-box",
      "&::before, &::after": {
        boxSizing: "border-box"
      }
    };
    let resetFontStyle = {};
    if (resetFont !== false) {
      resetFontStyle = {
        fontFamily: token2.fontFamily,
        fontSize: token2.fontSize
      };
    }
    return {
      [rootPrefixSelector]: Object.assign(Object.assign(Object.assign({}, resetFontStyle), resetStyle), {
        [prefixSelector]: resetStyle
      })
    };
  };
  const genFocusOutline = (token2, offset) => ({
    outline: `${unit$1(token2.lineWidthFocus)} solid ${token2.colorPrimaryBorder}`,
    outlineOffset: 1,
    transition: "outline-offset 0s, outline 0s"
  });
  const genFocusStyle = (token2, offset) => ({
    "&:focus-visible": genFocusOutline(token2)
  });
  const genIconStyle = (iconPrefixCls) => ({
    [`.${iconPrefixCls}`]: Object.assign(Object.assign({}, resetIcon()), {
      [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
        display: "block"
      }
    })
  });
  const {
    genStyleHooks,
    genComponentStyleHook,
    genSubStyleComponent
  } = genStyleUtils({
    usePrefix: () => {
      const {
        getPrefixCls,
        iconPrefixCls
      } = reactExports.useContext(ConfigContext);
      const rootPrefixCls = getPrefixCls();
      return {
        rootPrefixCls,
        iconPrefixCls
      };
    },
    useToken: () => {
      const [theme, realToken, hashId, token2, cssVar] = useToken();
      return {
        theme,
        realToken,
        hashId,
        token: token2,
        cssVar
      };
    },
    useCSP: () => {
      const {
        csp
      } = reactExports.useContext(ConfigContext);
      return csp !== null && csp !== void 0 ? csp : {};
    },
    getResetStyles: (token2, config) => {
      var _a;
      const linkStyle = genLinkStyle$1(token2);
      return [linkStyle, {
        "&": linkStyle
      }, genIconStyle((_a = config === null || config === void 0 ? void 0 : config.prefix.iconPrefixCls) !== null && _a !== void 0 ? _a : defaultIconPrefixCls)];
    },
    getCommonStyle: genCommonStyle,
    getCompUnitless: () => unitless
  });
  var Context = /* @__PURE__ */ reactExports.createContext({});
  var DomWrapper = /* @__PURE__ */ function(_React$Component) {
    _inherits(DomWrapper2, _React$Component);
    var _super = _createSuper(DomWrapper2);
    function DomWrapper2() {
      _classCallCheck(this, DomWrapper2);
      return _super.apply(this, arguments);
    }
    _createClass(DomWrapper2, [{
      key: "render",
      value: function render2() {
        return this.props.children;
      }
    }]);
    return DomWrapper2;
  }(reactExports.Component);
  function useSyncState(defaultValue) {
    var _React$useReducer = reactExports.useReducer(function(x2) {
      return x2 + 1;
    }, 0), _React$useReducer2 = _slicedToArray(_React$useReducer, 2), forceUpdate = _React$useReducer2[1];
    var currentValueRef = reactExports.useRef(defaultValue);
    var getValue2 = useEvent(function() {
      return currentValueRef.current;
    });
    var setValue = useEvent(function(updater) {
      currentValueRef.current = typeof updater === "function" ? updater(currentValueRef.current) : updater;
      forceUpdate();
    });
    return [getValue2, setValue];
  }
  var STATUS_NONE = "none";
  var STATUS_APPEAR = "appear";
  var STATUS_ENTER = "enter";
  var STATUS_LEAVE = "leave";
  var STEP_NONE = "none";
  var STEP_PREPARE = "prepare";
  var STEP_START = "start";
  var STEP_ACTIVE = "active";
  var STEP_ACTIVATED = "end";
  var STEP_PREPARED = "prepared";
  function makePrefixMap(styleProp, eventName) {
    var prefixes = {};
    prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes["Webkit".concat(styleProp)] = "webkit".concat(eventName);
    prefixes["Moz".concat(styleProp)] = "moz".concat(eventName);
    prefixes["ms".concat(styleProp)] = "MS".concat(eventName);
    prefixes["O".concat(styleProp)] = "o".concat(eventName.toLowerCase());
    return prefixes;
  }
  function getVendorPrefixes(domSupport, win) {
    var prefixes = {
      animationend: makePrefixMap("Animation", "AnimationEnd"),
      transitionend: makePrefixMap("Transition", "TransitionEnd")
    };
    if (domSupport) {
      if (!("AnimationEvent" in win)) {
        delete prefixes.animationend.animation;
      }
      if (!("TransitionEvent" in win)) {
        delete prefixes.transitionend.transition;
      }
    }
    return prefixes;
  }
  var vendorPrefixes = getVendorPrefixes(canUseDom(), typeof window !== "undefined" ? window : {});
  var style = {};
  if (canUseDom()) {
    var _document$createEleme = document.createElement("div");
    style = _document$createEleme.style;
  }
  var prefixedEventNames = {};
  function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName]) {
      return prefixedEventNames[eventName];
    }
    var prefixMap = vendorPrefixes[eventName];
    if (prefixMap) {
      var stylePropList = Object.keys(prefixMap);
      var len = stylePropList.length;
      for (var i = 0; i < len; i += 1) {
        var styleProp = stylePropList[i];
        if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
          prefixedEventNames[eventName] = prefixMap[styleProp];
          return prefixedEventNames[eventName];
        }
      }
    }
    return "";
  }
  var internalAnimationEndName = getVendorPrefixedEventName("animationend");
  var internalTransitionEndName = getVendorPrefixedEventName("transitionend");
  var supportTransition = !!(internalAnimationEndName && internalTransitionEndName);
  var animationEndName = internalAnimationEndName || "animationend";
  var transitionEndName = internalTransitionEndName || "transitionend";
  function getTransitionName(transitionName, transitionType) {
    if (!transitionName) return null;
    if (_typeof(transitionName) === "object") {
      var type = transitionType.replace(/-\w/g, function(match) {
        return match[1].toUpperCase();
      });
      return transitionName[type];
    }
    return "".concat(transitionName, "-").concat(transitionType);
  }
  const useDomMotionEvents = function(onInternalMotionEnd) {
    var cacheElementRef = reactExports.useRef();
    function removeMotionEvents(element) {
      if (element) {
        element.removeEventListener(transitionEndName, onInternalMotionEnd);
        element.removeEventListener(animationEndName, onInternalMotionEnd);
      }
    }
    function patchMotionEvents(element) {
      if (cacheElementRef.current && cacheElementRef.current !== element) {
        removeMotionEvents(cacheElementRef.current);
      }
      if (element && element !== cacheElementRef.current) {
        element.addEventListener(transitionEndName, onInternalMotionEnd);
        element.addEventListener(animationEndName, onInternalMotionEnd);
        cacheElementRef.current = element;
      }
    }
    reactExports.useEffect(function() {
      return function() {
        removeMotionEvents(cacheElementRef.current);
      };
    }, []);
    return [patchMotionEvents, removeMotionEvents];
  };
  var useIsomorphicLayoutEffect = canUseDom() ? reactExports.useLayoutEffect : reactExports.useEffect;
  const useNextFrame = function() {
    var nextFrameRef = reactExports.useRef(null);
    function cancelNextFrame() {
      wrapperRaf.cancel(nextFrameRef.current);
    }
    function nextFrame(callback) {
      var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
      cancelNextFrame();
      var nextFrameId = wrapperRaf(function() {
        if (delay <= 1) {
          callback({
            isCanceled: function isCanceled() {
              return nextFrameId !== nextFrameRef.current;
            }
          });
        } else {
          nextFrame(callback, delay - 1);
        }
      });
      nextFrameRef.current = nextFrameId;
    }
    reactExports.useEffect(function() {
      return function() {
        cancelNextFrame();
      };
    }, []);
    return [nextFrame, cancelNextFrame];
  };
  var FULL_STEP_QUEUE = [STEP_PREPARE, STEP_START, STEP_ACTIVE, STEP_ACTIVATED];
  var SIMPLE_STEP_QUEUE = [STEP_PREPARE, STEP_PREPARED];
  var SkipStep = false;
  var DoStep = true;
  function isActive(step) {
    return step === STEP_ACTIVE || step === STEP_ACTIVATED;
  }
  const useStepQueue = function(status, prepareOnly, callback) {
    var _useState = useSafeState(STEP_NONE), _useState2 = _slicedToArray(_useState, 2), step = _useState2[0], setStep = _useState2[1];
    var _useNextFrame = useNextFrame(), _useNextFrame2 = _slicedToArray(_useNextFrame, 2), nextFrame = _useNextFrame2[0], cancelNextFrame = _useNextFrame2[1];
    function startQueue() {
      setStep(STEP_PREPARE, true);
    }
    var STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;
    useIsomorphicLayoutEffect(function() {
      if (step !== STEP_NONE && step !== STEP_ACTIVATED) {
        var index = STEP_QUEUE.indexOf(step);
        var nextStep = STEP_QUEUE[index + 1];
        var result = callback(step);
        if (result === SkipStep) {
          setStep(nextStep, true);
        } else if (nextStep) {
          nextFrame(function(info) {
            function doNext() {
              if (info.isCanceled()) return;
              setStep(nextStep, true);
            }
            if (result === true) {
              doNext();
            } else {
              Promise.resolve(result).then(doNext);
            }
          });
        }
      }
    }, [status, step]);
    reactExports.useEffect(function() {
      return function() {
        cancelNextFrame();
      };
    }, []);
    return [startQueue, step];
  };
  function useStatus(supportMotion, visible, getElement, _ref) {
    var _ref$motionEnter = _ref.motionEnter, motionEnter = _ref$motionEnter === void 0 ? true : _ref$motionEnter, _ref$motionAppear = _ref.motionAppear, motionAppear = _ref$motionAppear === void 0 ? true : _ref$motionAppear, _ref$motionLeave = _ref.motionLeave, motionLeave = _ref$motionLeave === void 0 ? true : _ref$motionLeave, motionDeadline = _ref.motionDeadline, motionLeaveImmediately = _ref.motionLeaveImmediately, onAppearPrepare = _ref.onAppearPrepare, onEnterPrepare = _ref.onEnterPrepare, onLeavePrepare = _ref.onLeavePrepare, onAppearStart = _ref.onAppearStart, onEnterStart = _ref.onEnterStart, onLeaveStart = _ref.onLeaveStart, onAppearActive = _ref.onAppearActive, onEnterActive = _ref.onEnterActive, onLeaveActive = _ref.onLeaveActive, onAppearEnd = _ref.onAppearEnd, onEnterEnd = _ref.onEnterEnd, onLeaveEnd = _ref.onLeaveEnd, onVisibleChanged = _ref.onVisibleChanged;
    var _useState = useSafeState(), _useState2 = _slicedToArray(_useState, 2), asyncVisible = _useState2[0], setAsyncVisible = _useState2[1];
    var _useSyncState = useSyncState(STATUS_NONE), _useSyncState2 = _slicedToArray(_useSyncState, 2), getStatus = _useSyncState2[0], setStatus = _useSyncState2[1];
    var _useState3 = useSafeState(null), _useState4 = _slicedToArray(_useState3, 2), style2 = _useState4[0], setStyle = _useState4[1];
    var currentStatus = getStatus();
    var mountedRef = reactExports.useRef(false);
    var deadlineRef = reactExports.useRef(null);
    function getDomElement() {
      return getElement();
    }
    var activeRef = reactExports.useRef(false);
    function updateMotionEndStatus() {
      setStatus(STATUS_NONE);
      setStyle(null, true);
    }
    var onInternalMotionEnd = useEvent(function(event) {
      var status = getStatus();
      if (status === STATUS_NONE) {
        return;
      }
      var element = getDomElement();
      if (event && !event.deadline && event.target !== element) {
        return;
      }
      var currentActive = activeRef.current;
      var canEnd;
      if (status === STATUS_APPEAR && currentActive) {
        canEnd = onAppearEnd === null || onAppearEnd === void 0 ? void 0 : onAppearEnd(element, event);
      } else if (status === STATUS_ENTER && currentActive) {
        canEnd = onEnterEnd === null || onEnterEnd === void 0 ? void 0 : onEnterEnd(element, event);
      } else if (status === STATUS_LEAVE && currentActive) {
        canEnd = onLeaveEnd === null || onLeaveEnd === void 0 ? void 0 : onLeaveEnd(element, event);
      }
      if (currentActive && canEnd !== false) {
        updateMotionEndStatus();
      }
    });
    var _useDomMotionEvents = useDomMotionEvents(onInternalMotionEnd), _useDomMotionEvents2 = _slicedToArray(_useDomMotionEvents, 1), patchMotionEvents = _useDomMotionEvents2[0];
    var getEventHandlers = function getEventHandlers2(targetStatus) {
      switch (targetStatus) {
        case STATUS_APPEAR:
          return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onAppearPrepare), STEP_START, onAppearStart), STEP_ACTIVE, onAppearActive);
        case STATUS_ENTER:
          return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onEnterPrepare), STEP_START, onEnterStart), STEP_ACTIVE, onEnterActive);
        case STATUS_LEAVE:
          return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onLeavePrepare), STEP_START, onLeaveStart), STEP_ACTIVE, onLeaveActive);
        default:
          return {};
      }
    };
    var eventHandlers = reactExports.useMemo(function() {
      return getEventHandlers(currentStatus);
    }, [currentStatus]);
    var _useStepQueue = useStepQueue(currentStatus, !supportMotion, function(newStep) {
      if (newStep === STEP_PREPARE) {
        var onPrepare = eventHandlers[STEP_PREPARE];
        if (!onPrepare) {
          return SkipStep;
        }
        return onPrepare(getDomElement());
      }
      if (step in eventHandlers) {
        var _eventHandlers$step;
        setStyle(((_eventHandlers$step = eventHandlers[step]) === null || _eventHandlers$step === void 0 ? void 0 : _eventHandlers$step.call(eventHandlers, getDomElement(), null)) || null);
      }
      if (step === STEP_ACTIVE && currentStatus !== STATUS_NONE) {
        patchMotionEvents(getDomElement());
        if (motionDeadline > 0) {
          clearTimeout(deadlineRef.current);
          deadlineRef.current = setTimeout(function() {
            onInternalMotionEnd({
              deadline: true
            });
          }, motionDeadline);
        }
      }
      if (step === STEP_PREPARED) {
        updateMotionEndStatus();
      }
      return DoStep;
    }), _useStepQueue2 = _slicedToArray(_useStepQueue, 2), startStep = _useStepQueue2[0], step = _useStepQueue2[1];
    var active = isActive(step);
    activeRef.current = active;
    var visibleRef = reactExports.useRef(null);
    useIsomorphicLayoutEffect(function() {
      if (mountedRef.current && visibleRef.current === visible) {
        return;
      }
      setAsyncVisible(visible);
      var isMounted = mountedRef.current;
      mountedRef.current = true;
      var nextStatus;
      if (!isMounted && visible && motionAppear) {
        nextStatus = STATUS_APPEAR;
      }
      if (isMounted && visible && motionEnter) {
        nextStatus = STATUS_ENTER;
      }
      if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) {
        nextStatus = STATUS_LEAVE;
      }
      var nextEventHandlers = getEventHandlers(nextStatus);
      if (nextStatus && (supportMotion || nextEventHandlers[STEP_PREPARE])) {
        setStatus(nextStatus);
        startStep();
      } else {
        setStatus(STATUS_NONE);
      }
      visibleRef.current = visible;
    }, [visible]);
    reactExports.useEffect(function() {
      if (
        // Cancel appear
        currentStatus === STATUS_APPEAR && !motionAppear || // Cancel enter
        currentStatus === STATUS_ENTER && !motionEnter || // Cancel leave
        currentStatus === STATUS_LEAVE && !motionLeave
      ) {
        setStatus(STATUS_NONE);
      }
    }, [motionAppear, motionEnter, motionLeave]);
    reactExports.useEffect(function() {
      return function() {
        mountedRef.current = false;
        clearTimeout(deadlineRef.current);
      };
    }, []);
    var firstMountChangeRef = reactExports.useRef(false);
    reactExports.useEffect(function() {
      if (asyncVisible) {
        firstMountChangeRef.current = true;
      }
      if (asyncVisible !== void 0 && currentStatus === STATUS_NONE) {
        if (firstMountChangeRef.current || asyncVisible) {
          onVisibleChanged === null || onVisibleChanged === void 0 || onVisibleChanged(asyncVisible);
        }
        firstMountChangeRef.current = true;
      }
    }, [asyncVisible, currentStatus]);
    var mergedStyle = style2;
    if (eventHandlers[STEP_PREPARE] && step === STEP_START) {
      mergedStyle = _objectSpread2({
        transition: "none"
      }, mergedStyle);
    }
    return [currentStatus, step, mergedStyle, asyncVisible !== null && asyncVisible !== void 0 ? asyncVisible : visible];
  }
  function genCSSMotion(config) {
    var transitionSupport = config;
    if (_typeof(config) === "object") {
      transitionSupport = config.transitionSupport;
    }
    function isSupportTransition(props, contextMotion) {
      return !!(props.motionName && transitionSupport && contextMotion !== false);
    }
    var CSSMotion2 = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
      var _props$visible = props.visible, visible = _props$visible === void 0 ? true : _props$visible, _props$removeOnLeave = props.removeOnLeave, removeOnLeave = _props$removeOnLeave === void 0 ? true : _props$removeOnLeave, forceRender = props.forceRender, children = props.children, motionName = props.motionName, leavedClassName = props.leavedClassName, eventProps = props.eventProps;
      var _React$useContext = reactExports.useContext(Context), contextMotion = _React$useContext.motion;
      var supportMotion = isSupportTransition(props, contextMotion);
      var nodeRef = reactExports.useRef();
      var wrapperNodeRef = reactExports.useRef();
      function getDomElement() {
        try {
          return nodeRef.current instanceof HTMLElement ? nodeRef.current : findDOMNode(wrapperNodeRef.current);
        } catch (e2) {
          return null;
        }
      }
      var _useStatus = useStatus(supportMotion, visible, getDomElement, props), _useStatus2 = _slicedToArray(_useStatus, 4), status = _useStatus2[0], statusStep = _useStatus2[1], statusStyle = _useStatus2[2], mergedVisible = _useStatus2[3];
      var renderedRef = reactExports.useRef(mergedVisible);
      if (mergedVisible) {
        renderedRef.current = true;
      }
      var setNodeRef = reactExports.useCallback(function(node2) {
        nodeRef.current = node2;
        fillRef(ref, node2);
      }, [ref]);
      var motionChildren;
      var mergedProps = _objectSpread2(_objectSpread2({}, eventProps), {}, {
        visible
      });
      if (!children) {
        motionChildren = null;
      } else if (status === STATUS_NONE) {
        if (mergedVisible) {
          motionChildren = children(_objectSpread2({}, mergedProps), setNodeRef);
        } else if (!removeOnLeave && renderedRef.current && leavedClassName) {
          motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
            className: leavedClassName
          }), setNodeRef);
        } else if (forceRender || !removeOnLeave && !leavedClassName) {
          motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
            style: {
              display: "none"
            }
          }), setNodeRef);
        } else {
          motionChildren = null;
        }
      } else {
        var statusSuffix;
        if (statusStep === STEP_PREPARE) {
          statusSuffix = "prepare";
        } else if (isActive(statusStep)) {
          statusSuffix = "active";
        } else if (statusStep === STEP_START) {
          statusSuffix = "start";
        }
        var motionCls = getTransitionName(motionName, "".concat(status, "-").concat(statusSuffix));
        motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
          className: classNames(getTransitionName(motionName, status), _defineProperty(_defineProperty({}, motionCls, motionCls && statusSuffix), motionName, typeof motionName === "string")),
          style: statusStyle
        }), setNodeRef);
      }
      if (/* @__PURE__ */ reactExports.isValidElement(motionChildren) && supportRef(motionChildren)) {
        var originNodeRef = getNodeRef(motionChildren);
        if (!originNodeRef) {
          motionChildren = /* @__PURE__ */ reactExports.cloneElement(motionChildren, {
            ref: setNodeRef
          });
        }
      }
      return /* @__PURE__ */ reactExports.createElement(DomWrapper, {
        ref: wrapperNodeRef
      }, motionChildren);
    });
    CSSMotion2.displayName = "CSSMotion";
    return CSSMotion2;
  }
  const CSSMotion = genCSSMotion(supportTransition);
  var STATUS_ADD = "add";
  var STATUS_KEEP = "keep";
  var STATUS_REMOVE = "remove";
  var STATUS_REMOVED = "removed";
  function wrapKeyToObject(key) {
    var keyObj;
    if (key && _typeof(key) === "object" && "key" in key) {
      keyObj = key;
    } else {
      keyObj = {
        key
      };
    }
    return _objectSpread2(_objectSpread2({}, keyObj), {}, {
      key: String(keyObj.key)
    });
  }
  function parseKeys() {
    var keys = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return keys.map(wrapKeyToObject);
  }
  function diffKeys() {
    var prevKeys = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    var currentKeys = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    var list = [];
    var currentIndex = 0;
    var currentLen = currentKeys.length;
    var prevKeyObjects = parseKeys(prevKeys);
    var currentKeyObjects = parseKeys(currentKeys);
    prevKeyObjects.forEach(function(keyObj) {
      var hit = false;
      for (var i = currentIndex; i < currentLen; i += 1) {
        var currentKeyObj = currentKeyObjects[i];
        if (currentKeyObj.key === keyObj.key) {
          if (currentIndex < i) {
            list = list.concat(currentKeyObjects.slice(currentIndex, i).map(function(obj) {
              return _objectSpread2(_objectSpread2({}, obj), {}, {
                status: STATUS_ADD
              });
            }));
            currentIndex = i;
          }
          list.push(_objectSpread2(_objectSpread2({}, currentKeyObj), {}, {
            status: STATUS_KEEP
          }));
          currentIndex += 1;
          hit = true;
          break;
        }
      }
      if (!hit) {
        list.push(_objectSpread2(_objectSpread2({}, keyObj), {}, {
          status: STATUS_REMOVE
        }));
      }
    });
    if (currentIndex < currentLen) {
      list = list.concat(currentKeyObjects.slice(currentIndex).map(function(obj) {
        return _objectSpread2(_objectSpread2({}, obj), {}, {
          status: STATUS_ADD
        });
      }));
    }
    var keys = {};
    list.forEach(function(_ref) {
      var key = _ref.key;
      keys[key] = (keys[key] || 0) + 1;
    });
    var duplicatedKeys = Object.keys(keys).filter(function(key) {
      return keys[key] > 1;
    });
    duplicatedKeys.forEach(function(matchKey) {
      list = list.filter(function(_ref2) {
        var key = _ref2.key, status = _ref2.status;
        return key !== matchKey || status !== STATUS_REMOVE;
      });
      list.forEach(function(node2) {
        if (node2.key === matchKey) {
          node2.status = STATUS_KEEP;
        }
      });
    });
    return list;
  }
  var _excluded$3 = ["component", "children", "onVisibleChanged", "onAllRemoved"], _excluded2$1 = ["status"];
  var MOTION_PROP_NAMES = ["eventProps", "visible", "children", "motionName", "motionAppear", "motionEnter", "motionLeave", "motionLeaveImmediately", "motionDeadline", "removeOnLeave", "leavedClassName", "onAppearPrepare", "onAppearStart", "onAppearActive", "onAppearEnd", "onEnterStart", "onEnterActive", "onEnterEnd", "onLeaveStart", "onLeaveActive", "onLeaveEnd"];
  function genCSSMotionList(transitionSupport) {
    var CSSMotion$1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : CSSMotion;
    var CSSMotionList = /* @__PURE__ */ function(_React$Component) {
      _inherits(CSSMotionList2, _React$Component);
      var _super = _createSuper(CSSMotionList2);
      function CSSMotionList2() {
        var _this;
        _classCallCheck(this, CSSMotionList2);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        _this = _super.call.apply(_super, [this].concat(args));
        _defineProperty(_assertThisInitialized(_this), "state", {
          keyEntities: []
        });
        _defineProperty(_assertThisInitialized(_this), "removeKey", function(removeKey) {
          _this.setState(function(prevState) {
            var nextKeyEntities = prevState.keyEntities.map(function(entity) {
              if (entity.key !== removeKey) return entity;
              return _objectSpread2(_objectSpread2({}, entity), {}, {
                status: STATUS_REMOVED
              });
            });
            return {
              keyEntities: nextKeyEntities
            };
          }, function() {
            var keyEntities = _this.state.keyEntities;
            var restKeysCount = keyEntities.filter(function(_ref) {
              var status = _ref.status;
              return status !== STATUS_REMOVED;
            }).length;
            if (restKeysCount === 0 && _this.props.onAllRemoved) {
              _this.props.onAllRemoved();
            }
          });
        });
        return _this;
      }
      _createClass(CSSMotionList2, [{
        key: "render",
        value: function render2() {
          var _this2 = this;
          var keyEntities = this.state.keyEntities;
          var _this$props = this.props, component = _this$props.component, children = _this$props.children, _onVisibleChanged = _this$props.onVisibleChanged;
          _this$props.onAllRemoved;
          var restProps = _objectWithoutProperties(_this$props, _excluded$3);
          var Component = component || reactExports.Fragment;
          var motionProps = {};
          MOTION_PROP_NAMES.forEach(function(prop) {
            motionProps[prop] = restProps[prop];
            delete restProps[prop];
          });
          delete restProps.keys;
          return /* @__PURE__ */ reactExports.createElement(Component, restProps, keyEntities.map(function(_ref2, index) {
            var status = _ref2.status, eventProps = _objectWithoutProperties(_ref2, _excluded2$1);
            var visible = status === STATUS_ADD || status === STATUS_KEEP;
            return /* @__PURE__ */ reactExports.createElement(CSSMotion$1, _extends({}, motionProps, {
              key: eventProps.key,
              visible,
              eventProps,
              onVisibleChanged: function onVisibleChanged(changedVisible) {
                _onVisibleChanged === null || _onVisibleChanged === void 0 || _onVisibleChanged(changedVisible, {
                  key: eventProps.key
                });
                if (!changedVisible) {
                  _this2.removeKey(eventProps.key);
                }
              }
            }), function(props, ref) {
              return children(_objectSpread2(_objectSpread2({}, props), {}, {
                index
              }), ref);
            });
          }));
        }
      }], [{
        key: "getDerivedStateFromProps",
        value: function getDerivedStateFromProps(_ref3, _ref4) {
          var keys = _ref3.keys;
          var keyEntities = _ref4.keyEntities;
          var parsedKeyObjects = parseKeys(keys);
          var mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);
          return {
            keyEntities: mixedKeyEntities.filter(function(entity) {
              var prevEntity = keyEntities.find(function(_ref5) {
                var key = _ref5.key;
                return entity.key === key;
              });
              if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
                return false;
              }
              return true;
            })
          };
        }
      }]);
      return CSSMotionList2;
    }(reactExports.Component);
    _defineProperty(CSSMotionList, "defaultProps", {
      component: "div"
    });
    return CSSMotionList;
  }
  genCSSMotionList(supportTransition);
  function getRoot(ele) {
    var _ele$getRootNode;
    return ele === null || ele === void 0 || (_ele$getRootNode = ele.getRootNode) === null || _ele$getRootNode === void 0 ? void 0 : _ele$getRootNode.call(ele);
  }
  function inShadow(ele) {
    return getRoot(ele) instanceof ShadowRoot;
  }
  function getShadowRoot(ele) {
    return inShadow(ele) ? getRoot(ele) : null;
  }
  function camelCase(input) {
    return input.replace(/-(.)/g, function(match, g2) {
      return g2.toUpperCase();
    });
  }
  function warning(valid, message) {
    warningOnce(valid, "[@ant-design/icons] ".concat(message));
  }
  function isIconDefinition(target) {
    return _typeof(target) === "object" && typeof target.name === "string" && typeof target.theme === "string" && (_typeof(target.icon) === "object" || typeof target.icon === "function");
  }
  function normalizeAttrs() {
    var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return Object.keys(attrs).reduce(function(acc, key) {
      var val = attrs[key];
      switch (key) {
        case "class":
          acc.className = val;
          delete acc.class;
          break;
        default:
          delete acc[key];
          acc[camelCase(key)] = val;
      }
      return acc;
    }, {});
  }
  function generate(node2, key, rootProps) {
    if (!rootProps) {
      return /* @__PURE__ */ React.createElement(node2.tag, _objectSpread2({
        key
      }, normalizeAttrs(node2.attrs)), (node2.children || []).map(function(child, index) {
        return generate(child, "".concat(key, "-").concat(node2.tag, "-").concat(index));
      }));
    }
    return /* @__PURE__ */ React.createElement(node2.tag, _objectSpread2(_objectSpread2({
      key
    }, normalizeAttrs(node2.attrs)), rootProps), (node2.children || []).map(function(child, index) {
      return generate(child, "".concat(key, "-").concat(node2.tag, "-").concat(index));
    }));
  }
  function getSecondaryColor(primaryColor) {
    return generate$1(primaryColor)[0];
  }
  function normalizeTwoToneColors(twoToneColor) {
    if (!twoToneColor) {
      return [];
    }
    return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
  }
  var iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
  var useInsertStyles = function useInsertStyles2(eleRef) {
    var _useContext = reactExports.useContext(IconContext), csp = _useContext.csp, prefixCls = _useContext.prefixCls, layer = _useContext.layer;
    var mergedStyleStr = iconStyles;
    if (prefixCls) {
      mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
    }
    if (layer) {
      mergedStyleStr = "@layer ".concat(layer, " {\n").concat(mergedStyleStr, "\n}");
    }
    reactExports.useEffect(function() {
      var ele = eleRef.current;
      var shadowRoot = getShadowRoot(ele);
      updateCSS(mergedStyleStr, "@ant-design-icons", {
        prepend: !layer,
        csp,
        attachTo: shadowRoot
      });
    }, []);
  };
  var _excluded$2 = ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"];
  var twoToneColorPalette = {
    primaryColor: "#333",
    secondaryColor: "#E6E6E6",
    calculated: false
  };
  function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
    twoToneColorPalette.calculated = !!secondaryColor;
  }
  function getTwoToneColors() {
    return _objectSpread2({}, twoToneColorPalette);
  }
  var IconBase = function IconBase2(props) {
    var icon = props.icon, className = props.className, onClick = props.onClick, style2 = props.style, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, restProps = _objectWithoutProperties(props, _excluded$2);
    var svgRef = reactExports.useRef();
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor,
        secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
      };
    }
    useInsertStyles(svgRef);
    warning(isIconDefinition(icon), "icon should be icon definiton, but got ".concat(icon));
    if (!isIconDefinition(icon)) {
      return null;
    }
    var target = icon;
    if (target && typeof target.icon === "function") {
      target = _objectSpread2(_objectSpread2({}, target), {}, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return generate(target.icon, "svg-".concat(target.name), _objectSpread2(_objectSpread2({
      className,
      onClick,
      style: style2,
      "data-icon": target.name,
      width: "1em",
      height: "1em",
      fill: "currentColor",
      "aria-hidden": "true"
    }, restProps), {}, {
      ref: svgRef
    }));
  };
  IconBase.displayName = "IconReact";
  IconBase.getTwoToneColors = getTwoToneColors;
  IconBase.setTwoToneColors = setTwoToneColors;
  function setTwoToneColor(twoToneColor) {
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return IconBase.setTwoToneColors({
      primaryColor,
      secondaryColor
    });
  }
  function getTwoToneColor() {
    var colors = IconBase.getTwoToneColors();
    if (!colors.calculated) {
      return colors.primaryColor;
    }
    return [colors.primaryColor, colors.secondaryColor];
  }
  var _excluded$1 = ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"];
  setTwoToneColor(blue.primary);
  var Icon = /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
    var className = props.className, icon = props.icon, spin = props.spin, rotate = props.rotate, tabIndex = props.tabIndex, onClick = props.onClick, twoToneColor = props.twoToneColor, restProps = _objectWithoutProperties(props, _excluded$1);
    var _React$useContext = reactExports.useContext(IconContext), _React$useContext$pre = _React$useContext.prefixCls, prefixCls = _React$useContext$pre === void 0 ? "anticon" : _React$useContext$pre, rootClassName = _React$useContext.rootClassName;
    var classString = classNames(rootClassName, prefixCls, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), "".concat(prefixCls, "-spin"), !!spin || icon.name === "loading"), className);
    var iconTabIndex = tabIndex;
    if (iconTabIndex === void 0 && onClick) {
      iconTabIndex = -1;
    }
    var svgStyle = rotate ? {
      msTransform: "rotate(".concat(rotate, "deg)"),
      transform: "rotate(".concat(rotate, "deg)")
    } : void 0;
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return /* @__PURE__ */ reactExports.createElement("span", _extends({
      role: "img",
      "aria-label": icon.name
    }, restProps, {
      ref,
      tabIndex: iconTabIndex,
      onClick,
      className: classString
    }), /* @__PURE__ */ reactExports.createElement(IconBase, {
      icon,
      primaryColor,
      secondaryColor,
      style: svgStyle
    }));
  });
  Icon.displayName = "AntdIcon";
  Icon.getTwoToneColor = getTwoToneColor;
  Icon.setTwoToneColor = setTwoToneColor;
  function isFragment(child) {
    return child && /* @__PURE__ */ React.isValidElement(child) && child.type === React.Fragment;
  }
  const replaceElement = (element, replacement, props) => {
    if (!/* @__PURE__ */ React.isValidElement(element)) {
      return replacement;
    }
    return /* @__PURE__ */ React.cloneElement(element, typeof props === "function" ? props(element.props || {}) : props);
  };
  function cloneElement(element, props) {
    return replaceElement(element, element, props);
  }
  var LoadingOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "0 0 1024 1024", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" } }] }, "name": "loading", "theme": "outlined" };
  var LoadingOutlined = function LoadingOutlined2(props, ref) {
    return /* @__PURE__ */ reactExports.createElement(Icon, _extends({}, props, {
      ref,
      icon: LoadingOutlined$1
    }));
  };
  var RefIcon = /* @__PURE__ */ reactExports.forwardRef(LoadingOutlined);
  function _OverloadYield(e2, d2) {
    this.v = e2, this.k = d2;
  }
  function _regeneratorDefine(e2, r2, n2, t2) {
    var i = Object.defineProperty;
    try {
      i({}, "", {});
    } catch (e3) {
      i = 0;
    }
    _regeneratorDefine = function regeneratorDefine(e3, r3, n3, t3) {
      function o(r4, n4) {
        _regeneratorDefine(e3, r4, function(e4) {
          return this._invoke(r4, n4, e4);
        });
      }
      r3 ? i ? i(e3, r3, {
        value: n3,
        enumerable: !t3,
        configurable: !t3,
        writable: !t3
      }) : e3[r3] = n3 : (o("next", 0), o("throw", 1), o("return", 2));
    }, _regeneratorDefine(e2, r2, n2, t2);
  }
  function _regenerator() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
    var e2, t2, r2 = "function" == typeof Symbol ? Symbol : {}, n2 = r2.iterator || "@@iterator", o = r2.toStringTag || "@@toStringTag";
    function i(r3, n3, o2, i2) {
      var c3 = n3 && n3.prototype instanceof Generator ? n3 : Generator, u3 = Object.create(c3.prototype);
      return _regeneratorDefine(u3, "_invoke", function(r4, n4, o3) {
        var i3, c4, u4, f3 = 0, p2 = o3 || [], y2 = false, G2 = {
          p: 0,
          n: 0,
          v: e2,
          a: d2,
          f: d2.bind(e2, 4),
          d: function d3(t3, r5) {
            return i3 = t3, c4 = 0, u4 = e2, G2.n = r5, a;
          }
        };
        function d2(r5, n5) {
          for (c4 = r5, u4 = n5, t2 = 0; !y2 && f3 && !o4 && t2 < p2.length; t2++) {
            var o4, i4 = p2[t2], d3 = G2.p, l2 = i4[2];
            r5 > 3 ? (o4 = l2 === n5) && (u4 = i4[(c4 = i4[4]) ? 5 : (c4 = 3, 3)], i4[4] = i4[5] = e2) : i4[0] <= d3 && ((o4 = r5 < 2 && d3 < i4[1]) ? (c4 = 0, G2.v = n5, G2.n = i4[1]) : d3 < l2 && (o4 = r5 < 3 || i4[0] > n5 || n5 > l2) && (i4[4] = r5, i4[5] = n5, G2.n = l2, c4 = 0));
          }
          if (o4 || r5 > 1) return a;
          throw y2 = true, n5;
        }
        return function(o4, p3, l2) {
          if (f3 > 1) throw TypeError("Generator is already running");
          for (y2 && 1 === p3 && d2(p3, l2), c4 = p3, u4 = l2; (t2 = c4 < 2 ? e2 : u4) || !y2; ) {
            i3 || (c4 ? c4 < 3 ? (c4 > 1 && (G2.n = -1), d2(c4, u4)) : G2.n = u4 : G2.v = u4);
            try {
              if (f3 = 2, i3) {
                if (c4 || (o4 = "next"), t2 = i3[o4]) {
                  if (!(t2 = t2.call(i3, u4))) throw TypeError("iterator result is not an object");
                  if (!t2.done) return t2;
                  u4 = t2.value, c4 < 2 && (c4 = 0);
                } else 1 === c4 && (t2 = i3["return"]) && t2.call(i3), c4 < 2 && (u4 = TypeError("The iterator does not provide a '" + o4 + "' method"), c4 = 1);
                i3 = e2;
              } else if ((t2 = (y2 = G2.n < 0) ? u4 : r4.call(n4, G2)) !== a) break;
            } catch (t3) {
              i3 = e2, c4 = 1, u4 = t3;
            } finally {
              f3 = 1;
            }
          }
          return {
            value: t2,
            done: y2
          };
        };
      }(r3, o2, i2), true), u3;
    }
    var a = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    t2 = Object.getPrototypeOf;
    var c2 = [][n2] ? t2(t2([][n2]())) : (_regeneratorDefine(t2 = {}, n2, function() {
      return this;
    }), t2), u2 = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c2);
    function f2(e3) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(e3, GeneratorFunctionPrototype) : (e3.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e3, o, "GeneratorFunction")), e3.prototype = Object.create(u2), e3;
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u2, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u2), _regeneratorDefine(u2, o, "Generator"), _regeneratorDefine(u2, n2, function() {
      return this;
    }), _regeneratorDefine(u2, "toString", function() {
      return "[object Generator]";
    }), (_regenerator = function _regenerator2() {
      return {
        w: i,
        m: f2
      };
    })();
  }
  function AsyncIterator(t2, e2) {
    function n2(r3, o, i, f2) {
      try {
        var c2 = t2[r3](o), u2 = c2.value;
        return u2 instanceof _OverloadYield ? e2.resolve(u2.v).then(function(t3) {
          n2("next", t3, i, f2);
        }, function(t3) {
          n2("throw", t3, i, f2);
        }) : e2.resolve(u2).then(function(t3) {
          c2.value = t3, i(c2);
        }, function(t3) {
          return n2("throw", t3, i, f2);
        });
      } catch (t3) {
        f2(t3);
      }
    }
    var r2;
    this.next || (_regeneratorDefine(AsyncIterator.prototype), _regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
      return this;
    })), _regeneratorDefine(this, "_invoke", function(t3, o, i) {
      function f2() {
        return new e2(function(e3, r3) {
          n2(t3, i, e3, r3);
        });
      }
      return r2 = r2 ? r2.then(f2, f2) : f2();
    }, true);
  }
  function _regeneratorAsyncGen(r2, e2, t2, o, n2) {
    return new AsyncIterator(_regenerator().w(r2, e2, t2, o), n2 || Promise);
  }
  function _regeneratorAsync(n2, e2, r2, t2, o) {
    var a = _regeneratorAsyncGen(n2, e2, r2, t2, o);
    return a.next().then(function(n3) {
      return n3.done ? n3.value : a.next();
    });
  }
  function _regeneratorKeys(e2) {
    var n2 = Object(e2), r2 = [];
    for (var t2 in n2) r2.unshift(t2);
    return function e3() {
      for (; r2.length; ) if ((t2 = r2.pop()) in n2) return e3.value = t2, e3.done = false, e3;
      return e3.done = true, e3;
    };
  }
  function _regeneratorValues(e2) {
    if (null != e2) {
      var t2 = e2["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r2 = 0;
      if (t2) return t2.call(e2);
      if ("function" == typeof e2.next) return e2;
      if (!isNaN(e2.length)) return {
        next: function next2() {
          return e2 && r2 >= e2.length && (e2 = void 0), {
            value: e2 && e2[r2++],
            done: !e2
          };
        }
      };
    }
    throw new TypeError(_typeof(e2) + " is not iterable");
  }
  function _regeneratorRuntime() {
    var r2 = _regenerator(), e2 = r2.m(_regeneratorRuntime), t2 = (Object.getPrototypeOf ? Object.getPrototypeOf(e2) : e2.__proto__).constructor;
    function n2(r3) {
      var e3 = "function" == typeof r3 && r3.constructor;
      return !!e3 && (e3 === t2 || "GeneratorFunction" === (e3.displayName || e3.name));
    }
    var o = {
      "throw": 1,
      "return": 2,
      "break": 3,
      "continue": 3
    };
    function a(r3) {
      var e3, t3;
      return function(n3) {
        e3 || (e3 = {
          stop: function stop() {
            return t3(n3.a, 2);
          },
          "catch": function _catch() {
            return n3.v;
          },
          abrupt: function abrupt(r4, e4) {
            return t3(n3.a, o[r4], e4);
          },
          delegateYield: function delegateYield(r4, o2, a2) {
            return e3.resultName = o2, t3(n3.d, _regeneratorValues(r4), a2);
          },
          finish: function finish(r4) {
            return t3(n3.f, r4);
          }
        }, t3 = function t4(r4, _t, o2) {
          n3.p = e3.prev, n3.n = e3.next;
          try {
            return r4(_t, o2);
          } finally {
            e3.next = n3.n;
          }
        }), e3.resultName && (e3[e3.resultName] = n3.v, e3.resultName = void 0), e3.sent = n3.v, e3.next = n3.n;
        try {
          return r3.call(this, e3);
        } finally {
          n3.p = e3.prev, n3.n = e3.next;
        }
      };
    }
    return (_regeneratorRuntime = function _regeneratorRuntime2() {
      return {
        wrap: function wrap(e3, t3, n3, o2) {
          return r2.w(a(e3), t3, n3, o2 && o2.reverse());
        },
        isGeneratorFunction: n2,
        mark: r2.m,
        awrap: function awrap(r3, e3) {
          return new _OverloadYield(r3, e3);
        },
        AsyncIterator,
        async: function async(r3, e3, t3, o2, u2) {
          return (n2(e3) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r3), e3, t3, o2, u2);
        },
        keys: _regeneratorKeys,
        values: _regeneratorValues
      };
    })();
  }
  function asyncGeneratorStep(n2, t2, e2, r2, o, a, c2) {
    try {
      var i = n2[a](c2), u2 = i.value;
    } catch (n3) {
      return void e2(n3);
    }
    i.done ? t2(u2) : Promise.resolve(u2).then(r2, o);
  }
  function _asyncToGenerator(n2) {
    return function() {
      var t2 = this, e2 = arguments;
      return new Promise(function(r2, o) {
        var a = n2.apply(t2, e2);
        function _next(n3) {
          asyncGeneratorStep(a, r2, o, _next, _throw, "next", n3);
        }
        function _throw(n3) {
          asyncGeneratorStep(a, r2, o, _next, _throw, "throw", n3);
        }
        _next(void 0);
      });
    };
  }
  var fullClone = _objectSpread2({}, ReactDOM$1);
  var version = fullClone.version, reactRender = fullClone.render, unmountComponentAtNode = fullClone.unmountComponentAtNode;
  var createRoot;
  try {
    var mainVersion = Number((version || "").split(".")[0]);
    if (mainVersion >= 18) {
      createRoot = fullClone.createRoot;
    }
  } catch (e2) {
  }
  function toggleWarning(skip) {
    var __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = fullClone.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED && _typeof(__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === "object") {
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip;
    }
  }
  var MARK = "__rc_react_root__";
  function modernRender(node2, container) {
    toggleWarning(true);
    var root = container[MARK] || createRoot(container);
    toggleWarning(false);
    root.render(node2);
    container[MARK] = root;
  }
  function legacyRender(node2, container) {
    reactRender === null || reactRender === void 0 || reactRender(node2, container);
  }
  function render(node2, container) {
    if (createRoot) {
      modernRender(node2, container);
      return;
    }
    legacyRender(node2, container);
  }
  function modernUnmount(_x) {
    return _modernUnmount.apply(this, arguments);
  }
  function _modernUnmount() {
    _modernUnmount = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee(container) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Promise.resolve().then(function() {
              var _container$MARK;
              (_container$MARK = container[MARK]) === null || _container$MARK === void 0 || _container$MARK.unmount();
              delete container[MARK];
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _modernUnmount.apply(this, arguments);
  }
  function legacyUnmount(container) {
    unmountComponentAtNode(container);
  }
  function unmount(_x2) {
    return _unmount.apply(this, arguments);
  }
  function _unmount() {
    _unmount = _asyncToGenerator(/* @__PURE__ */ _regeneratorRuntime().mark(function _callee2(container) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(createRoot !== void 0)) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return", modernUnmount(container));
          case 2:
            legacyUnmount(container);
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _unmount.apply(this, arguments);
  }
  const defaultReactRender = (node2, container) => {
    render(node2, container);
    return () => {
      return unmount(container);
    };
  };
  let unstableRender = defaultReactRender;
  function unstableSetRender(render2) {
    return unstableRender;
  }
  function omit(obj, fields) {
    var clone = Object.assign({}, obj);
    if (Array.isArray(fields)) {
      fields.forEach(function(key) {
        delete clone[key];
      });
    }
    return clone;
  }
  const isVisible = function(element) {
    if (!element) {
      return false;
    }
    if (element instanceof Element) {
      if (element.offsetParent) {
        return true;
      }
      if (element.getBBox) {
        var _getBBox = element.getBBox(), width = _getBBox.width, height = _getBBox.height;
        if (width || height) {
          return true;
        }
      }
      if (element.getBoundingClientRect) {
        var _element$getBoundingC = element.getBoundingClientRect(), _width = _element$getBoundingC.width, _height = _element$getBoundingC.height;
        if (_width || _height) {
          return true;
        }
      }
    }
    return false;
  };
  const genWaveStyle = (token2) => {
    const {
      componentCls,
      colorPrimary
    } = token2;
    return {
      [componentCls]: {
        position: "absolute",
        background: "transparent",
        pointerEvents: "none",
        boxSizing: "border-box",
        color: `var(--wave-color, ${colorPrimary})`,
        boxShadow: `0 0 0 0 currentcolor`,
        opacity: 0.2,
        // =================== Motion ===================
        "&.wave-motion-appear": {
          transition: [`box-shadow 0.4s ${token2.motionEaseOutCirc}`, `opacity 2s ${token2.motionEaseOutCirc}`].join(","),
          "&-active": {
            boxShadow: `0 0 0 6px currentcolor`,
            opacity: 0
          },
          "&.wave-quick": {
            transition: [`box-shadow ${token2.motionDurationSlow} ${token2.motionEaseInOut}`, `opacity ${token2.motionDurationSlow} ${token2.motionEaseInOut}`].join(",")
          }
        }
      }
    };
  };
  const useStyle$1 = genComponentStyleHook("Wave", genWaveStyle);
  const TARGET_CLS = `${defaultPrefixCls}-wave-target`;
  function isValidWaveColor(color) {
    return color && color !== "#fff" && color !== "#ffffff" && color !== "rgb(255, 255, 255)" && color !== "rgba(255, 255, 255, 1)" && !/rgba\((?:\d*, ){3}0\)/.test(color) && // any transparent rgba color
    color !== "transparent" && color !== "canvastext";
  }
  function getTargetWaveColor(node2) {
    var _a;
    const {
      borderTopColor,
      borderColor,
      backgroundColor
    } = getComputedStyle(node2);
    return (_a = [borderTopColor, borderColor, backgroundColor].find(isValidWaveColor)) !== null && _a !== void 0 ? _a : null;
  }
  function validateNum(value) {
    return Number.isNaN(value) ? 0 : value;
  }
  const WaveEffect = (props) => {
    const {
      className,
      target,
      component,
      registerUnmount
    } = props;
    const divRef = reactExports.useRef(null);
    const unmountRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      unmountRef.current = registerUnmount();
    }, []);
    const [color, setWaveColor] = reactExports.useState(null);
    const [borderRadius, setBorderRadius] = reactExports.useState([]);
    const [left, setLeft] = reactExports.useState(0);
    const [top, setTop] = reactExports.useState(0);
    const [width, setWidth] = reactExports.useState(0);
    const [height, setHeight] = reactExports.useState(0);
    const [enabled, setEnabled] = reactExports.useState(false);
    const waveStyle = {
      left,
      top,
      width,
      height,
      borderRadius: borderRadius.map((radius) => `${radius}px`).join(" ")
    };
    if (color) {
      waveStyle["--wave-color"] = color;
    }
    function syncPos() {
      const nodeStyle = getComputedStyle(target);
      setWaveColor(getTargetWaveColor(target));
      const isStatic = nodeStyle.position === "static";
      const {
        borderLeftWidth,
        borderTopWidth
      } = nodeStyle;
      setLeft(isStatic ? target.offsetLeft : validateNum(-Number.parseFloat(borderLeftWidth)));
      setTop(isStatic ? target.offsetTop : validateNum(-Number.parseFloat(borderTopWidth)));
      setWidth(target.offsetWidth);
      setHeight(target.offsetHeight);
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius
      } = nodeStyle;
      setBorderRadius([borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius].map((radius) => validateNum(Number.parseFloat(radius))));
    }
    reactExports.useEffect(() => {
      if (target) {
        const id2 = wrapperRaf(() => {
          syncPos();
          setEnabled(true);
        });
        let resizeObserver;
        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(syncPos);
          resizeObserver.observe(target);
        }
        return () => {
          wrapperRaf.cancel(id2);
          resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
        };
      }
    }, [target]);
    if (!enabled) {
      return null;
    }
    const isSmallComponent = (component === "Checkbox" || component === "Radio") && (target === null || target === void 0 ? void 0 : target.classList.contains(TARGET_CLS));
    return /* @__PURE__ */ reactExports.createElement(CSSMotion, {
      visible: true,
      motionAppear: true,
      motionName: "wave-motion",
      motionDeadline: 5e3,
      onAppearEnd: (_, event) => {
        var _a, _b;
        if (event.deadline || event.propertyName === "opacity") {
          const holder = (_a = divRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
          (_b = unmountRef.current) === null || _b === void 0 ? void 0 : _b.call(unmountRef).then(() => {
            holder === null || holder === void 0 ? void 0 : holder.remove();
          });
        }
        return false;
      }
    }, ({
      className: motionClassName
    }, ref) => /* @__PURE__ */ reactExports.createElement("div", {
      ref: composeRef(divRef, ref),
      className: classNames(className, motionClassName, {
        "wave-quick": isSmallComponent
      }),
      style: waveStyle
    }));
  };
  const showWaveEffect = (target, info) => {
    var _a;
    const {
      component
    } = info;
    if (component === "Checkbox" && !((_a = target.querySelector("input")) === null || _a === void 0 ? void 0 : _a.checked)) {
      return;
    }
    const holder = document.createElement("div");
    holder.style.position = "absolute";
    holder.style.left = "0px";
    holder.style.top = "0px";
    target === null || target === void 0 ? void 0 : target.insertBefore(holder, target === null || target === void 0 ? void 0 : target.firstChild);
    const reactRender2 = unstableSetRender();
    let unmountCallback = null;
    function registerUnmount() {
      return unmountCallback;
    }
    unmountCallback = reactRender2(/* @__PURE__ */ reactExports.createElement(WaveEffect, Object.assign({}, info, {
      target,
      registerUnmount
    })), holder);
  };
  const useWave = (nodeRef, className, component) => {
    const {
      wave
    } = reactExports.useContext(ConfigContext);
    const [, token2, hashId] = useToken();
    const showWave = useEvent((event) => {
      const node2 = nodeRef.current;
      if ((wave === null || wave === void 0 ? void 0 : wave.disabled) || !node2) {
        return;
      }
      const targetNode = node2.querySelector(`.${TARGET_CLS}`) || node2;
      const {
        showEffect
      } = wave || {};
      (showEffect || showWaveEffect)(targetNode, {
        className,
        token: token2,
        component,
        event,
        hashId
      });
    });
    const rafId = reactExports.useRef(null);
    const showDebounceWave = (event) => {
      wrapperRaf.cancel(rafId.current);
      rafId.current = wrapperRaf(() => {
        showWave(event);
      });
    };
    return showDebounceWave;
  };
  const Wave = (props) => {
    const {
      children,
      disabled,
      component
    } = props;
    const {
      getPrefixCls
    } = reactExports.useContext(ConfigContext);
    const containerRef = reactExports.useRef(null);
    const prefixCls = getPrefixCls("wave");
    const [, hashId] = useStyle$1(prefixCls);
    const showWave = useWave(containerRef, classNames(prefixCls, hashId), component);
    React.useEffect(() => {
      const node2 = containerRef.current;
      if (!node2 || node2.nodeType !== window.Node.ELEMENT_NODE || disabled) {
        return;
      }
      const onClick = (e2) => {
        if (!isVisible(e2.target) || // No need wave
        !node2.getAttribute || node2.getAttribute("disabled") || node2.disabled || node2.className.includes("disabled") && !node2.className.includes("disabled:") || node2.getAttribute("aria-disabled") === "true" || node2.className.includes("-leave")) {
          return;
        }
        showWave(e2);
      };
      node2.addEventListener("click", onClick, true);
      return () => {
        node2.removeEventListener("click", onClick, true);
      };
    }, [disabled]);
    if (!/* @__PURE__ */ React.isValidElement(children)) {
      return children !== null && children !== void 0 ? children : null;
    }
    const ref = supportRef(children) ? composeRef(getNodeRef(children), containerRef) : containerRef;
    return cloneElement(children, {
      ref
    });
  };
  const useSize = (customSize) => {
    const size = React.useContext(SizeContext);
    const mergedSize = React.useMemo(() => {
      if (!customSize) {
        return size;
      }
      if (typeof customSize === "string") {
        return customSize !== null && customSize !== void 0 ? customSize : size;
      }
      if (typeof customSize === "function") {
        return customSize(size);
      }
      return size;
    }, [customSize, size]);
    return mergedSize;
  };
  (function(s, e2) {
    var t2 = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0) t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i])) t2[p2[i]] = s[p2[i]];
    }
    return t2;
  });
  const SpaceCompactItemContext = /* @__PURE__ */ reactExports.createContext(null);
  const useCompactItemContext = (prefixCls, direction) => {
    const compactItemContext = reactExports.useContext(SpaceCompactItemContext);
    const compactItemClassnames = reactExports.useMemo(() => {
      if (!compactItemContext) {
        return "";
      }
      const {
        compactDirection,
        isFirstItem,
        isLastItem
      } = compactItemContext;
      const separator = compactDirection === "vertical" ? "-vertical-" : "-";
      return classNames(`${prefixCls}-compact${separator}item`, {
        [`${prefixCls}-compact${separator}first-item`]: isFirstItem,
        [`${prefixCls}-compact${separator}last-item`]: isLastItem,
        [`${prefixCls}-compact${separator}item-rtl`]: direction === "rtl"
      });
    }, [prefixCls, direction, compactItemContext]);
    return {
      compactSize: compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactSize,
      compactDirection: compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactDirection,
      compactItemClassnames
    };
  };
  var __rest$1 = function(s, e2) {
    var t2 = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0) t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i])) t2[p2[i]] = s[p2[i]];
    }
    return t2;
  };
  const GroupSizeContext = /* @__PURE__ */ reactExports.createContext(void 0);
  const ButtonGroup = (props) => {
    const {
      getPrefixCls,
      direction
    } = reactExports.useContext(ConfigContext);
    const {
      prefixCls: customizePrefixCls,
      size,
      className
    } = props, others = __rest$1(props, ["prefixCls", "size", "className"]);
    const prefixCls = getPrefixCls("btn-group", customizePrefixCls);
    const [, , hashId] = useToken();
    const sizeCls = reactExports.useMemo(() => {
      switch (size) {
        case "large":
          return "lg";
        case "small":
          return "sm";
        default:
          return "";
      }
    }, [size]);
    const classes = classNames(prefixCls, {
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-rtl`]: direction === "rtl"
    }, className, hashId);
    return /* @__PURE__ */ reactExports.createElement(GroupSizeContext.Provider, {
      value: size
    }, /* @__PURE__ */ reactExports.createElement("div", Object.assign({}, others, {
      className: classes
    })));
  };
  const rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/;
  const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
  function isString(str) {
    return typeof str === "string";
  }
  function isUnBorderedButtonVariant(type) {
    return type === "text" || type === "link";
  }
  function splitCNCharsBySpace(child, needInserted) {
    if (child === null || child === void 0) {
      return;
    }
    const SPACE = needInserted ? " " : "";
    if (typeof child !== "string" && typeof child !== "number" && isString(child.type) && isTwoCNChar(child.props.children)) {
      return cloneElement(child, {
        children: child.props.children.split("").join(SPACE)
      });
    }
    if (isString(child)) {
      return isTwoCNChar(child) ? /* @__PURE__ */ React.createElement("span", null, child.split("").join(SPACE)) : /* @__PURE__ */ React.createElement("span", null, child);
    }
    if (isFragment(child)) {
      return /* @__PURE__ */ React.createElement("span", null, child);
    }
    return child;
  }
  function spaceChildren(children, needInserted) {
    let isPrevChildPure = false;
    const childList = [];
    React.Children.forEach(children, (child) => {
      const type = typeof child;
      const isCurrentChildPure = type === "string" || type === "number";
      if (isPrevChildPure && isCurrentChildPure) {
        const lastIndex = childList.length - 1;
        const lastChild = childList[lastIndex];
        childList[lastIndex] = `${lastChild}${child}`;
      } else {
        childList.push(child);
      }
      isPrevChildPure = isCurrentChildPure;
    });
    return React.Children.map(childList, (child) => splitCNCharsBySpace(child, needInserted));
  }
  ["default", "primary", "danger"].concat(_toConsumableArray(PresetColors));
  const IconWrapper = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
    const {
      className,
      style: style2,
      children,
      prefixCls
    } = props;
    const iconWrapperCls = classNames(`${prefixCls}-icon`, className);
    return /* @__PURE__ */ React.createElement("span", {
      ref,
      className: iconWrapperCls,
      style: style2
    }, children);
  });
  const InnerLoadingIcon = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
    const {
      prefixCls,
      className,
      style: style2,
      iconClassName
    } = props;
    const mergedIconCls = classNames(`${prefixCls}-loading-icon`, className);
    return /* @__PURE__ */ React.createElement(IconWrapper, {
      prefixCls,
      className: mergedIconCls,
      style: style2,
      ref
    }, /* @__PURE__ */ React.createElement(RefIcon, {
      className: iconClassName
    }));
  });
  const getCollapsedWidth = () => ({
    width: 0,
    opacity: 0,
    transform: "scale(0)"
  });
  const getRealWidth = (node2) => ({
    width: node2.scrollWidth,
    opacity: 1,
    transform: "scale(1)"
  });
  const DefaultLoadingIcon = (props) => {
    const {
      prefixCls,
      loading,
      existIcon,
      className,
      style: style2,
      mount
    } = props;
    const visible = !!loading;
    if (existIcon) {
      return /* @__PURE__ */ React.createElement(InnerLoadingIcon, {
        prefixCls,
        className,
        style: style2
      });
    }
    return /* @__PURE__ */ React.createElement(CSSMotion, {
      visible,
      // Used for minus flex gap style only
      motionName: `${prefixCls}-loading-icon-motion`,
      motionAppear: !mount,
      motionEnter: !mount,
      motionLeave: !mount,
      removeOnLeave: true,
      onAppearStart: getCollapsedWidth,
      onAppearActive: getRealWidth,
      onEnterStart: getCollapsedWidth,
      onEnterActive: getRealWidth,
      onLeaveStart: getRealWidth,
      onLeaveActive: getCollapsedWidth
    }, ({
      className: motionCls,
      style: motionStyle
    }, ref) => {
      const mergedStyle = Object.assign(Object.assign({}, style2), motionStyle);
      return /* @__PURE__ */ React.createElement(InnerLoadingIcon, {
        prefixCls,
        className: classNames(className, motionCls),
        style: mergedStyle,
        ref
      });
    });
  };
  const genButtonBorderStyle = (buttonTypeCls, borderColor) => ({
    // Border
    [`> span, > ${buttonTypeCls}`]: {
      "&:not(:last-child)": {
        [`&, & > ${buttonTypeCls}`]: {
          "&:not(:disabled)": {
            borderInlineEndColor: borderColor
          }
        }
      },
      "&:not(:first-child)": {
        [`&, & > ${buttonTypeCls}`]: {
          "&:not(:disabled)": {
            borderInlineStartColor: borderColor
          }
        }
      }
    }
  });
  const genGroupStyle = (token2) => {
    const {
      componentCls,
      fontSize,
      lineWidth,
      groupBorderColor,
      colorErrorHover
    } = token2;
    return {
      [`${componentCls}-group`]: [
        {
          position: "relative",
          display: "inline-flex",
          // Border
          [`> span, > ${componentCls}`]: {
            "&:not(:last-child)": {
              [`&, & > ${componentCls}`]: {
                borderStartEndRadius: 0,
                borderEndEndRadius: 0
              }
            },
            "&:not(:first-child)": {
              marginInlineStart: token2.calc(lineWidth).mul(-1).equal(),
              [`&, & > ${componentCls}`]: {
                borderStartStartRadius: 0,
                borderEndStartRadius: 0
              }
            }
          },
          [componentCls]: {
            position: "relative",
            zIndex: 1,
            "&:hover, &:focus, &:active": {
              zIndex: 2
            },
            "&[disabled]": {
              zIndex: 0
            }
          },
          [`${componentCls}-icon-only`]: {
            fontSize
          }
        },
        // Border Color
        genButtonBorderStyle(`${componentCls}-primary`, groupBorderColor),
        genButtonBorderStyle(`${componentCls}-danger`, colorErrorHover)
      ]
    };
  };
  var _excluded = ["b"], _excluded2 = ["v"];
  var getRoundNumber = function getRoundNumber2(value) {
    return Math.round(Number(value || 0));
  };
  var convertHsb2Hsv = function convertHsb2Hsv2(color) {
    if (color instanceof FastColor) {
      return color;
    }
    if (color && _typeof(color) === "object" && "h" in color && "b" in color) {
      var _ref = color, b2 = _ref.b, resets = _objectWithoutProperties(_ref, _excluded);
      return _objectSpread2(_objectSpread2({}, resets), {}, {
        v: b2
      });
    }
    if (typeof color === "string" && /hsb/.test(color)) {
      return color.replace(/hsb/, "hsv");
    }
    return color;
  };
  var Color = /* @__PURE__ */ function(_FastColor) {
    _inherits(Color2, _FastColor);
    var _super = _createSuper(Color2);
    function Color2(color) {
      _classCallCheck(this, Color2);
      return _super.call(this, convertHsb2Hsv(color));
    }
    _createClass(Color2, [{
      key: "toHsbString",
      value: function toHsbString() {
        var hsb = this.toHsb();
        var saturation = getRoundNumber(hsb.s * 100);
        var lightness = getRoundNumber(hsb.b * 100);
        var hue = getRoundNumber(hsb.h);
        var alpha = hsb.a;
        var hsbString = "hsb(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
        var hsbaString = "hsba(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%, ").concat(alpha.toFixed(alpha === 0 ? 0 : 2), ")");
        return alpha === 1 ? hsbString : hsbaString;
      }
    }, {
      key: "toHsb",
      value: function toHsb() {
        var _this$toHsv = this.toHsv(), v2 = _this$toHsv.v, resets = _objectWithoutProperties(_this$toHsv, _excluded2);
        return _objectSpread2(_objectSpread2({}, resets), {}, {
          b: v2,
          a: this.a
        });
      }
    }]);
    return Color2;
  }(FastColor);
  var generateColor = function generateColor2(color) {
    if (color instanceof Color) {
      return color;
    }
    return new Color(color);
  };
  generateColor("#1677ff");
  const toHexFormat = (value, alpha) => (value === null || value === void 0 ? void 0 : value.replace(/[^\w/]/g, "").slice(0, alpha ? 8 : 6)) || "";
  const getHex = (value, alpha) => value ? toHexFormat(value, alpha) : "";
  let AggregationColor = /* @__PURE__ */ function() {
    function AggregationColor2(color) {
      _classCallCheck(this, AggregationColor2);
      var _a;
      this.cleared = false;
      if (color instanceof AggregationColor2) {
        this.metaColor = color.metaColor.clone();
        this.colors = (_a = color.colors) === null || _a === void 0 ? void 0 : _a.map((info) => ({
          color: new AggregationColor2(info.color),
          percent: info.percent
        }));
        this.cleared = color.cleared;
        return;
      }
      const isArray = Array.isArray(color);
      if (isArray && color.length) {
        this.colors = color.map(({
          color: c2,
          percent
        }) => ({
          color: new AggregationColor2(c2),
          percent
        }));
        this.metaColor = new Color(this.colors[0].color.metaColor);
      } else {
        this.metaColor = new Color(isArray ? "" : color);
      }
      if (!color || isArray && !this.colors) {
        this.metaColor = this.metaColor.setA(0);
        this.cleared = true;
      }
    }
    return _createClass(AggregationColor2, [{
      key: "toHsb",
      value: function toHsb() {
        return this.metaColor.toHsb();
      }
    }, {
      key: "toHsbString",
      value: function toHsbString() {
        return this.metaColor.toHsbString();
      }
    }, {
      key: "toHex",
      value: function toHex() {
        return getHex(this.toHexString(), this.metaColor.a < 1);
      }
    }, {
      key: "toHexString",
      value: function toHexString() {
        return this.metaColor.toHexString();
      }
    }, {
      key: "toRgb",
      value: function toRgb() {
        return this.metaColor.toRgb();
      }
    }, {
      key: "toRgbString",
      value: function toRgbString() {
        return this.metaColor.toRgbString();
      }
    }, {
      key: "isGradient",
      value: function isGradient() {
        return !!this.colors && !this.cleared;
      }
    }, {
      key: "getColors",
      value: function getColors() {
        return this.colors || [{
          color: this,
          percent: 0
        }];
      }
    }, {
      key: "toCssString",
      value: function toCssString() {
        const {
          colors
        } = this;
        if (colors) {
          const colorsStr = colors.map((c2) => `${c2.color.toRgbString()} ${c2.percent}%`).join(", ");
          return `linear-gradient(90deg, ${colorsStr})`;
        }
        return this.metaColor.toRgbString();
      }
    }, {
      key: "equals",
      value: function equals(color) {
        if (!color || this.isGradient() !== color.isGradient()) {
          return false;
        }
        if (!this.isGradient()) {
          return this.toHexString() === color.toHexString();
        }
        return this.colors.length === color.colors.length && this.colors.every((c2, i) => {
          const target = color.colors[i];
          return c2.percent === target.percent && c2.color.equals(target.color);
        });
      }
    }]);
  }();
  const isBright = (value, bgColorToken) => {
    const {
      r: r2,
      g: g2,
      b: b2,
      a
    } = value.toRgb();
    const hsv = new Color(value.toRgbString()).onBackground(bgColorToken).toHsv();
    if (a <= 0.5) {
      return hsv.v > 0.5;
    }
    return r2 * 0.299 + g2 * 0.587 + b2 * 0.114 > 192;
  };
  const prepareToken = (token2) => {
    const {
      paddingInline,
      onlyIconSize
    } = token2;
    const buttonToken = merge(token2, {
      buttonPaddingHorizontal: paddingInline,
      buttonPaddingVertical: 0,
      buttonIconOnlyFontSize: onlyIconSize
    });
    return buttonToken;
  };
  const prepareComponentToken = (token2) => {
    var _a, _b, _c, _d, _e, _f;
    const contentFontSize = (_a = token2.contentFontSize) !== null && _a !== void 0 ? _a : token2.fontSize;
    const contentFontSizeSM = (_b = token2.contentFontSizeSM) !== null && _b !== void 0 ? _b : token2.fontSize;
    const contentFontSizeLG = (_c = token2.contentFontSizeLG) !== null && _c !== void 0 ? _c : token2.fontSizeLG;
    const contentLineHeight = (_d = token2.contentLineHeight) !== null && _d !== void 0 ? _d : getLineHeight(contentFontSize);
    const contentLineHeightSM = (_e = token2.contentLineHeightSM) !== null && _e !== void 0 ? _e : getLineHeight(contentFontSizeSM);
    const contentLineHeightLG = (_f = token2.contentLineHeightLG) !== null && _f !== void 0 ? _f : getLineHeight(contentFontSizeLG);
    const solidTextColor = isBright(new AggregationColor(token2.colorBgSolid), "#fff") ? "#000" : "#fff";
    const shadowColorTokens = PresetColors.reduce((prev2, colorKey) => Object.assign(Object.assign({}, prev2), {
      [`${colorKey}ShadowColor`]: `0 ${unit$1(token2.controlOutlineWidth)} 0 ${getAlphaColor(token2[`${colorKey}1`], token2.colorBgContainer)}`
    }), {});
    return Object.assign(Object.assign({}, shadowColorTokens), {
      fontWeight: 400,
      iconGap: token2.marginXS,
      defaultShadow: `0 ${token2.controlOutlineWidth}px 0 ${token2.controlTmpOutline}`,
      primaryShadow: `0 ${token2.controlOutlineWidth}px 0 ${token2.controlOutline}`,
      dangerShadow: `0 ${token2.controlOutlineWidth}px 0 ${token2.colorErrorOutline}`,
      primaryColor: token2.colorTextLightSolid,
      dangerColor: token2.colorTextLightSolid,
      borderColorDisabled: token2.colorBorder,
      defaultGhostColor: token2.colorBgContainer,
      ghostBg: "transparent",
      defaultGhostBorderColor: token2.colorBgContainer,
      paddingInline: token2.paddingContentHorizontal - token2.lineWidth,
      paddingInlineLG: token2.paddingContentHorizontal - token2.lineWidth,
      paddingInlineSM: 8 - token2.lineWidth,
      onlyIconSize: "inherit",
      onlyIconSizeSM: "inherit",
      onlyIconSizeLG: "inherit",
      groupBorderColor: token2.colorPrimaryHover,
      linkHoverBg: "transparent",
      textTextColor: token2.colorText,
      textTextHoverColor: token2.colorText,
      textTextActiveColor: token2.colorText,
      textHoverBg: token2.colorFillTertiary,
      defaultColor: token2.colorText,
      defaultBg: token2.colorBgContainer,
      defaultBorderColor: token2.colorBorder,
      defaultBorderColorDisabled: token2.colorBorder,
      defaultHoverBg: token2.colorBgContainer,
      defaultHoverColor: token2.colorPrimaryHover,
      defaultHoverBorderColor: token2.colorPrimaryHover,
      defaultActiveBg: token2.colorBgContainer,
      defaultActiveColor: token2.colorPrimaryActive,
      defaultActiveBorderColor: token2.colorPrimaryActive,
      solidTextColor,
      contentFontSize,
      contentFontSizeSM,
      contentFontSizeLG,
      contentLineHeight,
      contentLineHeightSM,
      contentLineHeightLG,
      paddingBlock: Math.max((token2.controlHeight - contentFontSize * contentLineHeight) / 2 - token2.lineWidth, 0),
      paddingBlockSM: Math.max((token2.controlHeightSM - contentFontSizeSM * contentLineHeightSM) / 2 - token2.lineWidth, 0),
      paddingBlockLG: Math.max((token2.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token2.lineWidth, 0)
    });
  };
  const genSharedButtonStyle = (token2) => {
    const {
      componentCls,
      iconCls,
      fontWeight,
      opacityLoading,
      motionDurationSlow,
      motionEaseInOut,
      iconGap,
      calc
    } = token2;
    return {
      [componentCls]: {
        outline: "none",
        position: "relative",
        display: "inline-flex",
        gap: iconGap,
        alignItems: "center",
        justifyContent: "center",
        fontWeight,
        whiteSpace: "nowrap",
        textAlign: "center",
        backgroundImage: "none",
        background: "transparent",
        border: `${unit$1(token2.lineWidth)} ${token2.lineType} transparent`,
        cursor: "pointer",
        transition: `all ${token2.motionDurationMid} ${token2.motionEaseInOut}`,
        userSelect: "none",
        touchAction: "manipulation",
        color: token2.colorText,
        "&:disabled > *": {
          pointerEvents: "none"
        },
        // https://github.com/ant-design/ant-design/issues/51380
        [`${componentCls}-icon > svg`]: resetIcon(),
        "> a": {
          color: "currentColor"
        },
        "&:not(:disabled)": genFocusStyle(token2),
        [`&${componentCls}-two-chinese-chars::first-letter`]: {
          letterSpacing: "0.34em"
        },
        [`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
          marginInlineEnd: "-0.34em",
          letterSpacing: "0.34em"
        },
        [`&${componentCls}-icon-only`]: {
          paddingInline: 0,
          // make `btn-icon-only` not too narrow
          [`&${componentCls}-compact-item`]: {
            flex: "none"
          }
        },
        // Loading
        [`&${componentCls}-loading`]: {
          opacity: opacityLoading,
          cursor: "default"
        },
        [`${componentCls}-loading-icon`]: {
          transition: ["width", "opacity", "margin"].map((transition) => `${transition} ${motionDurationSlow} ${motionEaseInOut}`).join(",")
        },
        // iconPosition
        [`&:not(${componentCls}-icon-end)`]: {
          [`${componentCls}-loading-icon-motion`]: {
            "&-appear-start, &-enter-start": {
              marginInlineEnd: calc(iconGap).mul(-1).equal()
            },
            "&-appear-active, &-enter-active": {
              marginInlineEnd: 0
            },
            "&-leave-start": {
              marginInlineEnd: 0
            },
            "&-leave-active": {
              marginInlineEnd: calc(iconGap).mul(-1).equal()
            }
          }
        },
        "&-icon-end": {
          flexDirection: "row-reverse",
          [`${componentCls}-loading-icon-motion`]: {
            "&-appear-start, &-enter-start": {
              marginInlineStart: calc(iconGap).mul(-1).equal()
            },
            "&-appear-active, &-enter-active": {
              marginInlineStart: 0
            },
            "&-leave-start": {
              marginInlineStart: 0
            },
            "&-leave-active": {
              marginInlineStart: calc(iconGap).mul(-1).equal()
            }
          }
        }
      }
    };
  };
  const genHoverActiveButtonStyle = (btnCls, hoverStyle, activeStyle) => ({
    [`&:not(:disabled):not(${btnCls}-disabled)`]: {
      "&:hover": hoverStyle,
      "&:active": activeStyle
    }
  });
  const genCircleButtonStyle = (token2) => ({
    minWidth: token2.controlHeight,
    paddingInline: 0,
    borderRadius: "50%"
  });
  const genDisabledStyle = (token2) => ({
    cursor: "not-allowed",
    borderColor: token2.borderColorDisabled,
    color: token2.colorTextDisabled,
    background: token2.colorBgContainerDisabled,
    boxShadow: "none"
  });
  const genGhostButtonStyle = (btnCls, background, textColor, borderColor, textColorDisabled, borderColorDisabled, hoverStyle, activeStyle) => ({
    [`&${btnCls}-background-ghost`]: Object.assign(Object.assign({
      color: textColor || void 0,
      background,
      borderColor: borderColor || void 0,
      boxShadow: "none"
    }, genHoverActiveButtonStyle(btnCls, Object.assign({
      background
    }, hoverStyle), Object.assign({
      background
    }, activeStyle))), {
      "&:disabled": {
        cursor: "not-allowed",
        color: textColorDisabled || void 0,
        borderColor: borderColorDisabled || void 0
      }
    })
  });
  const genSolidDisabledButtonStyle = (token2) => ({
    [`&:disabled, &${token2.componentCls}-disabled`]: Object.assign({}, genDisabledStyle(token2))
  });
  const genPureDisabledButtonStyle = (token2) => ({
    [`&:disabled, &${token2.componentCls}-disabled`]: {
      cursor: "not-allowed",
      color: token2.colorTextDisabled
    }
  });
  const genVariantButtonStyle = (token2, hoverStyle, activeStyle, variant) => {
    const isPureDisabled = variant && ["link", "text"].includes(variant);
    const genDisabledButtonStyle = isPureDisabled ? genPureDisabledButtonStyle : genSolidDisabledButtonStyle;
    return Object.assign(Object.assign({}, genDisabledButtonStyle(token2)), genHoverActiveButtonStyle(token2.componentCls, hoverStyle, activeStyle));
  };
  const genSolidButtonStyle = (token2, textColor, background, hoverStyle, activeStyle) => ({
    [`&${token2.componentCls}-variant-solid`]: Object.assign({
      color: textColor,
      background
    }, genVariantButtonStyle(token2, hoverStyle, activeStyle))
  });
  const genOutlinedDashedButtonStyle = (token2, borderColor, background, hoverStyle, activeStyle) => ({
    [`&${token2.componentCls}-variant-outlined, &${token2.componentCls}-variant-dashed`]: Object.assign({
      borderColor,
      background
    }, genVariantButtonStyle(token2, hoverStyle, activeStyle))
  });
  const genDashedButtonStyle = (token2) => ({
    [`&${token2.componentCls}-variant-dashed`]: {
      borderStyle: "dashed"
    }
  });
  const genFilledButtonStyle = (token2, background, hoverStyle, activeStyle) => ({
    [`&${token2.componentCls}-variant-filled`]: Object.assign({
      boxShadow: "none",
      background
    }, genVariantButtonStyle(token2, hoverStyle, activeStyle))
  });
  const genTextLinkButtonStyle = (token2, textColor, variant, hoverStyle, activeStyle) => ({
    [`&${token2.componentCls}-variant-${variant}`]: Object.assign({
      color: textColor,
      boxShadow: "none"
    }, genVariantButtonStyle(token2, hoverStyle, activeStyle, variant))
  });
  const genPresetColorStyle = (token2) => {
    const {
      componentCls
    } = token2;
    return PresetColors.reduce((prev2, colorKey) => {
      const darkColor = token2[`${colorKey}6`];
      const lightColor = token2[`${colorKey}1`];
      const hoverColor = token2[`${colorKey}5`];
      const lightHoverColor = token2[`${colorKey}2`];
      const lightBorderColor = token2[`${colorKey}3`];
      const activeColor = token2[`${colorKey}7`];
      return Object.assign(Object.assign({}, prev2), {
        [`&${componentCls}-color-${colorKey}`]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
          color: darkColor,
          boxShadow: token2[`${colorKey}ShadowColor`]
        }, genSolidButtonStyle(token2, token2.colorTextLightSolid, darkColor, {
          background: hoverColor
        }, {
          background: activeColor
        })), genOutlinedDashedButtonStyle(token2, darkColor, token2.colorBgContainer, {
          color: hoverColor,
          borderColor: hoverColor,
          background: token2.colorBgContainer
        }, {
          color: activeColor,
          borderColor: activeColor,
          background: token2.colorBgContainer
        })), genDashedButtonStyle(token2)), genFilledButtonStyle(token2, lightColor, {
          color: darkColor,
          background: lightHoverColor
        }, {
          color: darkColor,
          background: lightBorderColor
        })), genTextLinkButtonStyle(token2, darkColor, "link", {
          color: hoverColor
        }, {
          color: activeColor
        })), genTextLinkButtonStyle(token2, darkColor, "text", {
          color: hoverColor,
          background: lightColor
        }, {
          color: activeColor,
          background: lightBorderColor
        }))
      });
    }, {});
  };
  const genDefaultButtonStyle = (token2) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
    color: token2.defaultColor,
    boxShadow: token2.defaultShadow
  }, genSolidButtonStyle(token2, token2.solidTextColor, token2.colorBgSolid, {
    color: token2.solidTextColor,
    background: token2.colorBgSolidHover
  }, {
    color: token2.solidTextColor,
    background: token2.colorBgSolidActive
  })), genDashedButtonStyle(token2)), genFilledButtonStyle(token2, token2.colorFillTertiary, {
    color: token2.defaultColor,
    background: token2.colorFillSecondary
  }, {
    color: token2.defaultColor,
    background: token2.colorFill
  })), genGhostButtonStyle(token2.componentCls, token2.ghostBg, token2.defaultGhostColor, token2.defaultGhostBorderColor, token2.colorTextDisabled, token2.colorBorder)), genTextLinkButtonStyle(token2, token2.textTextColor, "link", {
    color: token2.colorLinkHover,
    background: token2.linkHoverBg
  }, {
    color: token2.colorLinkActive
  }));
  const genPrimaryButtonStyle = (token2) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
    color: token2.colorPrimary,
    boxShadow: token2.primaryShadow
  }, genOutlinedDashedButtonStyle(token2, token2.colorPrimary, token2.colorBgContainer, {
    color: token2.colorPrimaryTextHover,
    borderColor: token2.colorPrimaryHover,
    background: token2.colorBgContainer
  }, {
    color: token2.colorPrimaryTextActive,
    borderColor: token2.colorPrimaryActive,
    background: token2.colorBgContainer
  })), genDashedButtonStyle(token2)), genFilledButtonStyle(token2, token2.colorPrimaryBg, {
    color: token2.colorPrimary,
    background: token2.colorPrimaryBgHover
  }, {
    color: token2.colorPrimary,
    background: token2.colorPrimaryBorder
  })), genTextLinkButtonStyle(token2, token2.colorPrimaryText, "text", {
    color: token2.colorPrimaryTextHover,
    background: token2.colorPrimaryBg
  }, {
    color: token2.colorPrimaryTextActive,
    background: token2.colorPrimaryBorder
  })), genTextLinkButtonStyle(token2, token2.colorPrimaryText, "link", {
    color: token2.colorPrimaryTextHover,
    background: token2.linkHoverBg
  }, {
    color: token2.colorPrimaryTextActive
  })), genGhostButtonStyle(token2.componentCls, token2.ghostBg, token2.colorPrimary, token2.colorPrimary, token2.colorTextDisabled, token2.colorBorder, {
    color: token2.colorPrimaryHover,
    borderColor: token2.colorPrimaryHover
  }, {
    color: token2.colorPrimaryActive,
    borderColor: token2.colorPrimaryActive
  }));
  const genDangerousStyle = (token2) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
    color: token2.colorError,
    boxShadow: token2.dangerShadow
  }, genSolidButtonStyle(token2, token2.dangerColor, token2.colorError, {
    background: token2.colorErrorHover
  }, {
    background: token2.colorErrorActive
  })), genOutlinedDashedButtonStyle(token2, token2.colorError, token2.colorBgContainer, {
    color: token2.colorErrorHover,
    borderColor: token2.colorErrorBorderHover
  }, {
    color: token2.colorErrorActive,
    borderColor: token2.colorErrorActive
  })), genDashedButtonStyle(token2)), genFilledButtonStyle(token2, token2.colorErrorBg, {
    color: token2.colorError,
    background: token2.colorErrorBgFilledHover
  }, {
    color: token2.colorError,
    background: token2.colorErrorBgActive
  })), genTextLinkButtonStyle(token2, token2.colorError, "text", {
    color: token2.colorErrorHover,
    background: token2.colorErrorBg
  }, {
    color: token2.colorErrorHover,
    background: token2.colorErrorBgActive
  })), genTextLinkButtonStyle(token2, token2.colorError, "link", {
    color: token2.colorErrorHover
  }, {
    color: token2.colorErrorActive
  })), genGhostButtonStyle(token2.componentCls, token2.ghostBg, token2.colorError, token2.colorError, token2.colorTextDisabled, token2.colorBorder, {
    color: token2.colorErrorHover,
    borderColor: token2.colorErrorHover
  }, {
    color: token2.colorErrorActive,
    borderColor: token2.colorErrorActive
  }));
  const genLinkStyle = (token2) => Object.assign(Object.assign({}, genTextLinkButtonStyle(token2, token2.colorLink, "link", {
    color: token2.colorLinkHover
  }, {
    color: token2.colorLinkActive
  })), genGhostButtonStyle(token2.componentCls, token2.ghostBg, token2.colorInfo, token2.colorInfo, token2.colorTextDisabled, token2.colorBorder, {
    color: token2.colorInfoHover,
    borderColor: token2.colorInfoHover
  }, {
    color: token2.colorInfoActive,
    borderColor: token2.colorInfoActive
  }));
  const genColorButtonStyle = (token2) => {
    const {
      componentCls
    } = token2;
    return Object.assign({
      [`${componentCls}-color-default`]: genDefaultButtonStyle(token2),
      [`${componentCls}-color-primary`]: genPrimaryButtonStyle(token2),
      [`${componentCls}-color-dangerous`]: genDangerousStyle(token2),
      [`${componentCls}-color-link`]: genLinkStyle(token2)
    }, genPresetColorStyle(token2));
  };
  const genCompatibleButtonStyle = (token2) => Object.assign(Object.assign(Object.assign(Object.assign({}, genOutlinedDashedButtonStyle(token2, token2.defaultBorderColor, token2.defaultBg, {
    color: token2.defaultHoverColor,
    borderColor: token2.defaultHoverBorderColor,
    background: token2.defaultHoverBg
  }, {
    color: token2.defaultActiveColor,
    borderColor: token2.defaultActiveBorderColor,
    background: token2.defaultActiveBg
  })), genTextLinkButtonStyle(token2, token2.textTextColor, "text", {
    color: token2.textTextHoverColor,
    background: token2.textHoverBg
  }, {
    color: token2.textTextActiveColor,
    background: token2.colorBgTextActive
  })), genSolidButtonStyle(token2, token2.primaryColor, token2.colorPrimary, {
    background: token2.colorPrimaryHover,
    color: token2.primaryColor
  }, {
    background: token2.colorPrimaryActive,
    color: token2.primaryColor
  })), genTextLinkButtonStyle(token2, token2.colorLink, "link", {
    color: token2.colorLinkHover,
    background: token2.linkHoverBg
  }, {
    color: token2.colorLinkActive
  }));
  const genButtonStyle = (token2, prefixCls = "") => {
    const {
      componentCls,
      controlHeight,
      fontSize,
      borderRadius,
      buttonPaddingHorizontal,
      iconCls,
      buttonPaddingVertical,
      buttonIconOnlyFontSize
    } = token2;
    return [
      {
        [prefixCls]: {
          fontSize,
          height: controlHeight,
          padding: `${unit$1(buttonPaddingVertical)} ${unit$1(buttonPaddingHorizontal)}`,
          borderRadius,
          [`&${componentCls}-icon-only`]: {
            width: controlHeight,
            [iconCls]: {
              fontSize: buttonIconOnlyFontSize
            }
          }
        }
      },
      // Shape - patch prefixCls again to override solid border radius style
      {
        [`${componentCls}${componentCls}-circle${prefixCls}`]: genCircleButtonStyle(token2)
      },
      {
        [`${componentCls}${componentCls}-round${prefixCls}`]: {
          borderRadius: token2.controlHeight,
          [`&:not(${componentCls}-icon-only)`]: {
            paddingInline: token2.buttonPaddingHorizontal
          }
        }
      }
    ];
  };
  const genSizeBaseButtonStyle = (token2) => {
    const baseToken = merge(token2, {
      fontSize: token2.contentFontSize
    });
    return genButtonStyle(baseToken, token2.componentCls);
  };
  const genSizeSmallButtonStyle = (token2) => {
    const smallToken = merge(token2, {
      controlHeight: token2.controlHeightSM,
      fontSize: token2.contentFontSizeSM,
      padding: token2.paddingXS,
      buttonPaddingHorizontal: token2.paddingInlineSM,
      buttonPaddingVertical: 0,
      borderRadius: token2.borderRadiusSM,
      buttonIconOnlyFontSize: token2.onlyIconSizeSM
    });
    return genButtonStyle(smallToken, `${token2.componentCls}-sm`);
  };
  const genSizeLargeButtonStyle = (token2) => {
    const largeToken = merge(token2, {
      controlHeight: token2.controlHeightLG,
      fontSize: token2.contentFontSizeLG,
      buttonPaddingHorizontal: token2.paddingInlineLG,
      buttonPaddingVertical: 0,
      borderRadius: token2.borderRadiusLG,
      buttonIconOnlyFontSize: token2.onlyIconSizeLG
    });
    return genButtonStyle(largeToken, `${token2.componentCls}-lg`);
  };
  const genBlockButtonStyle = (token2) => {
    const {
      componentCls
    } = token2;
    return {
      [componentCls]: {
        [`&${componentCls}-block`]: {
          width: "100%"
        }
      }
    };
  };
  const useStyle = genStyleHooks("Button", (token2) => {
    const buttonToken = prepareToken(token2);
    return [
      // Shared
      genSharedButtonStyle(buttonToken),
      // Size
      genSizeBaseButtonStyle(buttonToken),
      genSizeSmallButtonStyle(buttonToken),
      genSizeLargeButtonStyle(buttonToken),
      // Block
      genBlockButtonStyle(buttonToken),
      // Color
      genColorButtonStyle(buttonToken),
      // https://github.com/ant-design/ant-design/issues/50969
      genCompatibleButtonStyle(buttonToken),
      // Button Group
      genGroupStyle(buttonToken)
    ];
  }, prepareComponentToken, {
    unitless: {
      fontWeight: true,
      contentLineHeight: true,
      contentLineHeightSM: true,
      contentLineHeightLG: true
    }
  });
  function compactItemBorder(token2, parentCls, options, prefixCls) {
    const {
      focusElCls,
      focus,
      borderElCls
    } = options;
    const childCombinator = borderElCls ? "> *" : "";
    const hoverEffects = ["hover", focus ? "focus" : null, "active"].filter(Boolean).map((n2) => `&:${n2} ${childCombinator}`).join(",");
    return {
      [`&-item:not(${parentCls}-last-item)`]: {
        marginInlineEnd: token2.calc(token2.lineWidth).mul(-1).equal()
      },
      [`&-item:not(${prefixCls}-status-success)`]: {
        zIndex: 2
      },
      "&-item": Object.assign(Object.assign({
        [hoverEffects]: {
          zIndex: 3
        }
      }, focusElCls ? {
        [`&${focusElCls}`]: {
          zIndex: 3
        }
      } : {}), {
        [`&[disabled] ${childCombinator}`]: {
          zIndex: 0
        }
      })
    };
  }
  function compactItemBorderRadius(prefixCls, parentCls, options) {
    const {
      borderElCls
    } = options;
    const childCombinator = borderElCls ? `> ${borderElCls}` : "";
    return {
      [`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item) ${childCombinator}`]: {
        borderRadius: 0
      },
      [`&-item:not(${parentCls}-last-item)${parentCls}-first-item`]: {
        [`& ${childCombinator}, &${prefixCls}-sm ${childCombinator}, &${prefixCls}-lg ${childCombinator}`]: {
          borderStartEndRadius: 0,
          borderEndEndRadius: 0
        }
      },
      [`&-item:not(${parentCls}-first-item)${parentCls}-last-item`]: {
        [`& ${childCombinator}, &${prefixCls}-sm ${childCombinator}, &${prefixCls}-lg ${childCombinator}`]: {
          borderStartStartRadius: 0,
          borderEndStartRadius: 0
        }
      }
    };
  }
  function genCompactItemStyle(token2, options = {
    focus: true
  }) {
    const {
      componentCls
    } = token2;
    const compactCls = `${componentCls}-compact`;
    return {
      [compactCls]: Object.assign(Object.assign({}, compactItemBorder(token2, compactCls, options, componentCls)), compactItemBorderRadius(componentCls, compactCls, options))
    };
  }
  function compactItemVerticalBorder(token2, parentCls, prefixCls) {
    return {
      // border collapse
      [`&-item:not(${parentCls}-last-item)`]: {
        marginBottom: token2.calc(token2.lineWidth).mul(-1).equal()
      },
      [`&-item:not(${prefixCls}-status-success)`]: {
        zIndex: 2
      },
      "&-item": {
        "&:hover,&:focus,&:active": {
          zIndex: 3
        },
        "&[disabled]": {
          zIndex: 0
        }
      }
    };
  }
  function compactItemBorderVerticalRadius(prefixCls, parentCls) {
    return {
      [`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item)`]: {
        borderRadius: 0
      },
      [`&-item${parentCls}-first-item:not(${parentCls}-last-item)`]: {
        [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
          borderEndEndRadius: 0,
          borderEndStartRadius: 0
        }
      },
      [`&-item${parentCls}-last-item:not(${parentCls}-first-item)`]: {
        [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
          borderStartStartRadius: 0,
          borderStartEndRadius: 0
        }
      }
    };
  }
  function genCompactItemVerticalStyle(token2) {
    const compactCls = `${token2.componentCls}-compact-vertical`;
    return {
      [compactCls]: Object.assign(Object.assign({}, compactItemVerticalBorder(token2, compactCls, token2.componentCls)), compactItemBorderVerticalRadius(token2.componentCls, compactCls))
    };
  }
  const genButtonCompactStyle = (token2) => {
    const {
      componentCls,
      colorPrimaryHover,
      lineWidth,
      calc
    } = token2;
    const insetOffset = calc(lineWidth).mul(-1).equal();
    const getCompactBorderStyle = (vertical) => {
      const selector = `${componentCls}-compact${vertical ? "-vertical" : ""}-item${componentCls}-primary:not([disabled])`;
      return {
        [`${selector} + ${selector}::before`]: {
          position: "absolute",
          top: vertical ? insetOffset : 0,
          insetInlineStart: vertical ? 0 : insetOffset,
          backgroundColor: colorPrimaryHover,
          content: '""',
          width: vertical ? "100%" : lineWidth,
          height: vertical ? lineWidth : "100%"
        }
      };
    };
    return Object.assign(Object.assign({}, getCompactBorderStyle()), getCompactBorderStyle(true));
  };
  const Compact = genSubStyleComponent(["Button", "compact"], (token2) => {
    const buttonToken = prepareToken(token2);
    return [
      // Space Compact
      genCompactItemStyle(buttonToken),
      genCompactItemVerticalStyle(buttonToken),
      genButtonCompactStyle(buttonToken)
    ];
  }, prepareComponentToken);
  var __rest = function(s, e2) {
    var t2 = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e2.indexOf(p2) < 0) t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e2.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i])) t2[p2[i]] = s[p2[i]];
    }
    return t2;
  };
  function getLoadingConfig(loading) {
    if (typeof loading === "object" && loading) {
      let delay = loading === null || loading === void 0 ? void 0 : loading.delay;
      delay = !Number.isNaN(delay) && typeof delay === "number" ? delay : 0;
      return {
        loading: delay <= 0,
        delay
      };
    }
    return {
      loading: !!loading,
      delay: 0
    };
  }
  const ButtonTypeMap = {
    default: ["default", "outlined"],
    primary: ["primary", "solid"],
    dashed: ["default", "dashed"],
    // `link` is not a real color but we should compatible with it
    link: ["link", "link"],
    text: ["default", "text"]
  };
  const InternalCompoundedButton = /* @__PURE__ */ React.forwardRef((props, ref) => {
    var _a, _b;
    const {
      loading = false,
      prefixCls: customizePrefixCls,
      color,
      variant,
      type,
      danger = false,
      shape: customizeShape,
      size: customizeSize,
      styles,
      disabled: customDisabled,
      className,
      rootClassName,
      children,
      icon,
      iconPosition = "start",
      ghost = false,
      block = false,
      // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
      htmlType = "button",
      classNames: customClassNames,
      style: customStyle = {},
      autoInsertSpace,
      autoFocus
    } = props, rest = __rest(props, ["loading", "prefixCls", "color", "variant", "type", "danger", "shape", "size", "styles", "disabled", "className", "rootClassName", "children", "icon", "iconPosition", "ghost", "block", "htmlType", "classNames", "style", "autoInsertSpace", "autoFocus"]);
    const mergedType = type || "default";
    const {
      button
    } = React.useContext(ConfigContext);
    const shape = customizeShape || (button === null || button === void 0 ? void 0 : button.shape) || "default";
    const [mergedColor, mergedVariant] = reactExports.useMemo(() => {
      if (color && variant) {
        return [color, variant];
      }
      if (type || danger) {
        const colorVariantPair = ButtonTypeMap[mergedType] || [];
        if (danger) {
          return ["danger", colorVariantPair[1]];
        }
        return colorVariantPair;
      }
      if ((button === null || button === void 0 ? void 0 : button.color) && (button === null || button === void 0 ? void 0 : button.variant)) {
        return [button.color, button.variant];
      }
      return ["default", "outlined"];
    }, [type, color, variant, danger, button === null || button === void 0 ? void 0 : button.variant, button === null || button === void 0 ? void 0 : button.color]);
    const isDanger = mergedColor === "danger";
    const mergedColorText = isDanger ? "dangerous" : mergedColor;
    const {
      getPrefixCls,
      direction,
      autoInsertSpace: contextAutoInsertSpace,
      className: contextClassName,
      style: contextStyle,
      classNames: contextClassNames,
      styles: contextStyles
    } = useComponentConfig("button");
    const mergedInsertSpace = (_a = autoInsertSpace !== null && autoInsertSpace !== void 0 ? autoInsertSpace : contextAutoInsertSpace) !== null && _a !== void 0 ? _a : true;
    const prefixCls = getPrefixCls("btn", customizePrefixCls);
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
    const disabled = reactExports.useContext(DisabledContext);
    const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
    const groupSize = reactExports.useContext(GroupSizeContext);
    const loadingOrDelay = reactExports.useMemo(() => getLoadingConfig(loading), [loading]);
    const [innerLoading, setLoading] = reactExports.useState(loadingOrDelay.loading);
    const [hasTwoCNChar, setHasTwoCNChar] = reactExports.useState(false);
    const buttonRef = reactExports.useRef(null);
    const mergedRef = useComposeRef(ref, buttonRef);
    const needInserted = reactExports.Children.count(children) === 1 && !icon && !isUnBorderedButtonVariant(mergedVariant);
    const isMountRef = reactExports.useRef(true);
    React.useEffect(() => {
      isMountRef.current = false;
      return () => {
        isMountRef.current = true;
      };
    }, []);
    useLayoutEffect(() => {
      let delayTimer = null;
      if (loadingOrDelay.delay > 0) {
        delayTimer = setTimeout(() => {
          delayTimer = null;
          setLoading(true);
        }, loadingOrDelay.delay);
      } else {
        setLoading(loadingOrDelay.loading);
      }
      function cleanupTimer() {
        if (delayTimer) {
          clearTimeout(delayTimer);
          delayTimer = null;
        }
      }
      return cleanupTimer;
    }, [loadingOrDelay.delay, loadingOrDelay.loading]);
    reactExports.useEffect(() => {
      if (!buttonRef.current || !mergedInsertSpace) {
        return;
      }
      const buttonText = buttonRef.current.textContent || "";
      if (needInserted && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar) {
          setHasTwoCNChar(true);
        }
      } else if (hasTwoCNChar) {
        setHasTwoCNChar(false);
      }
    });
    reactExports.useEffect(() => {
      if (autoFocus && buttonRef.current) {
        buttonRef.current.focus();
      }
    }, []);
    const handleClick = React.useCallback((e2) => {
      var _a2;
      if (innerLoading || mergedDisabled) {
        e2.preventDefault();
        return;
      }
      (_a2 = props.onClick) === null || _a2 === void 0 ? void 0 : _a2.call(props, "href" in props ? e2 : e2);
    }, [props.onClick, innerLoading, mergedDisabled]);
    const {
      compactSize,
      compactItemClassnames
    } = useCompactItemContext(prefixCls, direction);
    const sizeClassNameMap = {
      large: "lg",
      small: "sm",
      middle: void 0
    };
    const sizeFullName = useSize((ctxSize) => {
      var _a2, _b2;
      return (_b2 = (_a2 = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a2 !== void 0 ? _a2 : groupSize) !== null && _b2 !== void 0 ? _b2 : ctxSize;
    });
    const sizeCls = sizeFullName ? (_b = sizeClassNameMap[sizeFullName]) !== null && _b !== void 0 ? _b : "" : "";
    const iconType = innerLoading ? "loading" : icon;
    const linkButtonRestProps = omit(rest, ["navigate"]);
    const classes = classNames(prefixCls, hashId, cssVarCls, {
      [`${prefixCls}-${shape}`]: shape !== "default" && shape,
      // Compatible with versions earlier than 5.21.0
      [`${prefixCls}-${mergedType}`]: mergedType,
      [`${prefixCls}-dangerous`]: danger,
      [`${prefixCls}-color-${mergedColorText}`]: mergedColorText,
      [`${prefixCls}-variant-${mergedVariant}`]: mergedVariant,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
      [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonVariant(mergedVariant),
      [`${prefixCls}-loading`]: innerLoading,
      [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && mergedInsertSpace && !innerLoading,
      [`${prefixCls}-block`]: block,
      [`${prefixCls}-rtl`]: direction === "rtl",
      [`${prefixCls}-icon-end`]: iconPosition === "end"
    }, compactItemClassnames, className, rootClassName, contextClassName);
    const fullStyle = Object.assign(Object.assign({}, contextStyle), customStyle);
    const iconClasses = classNames(customClassNames === null || customClassNames === void 0 ? void 0 : customClassNames.icon, contextClassNames.icon);
    const iconStyle = Object.assign(Object.assign({}, (styles === null || styles === void 0 ? void 0 : styles.icon) || {}), contextStyles.icon || {});
    const iconNode = icon && !innerLoading ? /* @__PURE__ */ React.createElement(IconWrapper, {
      prefixCls,
      className: iconClasses,
      style: iconStyle
    }, icon) : loading && typeof loading === "object" && loading.icon ? /* @__PURE__ */ React.createElement(IconWrapper, {
      prefixCls,
      className: iconClasses,
      style: iconStyle
    }, loading.icon) : /* @__PURE__ */ React.createElement(DefaultLoadingIcon, {
      existIcon: !!icon,
      prefixCls,
      loading: innerLoading,
      mount: isMountRef.current
    });
    const kids = children || children === 0 ? spaceChildren(children, needInserted && mergedInsertSpace) : null;
    if (linkButtonRestProps.href !== void 0) {
      return wrapCSSVar(/* @__PURE__ */ React.createElement("a", Object.assign({}, linkButtonRestProps, {
        className: classNames(classes, {
          [`${prefixCls}-disabled`]: mergedDisabled
        }),
        href: mergedDisabled ? void 0 : linkButtonRestProps.href,
        style: fullStyle,
        onClick: handleClick,
        ref: mergedRef,
        tabIndex: mergedDisabled ? -1 : 0,
        "aria-disabled": mergedDisabled
      }), iconNode, kids));
    }
    let buttonNode = /* @__PURE__ */ React.createElement("button", Object.assign({}, rest, {
      type: htmlType,
      className: classes,
      style: fullStyle,
      onClick: handleClick,
      disabled: mergedDisabled,
      ref: mergedRef
    }), iconNode, kids, compactItemClassnames && /* @__PURE__ */ React.createElement(Compact, {
      prefixCls
    }));
    if (!isUnBorderedButtonVariant(mergedVariant)) {
      buttonNode = /* @__PURE__ */ React.createElement(Wave, {
        component: "Button",
        disabled: innerLoading
      }, buttonNode);
    }
    return wrapCSSVar(buttonNode);
  });
  const Button = InternalCompoundedButton;
  Button.Group = ButtonGroup;
  Button.__ANT_BUTTON = true;
  function Post() {
    return __jacJsx$1("div", {}, [__jacJsx$1("h1", {}, ["Post"]), __jacJsx$1(Feed$1, {}, []), __jacJsx$1(Button, {}, ["Click Me"])]);
  }
  const globalClientFunctions$1 = ["Post"];
  const globalFunctionMap$1 = {
    "Post": Post
  };
  for (const funcName of globalClientFunctions$1) {
    globalThis[funcName] = globalFunctionMap$1[funcName];
  }
  __jacRegisterClientModule$1("post", ["Post"], {});
  function __jacJsx$1(tag, props, children) {
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
      return reactExports.createElement.apply(React$1, args);
    } else {
      return reactExports.createElement(tag, props);
    }
  }
  function renderJsxTree$1(node2, container) {
    try {
      createRoot$1(container).render(node2);
    } catch (err) {
      console.error("[Jac] Error in renderJsxTree:", err);
    }
  }
  const __jacReactiveContext$1 = { "signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "reactRoot": null, "currentComponent": null, "currentEffect": null, "router": null };
  function __isObject$1(value) {
    if (value === null) {
      return false;
    }
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function __isFunction$1(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
  }
  function __objectKeys$1(obj) {
    if (obj === null) {
      return [];
    }
    return Object.keys(obj);
  }
  function __jacHasOwn$1(obj, key) {
    try {
      return Object.prototype.hasOwnProperty.call(obj, key);
    } catch {
      return false;
    }
  }
  function __jacGetDocument$1(scope) {
    try {
      return scope.document;
    } catch {
    }
    try {
      return window.document;
    } catch {
    }
    return null;
  }
  function __jacParseJsonObject$1(text) {
    try {
      let parsed = JSON.parse(text);
      if (__isObject$1(parsed)) {
        return parsed;
      }
      console.error("[Jac] Hydration payload is not an object");
      return null;
    } catch (err) {
      console.error("[Jac] Failed to parse hydration payload", err);
      return null;
    }
  }
  function __jacBuildOrderedArgs$1(order, argsDict) {
    let result = [];
    if (!order) {
      return result;
    }
    let values = __isObject$1(argsDict) ? argsDict : {};
    for (const name of order) {
      result.push(values[name]);
    }
    return result;
  }
  function __jacResolveRenderer$1(scope) {
    if (scope.renderJsxTree) {
      return scope.renderJsxTree;
    }
    if (__isFunction$1(renderJsxTree$1)) {
      return renderJsxTree$1;
    }
    return null;
  }
  function __jacResolveTarget$1(moduleRecord, registry, name) {
    let moduleFunctions = moduleRecord && moduleRecord.moduleFunctions ? moduleRecord.moduleFunctions : {};
    if (__jacHasOwn$1(moduleFunctions, name)) {
      return moduleFunctions[name];
    }
    let registryFunctions = registry && registry.functions ? registry.functions : {};
    if (__jacHasOwn$1(registryFunctions, name)) {
      return registryFunctions[name];
    }
    return null;
  }
  function __jacGlobalScope$1() {
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
  function __jacEnsureRegistry$1() {
    let scope = __jacGlobalScope$1();
    let registry = scope.__jacClient;
    if (!registry) {
      registry = { "functions": {}, "globals": {}, "modules": {}, "state": { "globals": {} }, "__hydration": { "registered": false }, "lastModule": null };
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
      registry.state = { "globals": {} };
    } else if (!registry.state.globals) {
      registry.state.globals = {};
    }
    if (!registry.__hydration) {
      registry.__hydration = { "registered": false };
    }
    return registry;
  }
  function __jacHydrateFromDom$1(defaultModuleName) {
    let scope = __jacGlobalScope$1();
    let documentRef = __jacGetDocument$1(scope);
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
    let payload = __jacParseJsonObject$1(payloadText);
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
    let registry = __jacEnsureRegistry$1();
    let modulesStore = registry.modules ? registry.modules : {};
    console.log("moduleName", moduleName);
    console.log("modulesStore", modulesStore);
    console.log("modulesStoreSnapshot", JSON.stringify(modulesStore));
    let moduleRecord = __jacHasOwn$1(modulesStore, moduleName) ? modulesStore[moduleName] : null;
    console.log("moduleRecord", moduleRecord);
    if (!moduleRecord) {
      console.error("[Jac] Client module not registered: " + moduleName);
      return;
    }
    let argOrderRaw = payload["argOrder"] !== null ? payload["argOrder"] : [];
    let argOrder = Array.isArray(argOrderRaw) ? argOrderRaw : [];
    let argsDictRaw = payload["args"] !== null ? payload["args"] : {};
    let argsDict = __isObject$1(argsDictRaw) ? argsDictRaw : {};
    let orderedArgs = __jacBuildOrderedArgs$1(argOrder, argsDict);
    let payloadGlobalsRaw = payload["globals"] !== null ? payload["globals"] : {};
    let payloadGlobals = __isObject$1(payloadGlobalsRaw) ? payloadGlobalsRaw : {};
    registry.state.globals[moduleName] = payloadGlobals;
    for (const gName of __objectKeys$1(payloadGlobals)) {
      let gValue = payloadGlobals[gName];
      scope[gName] = gValue;
      registry.globals[gName] = gValue;
    }
    let target = __jacResolveTarget$1(moduleRecord, registry, targetName);
    if (!target) {
      console.error("[Jac] Client function not found: " + targetName);
      return;
    }
    __jacReactiveContext$1.rootComponent = () => {
      __jacReactiveContext$1.currentComponent = "__root__";
      let result = target.apply(scope, orderedArgs);
      __jacReactiveContext$1.currentComponent = null;
      return result;
    };
    let renderer = __jacResolveRenderer$1(scope);
    if (!renderer) {
      console.warn("[Jac] renderJsxTree is not available in client bundle");
    }
    let reactRoot = null;
    try {
      reactRoot = createRoot$1(rootEl);
      __jacReactiveContext$1.reactRoot = reactRoot;
    } catch (err) {
      console.error("[Jac] Failed to create React root for hydration:", err);
      return;
    }
    let value = __jacReactiveContext$1.rootComponent();
    if (value && __isObject$1(value) && __isFunction$1(value.then)) {
      value.then((node2) => {
        reactRoot.render(node2);
      }).catch((err) => {
        console.error("[Jac] Error resolving client function promise", err);
      });
    } else {
      reactRoot.render(value);
    }
  }
  function __jacExecuteHydration$1() {
    let registry = __jacEnsureRegistry$1();
    let defaultModule = registry.lastModule ? registry.lastModule : "";
    __jacHydrateFromDom$1(defaultModule);
  }
  function __jacEnsureHydration$1(moduleName) {
    let registry = __jacEnsureRegistry$1();
    registry.lastModule = moduleName;
    let existingHydration = registry.__hydration ? registry.__hydration : null;
    let hydration = existingHydration ? existingHydration : { "registered": false };
    registry.__hydration = hydration;
    let scope = __jacGlobalScope$1();
    let documentRef = __jacGetDocument$1(scope);
    if (!documentRef) {
      return;
    }
    let alreadyRegistered = hydration.registered ? hydration.registered : false;
    if (!alreadyRegistered) {
      hydration.registered = true;
      documentRef.addEventListener("DOMContentLoaded", (_event) => {
        __jacExecuteHydration$1();
      }, { "once": true });
    }
  }
  function __jacRegisterClientModule$1(moduleName, clientFunctions2, clientGlobals) {
    let scope = __jacGlobalScope$1();
    let registry = __jacEnsureRegistry$1();
    let moduleFunctions = {};
    let registeredFunctions = [];
    if (clientFunctions2) {
      for (const funcName of clientFunctions2) {
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
    for (const gName of __objectKeys$1(globalsMap)) {
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
    let existingRecord = __jacHasOwn$1(modulesStore, moduleName) ? modulesStore[moduleName] : null;
    let moduleRecord = existingRecord ? existingRecord : {};
    moduleRecord.moduleFunctions = moduleFunctions;
    moduleRecord.moduleGlobals = moduleGlobals;
    moduleRecord.functions = registeredFunctions;
    moduleRecord.globals = globalNames;
    moduleRecord.defaults = globalsMap;
    registry.modules[moduleName] = moduleRecord;
    let stateGlobals = registry.state.globals;
    if (!__jacHasOwn$1(stateGlobals, moduleName)) {
      stateGlobals[moduleName] = {};
    }
    __jacEnsureHydration$1(moduleName);
  }
  function HomeView() {
    return __jacJsx("div", { "style": { "minHeight": "100vh", "fontFamily": "-apple-system, BlinkMacSystemFont, sans-serif" } }, [__jacJsx("main", { "style": { "maxWidth": "1200px", "margin": "0 auto", "padding": "60px 40px" } }, [__jacJsx("div", { "style": { "textAlign": "center", "marginBottom": "80px" } }, [__jacJsx("h1", { "style": { "fontSize": "56px", "marginBottom": "20px" } }, ["Welcome to", __jacJsx("span", { "style": { "color": "#007bff" } }, ["OneLang"])]), __jacJsx(Post, {}, []), __jacJsx("p", { "style": { "fontSize": "20px", "color": "#666" } }, ["One Language. One Stack. Zero Friction."])]), __jacJsx("div", { "style": { "display": "grid", "gridTemplateColumns": "repeat(2, 1fr)", "gap": "24px", "marginBottom": "60px" } }, [__jacJsx("a", { "href": "https://docs.jaseci.org", "target": "_blank", "style": { "padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000" } }, [__jacJsx("h3", { "style": { "marginTop": "0", "marginBottom": "12px" } }, ["📖 Documentation"]), __jacJsx("p", { "style": { "color": "#666", "margin": "0" } }, ["Learn how to build with OneLang"])]), __jacJsx("a", { "href": "https://docs.jaseci.org/learn", "target": "_blank", "style": { "padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000" } }, [__jacJsx("h3", { "style": { "marginTop": "0", "marginBottom": "12px" } }, ["🎓 Learn"]), __jacJsx("p", { "style": { "color": "#666", "margin": "0" } }, ["Tutorials and guides"])]), __jacJsx("a", { "href": "/examples", "style": { "padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000" } }, [__jacJsx("h3", { "style": { "marginTop": "0", "marginBottom": "12px" } }, ["💡 Examples"]), __jacJsx("p", { "style": { "color": "#666", "margin": "0" } }, ["Sample applications"])]), __jacJsx("a", { "href": "https://github.com/Jaseci-Labs/jaseci", "target": "_blank", "style": { "padding": "32px", "backgroundColor": "white", "border": "1px solid #eaeaea", "borderRadius": "8px", "textDecoration": "none", "color": "#000" } }, [__jacJsx("h3", { "style": { "marginTop": "0", "marginBottom": "12px" } }, ["🔧 Community"]), __jacJsx("p", { "style": { "color": "#666", "margin": "0" } }, ["GitHub repository"])])]), __jacJsx("footer", { "style": { "borderTop": "1px solid #eaeaea", "paddingTop": "40px", "textAlign": "center", "color": "#999" } }, [__jacJsx("p", {}, ["Get started by editing", __jacJsx("code", { "style": { "backgroundColor": "#f5f5f5", "padding": "2px 6px", "borderRadius": "3px" } }, ["app.jac"])])])])]);
  }
  function App() {
    let home_route = { "path": "/", "component": () => {
      return HomeView();
    }, "guard": null };
    let routes = [home_route];
    let router = initRouter(routes, "/");
    return __jacJsx("div", { "class": "app-container" }, [router.render()]);
  }
  function jac_app() {
    return App();
  }
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
      return reactExports.createElement.apply(React$1, args);
    } else {
      return reactExports.createElement(tag, props);
    }
  }
  function renderJsxTree(node2, container) {
    try {
      createRoot$1(container).render(node2);
    } catch (err) {
      console.error("[Jac] Error in renderJsxTree:", err);
    }
  }
  const __jacReactiveContext = { "signals": [], "pendingRenders": [], "flushScheduled": false, "rootComponent": null, "reactRoot": null, "currentComponent": null, "currentEffect": null, "router": null };
  function createSignal(initialValue) {
    __jacReactiveContext.signals.length;
    let signalData = { "value": initialValue, "subscribers": [] };
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
  function initRouter(routes, defaultRoute) {
    let initialPath = __jacGetHashPath();
    if (!initialPath) {
      initialPath = defaultRoute;
    }
    let [currentPath, setCurrentPath] = createSignal(initialPath);
    window.addEventListener("hashchange", (event) => {
      let newPath = __jacGetHashPath();
      if (!newPath) {
        newPath = defaultRoute;
      }
      setCurrentPath(newPath);
    });
    window.addEventListener("popstate", (event) => {
      let newPath = __jacGetHashPath();
      if (!newPath) {
        newPath = defaultRoute;
      }
      setCurrentPath(newPath);
    });
    function render2() {
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
    let router = { "path": currentPath, "render": render2, "navigate": navigateTo };
    __jacReactiveContext.router = router;
    return router;
  }
  function __jacGetHashPath() {
    let hash = window.location.hash;
    if (hash) {
      return hash.slice(1);
    }
    return "";
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
  function __jacGetDocument(scope) {
    try {
      return scope.document;
    } catch {
    }
    try {
      return window.document;
    } catch {
    }
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
      registry = { "functions": {}, "globals": {}, "modules": {}, "state": { "globals": {} }, "__hydration": { "registered": false }, "lastModule": null };
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
      registry.state = { "globals": {} };
    } else if (!registry.state.globals) {
      registry.state.globals = {};
    }
    if (!registry.__hydration) {
      registry.__hydration = { "registered": false };
    }
    return registry;
  }
  function __jacHydrateFromDom(defaultModuleName) {
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
    console.log("moduleName", moduleName);
    console.log("modulesStore", modulesStore);
    console.log("modulesStoreSnapshot", JSON.stringify(modulesStore));
    let moduleRecord = __jacHasOwn(modulesStore, moduleName) ? modulesStore[moduleName] : null;
    console.log("moduleRecord", moduleRecord);
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
      reactRoot = createRoot$1(rootEl);
      __jacReactiveContext.reactRoot = reactRoot;
    } catch (err) {
      console.error("[Jac] Failed to create React root for hydration:", err);
      return;
    }
    let value = __jacReactiveContext.rootComponent();
    if (value && __isObject(value) && __isFunction(value.then)) {
      value.then((node2) => {
        reactRoot.render(node2);
      }).catch((err) => {
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
    let registry = __jacEnsureRegistry();
    registry.lastModule = moduleName;
    let existingHydration = registry.__hydration ? registry.__hydration : null;
    let hydration = existingHydration ? existingHydration : { "registered": false };
    registry.__hydration = hydration;
    let scope = __jacGlobalScope();
    let documentRef = __jacGetDocument(scope);
    if (!documentRef) {
      return;
    }
    let alreadyRegistered = hydration.registered ? hydration.registered : false;
    if (!alreadyRegistered) {
      hydration.registered = true;
      documentRef.addEventListener("DOMContentLoaded", (_event) => {
        __jacExecuteHydration();
      }, { "once": true });
    }
  }
  function __jacRegisterClientModule(moduleName, clientFunctions2, clientGlobals) {
    let scope = __jacGlobalScope();
    let registry = __jacEnsureRegistry();
    let moduleFunctions = {};
    let registeredFunctions = [];
    if (clientFunctions2) {
      for (const funcName of clientFunctions2) {
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
  const globalClientFunctions = ["App", "Feed", "HomeView", "Post", "jac_app"];
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
  const clientFunctions = ["App", "Feed", "HomeView", "Post", "jac_app"];
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
  __jacRegisterClientModule("app", clientFunctions, {});
  globalThis.start_app = jac_app;
  if (!document.getElementById("__jac_init__")) {
    globalThis.start_app();
  }
})();
