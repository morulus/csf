/* Api */
import run from "./run";
import apply from "./apply";
import create from "./create";
import createChild from "./create-child";
import createChannel from "./create-channel";

/* Effects */
import payload from "./effects/payload";
import context from "./effects/context";
import getContext from "./effects/get-context";
import spawn from "./effects/spawn";
import evolve from "./effects/evolve";
import fork from "./effects/fork";
import defaultContext from "./effects/default-context";
import assignContext from "./effects/assign-context";
import createChildContext from "./effects/create-child-context";
import cancel from "./effects/cancel";
import map from "./effects/map";

function Sequence(task) {
  const internalPromise = new Promise(function (resolve) {
    resolve(apply(task, this));
  });

  Reflect.defineProperty(this, "promise", {
    writable: false,
    enumerable: false,
    configurable: false,
    value: internalPromise
  });
}

Sequence.prototype = Object.create(Promise.prototype);
Sequence.prototype.constructor = Promise;

Sequence.prototype.then = function(handler) {
  return this.promise.then(handler);
};

Sequence.prototype.catch = function(handler) {
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

const fx = {
  payload,

  context,

  getContext,

  spawn,

  evolve,

  fork,

  defaultContext,

  assignContext,

  createChildContext,

  cancel,

  map
};

Sequence.fx = fx;

/* Extend main module with api */
Object.assign(Sequence, {
  run,
  apply,
  create,
  createChild,
  createChannel,
  fx
});

export default Sequence;
