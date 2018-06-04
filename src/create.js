const run = require("./run");

/* Wrap any function to runner */
export default function create (task, initialContext, ownArgs) {
  return function(...args) {
    return Reflect.apply(run, initialContext || this, [
      task,
      ownArgs || args
    ]);
  };
}
