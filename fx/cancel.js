"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * Cancel in the fx is deprecated and will be removed soon.
                                                                                                                                                                                                                                                                               * Use Csf.cancel instead
                                                                                                                                                                                                                                                                               */


exports.default = cancel;

var _constants = require("../constants");

/* Cancel current task (it can a promise, or generator flow)*/
function cancel(task, final) {
  return function () {
    if (typeof task[_constants.CANCEL] === "function") {
      task[_constants.CANCEL](final);
    } else {
      throw new Error("The task (" + (typeof task === "undefined" ? "undefined" : _typeof(task)) + ")cannot be cancelled");
    }
  };
}
module.exports = exports["default"];