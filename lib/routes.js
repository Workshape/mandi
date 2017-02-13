const Router = require('koa-router')
const authMiddleware = require('./middleware/auth')

/**
 * Routes module
 *
 * Maps server controllers to routes
 */

module.exports = function (mandi) {
  // Intanciate auth middleware
  var auth = authMiddleware(mandi)

  // Instanciate controllers
  var controller = {
    auth    : require('./controller/auth')(mandi),
    users   : require('./controller/users')(mandi),
    types   : require('./controller/types')(mandi),
    statics : require('./controller/statics')(mandi)
  }

  // Auth shortcuts
  var adminOnly = auth.groups('overlord', 'admin')

  // Define routes
  var r = new Router()

  // Users
  r.get('/api/users', adminOnly, controller.users.list)
  r.put('/api/users', adminOnly, controller.users.update)

  // Auth
  r.get('/api/auth/session', auth.preferred, controller.auth.session)
  r.post('/api/auth', controller.auth.login)

  // Types
  r.get('/api/types/:type', adminOnly, controller.types.list)
  r.get('/api/types/:type/:id', adminOnly, controller.types.getById)
  r.post('/api/types/:type', adminOnly, controller.types.save)
  r.post('/api/types/:type/:id/move/:dir', adminOnly, controller.types.move)
  r.put('/api/types/:type/:id', adminOnly, controller.types.update)
  r.delete('/api/types/:type/:id', adminOnly, controller.types.remove)
  r.post('/api/types/:type/:id/clone', adminOnly, controller.types.clone)

  // Statics
  r.get('/api/statics', adminOnly, controller.statics.get)
  r.put('/api/statics', adminOnly, controller.statics.update)

  return r.routes()

}