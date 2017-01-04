const Vue = require('vue/dist/vue.js')
const auth = require('../core/auth')
const template = require('./header.pug')
const router = require('../core/router')
const { config } = require('../store')
const filters = require('../filters')

/**
 * Header UI component
 *
 * Instanciates Vue component over header
 */

/**
 * Instanciate VM
 *
 * @return {void}
 */
function init() {
  var header = new Vue({
    el       : 'header',
    template : template(),
    data      : {
      user    : auth.getUser(),
      config  : config.get(),
      path    : cleanPath(),
      open    : false
    },
    methods  : {
      logout,
      segment,
      toggle
    },
    filters
  })

  auth.on('change', user => header.user = user)
  config.on('change', config => header.config = config)
  router.on('change', () => header.path = cleanPath())
}

/**
 * Get current location path's segment at given index
 *
 * @param  {String} path
 * @param  {Number} index
 * @return {String}
 */
function segment(path, index) {
  return path.substr(1).split('/')[index] || null
}

/**
 * Get clean path from router (excluding query string or hash values)
 *
 * @return {String}
 */
function cleanPath() {
  return router.path.split(/[\#\?]/)[0]
}

/**
 * Toggle header open state
 *
 * @return {void}
 */
function toggle() {
  this.open = !this.open
}

/**
 * Logout and reload route
 *
 * @return {void}
 */
function logout() {
  auth.logout().then(() => router.refresh())
}

module.exports = { init }