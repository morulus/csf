/* Assign some properties to current execution context */
export default function assignContext(newProperies) {
  return function assignContext() {
    return Object.assign(this, newProperies);
  };
}
