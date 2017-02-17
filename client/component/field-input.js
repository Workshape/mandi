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
  methods : { updateValue, chooseFile, removeFile, updateCachebuster },
  data    : () => ({ config, cachebuster: 0 }),
  created
})

/**
 * Initialise component
 *
 * @return {void}
 */
function created() {
  this.$watch('value', this.updateCachebuster)
}

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

/**
 * Increment cachebuster open change
 *
 * @return {void}
 */
function updateCachebuster() {
  this.cachebuster++
}