const config = require('config')
const Nimda = require('./Nimda')

/**
 * Default run script
 *
 * This module instanciates Nimda with local configuration and runs the server

/**
 * Start server
 *
 * @return {void}
 */
new Nimda(config, {}).listen(config.port)