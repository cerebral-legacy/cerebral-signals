module.exports = function (extendedContext) {
  return function (context) {
    return Object.keys(extendedContext).reduce(function (currentContext, key) {
      currentContext[key] = extendedContext[key]

      return currentContext
    }, context)
  }
}
