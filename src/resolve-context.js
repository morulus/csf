module.exports = function resolveContext(context) {
  return typeof context === "function"
    ? context(this)
    : context;
};
