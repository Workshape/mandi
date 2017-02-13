const config = require('config')
const Mandi = require('./Mandi')
const path = require('path')

/**
 * Default run script
 *
 * This module instanciates Mandi with local configuration and runs the server
 */

// Schema file loaded (if found) when running with `npm run`
const SCHEMA_PATH = path.resolve(__dirname, '../schema.json')

// Instanciate mandi
let mandi = new Mandi(config, {})

// Load schema from file
mandi.schemaLoader.loadFromPath(SCHEMA_PATH)

// Start the server
.then(() => mandi.listen())

// Handle any errors
.catch(mandi.util.log.error)