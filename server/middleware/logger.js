const color = require('cli-color')

/**
 * Logger middleware
 *
 * Pretty logging of HTTP responses
 */

const METHOD_COLORS = {
  post   : color.cyan,
  get    : color.blue,
  put    : color.magenta,
  delete : color.red
}

module.exports = function (nimda) {

  /**
   * Middleware function, logs response once sent back
   *
   * @param  {Object} next
   * @return {String}
   */
  return function * (next) {
    let { req, res } = this

    res.once('finish', done)
    res.once('close', done)

    yield next

    /**
     * Called once request is finished
     *
     * @return {void}
     */
    function done() {
      res.removeListener('finish', done)
      res.removeListener('close', done)
      nimda.util.log.time()
      logRequest()
    }

    /**
     * Log request and response code
     *
     * @return {void}
     */
    function logRequest() {
      console.log(
        outputStatus(res.statusCode) +
        outputMethod(req.method) +
        ' - ' +
        color.yellow(req.url)
      )
    }
  }

  /**
   * Return HTTP method tag string with assigned color
   *
   * @param  {String} method
   * @return {String}
   */
  function outputMethod (method) {
    let colorFn = METHOD_COLORS[method.toLowerCase()] || color.white

    return colorFn(`[${ method.toUpperCase() }]`)
  }

  /**
   * Output HTTP status - green for good and red for bad status codes
   *
   * @param  {Number} code
   * @return {String}
   */
  function outputStatus(code) {
    let colorFn = code >= 200 && code < 300 ? color.green : color.red

    return colorFn(`[${ code }]`)
  }

}