import resolveContext from "../resolve-context";
import apply from "../apply";
import payload from "./payload";

/* Fork child flow */
export default function fork(task, context, args) {
  return function forkChildFlow() {
    const childContext = Object.create(this);

    Object.assign(childContext, resolveContext(context));

    const flow = apply(task, childContext, args);

    return payload(flow);
  };
}
