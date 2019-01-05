/* Api */
import run from "./run";
import apply from "./apply";
import create from "./create";
import createChild from "./create-child";
import createChannel from "./create-channel";
import isChannel from "./is-channel";
import cancel from "./cancel";

/* Effects */
import fx from "./effects";

function Csf(task) {
  const internalPromise = new Promise(resolve => {
    resolve(apply(task, {}));
  });

  Reflect.defineProperty(this, "promise", {
    writable: false,
    enumerable: false,
    configurable: false,
    value: internalPromise
  });
}

Csf.prototype = Object.create(Promise.prototype);
Csf.prototype.constructor = Promise;

Csf.prototype.then = function(handler) {
  return this.promise.then(handler);
};

Csf.prototype.catch = function(handler) {
  return this.promise.catch(handler);
};

/* Export api */
/*
 * export {
 *   run,
 *   apply,
 *   create,
 *   createChild,
 *   createChannel
 * };
 */

Csf.fx = fx;
/* Effects is deprecated */
Csf.effects = fx;

/* Extend main module with api */
Object.assign(Csf, {
  /* Run is deprecated, use call intead*/
  run,
  call: run,
  apply,
  /* Create is deprecated, use wrap instad */
  create,
  wrap: create,
  createChild,
  createChannel,
  isChannel,
  cancel,
  fx
});

export default Csf;
