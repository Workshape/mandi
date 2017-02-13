const local = require('./local')
const s3 = require('./s3')

/**
 * File transports index
 *
 * Exports all static file storage transport modules
 */

module.exports = mandi => ({
  local : local(mandi),
  s3    : s3(mandi)
})