const Validator = require('../../../common/util/Validator')
const config = require('../../config')
const api = require('../../core/api')
const path = require('../../util/path')
const modal = require('../../core/modal')
const router = require('../../core/router')

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
    valid     : false,
    changed   : false
  }
}
const methods = { loadEntry, save, bind }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  this.preventChange = true

  if (this.mode === 'edit') { this.loadEntry() }

  this.bind()

  this.$watch('entry', (oldVal, newVal) => {
    if (this.preventChange) { this.preventChange = false }
    else { this.changed = true }
    this.valid = this.validator.validate(this.entry || {}).valid
    this.error = null
  }, { deep: true })
}

/**
 * Start listening to all events
 *
 * @return {void}
 */
function bind() {
  this._keydown = keydown.bind(this)
  this._beforeRouteChange = beforeRouteChange.bind(this)

  window.addEventListener('keydown', this._keydown)
  router.on('beforeChange', this._beforeRouteChange)
}

/**
 * Stop listening to all events
 *
 * @return {void}
 */
function beforeDestroy() {
  window.removeEventListener('keydown', this._keydown)
  router.off('beforeChange', this._beforeRouteChange)
}

/**
 * Prompt confirmation before leaving route if there's unsaved changes
 *
 * @param  {RouteChangeEvent} e
 * @return {void}
 */
function beforeRouteChange(e) {
  if (this.changed && !this._confimedExit) {
    router.cancel = true

    return modal.open('confirm', {
      text        : 'Sure you want to leave without saving your changes?',
      confirmText : 'Sure',
      dangerous   : true
    })
    .then(confirmed => {
      if (!confirmed) { return }

      this._confimedExit = true
      router.goTo(e.path)
    })
  }
}

/**
 * Handle key down event
 *
 * @param  {KeyDownEvent} e
 * @return {void}
 */
function keydown(e) {
  if ((e.metaKey || e.ctrlKey || e.cmdKey) && e.keyCode === 83) {
    // CMD+S | CTRL+S
    e.preventDefault()
    e.stopPropagation()
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
  if (!this.changed) { return }

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
    .then(() => this.changed = false)
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