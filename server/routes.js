const Router = require('koa-router')
const auth = require('./middleware/auth')
const controllers = {
  auth  : require('./controller/auth'),
  users : require('./controller/users'),
  types : require('./controller/types')
}

/**
 * Routes module
 *
 * Maps server controllers to routes
 */

var router = new Router()

// Users
.get('/api/users', auth.groups('overlord', 'admin'), controllers.users.list)
.put('/api/users', auth.required, controllers.users.update)

// Auth
.get('/api/auth/session', auth.preferred, controllers.auth.session)
.post('/api/auth', controllers.auth.login)

// Types
.get('/api/types', controllers.types.schema)
.get('/api/types/:type', controllers.types.list)

module.exports = router.routes()