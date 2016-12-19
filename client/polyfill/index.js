// Import Babel polyfill
require('babel-polyfill')

const pointerEvents = require('./pointer-events')

/**
 * Polyfill index
 *
 * Imports and initialises app's polyfills
 */

/**
 * Initialise polyfills
 *
 * @return {void}
 */
function init() {
  pointerEvents.init()
}

module.exports = { init }