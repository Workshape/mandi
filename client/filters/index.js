const stringUtil = require('../../common/util/string')
const _ = require('lodash')

/**
 * Filters index
 *
 * Exports Vue.js filters in use by the application
 */

/**
 * Remove protocol from url (if present)
 *
 * @param  {String} url
 * @return {String}
 */
function removeProtocol(url) {
  if (url.indexOf('://') !== -1) { return url.split('://')[1] }

  return url
}

module.exports = _.extend({ removeProtocol }, stringUtil)