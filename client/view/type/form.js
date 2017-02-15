const Validator = require('../../../common/util/Validator')
const config = require('../../config')
const router = require('../../core/router')
const api = require('../../core/api')
const modal = require('../../core/modal')

/**
 * Type > Add controller
 *
 * Form to add entry for a type
 */

const scope = req => {
  let type = config.schema.types[req.namedParams.type]
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
const methods = { loadEntry, save, bind }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  if (this.mode === 'edit') { this.loadEntry() }

  this.bind()

  this.$watch('entry', () => {
    this.valid = this.validator.validate(this.entry || {}).valid
    this.error = null
  }, { deep: true })
}

/**
 * bind all DOM events
 *
 * @return {void}
 */
function bind() {
  this._keydown = keydown.bind(this)

  window.addEventListener('keydown', this._keydown)
}

/**
 * Unbind all DOM events
 *
 * @return {void}
 */
function beforeDestroy() {
  window.removeEventListener('keydown', this._keydown)
}

/**
 * Handle key down event
 *
 * @param  {KeyDownEvent} e
 * @return {void}
 */
function keydown(e) {
   // CMD+S | CTRL+S
  if ((e.metaKey || e.ctrlKey || e.cmdKey) && e.keyCode === 83) {
    e.preventDefault()
    this.save()
  }
}

/**
 * Get empty object with given type
 *
 * @param  {Object} type
 * @return {Object}
 */
function getEmpty(type) {
  let out = {}

  for (let key of Object.keys(type.schema)) { out[key] = null }

  return out
}

/**
 * Save entry
 *
 * @return {void}
 */
function save() {
  let payload = { _type: this.type.key, id: this.id || null }

  this.error = this.validator.getError(this.entry)

  if (this.error) {
    return modal.open('alert', { title: 'Not complete', text: this.error })
  }

  for (let key of Object.keys(this.entry)) {
    if (this.entry[key] instanceof File) {
      if (!payload.files) { payload.files = {} }
      payload.files[key] = this.entry[key]
    } else {
      payload[key] = this.entry[key]
    }
  }

  this.loading = true

  api.types[this.id ? 'update' : 'save'](payload)
  .then(res => {
    this.loading = false

    let { id } = res.body.entry

    this.mode = 'edit'
    this.id = id
    this.loadEntry()
  }, res => {
    modal.open('alert', { title: 'Error', text: res.body })
    this.loading = false
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

module.exports = { ready, scope, methods, beforeDestroy }