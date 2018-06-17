import isFunction from "is-function";
import isArray from "is-array";

export default function resolveArgs(ownArgs, userArgs) {
  if (!ownArgs) {
    return userArgs;
  }
  if (isFunction(ownArgs)) {
    return resolveArgs(ownArgs(userArgs), userArgs);
  } else if (isArray(ownArgs)) {
    return ownArgs;
  }
  throw new TypeError("Args must be a function or array");
}
