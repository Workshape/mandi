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

module.exports = function (mandi) {
  return { run }

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
      mandi.util.log.task('Checking the existance of a Overlord User..', 0)

      return mandi.orm.users.findOne({ groups: 'overlord' })
      .then(user => {
        if (!user) {
          mandi.util.log.task('Not found - creating Overlord User..', 0)

          return createOverlord().then(() => {
            mandi.util.log.task('Done', 1)
            return resolve()
          })
        }

        mandi.util.log.task('Done', 1)
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
    return mandi.orm.users.create({
      username : DEFAULT_CREDENTIALS.username,
      password : DEFAULT_CREDENTIALS.password,
      groups   : [ 'admin', 'overlord' ]
    })
  }

}