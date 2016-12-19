const Vue = require('vue')

/**
 * App module
 *
 * Interface to initialise main app VM
 */

var baseTitle = document.title
var vm

/*
 * Initialise app main vm
 */
function init() {
  if (vm) { return }

  vm = new Vue({
    data    : {
      title : '',
      user  : {}
    },
    methods : {}
  })

  vm.$watch('title', title => {
    document.title = title ? `${ baseTitle } - ${ title }` : baseTitle
  })
}

/**
 * Set app's VM value
 *
 * @param  {String} key
 * @param  {*} value
 * @return {void}
 */
function set(key, value) {
  if (!vm) { return }

  vm[key] = value
}

/**
 * Get app's VM value by key
 *
 * @param  {String} key
 * @return {*}
 */
function get(key) {
  return vm[key]
}

module.exports = { init, set, get }