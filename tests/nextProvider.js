'use strict'
const CerebralSignal = require('../index')
const NextProvider = require('../providers/Next')
const InputProvider = require('../providers/Input')

module.exports['should expose "next" method on context to move to next action'] = (test) => {
  const Signal = CerebralSignal([
    NextProvider()
  ])
  const signal = Signal([
    function action(context) {
      context.next()
    }
  ])

  signal.on('signalEnd', function() {
    test.done()
  })

  signal()
}

module.exports['should work async'] = (test) => {
  const Signal = CerebralSignal([
    NextProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      setTimeout(context.next)
    },
    function actionB(context) {
      context.next()
    }
  ])

  signal.on('signalEnd', function() {
    test.done()
  })

  signal()
}

module.exports['should go down path specified'] = (test) => {
  const Signal = CerebralSignal([
    NextProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      context.next('foo')
    }, {
      foo: [
        function actionB(context) {
          test.ok(true)
          context.next()
        }
      ]
    }
  ])

  test.expect(1)
  signal.on('signalEnd', function() {
    test.done()
  })

  signal()
}

module.exports['should go down path specified with payload'] = (test) => {
  const Signal = CerebralSignal([
    NextProvider(),
    InputProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      context.next('foo', {
        bar: 'hm'
      })
    }, {
      foo: [
        function actionB(context) {
          test.deepEqual(context.input, {
            bar: 'hm'
          })
          context.next()
        }
      ]
    }
  ])

  test.expect(1)
  signal.on('signalEnd', function() {
    test.done()
  })

  signal()
}

module.exports['should move to next action with payload'] = (test) => {
  const Signal = CerebralSignal([
    NextProvider(),
    InputProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      context.next({
        bar: 'hm'
      })
    },
    function actionB(context) {
      test.deepEqual(context.input, {
        bar: 'hm'
      })
      context.next()
    }
  ])

  test.expect(1)
  signal.on('signalEnd', function() {
    test.done()
  })

  signal()
}
