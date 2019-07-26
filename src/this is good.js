/* eslint-env browser */
/* global copy */
'use strict';

const blacklist = [
    /^webkit/i,
    'BeforeInstallPromptEvent',
    /^Bluetooth/,
    'CDATASection',
    'captureEvents',
    'InputDeviceCapabilities',
    'releaseEvents',
    'SyncManager',
    /^USB/,

    // DevTools globals
    'chrome',
    '$_',
    '$0',
    '$1',
    '$2',
    '$3',
    '$4',
    '$',
    '$$',
    '$x',
    'clear',
    'copy',
    'debug',
    'dir',
    'dirxml',
    'getEventListeners',
    'inspect',
    'keys',
    'monitor',
    'monitorEvents',
    'profile',
    'profileEnd',
    'queryObjects',
    'table',
    'undebug',
    'unmonitor',
    'unmonitorEvents',
    'values'
];

const globals = Object.getOwnPropertyNames(window)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .filter(global => {
        for (const pattern of blacklist) {
            if (typeof pattern === 'string') {
                if (global === pattern) {
                    return false;
                }
            } else {
                if (pattern.test(global)) {
                    return false;
                }
            }
        }

        return true;
    });


const staticMethods = {};
const instanceMethods = {};
const typedArrays = ["Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array"
];

const typedArrayInstanceMethods = [
    "copyWithin",
    "entries",
    "every",
    "fill",
    "filter",
    "find",
    "findIndex",
    "forEach",
    "includes",
    "indexOf",
    "join",
    "keys",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "reverse",
    "set",
    "slice",
    "some",
    "sort",
    "subarray",
    "toLocaleString",
    "toString",
    "values",
    "@@iterator"
]

for (const property of globals) {
    if (!(window[property] instanceof Window) && window[property] && property !== 'parent') {
        const names = Object.getOwnPropertyNames(window[property]);
        for (const name of names) {
            staticMethods[property] = staticMethods[property] || {};
            staticMethods[property][name] = property + '.' + name;
            if (name === 'prototype') {
                const prototypeMethods = Object.getOwnPropertyNames(window[property].prototype);
                for (const method of prototypeMethods) {
                    instanceMethods[property] = instanceMethods[property] || {};
                    instanceMethods[property][method] = property + '.prototype.' + method;
                }
            }
            if (typedArrays.includes(property)) {
                staticMethods[property] = staticMethods[property] || {};
                staticMethods[property].of = property + '.of';
                staticMethods[property].from = property + '.from';
                typedArrayInstanceMethods.forEach(method => {
                    instanceMethods[property] = instanceMethods[property] || {};
                    instanceMethods[property][method] = property + '.prototype.' + method;
                })
            }

        }
    }
}

copy(JSON.stringify({
    globals,
    staticMethods,
    instanceMethods
}, null, '\t'));
console.log('done');