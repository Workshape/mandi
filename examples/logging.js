const Nimda = require('../lib/Nimda')

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

// Instanciate Nimda
let nimda = new Nimda(config, schema)

// Bind logging to console
nimda.on('log', console.log)

// Start server on port 8000
nimda.listen(8000)