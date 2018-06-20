import resolveContext from "../resolve-context";
import apply from "../apply";
import payload from "./payload";

const nextTick = setImmediate || setTimeout;

/* Fork child flow */
export default function fork(task, context, args) {
  return function forkChildFlow() {
    const childContext = Object.create(this);

    Object.assign(childContext, resolveContext(context));

    return payload(new Promise((resolve, reject) => {
      nextTick(() => {
        apply(task, childContext, args)
          .then(resolve)
          .catch(reject);
      });
    }));
  };
}
