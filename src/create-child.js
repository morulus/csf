const run = require("./run");
const resolveContext = require("./resolve-context");

/* Create fyped function with prototypically inherit context */
export default function createChild(
  task,
  initialChildContext,
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
      [ initialChildContext ]
    ));

    return Reflect.apply(run, childContext, [
      task,
      ownArgs || args
    ]);
  };
}
