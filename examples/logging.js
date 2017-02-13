const Mandi = require('../lib/Mandi')

/**
 * Examples > Logging
 *
 * Suppress logging using the `quiet` option in the config, then listen for
 * log events and pass to console
 */

// Create a simple configuration
let config = {
  // .. Options here
  quiet: true // Suppress logging
}
let schema = {} // Your schema here..

// Instanciate Mandi
let mandi = new Mandi(config, schema)

// Bind logging to console
mandi.on('log', console.log)

// Start server on port 8000
mandi.listen(8000)