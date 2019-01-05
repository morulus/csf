"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spawn;

var _apply = require("../apply");

var _apply2 = _interopRequireDefault(_apply);

var _resolveContext = require("../resolve-context");

var _resolveContext2 = _interopRequireDefault(_resolveContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * create child processes. To prevent collisions function name has changed
 * to evolve.
 */
function spawn(task, contextProperties, args) {
  return function spawnChildFlow() {
    var childContext = Object.create(this || null);

    Object.assign(childContext, Reflect.apply(_resolveContext2.default,

    /*
     * When child context build by function, by default should use empty
     * object, not null as other cases does
     */
    this || {}, [contextProperties]));

    return (0, _apply2.default)(task, childContext, args);
  };
}
module.exports = exports["default"];