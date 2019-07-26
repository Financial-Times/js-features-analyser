function keyMirror(keys) {
  return keys.reduce(
    function(previous, current) {
      return Object.assign(previous, { [current]: current });
    },
    {}
  );
}

const browserGlobals = require('./global-static-instance.json').globals;
const extraGlobals = ["clearImmediate", "setImmediate"];

module.exports = keyMirror([].concat(browserGlobals, extraGlobals));
