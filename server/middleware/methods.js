/**
 * Methods middleware
 *
 * Attaches useful methods to controllers
 */

module.exports = function () {

  /**
   * Bind and attach validate method to controller
   *
   * @return {void}
   */
  return function * (next) {
    // Get content type header
    let contentType = this.request.headers['content-type'] || ''

    // Always fill fields and fiels in request body
    this.request.files = this.request.body.files || {}
    this.params = this.params || {}
    this.query = this.query || {}
    this.request.body = this.request.body || {}

    // Attempt parsing JSON payload properties when is multipart
    if (contentType.indexOf('multipart') !== -1) {
      let fields = this.request.body.fields

      delete this.request.body.fields
      delete this.request.body.files

      for (let key in fields) {
        let value = fields[key]

        try {
          value = JSON.parse(fields[key])
        } catch (e) {
          // Do nothing..
        }

        this.request.body[key] = value
      }
    }

    // Attach methods to controller
    this.param = param.bind(this)

    // Continue
    yield next
  }

  /**
   * Get a parameter from body, query or params
   *
   * @param  {String} key
   * @param  {*} kefallback
   * @return {*}
   */
  function param(key, fallback = undefined) {
    return firstNotUndefined(
      this.params[key],
      this.query[key],
      this.request.body[key],
      this.request.query[key],
      fallback
    )
  }

  /**
   * Return first non-undefined argument
   *
   * @param  {...values}
   * @return {*|undefined}
   */
  function firstNotUndefined(...values) {
    for (let value of values) {
      if (typeof value !== 'undefined') { return value }
    }

    return undefined
  }

}