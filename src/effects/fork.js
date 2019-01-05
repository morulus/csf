import resolveContext from "../resolve-context";
import apply from "../apply";
import payload from "./payload";
import cancel from "../cancel";
import {
  CANCEL
} from "../constants";

const nextTick = setImmediate || setTimeout;

/* Fork child flow */
export default function fork(task, contextProperties, args) {
  return function forkChildFlow() {
    let subFlow;
    const childContext = Object.create(this);

    Object.assign(childContext, Reflect.apply(
      resolveContext,

      /*
       * When child context build by function, by default should use empty
       * object, not null as other cases does
       */
      this || {},
      [ contextProperties ]
    ));

    const forkPromise = new Promise((resolve, reject) => {
      nextTick(() => {
        subFlow = apply(task, childContext, args);

        subFlow
          .then(resolve)
          .catch(reject);
      });
    });

    forkPromise[CANCEL] = function cancelFork() {
      if (subFlow) {
        cancel(subFlow);
      } else {
        throw new Error("Unnitialized flow can not be cancelled");
      }
    };

    return payload(forkPromise);
  };
}
