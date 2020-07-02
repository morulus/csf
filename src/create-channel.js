import {
  CANCEL,
  CHANNEL
} from "./constants";

export const DONE = Symbol("DONE");

export default function channel(maxLength = 1000000) {
  const sequence = [];
  let cancelled = false;
  let done = false;
  let final;
  let anticipant;

  const channelEmitter = function channelEmitter() {
    if (cancelled) {
      // Return undefined intead of promise
      return undefined;
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

  channelEmitter[CHANNEL] = true;

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

  /*
   * Complete channel, disable push, resolve active promise with undefined
   * or specified final value
   */
  channelEmitter.done = function (finalValue) {
    done = true;
    if (anticipant) {
      anticipant(final);
    } else {
      final = finalValue;
    }
  };

  channelEmitter.push = (next, last) => {
    if (done) {
      return;
    }

    if (cancelled) {
      throw new Error("Pushing to cancelled channel is unreachable");
    }

    if (last) {
      // Force done channel
      channelEmitter.done(next);
    } else {
      if (anticipant) {
        anticipant(next);
        anticipant = null;
      } else {
        sequence.push(next);
      }

      if (sequence.length > maxLength) {
        sequence.splice(0, maxLength - sequence.length);
      }
    }
  };

  channelEmitter.next = function(...args) {
    const nextPromise = channelEmitter(...args);

    if (nextPromise) {
      return nextPromise
        .then(value => ({
          value,
          done: false
        }));
    }

    return Promise.resolve({
      done: true,
      value: undefined
    });
  };

  /* Return count of cached values */
  channelEmitter.count = () => sequence.length;

  return channelEmitter;
}
