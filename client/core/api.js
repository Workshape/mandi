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
.add('types.getSchema', {
  method : 'get',
  route  : '/types'
})

// Get paginated entries for type
.add('types.list', {
  method : 'get',
  route  : '/types/:type'
})