/* Assign some properties to current execution context */
export default function assignContext(newProperies) {
  return function assignContext() {
    Object.assign(this, newProperies);
  };
}
