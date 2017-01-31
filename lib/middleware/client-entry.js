const pug = require('pug')
const path = require('path')
const Promise = require('bluebird')

/**
 * Client Entry middleware
 *
 * Middleware for single-page-app routing - serves client's entry file
 */

const RESERVED_PATHS = [ 'api' ]
const ENTRY_FILE = '../../view/index.pug'

module.exports = function (nimda) {

  /**
   * Respond with index.html file
   *
   * @param  {Object} next
   * @return {void}
   */
  return function * (next) {
    let segments = this.request.path.split('/').splice(1)

    if (RESERVED_PATHS.indexOf(segments[0]) === -1) {
      this.body = yield renderEntryFile()
      return
    }

    yield next
  }

  /**
   * Render entry file
   *
   * @return {Promise}
   */
  function renderEntryFile() {
    return new Promise((resolve, reject) => {
      let fpath = path.resolve(__dirname, ENTRY_FILE)

      pug.renderFile(fpath, { pretty: true, nimda }, (err, result) => {
        err ? reject(err) : resolve(result)
      })
    })
  }

}