const ActionTree = require('action-tree')
const EventEmitter = require('events')

function Signal(contextProviders) {
  this.contextProviders = contextProviders

  this.create = this.create.bind(this)
  this.runChain = this.runChain.bind(this)
  this.runAction = this.runAction.bind(this)

  this.runChain.on = this.on.bind(this)
  this.runChain.once = this.once.bind(this)
  this.runChain.off = this.removeListener.bind(this)
}

Signal.prototype = Object.create(EventEmitter.prototype)

Signal.prototype.create = function(chain) {
  if (chain && !Array.isArray(chain)) {
    throw new Error('Cerebral Signal - The chain ' + JSON.stringify(chain) + ' is not a valid chain, it has to be an array')
  }

  this.staticTree = ActionTree.staticTree(chain)

  return this.runChain
}

Signal.prototype.runChain = function(payload) {

  this.emit('signalStart')

  ActionTree.executeTree(this.staticTree.tree, this.runAction, payload, function() {
    this.emit('signalEnd')
  }.bind(this))
}

Signal.prototype.runAction = function(action, payload, next) {

  // We wrap next becase we want to emit an event
  // when the action is done
  const wrappedNext = function() {
    this.emit('actionEnd', action, payload)
    next.apply(null, arguments)
  }.bind(this)


  const context = this.createContext(action, payload, wrappedNext)

  // The action function itself is in the static tree
  const actionFunc = this.staticTree.actions[action.actionIndex]

  this.emit('actionStart', action, payload)
  actionFunc(context)
}

Signal.prototype.createContext = function(action, payload, next) {
  return this.contextProviders.reduce(function(currentContext, contextProvider) {
    return contextProvider(currentContext, action, payload, next)
  }, {})
}

module.exports = function(contextProviders) {
  const signal = new Signal(contextProviders)
  return signal.create
}
