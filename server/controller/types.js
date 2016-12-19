const ormUtil = require('../util/orm')
const types = require('../access/types')

/**
 * Types controllers
 *
 * Exports controllers related to types
 */

/**
 * Get types schema
 *
 * @return {void}
 */
function * schema() {
  this.body = { types: yield types.getSchema() }
}

/**
 * List entries for given type
 *
 * @return {void}
 */
function * list() {
  let schemas = yield types.getSchema()
  let type = this.param('type')

  if (!schemas[type]) { return this.throw(400, 'Invalid Type') }

  yield ormUtil.getPaginated.call(this, type, 'entries', {})
}

module.exports = { schema, list }