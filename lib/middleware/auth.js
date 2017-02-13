const arrayUtil = require('../../common/util/array')

/**
 * Auth middleware
 *
 * Exports middleware to retrieve user data, attach it to the controller and
 * manage access to API endpoints
 */

module.exports = function (mandi) {
  return { required, groups, preferred }

  /**
   * Attach session to controller if token is set
   *
   * @param  {Object} next
   * @return {void}
   */
  function * required(next) {
    let user = yield getCurrentUser(this)

    if (!user) { return this.throw(401, 'Not authorized') }

    this.user = user

    yield next
  }

  /**
   * Lock access to logged in users that are part of at least one of given groups
   *
   * @param  {[String]|String} allowedGroups
   * @return {Function}
   */
  function groups(allowedGroups = []) {
    if (typeof allowedGroups === 'string') { allowedGroups = [ allowedGroups ] }

    return function * (next) {
      let user = yield getCurrentUser(this)

      this.user = user

      if (
        !user ||
        !arrayUtil.containsOneOf(user.groups || [], allowedGroups)
      ) { return this.throw(401, 'Not authorized') }

      yield next
    }
  }

  /**
   * Attach session to controller if token is set
   *
   * @param  {Object} next
   * @return {void}
   */
  function * preferred(next) {
    let user = yield getCurrentUser(this)

    this.user = user

    yield next
  }

  /**
   * Get current user for given controller, if auth is available and valid
   *
   * @param  {Object}
   * @return {Object|void}
   */
  function * getCurrentUser(controller) {
    let token

    if (controller.cookie['auth-token']) {
      token = controller.cookie['auth-token']
    } else if (controller.headers.authorization) {
      token = controller.headers.authorization
    } else if (controller.query.token) {
      token = controller.query.token
    }

    if (!token) { return null }

    let user = yield mandi.orm.users.findOne({ 'token.value': token })

    if (user && user.token.expiry && user.token.expiry < new Date()) {
      user.token = user.generateAccessToken()
      yield user.save()
      return user
    }

    return user || null
  }

}