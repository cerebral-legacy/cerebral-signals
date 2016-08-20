'use strict'
const CerebralSignal = require('../index')
const ContextProvider = require('../providers/Context')

module.exports['should add whatever is passed into the context'] = (test) => {
  const Signal = CerebralSignal([
    ContextProvider({
      foo: 'bar'
    })
  ])
  const signal = Signal([
    function action(context) {
      test.equal(context.foo, 'bar')
    }
  ])

  test.expect(1)
  signal()
  test.done()
}
