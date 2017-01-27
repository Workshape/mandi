const config = require('config')
const Nimda = require('./Nimda')
const path = require('path')

/**
 * Default run script
 *
 * This module instanciates Nimda with local configuration and runs the server
 */

// Schema file loaded (if found) when running with `npm run`
const SCHEMA_PATH = path.resolve(__dirname, '../schema.json')

// Instanciate nimda
let nimda = new Nimda(config, {})

// Load schema from file
nimda.schemaLoader.loadFromPath(SCHEMA_PATH)

// Start the server
.then(() => nimda.listen())

// Handle any errors
.catch(nimda.util.log.error)