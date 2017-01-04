const Vue = require('vue/dist/vue.js')
const template = require('./field-display.pug')()

/**
 * Field Display component
 *
 * Display field value for custom type
 */

Vue.component('field-display', {
  template,
  props : [ 'value', 'type' ]
})