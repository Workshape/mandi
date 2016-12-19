const browser = require('../util/browser')

/**
 * Pointer Events polyfill
 *
 * jQuery polyfill that allows seamless compatibility of pointer-events css
 * attribute
 */

var EVENTS = [ 'click', 'dblclick', 'mousedown', 'mouseup' ]

/**
 * Initialise pointer-events polyfill
 */
exports.init = function () {
  if (!(browser.isIeEqualOrBelow(10) || browser.isOperaMini())) { return }
  EVENTS.forEach(evt => document.addEventListener(evt, polyfillEvent))
}

/**
 * Polyfill given mouse event
 *
 * @param  {MouseEvent} event
 * @return {void}
 */
function polyfillEvent(event) {
  let el = event.target
  let style = window.getComputedStyle(el)

  if (style['pointer-events'] === 'none') {
    let origDisplayAttribute = style.display

    el.style.display = 'none'

    let underneathEl = document.elementFromPoint(event.clientX, event.clientY)

    event.target = underneathEl

    if (document.createEvent) {
      underneathEl.dispatchEvent(event)
    } else {
      underneathEl.fireEvent(`on${ event.eventType }`, event)
    }

    if (origDisplayAttribute) {
      el.style.display = origDisplayAttribute
    } else {
      el.style.display = ''
    }

    return false
  }

  return true
}