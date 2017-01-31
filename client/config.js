const _ = require('lodash')

/**
 * Client config
 *
 * Exports client configuration
 */

module.exports = _.extend(window.NIMDA_CONFIG, {
  schema : window.NIMDA_SCHEMA
})