const Vue = require('vue/dist/vue.js')
const template = require('./field-input.pug')()

/**
 * Field Input component
 *
 * Display field input / editing component for custom type
 */

Vue.component('field-input', {
  template,
  props   : [ 'type', 'value' ],
  methods : { updateValue, chooseFile }
})

/**
 * Set given value
 *
 * @param  {*} value
 * @return {void}
 */
function updateValue(value) {
  this.$emit('input', value)
}

/**
 * Trigger file selection
 *
 * @return {void}
 */
function chooseFile() {
  this.$el.querySelector('input[type="file"]').click()
}