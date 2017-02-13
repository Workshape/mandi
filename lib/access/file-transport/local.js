const fs = require('fs-extra')
const path = require('path')

/**
 * Local file transport
 *
 * Handles uploads to local uploads directory
 */

module.exports = function (mandi) {
  let uploadsDir

  // Resolve uploads dir
  if (mandi.config.uploadsDir) {
    uploadsDir = mandi.config.uploadsDir
  } else {
    uploadsDir = path.resolve(__dirname, '../../../uploads')
  }

  return { uploadFile, removeFile }

  /**
   * Upload file to local uploads directory
   *
   * @param  {Object} file
   * @param  {String} uploadPath
   * @param  {Function} callback
   * @return {void}
   */
  function uploadFile(file, uploadPath, callback) {
    let destPath = path.join(uploadsDir, uploadPath)

    fs.move(file.path, destPath, { clobber: true }, err => {
      if (err) { return callback(err) }

      callback(null, {
        type : 'local',
        url  : `${ mandi.config.publicUrl }/uploads/${ uploadPath }`,
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
    let destPath = path.join(uploadsDir, filePath)
    fs.unlink(destPath, err => callback(err))
  }

}