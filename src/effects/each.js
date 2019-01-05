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
const apply = require("../apply");
const isChannel = require("../is-channel");
const {
  CANCEL
} = require("../constants");

export default function each(iterable, handler) {
  let cancelled = false;

  function eachRuntime() {
    let runtimeCancelled = false;
    const eachHelper = (gen, index, resolve, reject) => {
      const genIsChannel = isChannel(gen);
      const next = gen.next();

      (genIsChannel
        ? next
        : Promise.resolve(next)
      ).then(function(result) {
        if (result.done || cancelled || runtimeCancelled) {
          resolve();
        } else {
          apply(handler, this, [
            result.value,
            index,
            iterable
          ])
            .then(response => {
              if (response === false || cancelled || runtimeCancelled) {
                resolve();
              } else {
                eachHelper(
                  gen,
                  index + 1,
                  resolve,
                  reject
                );
              }
            })
            .catch(reject);
        }
      })
        .catch(reject);
    };

    const promise = new Promise((resolve, reject) => {
      if (Symbol.iterator in iterable) {
        const generator = iterable[Symbol.iterator]();

        eachHelper(generator, 0, resolve, reject);
      } else if (isChannel(iterable)) {
        eachHelper(iterable, 0, resolve, reject);
      } else {
        throw new Error("Operator each() expects an array or an iterable object");
      }
    });

    /* TODO: This functional should be tested */
    promise[CANCEL] = function() {
      runtimeCancelled = true;
    };

    return promise;
  }

  eachRuntime[CANCEL] = function() {
    cancelled = true;
  };

  return eachRuntime;
}
