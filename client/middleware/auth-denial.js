const router = require('../core/router')
const auth = require('../core/auth')

/**
 * API service Auth Denial middleware
 *
 * Exports middleware to incorporate into API service that handles
 * authentication denials (For token expiries, bad auth, etc..)
 */

/**
 * Handle auth denials on API responses
 *
 * @param  {Object} req
 * @param  {Function} next
 * @return {void}
 */
module.exports = function (req, next) {
  this.once('response', res => {
    if (this.properties.disableDenial) {
      return
    }

    if (res.status === 401) {
      router.goTo('/sign-in')
      auth.setToken(null)
    }
  })

  next()
}