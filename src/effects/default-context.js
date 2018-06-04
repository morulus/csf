const defaults = require("lodash.defaults");

/* Specify default context properties */
export default function defaultContext(defaultContextProperties) {
  return function applyDefaultContext() {
    defaults(this, defaultContextProperties);
  };
}
