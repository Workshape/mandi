const Vue = require('vue/dist/vue.js')
const Color = require('color')
const ColorPicker = require('simple-color-picker')
const slider = require('vue-range-slider')
const domUtil = require('../util/dom')
const template = require('./color-picker.pug')()

/**
 * Color Picker component
 *
 * UI component for color selection
 */

const DEFAULT_COLOR = 'rgba(0, 0, 0, 0)'

Vue.component('color-picker', {
  template,
  data       : () => ({
    open             : false,
    alpha            : null,
    baseColor        : null,
    preview          : null,
    previewTextColor : null
  }),
  props      : [ 'value' ],
  methods    : {
    toggle, updatePicker, apply, onHexInput,
    bind, unbind, reset, updatePreviewValue, clear
  },
  components : { slider },
  mounted,
  beforeDestroy
})

/**
 * Initialise component
 *
 * @return {void}
 */
function mounted() {
  let el = this.$refs.picker

  this._preventChange = true

  this._picker = new ColorPicker({
    el,
    width  : el.clientWidth,
    height : el.clientHeight
  })

  this.$watch('alpha', () => {
    this.updatePreviewValue()
  })

  this._picker.onChange(value => {
    if (this._preventChange) { return this._preventChange = false }
    if ((!this.value && !this.preview) || !this.alpha) { this.alpha = 1 }
    this.baseColor = value
    this.updatePreviewValue()
  })
}

/**
 * Unbind all events
 *
 * @return {void}
 */
function beforeDestroy() {
  if (this.open) { this.unbind() }
  this._picker.remove()
}

/**
 * Toggle to given state (if Boolean value is passed) or to opposite of current
 *
 * @param  {Boolean=} state
 * @return {void}
 */
function toggle(state = null) {
  let newState = typeof state === 'boolean' ? state : !this.open

  if (newState === this.open) { return }

  this.open = newState

  if (newState) {
    this.bind()
    this.updatePicker(this.value)
  } else {
    this.preview = null
    this.unbind()
  }
}

/**
 * Update picker compnent depending on current model value
 *
 * @param  {Boolean=} state
 * @return {void}
 */
function updatePicker(color = null) {
  color = new Color(this.value || DEFAULT_COLOR)

  this.baseColor = color.hex()
  this.alpha = color.valpha

  this._preventChange = true
  this._picker.setColor(this.baseColor)
}

/**
 * Apply value chosen in picker dialog to current model
 *
 * @return {void}
 */
function apply() {
  let color = new Color(this.baseColor)
  let value = this.alpha ? color.alpha(this.alpha).string() : null

  this.preview = null

  this.$emit('input', { target: { value } })
  this.toggle(false)
}

/**
 * Handle text input value change
 *
 * @param  {String} hex
 * @return {void}
 */
function onHexInput(hex) {
  if (hex.length !== 7) { return }

  this.updatePicker(hex, true)
  this.baseColor = hex
  this._picker.setColor(hex)
}

/**
 * Bind DOM events
 *
 * @return {void}
 */
function bind() {
  this._keydown = keydown.bind(this)
  this._mousedown = mousedown.bind(this)

  window.addEventListener('keydown', this._keydown)
  window.addEventListener('mousedown', this._mousedown)
}

/**
 * Unbind DOM events
 *
 * @return {void}
 */
function unbind() {
  window.removeEventListener('keydown', this._keydown)
  window.removeEventListener('mousedown', this._mousedown)
}

/**
 * Handle keydown event
 *
 * @param  {KeyDownEvent} e
 * @return {void}
 */
function keydown(e) {
  if (e.keyCode === 27) {
    // Escape
    e.preventDefault()
    this.reset()
  } else if (e.keyCode === 13) {
    // Enter
    e.preventDefault()
    this.apply()
  }
}

function mousedown(e) {
  if (e.button < 1 && !domUtil.isChild(e.target, this.$el)) { this.reset() }
}

/**
 * Reset current state (reset preview value, close picker dialog)
 *
 * @return {void}
 */
function reset() {
  this.toggle(false)
  this.preview = null
}

/**
 * Clear model value and reset
 *
 * @return {void}
 */
function clear() {
  this.$emit('input', { target: { value: null } })
  this.reset()
}

/**
 * Update preview color
 *
 * @return {void}
 */
function updatePreviewValue() {
  let base = new Color(this.baseColor)
  let color = base.alpha(this.alpha)

  this.preview = color.string()
  this.previewTextColor = base
  .lightness(100 - base.lightness())
  .darken(.5)
  .rgb()
  .string()
}