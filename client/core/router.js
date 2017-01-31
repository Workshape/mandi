const _ = require('lodash')
const Vue = require('vue/dist/vue.js')
const app = require('../core/app')
const routy = require('routy')
const auth = require('../core/auth')
const filters = require('../filters')
const arrayUtil = require('../../common/util/array')
const controllerUtil = require('../util/controller')
const config = require('../config')

/**
 * App Router
 *
 * Initialises and defines route behaviour
 */

// Controller scope defaults (avoid repeating declaring common scope properties)
const SCOPE_DEFAULTS = {
  loading    : false,
  error      : null,
  pagination : null
}

var router = new routy.Router()
var view

module.exports = router

/**
 * Add initialise method to router
 *
 * @return {void}
 */
router.init = function () {
  router.on('change', updateRoute).html5().run()
}

/**
 * Handle route change
 *
 * @param  {Object} route
 * @return {boid}
 */
function updateRoute(route) {
  let options = route.route.options
  let controller = options.controller ? options.controller : {}
  let scope = controller.scope || {}
  let template = options.template ? options.template() : ''
  let wrap = document.querySelector('[data-role="view"]')

  // Evaluate scope if passed as a Function
  if (typeof scope === 'function') {
    scope = scope(route)
  } else {
    scope = _.cloneDeep(scope)
  }

  scope = _.extend({}, SCOPE_DEFAULTS, scope, {
    config : config,
    user   : auth.getUser(),
    path   : null
  })

  // Get current user
  let user = auth.getUser()

  // Redirection check for routes that require a logged in status
  if (typeof options.loggedIn === 'boolean' && !!user !== options.loggedIn) {
    if (options.loggedIn) {
      let redirectQuery = `?redirect=${ config.basePath }${ router.path }`
      return router.goTo(`${ config.basePath }sign-in${ redirectQuery }`)
    }

    return router.goTo(config.basePath)
  }

  // Redirection check for routes restricted to user groups
  if (
    options.groups &&
    (!user || !arrayUtil.containsOneOf(user.groups, options.groups))
  ) {
    return router.goTo(config.basePath)
  }

  // Clean up from previous view's VM
  if (view) { view.$destroy() }

  // Set title to new view
  app.set('title', options.title || null)

  // Prepare component
  wrap.innerHTML = template || ''

  // Instanciate VM
  view = new Vue({
    el            : wrap,
    data          : scope,
    methods       : _.defaults(_.clone(controllerUtil), controller.methods || {}),
    beforeDestroy : controller.beforeDestroy || null,
    filters       : filters
  })

  // Call controller's `ready` function
  if (typeof controller.ready === 'function') {
    controller.ready.apply(view, [ route, scope ])
  }
}