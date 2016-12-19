const api = require('./api')
const app = require('./app')
const cookieUtil = require('../util/cookie')
const EventEmitter = require('tiny-emitter')
const Promise = require('bluebird')

/**
 * Auth module
 *
 * Module that handles session and token /user storage
 */

var token
var user = null
var events = new EventEmitter()
var on = events.on.bind(events)

/**
 * Initialise auth
 *
 * @return {void}
 */
function init() {
  return setToken(cookieUtil.get('auth-token') || null)
}

/**
 * Set token to given value
 *
 * @param  {String} value
 * @return {Promise}
 */
function setToken(value) {
  token = value
  cookieUtil.set('auth-token', token, '/')

  return reload()
}

/**
 * Reload current user
 *
 * @return {Promise}
 */
function reload() {
  return new Promise((resolve, reject) => {
    if (!token) {
      setUser(null)
      return resolve(user)
    }

    return api.auth.getSession({ token })
    .then(res => {
      setUser(res.body.session.user || null)
      resolve(user)
      return user
    }, res => reject(new Error(res.body)))
    .catch(reject)
  })
}

/**
 * Set current user to given value
 *
 * @param  {Object|void} user
 * @return {void}
 */
function setUser(value = null) {
  let changedState

  if (!!user !== !!value) { changedState = true }

  user = value

  app.set('user', user)
  events.emit('change', user)
  if (changedState) { events.emit('change-state', changedState) }
}

/**
 * Get current user if set
 *
 * @return {Object|void}
 */
function getUser() {
  return user || null
}

/**
 * Log out current user
 *
 * @return {Promise}
 */
function logout() {
  return setToken(null)
}

module.exports = { init, setToken, reload, logout, on, getUser, setUser }