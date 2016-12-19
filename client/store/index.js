const Store = require('../class/Store')
const api = require('../core/api')

/**
 * Stores index
 *
 * Instanciates and exports all data stores
 */

module.exports = {
  types : new Store(() => api.types.getSchema().then(res => res.body.types))
}