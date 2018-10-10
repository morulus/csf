import resolveContext from "../resolve-context";
import apply from "../apply";
import payload from "./payload";

const nextTick = setImmediate || setTimeout;

/* Fork child flow */
export default function fork(task, contextProperties, args) {
  return function forkChildFlow() {
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

    return payload(new Promise((resolve, reject) => {
      nextTick(() => {
        apply(task, childContext, args)
          .then(resolve)
          .catch(reject);
      });
    }));
  };
}
