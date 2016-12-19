const fs = require('fs-extra')
const path = require('path')
const config = require('config')

/**
 * Local file transport
 *
 * Handles uploads to local uploads directory
 */

const UPLOADS_DIR = './uploads'

/**
 * Upload file to local uploads directory
 *
 * @param  {Object} file
 * @param  {String} uploadPath
 * @param  {Function} callback
 * @return {void}
 */
function uploadFile(file, uploadPath, callback) {
  let destPath = path.join(UPLOADS_DIR, uploadPath)

  fs.move(file.path, destPath, { clobber: true }, err => {
    if (err) { return callback(err) }

    callback(null, {
      type : 'local',
      url  : `${ config.publicUrl }/uploads/${ uploadPath }`,
      path : uploadPath
    })
  })
}

/**
 * Upload file to local uploads directory
 *
 * @param  {String} path
 * @param  {Function} callback
 * @return {void}
 */
function removeFile(filePath, callback) {
  let destPath = path.resolve(UPLOADS_DIR, filePath)

  fs.unlink(destPath, err => callback(err))
}

module.exports = { uploadFile, removeFile }