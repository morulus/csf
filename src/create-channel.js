import {
  CANCEL
} from "./constants";

export const DONE = Symbol("DONE");

export default function channel() {
  const sequence = [];
  let cancelled = false;
  let done = false;
  let final;
  let anticipant;

  const channelEmitter = function channelEmitter() {
    if (cancelled) {
      // Return unresolvable promise
      return new Promise(Function.prototype);
    }

    if (sequence.length) {
      return Promise.resolve(sequence.shift());
    } else if (done) {
      cancelled = true;

      return Promise.resolve(final);
    }

    return new Promise(resolve => {
      anticipant = resolve;
    });
  };

  /*
   * Immediately permanently disable channel
   */
  channelEmitter[CANCEL] = function() {
    cancelled = true;
  };

  /*
   * Because createChannel is not a part of fx,
   * returned function should not have payload flag
   */
  // channelEmitter[PAYLOAD] = true;

  channelEmitter.push = next => {
    if (done) {
      return;
    }

    if (cancelled) {
      throw new Error("Pushing to cancelled channel");
    }

    if (anticipant && !cancelled) {
      anticipant(next);
      anticipant = null;
    } else {
      sequence.push(next);
    }

    if (sequence.length > 1000) {
      throw new Error("Dangerously count of observable result");
    }
  };

  /*
   * Complete channel, disiable push, resolve active promise with undefined
   * or specified final value
   */
  channelEmitter.done = final => {
    done = true;
    if (anticipant) {
      anticipant(final);
    } else {
      final = false;
    }
  };

  /* Return count of cached values */
  channelEmitter.count = () => sequence.length;

  return channelEmitter;
}
