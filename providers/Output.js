function createNext(next, path) {
  return function (payload) {
    next({
      path,
      payload
    })
  }
}

module.exports = function () {
  return function(context, action, payload, next) {
    context.output = Object.keys(action.outputs || {}).reduce(function (output, outputPath) {
      output[outputPath] = createNext(next, outputPath)

      return output
    }, createNext(next))

    return context
  }
}
