/*
 * Create new child context prototypically inherited with current
 * context
 */
export default function createChildContext(initialContext) {
  return function childContextCreator() {
    const childContext = Object.create(this);

    Object.assign(childContext, initialContext);

    return childContext;
  };
}
