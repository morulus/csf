import resolveContext from "../resolve-context";
import apply from "../apply";

/* Apply function with child context */
export default function evolve(task, context, args) {
  console.warn("Evolve is deprecated, use spawn");

  return function applyChildFlow() {
    const childContext = Object.create(this || null);

    Object.assign(childContext, resolveContext(context));

    return apply(task, childContext, args);
  };
}
