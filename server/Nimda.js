const koa = require('koa')
const body = require('koa-body')
const serve = require('koa-static')
const mount = require('koa-mount')
const routes = require('./routes')
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
  constructor(config, schema = {}) {
    // Set config
    this.config = config

    // Instanciate utils and schema loader
    this.util = require('./util')(this)
    this.schemaLoader = require('./access/schema-loader')(this)

    // Load (resolve and store) schema
    this.schemaLoader.load(schema)

    // Instanciate modules
    this.db = require('./access/db')(this)
    this.file = require('./access/file')(this)
    this.orm = require('./orm')(this)
    this.setup = require('./setup')(this)

    // Instanciate Koa server
    this.app = koa()
  }

  /**
   * Validate configuration Object
   *
   * @retur {Error|void}
   */
  validateConfig(config) {
    if (!config) { return new Error('Configuration Object is required') }

    if (!config.mongo) {
      return new Error('Configuration Object requires a `mongo` Object')
    }

    if (!config.mongo.url) {
      return new Error('Configuration Object requires `mongo.url` String')
    }

    return null
  }

  /**
   * Initialise server
   *
   * @return {void}
   */
  init() {
    if (this._initialised) {
      throw new Error('This Nimda instance was already initialised')
    }
    this._initialised = true

    if (this.config) {
      let error = this.validateConfig(this.config)
      if (error) { throw error }
    }

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

    // Log initialisation
    this.util.log.task('Initialising nimda', -1)

    // Connect to databse
    return this.db.connect().then(() => this.setup.run())
  }

  /**
   * Generate server middleware function
   *
   * @return {Function}
   */
  middleware() {
    let fn

    this.init().then(() => {
      fn = this.app.callback()
    })

    return function (req, res) {
      if (fn) { return fn.apply(this, arguments) }
      res.write('Starting Nimda - please refresh in a second..')
      res.end()
    }
  }

  /**
   * Start server and listen on given port
   *
   * @return {Promise}
   */
  listen(port = null) {
    this.init().then(() => {
      this.util.log.task('Starting server', -1)

      return this.app.listen(port || this.config.port, () => {
        return this.util.log.task(`Listening on port ${ this.config.port }`, 1)
      })
    })
  }

}