const { schema } = require('../store')
const Validator = require('../../common/util/Validator')

/**
 * Website Static controller
 *
 * Controller module for website static values form page
 */

const scope = () => ({
  values    : getEmptyValues(),
  valid     : false,
  validator : new Validator(schema.get('statics')),
  changed   : false,
  success   : false
})
const methods = {
  save
}

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  this.loadFromApi('statics.get', null, null, 'values', 'values')
  this.$watch('values', validate, { deep: true })
}

/**
 * Run form validation
 *
 * @return {void}
 */
function validate() {
  if (!this.values || !this._changedOnce) {
    this._changedOnce = true
    return
  }

  this.changed = true
  this.success = false
  this.valid = this.validator.validate(this.values).valid
}

/**
 * Save statics through the API
 *
 * @return {void}
 */
function save() {
  this.apiCall('statics.save', { values: this.values })
  .then(() => this.success = true)
}

/**
 * Get empty static values Object following currently loaded schema
 *
 * @return {Object}
 */
function getEmptyValues() {
  let out = {}

  for (let key in schema.get().statics) {
    out[key] = null
  }

  return out
}

module.exports = { scope, ready, methods }