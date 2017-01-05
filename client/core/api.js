const Service = require('api-service')

/**
 * API endpoints wrapper
 *
 * Interface to API routes
 */

module.exports =  new Service('/api')

/**
 * Auth
 */

// Sign in a new user
.add('auth.login', {
  method     : 'post',
  route      : '/auth',
  properties : { disableDenial: true }
})

// Get current session
.add('auth.getSession', {
  method     : 'get',
  route      : '/auth/session',
  properties : { disableDenial: true }
})

/**
 * Users
 */

// Update user profile
.add('users.update', {
  method : 'put',
  route  : '/users'
})

/**
 * Types
 */

// List types
.add('config.load', {
  method : 'get',
  route  : '/config'
})

// Get single entry by id for type
.add('types.get', {
  method : 'get',
  route  : '/types/:type/:id'
})

// Get paginated entries for type
.add('types.list', {
  method : 'get',
  route  : '/types/:type'
})

// Save entry for type
.add('types.save', {
  method : 'post',
  route  : '/types/:_type'
})

// Save entry for type
.add('types.update', {
  method : 'put',
  route  : '/types/:_type/:id'
})

// Delete type entry
.add('types.delete',{
  method : 'delete',
  route  : '/types/:type/:id'
})

// Move type entry up
.add('types.moveUp',{
  method : 'post',
  route  : '/types/:type/:id/move/up'
})

// Move type entry down
.add('types.moveDown',{
  method : 'post',
  route  : '/types/:type/:id/move/down'
})

/**
 * Statics
 */

// Get static values
.add('statics.get',{
  method : 'get',
  route  : '/statics'
})

// Save static values
.add('statics.save',{
  method : 'put',
  route  : '/statics'
})