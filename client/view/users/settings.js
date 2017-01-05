/**
 * User Settings controller
 *
 * Controller module for user settings page
 */

const scope = {
  passChange : {
    valid   : false,
    success : false,
    old     : '',
    new     : '',
    confirm : ''
  }
}
const methods = { changePassword }

/**
 * Controller is ready
 *
 * @return {void}
 */
function ready() {
  this.$watch('passChange', val => {
    val.valid = val.old && val.new && val.new === val.confirm
  }, { deep: true })
}

/**
 * Submit password change
 *
 * @return {Promise}
 */
function changePassword() {
  if (!this.passChange.valid || this.loading) { return }

  this.passChange.success = false

  return this.apiCall('users.update', {
    oldPassword : this.passChange.old,
    password    : this.passChange.new
  })
  .then(() => {
    this.passChange.old = ''
    this.passChange.new = ''
    this.passChange.confirm = ''
    this.passChange.success = true
  })
}

module.exports = { scope, ready, methods }