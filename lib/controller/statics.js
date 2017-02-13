const Promise = require('bluebird')
const _ = require('lodash')
const Validator = require('../../common/util/Validator')

/**
 * Statics controllers
 *
 * Exports controllers related to static website values
 */

module.exports = function (mandi) {
  return { get, update }

  /**
   * List entries for given type
   *
   * @return {void}
   */
  function * get() {
    let schemas = mandi.schema.statics
    let out = {}
    let values = yield getMappedValues()

    for (let key in schemas) {
      out[key] = typeof values[key] === 'undefined' ? null : values[key]
    }

    this.body = { values: out }
  }

  /**
   * Override static values
   *
   * @return {void}
   */
  function * update() {
    let { values } = this.request.body

    // Ensure `values` field
    if (!values) { return this.throw('Field `values` is required') }
    if (typeof values !== 'object' || values instanceof Array) {
      return this.throw('Field `values` must be an Object')
    }

    // Run validation
    let current = yield getMappedValues()
    let validator = new Validator(mandi.schema.statics)
    let validationError = validator.getError(_.extend(current, values))

    if (validationError) { return this.throw(400, validationError) }

    // Store given values
    yield Promise.map(Object.keys(values), key => {
      return mandi.db.findOne('statics', { key }).then(entry => {
        let value = values[key]

        // Override existing ones
        if (entry) {
          return mandi.db.update('statics', { _id: entry._id }, { $set: { value } })
        }

        // Store new ones
        return mandi.db.insert('statics', { key, value })
      })
    })

    yield get.apply(this, arguments)

    this.body.success = true
  }

  /**
   * Get all statics stored to the DB in an Object organised by key > value pairs
   *
   * @return {Promise}
   */
  function getMappedValues() {
    return mandi.db.find('statics', {})
    .toArray()
    .then(entries => {
      let out = {}

      for (let entry of entries) { out[entry.key] = entry.value }

      return out
    })
  }

}