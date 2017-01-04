const Validator = require('../../../common/util/Validator')
const { config } = require('../../store')
const router = require('../../core/router')

/**
 * Type > Add controller
 *
 * Form to add entry for a type
 */

const scope = req => {
  let type = config.get('types')[req.namedParams.type]
  let { id } = req.namedParams
  let mode = id ? 'edit' : 'create'

  type.key = req.namedParams.type

  return {
    id, type, mode,
    entry     : getEmpty(type),
    loading   : mode === 'edit',
    validator : new Validator(type.schema),
    valid     : false
  }
}
const methods = { loadEntry, save }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  if (this.mode === 'edit') { this.loadEntry() }

  this.$watch('entry', () => {
    this.valid = this.validator.validate(this.entry || {}).valid
    this.error = null
  }, { deep: true })
}

/**
 * Get empty object with given type
 *
 * @param  {Object} type
 * @return {Object}
 */
function getEmpty(type) {
  let out = {}

  for (let key of Object.keys(type.schema)) {
    out[key] = null
  }

  return out
}

/**
 * Save entry
 *
 * @return {void}
 */
function save() {
  let payload = { _type: this.type.key }

  this.error = this.validator.getError(this.entry)
  if (this.error) { return }

  for (let key of Object.keys(this.entry)) {
    if (this.entry[key] instanceof File) {
      if (!payload.files) { payload.files = {} }
      payload.files[key] = this.entry[key]
    } else {
      payload[key] = this.entry[key]
    }
  }

  this.apiCall(`types.${ this.id ? 'update' : 'save' }`, payload)
  .then(() => {
    let baseUrl = `/${ this.type.key }/list`
    let { id } = this
    router.goTo(`${ baseUrl }` + (id ? `/page-${ this.page }#${ id }` : ''))
  })
}

/**
 * Load entry of assigned ID
 *
 * @return {Promise}
 */
function loadEntry() {
  let body = { type: this.type.key, id: this.id }
  return this.loadFromApi('types.get', body, { page: true }, 'entry', 'entry')
  .then(res => this.page = res.page)
}

module.exports = { ready, scope, methods }