const router = require('../core/router')
const { basePath } = require('../config')
const stringUtil = require('../../common/util/string')

/**
 * Path utility
 *
 * Exports handy methods to work path and routing
 */

/**
 * Get clean path from router (excluding query string or hash values)
 *
 * @return {String}
 */
function cleanPath() {
  return removeBasePath(router.path || '').split(/[\#\?]/)[0]
}

/**
 * Remove base path from the start of given path
 *
 * @param  {String} path
 * @return {String}
 */
function removeBasePath(path) {
  return path.substr(basePath.length)
}

/**
 * Return resolved link
 *
 * @param  {String} path
 * @return {String}
 */
function link(path) {
  return basePath + stringUtil.removeInitialSlash(path)
}

module.exports = { removeBasePath, cleanPath, link }