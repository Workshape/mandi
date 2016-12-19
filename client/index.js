const Promise = require('bluebird')
const polyfill = require('./polyfill/index')
const router = require('./core/router')
const app = require('./core/app')
const api = require('./core/api')
const auth = require('./core/auth')
const header = require('./ui/header')
const error = require('./core/error')
const stores = require('./store')
const authDenial = require('./middleware/auth-denial')

/**
 * Index module
 *
 * Client entry file - imports and initialises core modules
 */

// Import components
require('./component/pagination')
require('./component/field-display')

// Import routes
require('./routes')

// Initialise
init()

/**
 * Initialise application
 *
 * @return {void}
 */
function init() {
  polyfill.init()
  api.use(authDenial)

  Promise.all([
    auth.init(),
    stores.types.init()
  ])
  .then(() => {
    app.init()
    router.init()
    header.init()
    return null
  })
  .catch(error.handle)
}