const send = require('koa-send')

/**
 * Client Entry middleware
 *
 * Middleware for single-page-app routing - serves client's entry file
 */

const RESERVED_PATHS = [ 'api' ]

module.exports = function () {

  /**
   * Respond with index.html file
   *
   * @param  {Object} next
   * @return {void}
   */
  return function * (next) {
    var segments = this.request.path.split('/').splice(1)

    if (RESERVED_PATHS.indexOf(segments[0]) === -1) {
      yield send(this, 'index.html', { root: './www' })
    }

    yield next
  }

}