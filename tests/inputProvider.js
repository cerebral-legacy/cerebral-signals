'use strict'
const CerebralSignal = require('../index')
const InputProvider = require('../providers/Input')

module.exports['should have "input" on context'] = (test) => {
  const Signal = CerebralSignal([
    InputProvider()
  ])
  const signal = Signal([
    function action(context) {
      test.ok(context.input)
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should have initial payload on input'] = (test) => {
  const Signal = CerebralSignal([
    InputProvider()
  ])
  const signal = Signal([
    function action(context) {
      test.deepEqual(context.input, {
        foo: 'bar'
      })
    }
  ])

  test.expect(1)
  signal({
    foo: 'bar'
  })
  test.done()
}
