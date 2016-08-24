'use strict'
const CerebralSignal = require('../index')
const InputProvider = require('../providers/Input')
const OutputProvider = require('../providers/Output')

module.exports['should add output function'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider()
  ])
  const signal = Signal([
    function action(context) {
      test.ok(context.output)
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should have possible outputs as methods'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider()
  ])
  const signal = Signal([
    function action(context) {
      test.ok(context.output.foo)
      test.ok(context.output.bar)
    }, {
      foo: [],
      bar: []
    }
  ])

  test.expect(2)
  signal()
  test.done()
}

module.exports['should go down path based on method used'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      context.output.foo()
    }, {
      foo: [
        function actionB() {
          test.ok(true)
        }
      ],
      bar: []
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should pass payload down outputs'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider(),
    InputProvider()
  ])
  const signal = Signal([
    function actionA(context) {
      context.output.foo({foo: 'bar'})
    }, {
      foo: [
        function actionB(context) {
          test.deepEqual(context.input, {foo: 'bar'})
        }
      ],
      bar: []
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should pass payload async'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider(),
    InputProvider()
  ])
  function actionA(context) {
    setTimeout(function () {
      context.output.foo({foo: 'bar'})
    })
  }
  actionA.async = true

  function actionB(context) {
    test.deepEqual(context.input, {foo: 'bar'})
  }

  const signal = Signal([
    actionA, {
      foo: [
        actionB
      ],
      bar: []
    }
  ])

  test.expect(1)
  signal.on('signalEnd', test.done)
  signal()
}

module.exports['should throw when calling output twice'] = (test) => {
  const Signal = CerebralSignal([
    OutputProvider(),
    InputProvider()
  ])

  const signal = Signal([
    function action(context) {
      context.output()
      context.output()
    }
  ])

  test.expect(1)
  test.throws(() => {
    signal()
  })
  test.done()
}
