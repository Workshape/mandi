/**
 * Email Auth API endpoints
 *
 * Exports controller functions for endpoints related to email auth
 */

module.exports = function (nimda) {
  return { session, login }

  /**
   * Match email and password to obtain authorization token
   *
   * @return {void}
   */
  function * login() {
    let { username, password } = this.request.body
    let user = yield nimda.orm.users.findOne({ username })

    // Check existance of user with given username
    if (!user) { return this.throw(401, 'Invalid credentials') }

    // Compare password
    if (!(yield nimda.orm.users.matchPasswords(password, user.password))) {
      return this.throw(401, 'Invalid credentials')
    }

    // Make sure to renew user's token if necessary
    yield nimda.orm.users.ensureValidToken(user)

    this.body = {
      success : true,
      token   : user.token.value
    }
  }

  /**
   * Session endpoint
   *
   * @return {void}
   */
  function * session() {
    let session = { user: null }

    // Attached some user data to response if logged in
    if (this.user) {
      session.user = {
        id       : this.user._id,
        username : this.user.username,
        groups   : this.user.groups
      }
    }

    this.body = { session }
  }

}