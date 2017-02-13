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
  if (!url || typeof url !== 'string') { return url }
  if (url.indexOf('://') !== -1) { return url.split('://')[1] }

  return url
}

/**
 * Remove tags from HTML
 *
 * @param  {String} html
 * @return {String}
 */
function stripTags(html) {
  if (!html || typeof html !== 'string') { return html }
  return html.replace(/(<([^>]+)>)/ig, '')
}

module.exports = _.extend({ removeProtocol, stripTags }, stringUtil)