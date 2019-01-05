"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pause;
/* Peform pause in async flow */
function pause(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}
module.exports = exports["default"];