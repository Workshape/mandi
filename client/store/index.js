const Store = require('../class/Store')
const api = require('../core/api')

/**
 * Stores index
 *
 * Instanciates and exports all data stores
 */

module.exports = {
  config : new Store(() => api.config.load().then(res => res.body.config))
}