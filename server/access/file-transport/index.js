const local = require('./local')
const s3 = require('./s3')

/**
 * File transports index
 *
 * Exports all static file storage transport modules
 */

module.exports = nimda => ({
  local : local(nimda),
  s3    : s3(nimda)
})