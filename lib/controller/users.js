const _ = require('lodash')
const Validator = require('../../common/util/Validator')

/**
 * Users controllers
 *
 * Exports controllers related to users
 */

const validator = new Validator({
  username : { extends: 'name' },
  password : { extends: 'password' }
})

module.exports = function (mandi) {
  return { list, update }

  /**
   * List users
   *
   * @return {void}
   */
  function * list() {
    yield mandi.util.orm.getPaginated.call(this, 'users', 'users', {}, user => {
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
    let changes = {}
    let user = _.cloneDeep(this.user)
    let passwordChanged = false

    for (let key in validator.schema) {
      if (typeof this.request.body[key] === 'undefined') { continue }

      let val = this.request.body[key]

      user[key] = val

      if (key === 'password') {
        changes[key] = yield mandi.orm.users.hashPassword(val)
        passwordChanged = true
      } else {
        changes[key] = val
      }
    }

    let validationError = validator.getError(user)

    if (validationError) { return this.throw(400, validationError) }

    user = yield mandi.db.update('users', { _id: this.user._id }, { $set: changes })

    // Match `oldPassword` field if password is being changed
    if (passwordChanged) {
      let oldPassword = this.param('oldPassword')

      if (
        passwordChanged &&
        !(yield mandi.orm.users.matchPasswords(oldPassword, this.user.password))
      ) {
        return this.throw(403, 'Old password doesn\'t match')
      }
    }

    this.body = { user, success: true }
  }

}