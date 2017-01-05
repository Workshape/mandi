const Promise = require('bluebird')
const db = require('../access/db')
const config = require('../access/config')

/**
 * Statics controllers
 *
 * Exports controllers related to static website values
 */

/**
 * List entries for given type
 *
 * @return {void}
 */
function * get() {
  let schemas = (yield config.load()).statics
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

  if (!values) { return this.throw('Field `values` is required') }
  if (typeof values !== 'object' || values instanceof Array) {
    return this.throw('Field `values` must be an Object')
  }

  yield Promise.map(Object.keys(values), key => {
    return db.findOne('statics', { key }).then(entry => {
      let value = values[key]

      if (entry) {
        return db.update('statics', { _id: entry._id }, { $set: { value } })
      }

      return db.insert('statics', { key, value })
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
  return db.find('statics', {})
  .toArray()
  .then(entries => {
    let out = {}

    for (let entry of entries) { out[entry.key] = entry.value }

    return out
  })
}

module.exports = { get, update }