const _ = require('lodash')
const controllerUtil = require('../../util/controller')
const validators = require('../../../common/util/validators')

/**
 * Admin Location modal
 *
 * Modal for admin to edit or create a Location
 */

const validator = validators.location
const methods = { save, setPhoto, validate }
const scope = {
  mode       : null,
  validation : {},
  error      : null,
  loading    : false,
  photo      : null,
  location   : {
    id          : null,
    address     : { label : null },
    name        : null,
    url         : null,
    description : ''
  }
}

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  this.mode = this.location && this.location.id ? 'update' : 'create'

  // Validate
  this.validate()

  // Run validation at every change
  this.$watch('location', this.validate, { deep: true })
}

/**
 * Validate current location data
 *
 * @return {void}
 */
function validate() {
  this.validation = validator.validate(this.location)
}

/**
 * Save location
 *
 * @return {void}
 */
function save() {
  let files = this.photo ? { photo: this.photo } : null
  let payload = _.extend({}, this.location, { files })
  let endpoint = `admin.locations.${ this.mode }`

  // Get validation error
  this.error = validator.getError(this.location)
  if (this.error) { return }

  // Search postcode on photon API
  controllerUtil.loadFromApi
  .call(this, endpoint, payload, {}, 'options', 'addresses')
  .then(this.close)
}

/**
 * Set photo to upload
 *
 * @param  {Event} e
 * @return {void}
 */
function setPhoto(e) {
  this.photo = e.target.files[0]
}

module.exports = { ready, scope, methods }