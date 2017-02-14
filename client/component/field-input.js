const Vue = require('vue/dist/vue.js')
const template = require('./field-input.pug')()
const config = require('../config')
/**
 * Field Input component
 *
 * Display field input / editing component for custom type
 */

Vue.component('field-input', {
  template,
  props   : [ 'type', 'value' ],
  methods : { updateValue, chooseFile, removeFile },
  data    : () => ({ config })
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

/**
 * Remove file
 *
 * @return {void}
 */
function removeFile() {
  this.$emit('input', null)
}