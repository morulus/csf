"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = payload;
var isGenerator = require("is-generator");
var isFunction = require("is-function");
var isPromise = require("is-promise");
var run = require("../run");

/* Wrap value, which will be returned as result no matter its type */
function payload(value) {
  if (isPromise(value)) {
    var promiseFactory = function promiseFactory() {
      return value;
    };

    promiseFactory[run.PAYLOAD] = "invoke";

    return promiseFactory;
  }
  if (isGenerator(value) || isFunction(value)) {
    value[run.PAYLOAD] = true;
  }

  return value;
}
module.exports = exports["default"];