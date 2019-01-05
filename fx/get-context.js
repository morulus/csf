"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* Get current context */
exports.default = function () {
  return function getContext() {
    return this;
  };
};

module.exports = exports["default"];