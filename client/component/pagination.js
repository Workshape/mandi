const Vue = require('vue/dist/vue.js')
const router = require('../core/router')
const error = require('../core/error')
const template = require('./pagination.pug')()

/**
 * Pagination component
 *
 * Display pagination with pagination data as returned by API endpoints using
 * the server's pagination utility methods
 */

Vue.component('pagination', {
  template,
  props   : {
    pagination : { type: Object, required: true },
    change     : { type: Function, required: false },
    pathFormat : { type: String, required: false }
  },
  methods : { goTo }
})

/**
 * Go to given page
 *
 * @param  {Number} page
 * @return {void}
 */
function goTo(page) {
  if (page > this.pagination.pages || page < 1) { return }

  if (this.pathFormat) {
    router.goTo(this.pathFormat.replace(':page', page))
  } else if (this.change) {
    this.change(page)
  } else {
    error.handle(new Error('No pagination handler was declared'))
  }
}