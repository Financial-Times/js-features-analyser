"use strict";

const definitions = require("./built-in-definitions");

const fs = require('fs');
const path = require('path');

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = function({ types: t }) {
  function record(path, builtIn, builtIns) {
    if (builtIn && !builtIns.has(builtIn)) {
      builtIns.add(builtIn);
    }
  }

  function recordEsRuntimeFeature(path, builtIn, builtIns) {
    if (Array.isArray(builtIn)) {
      for (const i of builtIn) {
        record(path, i, builtIns);
      }
    } else {
      record(path, builtIn, builtIns);
    }
  }

  const recordEsRuntimeFeatures = {
    ForOfStatement(path) {
      recordEsRuntimeFeature(path, "Symbol", this.builtIns);
      recordEsRuntimeFeature(path, "Symbol.iterator", this.builtIns);
      recordEsRuntimeFeature(path, "Int8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8ClampedArray.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float64Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "String.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Map.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Set.prototype[@@iterator]", this.builtIns);
    },

    // Symbol()
    // new Promise
    ReferencedIdentifier(path) {
      const { node, parent, scope } = path;

      if (t.isMemberExpression(parent)) return;
      if (!has(definitions.globals, node.name)) return;
      if (scope.getBindingIdentifier(node.name)) return;

      const builtIn = definitions.globals[node.name];
      recordEsRuntimeFeature(path, builtIn, this.builtIns);
    },

    // arr[Symbol.iterator]()
    CallExpression(path) {
      // we can't compile this
      if (path.node.arguments.length) return;

      const callee = path.node.callee;
      if (!t.isMemberExpression(callee)) return;
      if (!callee.computed) return;
      if (!path.get("callee.property").matchesPattern("Symbol.iterator")) {
        return;
      }

      recordEsRuntimeFeature(path, "Symbol.iterator", this.builtIns);
      recordEsRuntimeFeature(path, "Int8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8ClampedArray.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float64Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "String.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Map.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Set.prototype[@@iterator]", this.builtIns);
    },

    // Symbol.iterator in arr
    BinaryExpression(path) {
      if (path.node.operator !== "in") return;
      if (!path.get("left").matchesPattern("Symbol.iterator")) return;

      recordEsRuntimeFeature(path, "Symbol.iterator", this.builtIns);
      recordEsRuntimeFeature(path, "Int8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8ClampedArray.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float64Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "String.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Map.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Set.prototype[@@iterator]", this.builtIns);
    },

    // yield*
    YieldExpression(path) {
      if (!path.node.delegate) return;

      recordEsRuntimeFeature(path, "Symbol.iterator", this.builtIns);
      recordEsRuntimeFeature(path, "Int8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint8ClampedArray.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint16Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Int32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Uint32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float32Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Float64Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Array.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "String.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Map.prototype[@@iterator]", this.builtIns);
      recordEsRuntimeFeature(path, "Set.prototype[@@iterator]", this.builtIns);
    },

    // Array.from
    MemberExpression: {
      enter(path) {
        if (!path.isReferenced()) return;

        const { node } = path;
        const obj = node.object;
        const prop = node.property;

        if (!t.isReferenced(obj, node)) return;

        if (has(definitions.staticMethods, obj.name)) {
          const staticMethods = definitions.staticMethods[obj.name];
          if (has(staticMethods, prop.name)) {
            const builtIn = staticMethods[prop.name];
            recordEsRuntimeFeature(path, builtIn, this.builtIns);
          }
        }

        if (
          !node.computed &&
          t.isIdentifier(prop) &&
          has(definitions.instanceMethods, prop.name)
        ) {
          const builtIn = definitions.instanceMethods[prop.name];
          recordEsRuntimeFeature(path, builtIn, this.builtIns);
        } else if (node.computed) {
          if (
            t.isStringLiteral(prop) &&
            has(definitions.instanceMethods, prop.value)
          ) {
            const builtIn = definitions.instanceMethods[prop.value];
            recordEsRuntimeFeature(path, builtIn, this.builtIns);
          } else {
            const res = path.get("property").evaluate();
            if (res.confident) {
              const builtIn = definitions.instanceMethods[res.value];
              recordEsRuntimeFeature(
                path.get("property"),
                builtIn,
                this.builtIns
              );
            }
          }
        }
      },

      // Symbol.match
      exit(path) {
        if (!path.isReferenced()) return;

        const { node } = path;
        const obj = node.object;

        if (!has(definitions.globals, obj.name)) return;
        if (path.scope.getBindingIdentifier(obj.name)) return;

        const builtIn = definitions.globals[obj.name];
        recordEsRuntimeFeature(path, builtIn, this.builtIns);
      },
    },

    // var { repeat, startsWith } = String
    VariableDeclarator(path) {
      if (!path.isReferenced()) return;

      const { node } = path;
      const obj = node.init;

      if (!t.isObjectPattern(node.id)) return;
      const props = node.id.properties;

      if (!t.isReferenced(obj, node)) return;

      // doesn't reference the global
      if (obj !== null && path.scope.getBindingIdentifier(obj.name)) return;

      for (let prop of props) {
        prop = prop.key;
        if (
          !node.computed &&
          t.isIdentifier(prop) &&
          has(definitions.instanceMethods, prop.name)
        ) {
          const builtIn = definitions.instanceMethods[prop.name];
          recordEsRuntimeFeature(path, builtIn, this.builtIns);
        }
      }
    },

    ArrayExpression(path) {
      recordEsRuntimeFeature(path, 'Array', this.builtIns);
    },
    BigIntLiteral() {},
    BooleanLiteral(path) {
      recordEsRuntimeFeature(path, 'Boolean', this.builtIns);
    },
    FunctionDeclaration(path) {
      recordEsRuntimeFeature(path, 'Function', this.builtIns);
    },
    FunctionExpression(path) {
      recordEsRuntimeFeature(path, 'Function', this.builtIns);
    },
    ObjectExpression(path) {
      recordEsRuntimeFeature(path, 'Object', this.builtIns);
    },
    NumericLiteral(path) {
      recordEsRuntimeFeature(path, 'Number', this.builtIns);
    },
    RegExpLiteral(path) {
      recordEsRuntimeFeature(path, 'RegExp', this.builtIns);
    },
    StringLiteral(path) {
      recordEsRuntimeFeature(path, 'String', this.builtIns);
    },
    TemplateLiteral() {},
  };

  return {
    name: "js-features-analyser",
    pre() {
      this.builtIns = new Set();
    },
    post(state) {
      // It is very likely we have included TypedArray instance methods when in fact no TypedArrays were used in the code.
      // If we see that a TypedArray constructor has not been used, let's remove it's instance methods from the builtIns Set.

      const constuctors = [
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array",
        
        "Array",
        "ArrayBuffer",
        "Boolean",
        "DataView",
        "Date",
        "Error",
        "EvalError",
        "Function",
        "JSON",
        "Map",
        "Math",
        "Object",
        "Number",
        "Promise",
        "Proxy",
        "RangeError",
        "ReferenceError",
        "Reflect",
        "RegExp",
        "Set",
        "SharedArrayBuffer",
        "String",
        "Symbol",
        "SyntaxError",
        "TypeError",
        "URIError",
        "WeakMap",
        "WeakSet"
      ];

      for (const constructor of constuctors) {
        if (!this.builtIns.has(constructor)) {
          this.builtIns = new Set(Array.from(this.builtIns).filter(item => !item.startsWith(constructor)));
        }
      }
      const pluginOptions = state.opts.plugins.find(plugin => plugin.key === 'js-features-analyser').options || {};
      const outputDestination = pluginOptions.outputDestination || 'features.json';
      const builtIns = JSON.stringify(Array.from(this.builtIns), undefined, 4);
      if (path.isAbsolute(outputDestination)) {
        fs.writeFileSync(outputDestination, builtIns, 'utf-8');
      } else {
        fs.writeFileSync(path.join(state.opts.cwd, outputDestination), builtIns, 'utf-8');
      }
    },
    visitor: recordEsRuntimeFeatures,
  };
};
