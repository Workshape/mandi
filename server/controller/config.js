const config = require('../access/config')

/**
 * Config controllers
 *
 * Exports controllers related to website configuration
 */

/**
 * Get types schema
 *
 * @return {void}
 */
function * load() {
  this.body = { config: yield config.load() }
}

module.exports = { load }