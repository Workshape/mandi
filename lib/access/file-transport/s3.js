const knox = require('knox')

module.exports = function (nimda) {
  var client

  return { uploadFile, removeFile, hasConfig }

  /**
   * Upload file to given path
   *
   * @param  {Object} file
   * @param  {String} path
   * @return {void}
   */
  function uploadFile(file, path, callback) {
    if (!client) { initialise() }

    client.putFile(file.path, `/${ path }`, {
      'Content-Type' : file.type,
      'x-amz-acl'    : 'public-read'
    }, (err, res) => {
      if (err) { return callback(err) }

      if (res.statusCode >= 300) {
        let errorMsg = `${ res.statusCode } - ${ res.statusMessage }`
        return callback(new Error(`S3 responded with ${ errorMsg }`))
      }

      callback(null, {
        type : 's3',
        url  : res.req.url,
        path
      })
    })
  }

  function initialise() {
    client = knox.createClient(nimda.config.aws)
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