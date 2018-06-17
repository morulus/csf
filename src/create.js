import run from "./run";
import resolveArgs from "resolve-args";

/* Wrap any function to runner */
export default function create (task, initialContext, ownArgs) {
  return function(...args) {
    return Reflect.apply(run, initialContext || this, [
      task,
      resolveArgs(ownArgs, args)
    ]);
  };
}
