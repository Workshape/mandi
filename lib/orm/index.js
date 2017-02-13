const users = require('./users')

/**
 * ORM index
 *
 * Exports Mandi ORM modules
 */

module.exports = mandi => ({
  users : users(mandi)
})