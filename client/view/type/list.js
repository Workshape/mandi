const { config } = require('../../store')
const modal = require('../../core/modal')

/**
 * Dashboard controller
 *
 * Controller module for type > list view
 */

const scope = req => ({
  type       : null,
  loading    : true,
  page       : req.namedParams.page || 1,
  entries    : null,
  pagination : null
})
const methods = { update, deleteEntry }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready(req) {
  let type = config.get('types')[req.namedParams.type]
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
  let query = { page: this.page }
  this.loading = true
  return this.loadFromApi('types.list', body, query, 'entries', 'entries')
  .then(res => this.pagination = res.pagination)
}

/**
 * Delete entry by id
 *
 * @return {void}
 */
function deleteEntry(id) {
  modal.open('confirm', {})
  .then(confirmed => {
    if (!confirmed) { return }

    this.apiCall('types.delete', { type: this.type.key, id })
    .then(this.update)
  })
}

module.exports = { scope, ready, methods }