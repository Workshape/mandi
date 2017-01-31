/**
 * An error handler middleware that by default sets the HTTP status code to 500
 * and sets the body as the error message
 *
 * @param  {Function} next
 * @return {void}
 */

module.exports = function () {

  /**
   * Handle application error
   *
   * @param  {Object} next
   * @return {void}
   */
  return function * (next) {
    try {
      yield next
    } catch (err) {
      this.status = err.status || 500

      this.body = err.message
      this.app.emit('error', err, this)
    }
  }

}