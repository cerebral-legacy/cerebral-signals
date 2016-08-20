module.exports = function () {
  return function(context, action, args, next) {
    context.next = function() {
      if (arguments.length === 1 && typeof arguments[0] === 'string') {
        next({
          path: arguments[0]
        })
      } else if (arguments.length === 1) {
        next({
          payload: arguments[0]
        })
      } else if (arguments.length === 2 && typeof arguments[0] === 'string') {
        next({
          path: arguments[0],
          payload: arguments[1]
        })
      } else if (arguments.length) {
        throw new Error('Cerebral Next Provider - You are passing invalid arguments to a "next": ' + JSON.stringify([].slice.call(arguments)))
      } else {
        next()
      }
    }

    return context
  }
}
