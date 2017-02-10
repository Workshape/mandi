const fs = require('fs')
const _ = require('lodash')
const Jimp = require('jimp')
const mime = require('mime')
const Promise = require('bluebird')

/**
 * Image module
 *
 * Exports methods for image manipulation - mainly used for resize / crop
 * operations
 */

const RESIZABLES = [ 'image/jpeg', 'image/png', 'image/gif' ]

module.exports = function () {
  return { applyTransformations }

  /**
   * Apply transformations such as resize specified in option Object
   *
   * @param  {Object=} file
   * @param  {Object=} options
   * @return {Promise}
   */
  function applyTransformations(file, options) {
    return new Promise((resolve, reject) => {
      let { resize } = options

      // Image resize
      if (resize && _.includes(RESIZABLES, file.type)) {
        let ext = mime.extension(file.type)
        let srcPath = file.path
        let tempDest = `${ srcPath }.${ ext }`

        return Jimp.read(srcPath)
        .then(image => {
          image.cover(resize[0], resize[1])
          .write(tempDest, err => {
            return err ? reject(err) : resolve()
          })
        })
        .then(() => fs.unlink(srcPath, err => err ? reject(err) : resolve()))
        .then(() => fs.rename(tempDest, srcPath, err => {
          return err ? reject(err) : resolve()
        }))
        .then(resolve)
        .catch(reject)
      }

      return resolve(null)
    })
  }

}