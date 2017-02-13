const log = require('./log')
const orm = require('./orm')

/**
 * Util index
 *
 * Exports Mandi utilities
 */

module.exports = mandi => ({
  log : log(mandi),
  orm : orm(mandi)
})