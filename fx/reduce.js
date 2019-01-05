"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;
/**
 * Create a new array with the results of executing a handler for every
 * array/object element.
 * @example
 * const files = [
 *  './a.js',
 *  './b.js',
 *  './c.js'
 * ];
 * const existsMap = yield map(files, function* (file) {
 *  yield fileExists(file);
 * });
 * yield echo(existsMap); // [true, true, false]
 * @param  {array|object} iterable
 * @param  {function|generator} handler
 * @return {array|object}
 */
var apply = require("../apply");

function map(iterable, handler) {
  var args = arguments;

  return new Promise(function (resolve, reject) {
    if (Symbol.iterator in iterable) {
      var value = void 0;
      var key = 0;
      var len = iterable.length;

      if (args.length > 2) {
        value = args[2];
      } else {
        while (key < len && !(key in iterable)) {
          key++;
        }
        if (key >= len) {
          throw new TypeError("Reduce of empty array with no initial value");
        }
        value = iterable[key++];
      }

      var generator = iterable.slice(key)[Symbol.iterator]();

      var index = -1;

      var reducer = function reducer(nextMemo) {
        var next = generator.next();

        if (next.done) {
          return resolve(nextMemo);
        }

        return apply(handler, this, [nextMemo, next.value, ++index, iterable]).then(reducer).catch(reject);
      };

      reducer(value);
    } else {
      throw new Error("Operator reduce() expects an array or an iterable object");
    }
  });
}
module.exports = exports["default"];