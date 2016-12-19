const ormUtil = require('../util/orm')
const Validator = require('../../common/util/Validator')

/**
 * Users controllers
 *
 * Exports controllers related to users
 */

/**
 * User API endpoints
 *
 * Exports controller functions for User related endpoints
 */

const validator = new Validator({
  username : { extends: 'name' },
  password : { extends: 'password' }
})

/**
 * List users
 *
 * @return {void}
 */
function * list() {
  yield ormUtil.getPaginated.call(this, 'users', 'users', {}, user => {
    return {
      id       : user.id,
      groups   : user.groups,
      username : user.username
    }
  })
}

/**
 * Update current user's profile
 *
 * @return {void}
 */
function * update() {
  Object.keys(validator.schema).forEach(key => {
    if (typeof this.request.body[key] !== 'undefined') {
      this.user[key] = this.request.body[key]
    }
  })

  let validationError = validator.getError(this.user)

  if (validationError) { return this.throw(400, validationError) }

  let user = yield this.user.save()

  this.body = { user, success: true }
}

module.exports = { update, list }