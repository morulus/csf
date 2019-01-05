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
    var eachHelper = function eachHelper(gen, index, resolve, reject) {
      var genIsChannel = isChannel(gen);
      var next = gen.next();

      (genIsChannel ? next : Promise.resolve(next)).then(function (result) {
        if (result.done || cancelled) {
          resolve();
        } else {
          apply(handler, this, [result.value, index, iterable]).then(function (response) {
            if (response === false || cancelled) {
              resolve();
            } else {
              eachHelper(gen, index + 1, resolve, reject);
            }
          }).catch(reject);
        }
      }).catch(reject);
    };

    return new Promise(function (resolve, reject) {
      if (Symbol.iterator in iterable) {
        var generator = iterable[Symbol.iterator]();

        eachHelper(generator, 0, resolve, reject);
      } else if (isChannel(iterable)) {
        eachHelper(iterable, 0, resolve, reject);
      } else {
        throw new Error("Operator reduce() expects an array or an iterable object");
      }
    });
  }

  eachRuntime[CANCEL] = function () {
    cancelled = true;
  };

  return eachRuntime;
}
module.exports = exports["default"];