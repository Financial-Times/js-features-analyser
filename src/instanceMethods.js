"use strict";

const methods = require('./global-static-instance.json').instanceMethods;

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

const instanceMethods = Object.values(methods).reduce(
  function(previous, current) {
    for (const [key, value] of Object.entries(current)) {
      if (has(previous, key)) {
        if (Array.isArray(previous[key])) {
          previous[key].push(value);
        } else {
          previous[key] = [previous[key], value];
        }
      } else {
        previous[key] = value;
      }
    }
    return previous;
  },
  {}
);

module.exports = instanceMethods;
