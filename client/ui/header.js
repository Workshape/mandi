const Vue = require('vue/dist/vue.js')
const pathUtil = require('../util/path')
const auth = require('../core/auth')
const template = require('./header.pug')
const router = require('../core/router')
const config = require('../config')
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
      config  : config,
      path    : pathUtil.cleanPath(),
      open    : false
    },
    methods  : {
      logout,
      segment,
      toggle,
      link : pathUtil.link
    },
    filters,
    created
  })

  auth.on('change', user => header.user = user)
  router.on('change', () => header.path = pathUtil.cleanPath())
}

/**
 * Initialise header component
 *
 * @return {void}
 */
function created() {
  // Close menu on route change
  router.on('change', () => this.open = false)

  // Add keydown handler
  this._keydown = e => {
    // Close menu when ESC is pressed
    if (e.keyCode === 27) { this.open = false }
  }

  // Listen for key down
  window.addEventListener('keydown', this._keydown)
}

/**
 * Get current location path's segment at given index
 *
 * @param  {String} path
 * @param  {Number} index
 * @return {String}
 */
function segment(path, index) {
  path = pathUtil.removeBasePath(path)
  return path.substr(1).split('/')[index] || null
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