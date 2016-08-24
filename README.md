# cerebral-signals
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

#### Output
Actions without any output will progress automatically. If you want to go down a specific path, pass payload and/or run async, you need an output to do that.

```js
const CerebralSignal = require('cerebral-signals')
const OutputProvivder = require('cerebral-signals/providers/Output')

const MySignal = CerebralSignal([
  OutputProvivder()
])

function actionA(context) {
  // Trigger next action manually with a payload
  context.output({
    foo: 'bar'
  })
}

function actionB(context) {
  // If InputProvider was available the updated
  // (merged) payload would be available on "input"

  // Goes down to actionC, argument would be a payload.
  // This is run async, which is why the action is marked
  // as async as well
  setTimeout(() => context.output.alt1())
}
actionB.async = true

const signal = MySignal([
  actionA,
  actionB, {
    alt1: [],
    alt2: []
  }
])

signal()
```
