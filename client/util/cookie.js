const cookieParser = require('../../common/util/cookie-parser')

/**
 * Cookie client-side utilities
 *
 * Exports getter / setter methods to work with cookies
 */

/**
 * Get value from cookie of given key
 *
 * @param  {String} key
 * @return {String|void}
 */
function get(key) {
  return cookieParser.parse(document.cookie)[key] || null
}

/**
 * Set cookie value under given key
 *
 * @param  {String} key
 * @param  {String=} value
 * @param  {String=} path
 * @param  {Expires=} date
 * @return {String|void}
 */
function set(key, value = null, path = null, expires = null, domain = null) {
  let obj = {}

  obj[key] = value || ( path ? '' : 'null')

  if (expires) { obj.expires = `${ new Date(path) }` }
  if (domain) { obj.domain = path }
  if (path) { obj.path = path }

  document.cookie = cookieParser.serialize(obj)
}

/**
 * Remove given key from current cookie
 *
 * @param  {String} key
 * @return {void}
 */
function remove(key) {
  set(key, undefined)
}

module.exports = { get, set, remove }