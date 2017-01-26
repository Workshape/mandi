const koa = require('koa')
const routes = require('./routes')
const body = require('koa-body')
const serve = require('koa-static')
const mount = require('koa-mount')
const clientEntry = require('./middleware/client-entry')
const errorHandler = require('./middleware/error-handler')
const methods = require('./middleware/methods')
const logger = require('./middleware/logger')
const cookies = require('./middleware/cookies')

/**
 * Server entry module
 *
 * Configures and spins up Express server
 */

module.exports = class Nimda {

  /**
   * Class constructor
   *
   * @param  {Object} config
   * @param  {Object} schema
   * @constructor
   */
  constructor(config, schema) {
    this._schema = schema
    this.config = config

    this.schema = require('./access/schema')(this)
    this.db = require('./access/db')(this)
    this.file = require('./access/file')(this)
    this.orm = require('./orm')(this)
    this.util = require('./util')(this)
    this.setup = require('./setup')(this)

    this.app = koa()

    // Attach middleware
    this.app.use(cookies(this))
    this.app.use(logger(this))
    this.app.use(errorHandler(this))
    this.app.use(body({ multipart: true, formidable: { uploadDir: './tmp' } }))
    this.app.use(methods(this))
    this.app.use(routes(this))
    this.app.use(serve('www'))
    this.app.use(mount('/uploads', serve('uploads')))
    this.app.use(clientEntry(this))

    // First log
    this.util.log.task('Starting server', -1)

    // Connect to databse
    this.db.connect().then(() => {
      // Run setup
      return this.setup.run().then(() => {
      })
    })
  }

}