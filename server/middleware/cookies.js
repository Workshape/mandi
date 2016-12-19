const cookieParser = require('../../common/util/cookie-parser')

/**
 * Cookies middleware
 *
 * Middleware that parses cookies and attaches them to controllers
 */

/**
 * Cookie parsing middleware function
 *
 * @param  {Object} next
 * @return {void}
 */
module.exports = function * (next) {
  this.cookie = {}

  if (!this.headers.cookie) {
    return yield next
  }

  try {
    this.cookie = cookieParser.parse(this.headers.cookie)
  } catch (e) {
    this.cookie = {}
  }

  yield next
}