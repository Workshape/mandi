const Vue = require('vue/dist/vue.js')
const modals = require('../modal')
const Promise = require('bluebird')
const domUtil = require('../util/dom')
const keycode = require('keycode')
const _ = require('lodash')
const filters = require('../filters/index')

// Modal scope defaults (avoid repeating declaring common scope properties)
const SCOPE_DEFAULTS = {
  loading    : false,
  error      : null,
  pagination : null
}

/**
 * Modal module
 *
 * Handles creation, opening and closing of modal dialogs
 */

const MODAL_TRANSITION_MS = 200

var openModals = []
var initialised = false

/**
 * Initialise modals - bind key events
 *
 * @return {void}
 */
function initialise() {
  initialised = true

  let overlay = document.querySelector('[data-role="overlay"]')

  window.addEventListener('keydown', handleKeyDown)
  overlay.addEventListener('click', closeAll)
}

/**
 * Handle key down event
 *
 * @param {KeyDownEvent} e
 * @return {void}
 */
function handleKeyDown(e) {
  let key = keycode(e.keyCode)

  if (key === 'esc') {
    closeAll()
  }
}

/**
 * Open modal with given presetId and context data
 *
 * @param  {String} presetId
 * @param  {Object=} ctx
 * @return {Promise}
 */
function open(presetId, ctx = {}) {
  if (!initialised) { initialise() }

  return new Promise((resolve, reject) => {
    // Load preset, throw error if not found
    let preset = modals[presetId]
    if (!preset) { return reject(new Error(`Preset ${ presetId } not found`)) }

    // Extract controller and template - throw error if template is not found
    // (Controller is not required)
    let { controller, template } = preset
    controller = controller || {}
    if (!template) { return reject(new Error('Modal template was not set'))}

    toggleOverlay(true)

    let { el, inner } = renderModal(presetId, template)

    // Instanciate modal's VM
    let modal = new Vue({
      el      : inner,
      methods : controller.methods || {},
      data    : () => _.extend({}, SCOPE_DEFAULTS, controller.scope || {}, ctx),
      filters : filters
    })

    // Run `ready` function if set in modal's controller
    if (controller.ready) { controller.ready.call(modal) }

    // Define modal close method that resolve the returned promise
    modal.close = function (value) {
      close(modal)
      resolve(typeof value === 'undefined' ? this.value || null : value)
    }

    // Reference wrapping element inside VM Object to retrieve it when closing
    modal.el = el
    openModals.push(modal)

    // Add element to body
    document.body.appendChild(el)

    // Autofocus if any input, button or explicit autofocus element is found
    let autofocus = el.querySelector(
      '[autofocus], [tabindex], input'
    )

    if (autofocus) { autofocus.focus() }
  })
}

/**
 * Close modal if current open, throw an exeption otherwise
 *
 * @return {void}
 */
function close(modal = null) {
  if (!modal) { return closeAll() }

  let index = openModals.indexOf(modal)

  if (index === -1) {
    throw new Error('Attempting to close a modal that is not open')
  }

  openModals.splice(index, 1)

  if (!openModals.length) {
    domUtil.removeClass(document.body, 'show-overlay')
  }

  domUtil.addClass(modal.el, 'out')

  setTimeout(() => {
    modal.$destroy()
    document.body.removeChild(modal.el)
  }, MODAL_TRANSITION_MS)
}

/**
 * Close all open modals
 *
 * @return {void}
 */
function closeAll() {
  for (let modal of openModals) {
    if (modal) { close(modal) }
  }
}

/**
 * Render modal DOM element
 *
 * @param  {String} presetId
 * @param  {Function} template
 * @param  {Object} controller
 * @return {Object}
 */
function renderModal(presetId, template) {
  // Create wrapper and VM elements
  let el = document.createElement('div')
  let inner = document.createElement('div')

  // Insert VM element inside wrapper, assign class names
  el.appendChild(inner)
  el.className = `modal with-actions modal-${ presetId }`
  inner.className = 'inner'
  inner.innerHTML = template()

  return { el, inner }
}

/**
 * Toggle overlay to given state - or opposite of current state
 *
 * @param  {Boolean=} state
 * @return {void}
 */
function toggleOverlay(state = null) {
  // Add class to body to prevent scrolling and show overlay
  domUtil.toggleClass(document.body, 'show-overlay', state)
}

module.exports = { open }