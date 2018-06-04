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
export default function *map(iterable, handler) {
  if (Symbol.iterator in iterable) {
    for (let i = 0; i < iterable.length; i++) {
      iterable[i] = yield handler(iterable[i], i, iterable);
    }
    yield iterable;
  } else if (typeof iterable === "object") {
    const mapped = {};

    for (const prop in iterable) {
      if (Reflect.apply(Object.prototype.hasOwnProperty, iterable, [ prop ])) {
        mapped[prop] = yield handler(iterable[prop], prop, iterable);
      }
    }
    yield mapped;
  } else {
    throw new Error("Operator map() requires iterable or object");
  }
}
