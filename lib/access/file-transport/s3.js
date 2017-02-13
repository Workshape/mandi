const knox = require('knox')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

module.exports = function (nimda) {
  var initialised = false
  var client
  var putFile

  return { uploadFile, removeFile, hasConfig }

  /**
   * Instanciate Knox client
   *
   * @return {void}
   */
  function initialise() {
    if (initialised) { return}

    initialised = true

    client = knox.createClient(nimda.config.aws)
    putFile = Promise.promisify(client.putFile.bind(client))
  }

  /**
   * Upload file to given path
   *
   * @param  {Object} file
   * @param  {String} path
   * @return {void}
   */
  function uploadFile(file, path, callback) {
    initialise()

    return putFile(file.path, `/${ path }`, {
      'Content-Type' : file.type,
      'x-amz-acl'    : 'public-read'
    })
    .then(res => {
      if (res.statusCode >= 300) {
        throw new Error(`${ res.statusCode } - ${ res.statusMessage }`)
      }

      callback(null, {
        type : 's3',
        url  : res.req.url,
        path
      })
    })
    .then(() => fs.unlink(file.path))
  }

  /**
   * Remove file with given path
   *
   * @param  {String} path
   * @param  {Function} callback
   * @return {void}
   */
  function removeFile(path, callback) {
    if (!client) { initialise() }

    client.deleteFile(path, (err, res) => {
      if (res.statusCode >= 300) {
        let errorMsg = `${ res.statusCode } - ${ res.statusMessage }`
        return callback(new Error(`S3 responded with ${ errorMsg }`))
      }

      callback()
    })
  }

  /**
   * Returns true if AWS S3 configuration variables are all available
   *
   * @return {Boolean}
   */
  function hasConfig() {
    return (
      nimda.config.aws &&
      nimda.config.aws.key &&
      nimda.config.aws.secret &&
      nimda.config.aws.bucket &&
      nimda.config.aws.region
    )
  }

}