const { types } = require('../../store')

/**
 * Dashboard controller
 *
 * Controller module for type > list view
 */

const scope = {
  type    : null,
  loading : true,
  page    : 1,
  entries : []
}
const methods = { update }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready(req) {
  let type = types.get(req.namedParams.type)
  type.key = req.namedParams.type
  this.type = type
  this.update()
}

/**
 * Update paginated list of entries for type
 *
 * @return {Promise}
 */
function update() {
  let body = { type: this.type.key }
  this.loading = true
  return this.loadFromApi('types.list', body, {}, 'entries', 'entries')
}

module.exports = { scope, ready, methods }