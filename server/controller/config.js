/**
 * Config controllers
 *
 * Exports controllers related to website configuration
 */

module.exports = function (nimda) {
  return { load }

  /**
   * Get types schema
   *
   * @return {void}
   */
  function * load() {
    this.body = { config: yield nimda.schema.load() }
  }

}