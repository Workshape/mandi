const koa = require('koa')
const routes = require('./routes')
const db = require('./access/db')
const config = require('config')
const body = require('koa-body')
const serve = require('koa-static')
const mount = require('koa-mount')
const clientEntry = require('./middleware/client-entry')
const errorHandler = require('./middleware/error-handler')
const methods = require('./middleware/methods')
const logger = require('./middleware/logger')
const cookies = require('./middleware/cookies')
const setup = require('./setup')
const log = require('./util/log')

/**
 * Server entry module
 *
 * Configures and spins up Express server
 */

var app = koa()
var port = config.port

// Attach middleware
app.use(cookies)
app.use(logger)
app.use(errorHandler)
app.use(body({ multipart: true, formidable: { uploadDir: './tmp' } }))
app.use(methods)
app.use(routes)
app.use(serve('www'))
app.use(mount('/uploads', serve('uploads')))
app.use(clientEntry)

// First log
log.task('Starting server', -1)

// Connect to databse
db.connect().then(() => {
  // Run setup
  return setup.run().then(() => {
    // Start listening
    app.listen(port)
    log.task(`Listening on http://localhost:${ port }`, 1)
  })
})