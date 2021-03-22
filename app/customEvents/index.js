const { EventEmitter } = require('events')

// Increase the max listeners to get rid of the warning below
// MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
// 11 global:completed listeners added. Use emitter.setMaxListeners() to increase limit
EventEmitter.defaultMaxListeners = 50

module.exports = new EventEmitter()
