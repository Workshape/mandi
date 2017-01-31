const config = require('../../config')
const modal = require('../../core/modal')
const router = require('../../core/router')

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
const methods = { update, deleteEntry, moveEntry, cloneEntry }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready(req) {
  let type = config.schema.types[req.namedParams.type]
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
 * Move entry up or down
 *
 * @param  {String} direction
 * @return {Promise}
 */
function moveEntry(id, direction = 'up') {
  let dir = direction === 'up' ? 'Up' : 'Down'

  return this.apiCall(`types.move${ dir }`, { type: this.type.key, id })
  .then(this.update)
}

/**
 * Delete entry by id
 *
 * @param  {String} id
 * @return {Promise}
 */
function deleteEntry(id) {
  return modal.open('confirm', {})
  .then(confirmed => {
    if (!confirmed) { return }

    return this.apiCall('types.delete', { type: this.type.key, id })
    .then(this.update)
  })
}

/**
 * Clone entry by id
 *
 * @param  {String} id
 * @return {Promise}
 */
function cloneEntry(id) {
  return modal.open('confirm', {})
  .then(confirmed => {
    if (!confirmed) { return }

    let { basePath } = config
    let { key } = this.type

    return this.apiCall('types.clone', { type: key, id })
    .then(res => router.goTo(`${ basePath }${ key }/edit/${ res.entry.id }`))
  })
}

module.exports = { scope, ready, methods }