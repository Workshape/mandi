const api = require('../core/api')
const error = require('../core/error')
const Promise = require('bluebird')
const _ = require('lodash')

/**
 * Controller util
 *
 * Exports helper methods that are attached to client side controllers
 */

/**
 * Load result from a given API endpoint, then attach result at given `source`
 * namespace in response body to given `dest` in the controller's scope
 *
 * @param  {String} endpointNs
 * @param  {Object=} body
 * @param  {Object=} query
 * @return {Promise}
 */
function loadFromApi(endpointNs, body, query, dest = null, source = null) {
  return apiCall.call(this, endpointNs, body, query)
  .then(data => {
    let value = source ? _.get(data, source) : data
    if (!dest) { return _.extend(this, value) }
    _.set(this, dest, value)
    return data
  })
}

/**
 * Perform API call, handle rejections, errors and loading state
 *
 * @param  {String} endpointNs
 * @param  {Object=} body
 * @param  {Object=} query
 * @return {Promise}
 */
function apiCall(endpointNs, body = null, query = null) {
  return new Promise(resolve => {
    this.loading = true
    this.error = null

    let endpoint

    try {
      endpoint = _.get(api, endpointNs)
    } catch (e) {
      return error.handle(new Error(`Endpoint not found: ${ endpointNs }`))
    }

    if (!endpoint) {
      return error.handle(new Error(`Endpoint not found: ${ endpointNs }`))
    }

    return endpoint(body, query)
    .then(res => {
      this.loading = false
      resolve(res.body)
    }, res => {
      this.loading = false
      this.error = res.body
    })
    .catch(error.handle)
  })
}

module.exports = { apiCall, loadFromApi }