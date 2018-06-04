const run = require("./run");

/* Apply any executable value */
export default (task, context, args) => Reflect.apply(run, context || null, [
  task,
  args
]);
