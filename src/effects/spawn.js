import apply from "../apply";
import resolveContext from "../resolve-context";

/**
 * create child processes. To prevent collisions function name has changed
 * to evolve.
 */
export default function spawn(task, contextProperties, args) {
  return function spawnChildFlow() {
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

    return apply(task, childContext, args);
  };
}
