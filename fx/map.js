"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
var create = require("../create");
var reduce = require("./reduce");

function map(iterable, handler) {
  return function () {
    var context = this; // eslint-disable-line
    var asyncHandler = create(handler, this);

    if (Symbol.iterator in iterable) {
      return reduce(iterable, function (memo, value, index) {
        return asyncHandler(value, index, iterable).then(function (result) {
          return memo.concat([result]);
        });
      }, []);
    } else if ((typeof iterable === "undefined" ? "undefined" : _typeof(iterable)) === "object") {
      var keys = [];
      var values = [];

      for (var prop in iterable) {
        if (Reflect.apply(Object.prototype.hasOwnProperty, iterable, [prop])) {
          keys.push(prop);
          values.push(iterable[prop]);
        }
      }

      return new Promise(function (resolve, reject) {
        function handlerForObjects(item, index, items) {
          return handler(item, keys[index], items);
        }
        Reflect.apply(map(values, handlerForObjects), context, []).then(function (nextValues) {
          var result = [];

          for (var i = 0; i < nextValues.length; i++) {
            result[keys[i]] = nextValues[i];
          }

          resolve(result);
        }).catch(reject);
      });
    }
    throw new Error("Operator map() requires iterable or object");
  };
}
module.exports = exports["default"];