"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fork;

var _resolveContext = require("../resolve-context");

var _resolveContext2 = _interopRequireDefault(_resolveContext);

var _apply = require("../apply");

var _apply2 = _interopRequireDefault(_apply);

var _payload = require("./payload");

var _payload2 = _interopRequireDefault(_payload);

var _cancel = require("../cancel");

var _cancel2 = _interopRequireDefault(_cancel);

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextTick = setImmediate || setTimeout;

/* Fork child flow */
function fork(task, contextProperties, args) {
  return function forkChildFlow() {
    var subFlow = void 0;
    var childContext = Object.create(this);

    Object.assign(childContext, Reflect.apply(_resolveContext2.default,

    /*
     * When child context build by function, by default should use empty
     * object, not null as other cases does
     */
    this || {}, [contextProperties]));

    var forkPromise = new Promise(function (resolve, reject) {
      nextTick(function () {
        subFlow = (0, _apply2.default)(task, childContext, args);

        subFlow.then(resolve).catch(reject);
      });
    });

    forkPromise[_constants.CANCEL] = function cancelFork() {
      if (subFlow) {
        (0, _cancel2.default)(subFlow);
      } else {
        throw new Error("Unnitialized flow can not be cancelled");
      }
    };

    return (0, _payload2.default)(forkPromise);
  };
}
module.exports = exports["default"];