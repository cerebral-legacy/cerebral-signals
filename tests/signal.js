'use strict'
const CerebralSignal = require('../index')

module.exports['should create a signal factory'] = (test) => {
  const Signal = CerebralSignal([])

  test.equal(typeof Signal, 'function')
  test.done()
}

module.exports['should create a signal extending event emitter'] = (test) => {
  const Signal = CerebralSignal([])
  const signal = Signal([])

  test.equal(typeof signal.on, 'function')
  test.equal(typeof signal.once, 'function')
  test.equal(typeof signal.off, 'function')
  test.done()
}

module.exports['should run actions'] = (test) => {
  const Signal = CerebralSignal([])
  const signal = Signal([
    function action() {
      test.ok(true)
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should pass arguments to context creator and run it for each action'] = (test) => {
  const Signal = CerebralSignal([
    function ContextProvider(context, action, payload, next) {
      test.deepEqual(context, {})
      test.equal(action.actionIndex, 0)
      test.deepEqual(payload, {foo: 'bar'})
      test.ok(typeof next, 'function')
    }
  ])
  const signal = Signal([
    function action() {}
  ])

  test.expect(4)
  signal({
    foo: 'bar'
  })
  test.done()
}

module.exports['should pass returned context into actions'] = (test) => {
  const Signal = CerebralSignal([
    function ContextProvider(context, action, payload, next) {
      return {
        foo: 'bar'
      }
    }
  ])
  const signal = Signal([
    function action(context) {
      test.deepEqual(context, {foo: 'bar'})
    }
  ])

  test.expect(1)
  signal()
  test.done()
}

module.exports['should emit execution events in correct order'] = (test) => {
  let eventsCount = 0
  const Signal = CerebralSignal([])
  const signal = Signal([
    function actionA() {},
    function actionB() {}
  ])

  test.expect(6)
  signal.once('signalStart', function() {
    eventsCount++
    test.equal(eventsCount, 1)
  })
  signal.once('actionStart', function() {
    eventsCount++
    test.equal(eventsCount, 2)
    signal.once('actionStart', function() {
      eventsCount++
      test.equal(eventsCount, 4)
    })
  })
  signal.once('actionEnd', function() {
    eventsCount++
    test.equal(eventsCount, 3)
    signal.once('actionEnd', function() {
      eventsCount++
      test.equal(eventsCount, 5)
    })
  })
  signal.on('signalEnd', function() {
    eventsCount++
    test.equal(eventsCount, 6)
    test.done()
  })
  signal()
}

module.exports['should pass action and payload on action events'] = (test) => {
  const Signal = CerebralSignal([])
  const signal = Signal([
    function action() {}
  ])

  test.expect(4)
  signal.once('actionStart', function(action, payload) {
    test.equal(action.actionIndex, 0)
    test.deepEqual(payload, {foo: 'bar'})
  })
  signal.once('actionEnd', function(action, payload) {
    test.equal(action.actionIndex, 0)
    test.deepEqual(payload, {foo: 'bar'})
  })
  signal({
    foo: 'bar'
  })
  test.done()
}

module.exports['should be able to reuse existing chain to define signals'] = (test) => {
  const Signal = CerebralSignal([
    function NextProvider(context, action, payload, next) {
      context.next = next

      return context
    }
  ])

  function actionA(context) {
    test.ok(true)
    context.next({
      path: 'success'
    })
  }
  actionA.async = true

  function actionB(context) {
    test.ok(true)
    context.next({
      path: 'success'
    })
  }

  function actionC(context) {
    test.ok(true)
    context.next()
  }

  const chain = [
    actionA, {
      success: [
        actionB, {
          success: [
            actionC
          ]
        }
      ]
    }
  ]
  const signalA = Signal(chain)
  signalA.on('signalEnd', () => {
    const signalB = Signal(chain)
    signalB.on('signalEnd', () => {
      test.done()
    })
    signalB()
  })

  test.expect(6)
  signalA()
}
