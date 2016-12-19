const Vue = require('vue')
const EventEmitter = require('tiny-emitter')
const _ = require('lodash')
const error = require('../core/error')

/**
 * Store class
 *
 * Base class for data stores
 */

module.exports = class Store {

  /**
   * Class constructor
   *
   * @constructor
   * @param  {Function} getData
   */
  constructor(getData) {
    this.getData = getData
    this.events = new EventEmitter()
    this.on = this.events.on.bind(this.events)
    this.emit = this.events.emit.bind(this.events)
  }

  /**
   * Initialise and load state
   *
   * @return {Promise}
   */
  init() {
    this.events.on('_change', this.refresh)
    return this.refresh()
  }

  /**
   * Get current state data (or key value, if a key is passed)
   *
   * @param  {String=} key
   * @return {Object}
   */
  get(key = null) {
    let data = this.vm ? this.vm.$data : {}
    let out = {}
    for (let key in data) { out[key] = data[key] }
    return key ? out[key] : out
  }

  /**
   * Refresh State data from the API
   *
   * @return {Promise}
   */
  refresh() {
    return this.getData().then(data => {
      let changed = !_.isEqual(this.get(), data)

      if (!this.vm) {
        // Instanciate Vue vm first time
        this.vm = new Vue({ data })
      } else {
        // Otherwise, extend Vue instance's data
        _.extend(this.vm, data)
      }

      // Emit change if needed
      if (changed) { this.emit('change', this.get()) }

      // Return new data
      return this.get()
    })
    .catch(error.handle)
  }

  /**
   * Watch changes in Vue instance's data
   *
   * @return {void}
   */
  watch() {
    this.vm.$watch.apply(this.vm, arguments)
  }

}