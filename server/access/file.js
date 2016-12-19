const Promise = require('bluebird')
const transports = require('./file-transport')
const mime = require('mime')
const _ = require('lodash')
const fs = require('fs')

const DEFAULT_OPTIONS = {
  addExtension : false, // Do not add extension while uploading file
  allowedTypes : null   // All mime types allowrd
}

/**
 * File storage module
 *
 * S3 / local file management access wrapper
 */

/**
 * Upload file using available transport
 *
 * @param  {Object} file
 * @param  {String} path
 * @param  {Object=} options
 * @return {Promise}
 */
function upload(file, path, options = {}) {
  return new Promise((resolve, reject) => {
    if (!path) { return reject(new Error('Missing argument `path`')) }

    options = _.defaults(options, DEFAULT_OPTIONS)

    let suffix = ''
    let { allowedTypes, addExtension } = options

    if (addExtension) {
      suffix = `.${ mime.extension(file.type) }`
    }

    if (allowedTypes && allowedTypes.indexOf(file.type) === -1) {
      return fs.unlink(file.path, err => {
        let extensions = allowedTypes.map(t => mime.extension(t))
        let message = `Only accepts: ${ extensions.join(', ') }`

        reject(err || new Error(message))
      })
    }

    getTransport().uploadFile(file, path + suffix, (err, result) => {
      err ? reject(err) : resolve(result)
    })
  })
}

/**
 * Upload file using available transport
 *
 * @param  {String} path
 * @return {Promise}
 */
function remove(path) {
  return new Promise((resolve, reject) => {
    if (!path) { return reject(new Error('Missing argument `path`')) }

    getTransport().removeFile(path, err => err ? reject(err) : resolve())
  })
}

/**
 * Returns S3 transport if correctly configured, local transport otherwise
 *
 * @return {Object}
 */
function getTransport() {
  if (transports.s3.hasConfig()) {
    return transports.s3
  }

  return transports.local
}

module.exports = { upload, remove }