"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = evolve;

var _resolveContext = require("../resolve-context");

var _resolveContext2 = _interopRequireDefault(_resolveContext);

var _apply = require("../apply");

var _apply2 = _interopRequireDefault(_apply);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Apply function with child context */
function evolve(task, context, args) {
  console.warn("Evolve is deprecated, use spawn");

  return function applyChildFlow() {
    var childContext = Object.create(this || null);

    Object.assign(childContext, (0, _resolveContext2.default)(context));

    return (0, _apply2.default)(task, childContext, args);
  };
}
module.exports = exports["default"];