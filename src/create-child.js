import run from "./run";
import resolveContext from "./resolve-context";
import resolveArgs from "./resolve-args";

/* Create fyped function with prototypically inherit context */
export default function createChild(
  task,
  contextProperties,
  ownArgs
) {
  return function withBoundedChildContext(...args) {
    const childContext = Object.create(this || null);

    Object.assign(childContext, Reflect.apply(
      resolveContext,

      /*
       * When child context build by function, by default should use empty
       * object, not null as other cases does
       */
      this || {},
      [ contextProperties ]
    ));

    return Reflect.apply(run, childContext, [
      task,
      resolveArgs(ownArgs, args)
    ]);
  };
}
