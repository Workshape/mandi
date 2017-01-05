const Router = require('koa-router')
const auth = require('./middleware/auth')
const controllers = {
  config : require('./controller/config'),
  auth   : require('./controller/auth'),
  users  : require('./controller/users'),
  types  : require('./controller/types')
}

/**
 * Routes module
 *
 * Maps server controllers to routes
 */

var router = new Router()

// Config
.get('/api/config', controllers.config.load)

// Users
.get('/api/users', auth.groups('overlord', 'admin'), controllers.users.list)
.put('/api/users', auth.required, controllers.users.update)

// Auth
.get('/api/auth/session', auth.preferred, controllers.auth.session)
.post('/api/auth', controllers.auth.login)

// Types
.get('/api/types/:type', auth.groups('admin'), controllers.types.list)
.get('/api/types/:type/:id', auth.groups('admin'), controllers.types.getById)
.post('/api/types/:type', auth.groups('admin'), controllers.types.save)
.put('/api/types/:type/:id', auth.groups('admin'), controllers.types.update)
.delete('/api/types/:type/:id', auth.groups('admin'), controllers.types.remove)

module.exports = router.routes()