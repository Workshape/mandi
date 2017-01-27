const Store = require('../class/Store')
const api = require('../core/api')

/**
 * Stores index
 *
 * Instanciates and exports all data stores
 */

module.exports = {
  schema : new Store(() => api.schema.load().then(res => res.body))
}