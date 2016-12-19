const log = require('../util/log')
const users = require('../orm/users')
const Promise = require('bluebird')

/**
 * Setup module
 *
 * Ensures app is ready for use
 */

const DEFAULT_CREDENTIALS = {
  username : 'admin',
  password : 'foobar'
}

/**
 * Run setup
 *
 * @return {Promise}
 */
function run() {
  return ensureOverlord()
}

/**
 * Look Overlord User up - create a new one if not found
 *
 * @return {Promise}
 */
function ensureOverlord() {
  return new Promise((resolve) => {
    log.task('Checking the existance of a Overlord User..', 0)

    return users.findOne({ groups: 'overlord' })
    .then(user => {
      if (!user) {
        log.task('Not found - creating Overlord User..', 0)

        return createOverlord().then(() => {
          log.task('Done', 1)
          return resolve()
        })
      }

      log.task('Done', 1)
      return resolve()
    })
  })
}

/**
 * Create and save Overlord User with default credentials
 *
 * @return {Promise}
 */
function createOverlord() {
  return users.create({
    username : DEFAULT_CREDENTIALS.username,
    password : DEFAULT_CREDENTIALS.password,
    groups   : [ 'admin', 'overlord' ]
  })
}

module.exports = { run }