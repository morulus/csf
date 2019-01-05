"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultContext;
var defaults = require("lodash.defaults");

/* Specify default context properties */
function defaultContext(defaultContextProperties) {
  return function applyDefaultContext() {
    defaults(this, defaultContextProperties);
  };
}
module.exports = exports["default"];