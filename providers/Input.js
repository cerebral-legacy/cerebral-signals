module.exports = function () {
  return function(context, action, payload) {
    context.input = payload || {}

    return context
  }
}
