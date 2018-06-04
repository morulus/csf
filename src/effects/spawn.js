import apply from "../apply";
import resolveContext from "../resolve-context";

/**
 * create child processes. To prevent collisions function name has changed
 * to evolve.
 */
export default function spawn(task, context, args) {
  return function spawnChildFlow() {
    const childContext = Object.create(this || null);

    Object.assign(childContext, resolveContext(context));

    return apply(task, childContext, args);
  };
}
