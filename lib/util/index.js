const log = require('./log')
const orm = require('./orm')

/**
 * Util index
 *
 * Exports Nimda utilities
 */

module.exports = nimda => ({
  log : log(nimda),
  orm : orm(nimda)
})