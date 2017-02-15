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

/**
 * Merge paths avoiding repeated trailing slashes
 *
 * @param  {..String..}
 * @return {String}
 */
function merge() {
  let parts = []

  for (let i = 0; i < arguments.length; i++) {
    let path = arguments[i]

    // Remove trailing slash after path
    if (path.substr(path.length - 1) === '/') {
      path = path.substr(0, path.length - 1)
    }

    // Remove trailing slash before path (except for first segment)
    if (i > 0 && path.substr(0, 1) == '/') {
      path = path.substr(1)
    }

    parts.push(path)
  }

  return parts.join('/')
}

module.exports = { removeBasePath, cleanPath, link, merge }