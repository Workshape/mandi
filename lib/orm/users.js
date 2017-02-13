const Promise = require('bluebird')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const Validator = require('../../common/util/Validator')

/**
 * Users ORM module
 *
 * Exports methods to work with users collection
 */

const SESSION_LENGTH = 1000 * 60 * 60 * 24 * 60 // 30 days
const CODE_LENGTH = 25
const GROUPS = [ 'admin', 'overlord' ]
const validator = new Validator({
  username : { extends: 'name', label: 'Username' },
  password : { extends: 'password', label: 'Password' },
  groups   : {
    rules: {
      custom : [
        values => {
          if (!values || !(values instanceof Array)) { return false }
          for (let value of values) {
            if (GROUPS.indexOf(value) === -1) { return false }
          }
          return true
        },
        'Groups must be an Array of allowed groups'
      ]
    }
  }
})

module.exports = function (mandi) {
  return { create, findOne, matchPasswords, hashPassword, ensureValidToken }

  /**
   * Create new User
   *
   * @param  {Object} props
   * @return {Promise}
   */
  function create(props = {}) {
    return new Promise((resolve, reject) => {
      let user = {
        username : props.username,
        password : props.password,
        groups   : props.groups || []
      }

      let error = validator.getError(user)
      if (error) { return reject(new Error(error)) }

      return hashPassword(user.password)
      .then(hashed => {
        user.password = hashed
        user.token = generateToken()

        return mandi.db.insert('users', user)
        .then(resolve)
        .catch(reject)
      })
    })
  }

  /**
   * Hash password using bcrypt
   *
   * @param  {String} password
   * @return {Promise}
   */
  function hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) { return reject(err) }

        bcrypt.hash(password, salt, (err, hashed) => {
          err ? reject(err) : resolve(hashed)
        })
      })
    })
  }

  /**
   * Generate a random access token valid from now
   *
   * @return {Object}
   */
  function generateToken() {
    return {
      value  : randomstring.generate(CODE_LENGTH),
      expiry : new Date(new Date().getTime() + SESSION_LENGTH)
    }
  }

  /**
   * Find user with given filter
   *
   * @param  {Object=} filter
   * @return {Promise}
   */
  function findOne(filter = {}) {
    let collection = mandi.db.collection('users')
    return collection.findOne.apply(collection, filter)
  }

  /**
   * Match given (hashed and raw) passwords
   *
   * @param  {String} raw
   * @param  {String} hashed
   * @return {Promise}
   */
  function matchPasswords(raw, hashed) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(raw, hashed, (err, result) => {
        (err ? reject : resolve)(err || result)
      })
    })
  }

  /**
   * Ensure valid token for given user (generate a new one if necessary)
   *
   * @param  {Object} user
   * @return {Promise}
   */
  function ensureValidToken(user) {
    return new Promise((resolve, reject) => {
      if (user.token && user.token.expiry > new Date()) { return resolve() }

      user.token = this.generateAccessToken()

      return mandi.db.collection('users').update({ _id: user._id }, user)
      .then(resolve)
      .catch(reject)
    })
  }

}