const users = require('./users')

/**
 * ORM index
 *
 * Exports Nimda ORM modules
 */

module.exports = nimda => ({
  users : users(nimda)
})