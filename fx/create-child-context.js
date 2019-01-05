"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createChildContext;
/*
 * Create new child context prototypically inherited with current
 * context
 */
function createChildContext(initialContext) {
  return function childContextCreator() {
    var childContext = Object.create(this);

    Object.assign(childContext, initialContext);

    return childContext;
  };
}
module.exports = exports["default"];