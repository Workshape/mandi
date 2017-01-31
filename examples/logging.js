const Nimda = require('../lib/Nimda')
const http = require('http')

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

// Instanciate a HTTPServer using Nimda's middleware function
let server = http.createServer(nimda.middleware())

// Start server on port 8000
server.listen(8000)

// The Nimda interface should now be available at localhost:8000/admin
nimda.util.log.info('Running Nimda on', 'http://localhost:8000/admin')