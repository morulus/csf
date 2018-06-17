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
const create = require("../create");
const reduce = require("./reduce");

export default function map(iterable, handler) {
  const asyncHandler = create(handler, this);

  if (Symbol.iterator in iterable) {
    return reduce(iterable, (memo, value, index) => asyncHandler(value, index, iterable)
      .then(result => memo.concat([ result ])), []);
  } else if (typeof iterable === "object") {
    const keys = [];
    const values = [];

    for (const prop in iterable) {
      if (Reflect.apply(Object.prototype.hasOwnProperty, iterable, [ prop ])) {
        keys.push(prop);
        values.push(iterable[prop]);
      }
    }

    return new Promise((resolve, reject) => {
      map(values, handler)
        .then(nextValues => {
          const result = [];

          for (let i = 0; i < nextValues.length; i++) {
            result[keys[i]] = nextValues[i];
          }

          resolve(result);
        })
        .catch(reject);
    });
  }
  throw new Error("Operator map() requires iterable or object");
}
