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
const apply = require("../apply");

export default function map(iterable, handler) {
  const args = arguments;

  return new Promise((resolve, reject) => {
    if (Symbol.iterator in iterable) {
      let value;
      let key = 0;
      const len = iterable.length;

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

      const generator = iterable.slice(key)[Symbol.iterator]();

      let index = -1;

      const reducer = function reducer(nextMemo) {
        const next = generator.next();

        if (next.done) {
          return resolve(nextMemo);
        }

        return apply(handler, this, [
          nextMemo,
          next.value,
          ++index,
          iterable
        ])
          .then(reducer)
          .catch(reject);
      };

      reducer(value);
    } else {
      throw new Error("Operator reduce() expects an array or an iterable object");
    }
  });
}
