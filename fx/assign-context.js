"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assignContext;
/* Assign some properties to current execution context */
function assignContext(newProperies) {
  return function assignContext() {
    return Object.assign(this, newProperies);
  };
}
module.exports = exports["default"];