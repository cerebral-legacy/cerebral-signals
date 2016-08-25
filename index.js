'use strict';

const ActionTree = require('action-tree')
const EventEmitter = require('events')

function SignalInstance(chain, contextProviders) {
  this.contextProviders = contextProviders
  this.staticTree = ActionTree.staticTree(chain)

  this.runChain = this.runChain.bind(this)
  this.runAction = this.runAction.bind(this)

  this.runChain.on = this.on.bind(this)
  this.runChain.once = this.once.bind(this)
  this.runChain.off = this.removeListener.bind(this)
}

SignalInstance.prototype = Object.create(EventEmitter.prototype)

SignalInstance.prototype.runChain = function(payload) {

  this.emit('signalStart')
  ActionTree.executeTree(this.staticTree.tree, this.runAction, payload, function() {
    this.emit('signalEnd')
  }.bind(this))
}

SignalInstance.prototype.runAction = function(action, payload, next) {

  let hasRunNext = false

  // We wrap next becase we want to emit an event
  // when the action is done
  const wrappedNext = function() {
    if (hasRunNext) {
      throw new Error('cerebral-signals: You ran an output twice in an action, maybe you forgot to set it as async?')
    }
    hasRunNext = true
    this.emit('actionEnd', action, payload)
    next.apply(null, arguments)
  }.bind(this)

  const context = this.createContext(action, payload, wrappedNext)

  this.emit('actionStart', action, payload)
  action.actionFunc(context)

  if (!action.isAsync && !hasRunNext) {
    wrappedNext()
  }
}

SignalInstance.prototype.createContext = function(action, payload, next) {
  return this.contextProviders.reduce(function(currentContext, contextProvider) {
    return contextProvider(currentContext, action, payload, next)
  }, {})
}

module.exports = function(contextProviders) {
  return function (chain) {
    const signal = new SignalInstance(chain, contextProviders)
    return signal.runChain
  }
}
