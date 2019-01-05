"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = each;
/**
 * Run hanadle in a flow context with each iterable value
 * @example
 * const files = [
 *  './a.js',
 *  './b.js',
 *  './c.js'
 * ];
 * const existsMap = yield each(files, function* (file) {
 *  yield echo(file)
 * });
 * @param  {array|object} iterable
 * @param  {function|generator} handler
 */
var apply = require("../apply");
var isChannel = require("../is-channel");

var _require = require("../constants"),
    CANCEL = _require.CANCEL;

function each(iterable, handler) {
  var cancelled = false;

  function eachRuntime() {
    var runtimeCancelled = false;
    var eachHelper = function eachHelper(gen, index, resolve, reject) {
      var genIsChannel = isChannel(gen);
      var next = gen.next();

      (genIsChannel ? next : Promise.resolve(next)).then(function (result) {
        if (result.done || cancelled || runtimeCancelled) {
          resolve();
        } else {
          apply(handler, this, [result.value, index, iterable]).then(function (response) {
            if (response === false || cancelled || runtimeCancelled) {
              resolve();
            } else {
              eachHelper(gen, index + 1, resolve, reject);
            }
          }).catch(reject);
        }
      }).catch(reject);
    };

    var promise = new Promise(function (resolve, reject) {
      if (Symbol.iterator in iterable) {
        var generator = iterable[Symbol.iterator]();

        eachHelper(generator, 0, resolve, reject);
      } else if (isChannel(iterable)) {
        eachHelper(iterable, 0, resolve, reject);
      } else {
        throw new Error("Operator each() expects an array or an iterable object");
      }
    });

    /* TODO: This functional should be tested */
    promise[CANCEL] = function () {
      runtimeCancelled = true;
    };

    return promise;
  }

  eachRuntime[CANCEL] = function () {
    cancelled = true;
  };

  return eachRuntime;
}
module.exports = exports["default"];