const isGenerator = require("is-generator");
const isFunction = require("is-function");
const isPromise = require("is-promise");
const run = require("../run");

/* Wrap value, which will be returned as result no matter its type */
export default function payload(value) {
  if (isPromise(value)) {
    const promiseFactory = function promiseFactory() {
      return value;
    };

    promiseFactory[run.PAYLOAD] = "invoke";

    return promiseFactory;
  }
  if (isGenerator(value) || isFunction(value)) {
    value[run.PAYLOAD] = true;
  }

  return value;
}
