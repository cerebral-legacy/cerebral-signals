# cerebral-signal
A mixed synchronous and asynchronous flow control tool

### Creating a custom signal

```js
const CerebralSignal = require('cerebral-signals')

const MySignal = CerebralSignal([
  // Context providers
])

const signal = MySignal([
  actionA,
  actionB
])
```

### Included context providers

#### Next
You need a context provider to progress the signal. This is a simple
"middleware" like implementation of next.

```js
const CerebralSignal = require('cerebral-signals')
const NextProvider = require('cerebral-signals/providers/Next')

const MySignal = CerebralSignal([
  NextProvider()
])

function actionA(context) {
  // Trigger next action, actionB with a payload
  context.next({
    foo: 'bar'
  })
}

function actionB(context) {
  // If InputProvider was available the updated
  // (merged) payload would be available on "input"

  // Goes down to actionC, second argument would be payload
  context.next('alt1')
}

function actionC(context) {
  // Ends signal, emits "signalEnd" event
  context.next()
}

const signal = MySignal([
  actionA,
  actionB, {
    alt1: [
      actionC
    ],
    alt2: []
  }
])

signal()
```

#### Input
Any payload passed into signal or updated using "next" will be available
on the context as "input".

```js
const CerebralSignal = require('cerebral-signals')
const InputProvider = require('cerebral-signals/providers/Input')

const MySignal = CerebralSignal([
  InputProvider()
])

function actionA(context) {
  context.input.foo // "bar"
}

const signal = MySignal([
  actionA
])

signal({
  foo: 'bar'
})
```
