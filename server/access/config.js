const presets = require('../../common/util/validator-presets')
const Promise = require('bluebird')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

/**
 * Config access module
 *
 * Loads / caches / resolves current website configuration
 */

var cached

/**
 * Get configured types schema
 *
 * @return {Promise}
 */
function load() {
  return new Promise(resolve => {
    if (cached) { return resolve(cached)}

    return getDefaultConfig()
    .then(defaultConf => getUserConfig().then(userConf => {
      return _.extend(defaultConf, userConf)
    }))
    .then(configs => {
      let config = _.extend(configs)

      // Resolve inheritances
      for (let key in config.types) { resolveType(config.types[key]) }

      // Cache
      cached = config

      // Resolve Promise
      resolve(config)
    })
  })
}

/**
 * Read custom configuration from website.default.json file
 *
 * @return {Promise}
 */
function getDefaultConfig() {
  let filepath = path.resolve(__dirname, '../../website.default.json')
  return Promise.promisify(fs.readJson)(filepath)
}

/**
 * Read user configuration from website.json file
 *
 * @return {Promise}
 */
function getUserConfig() {
  let filepath = path.resolve(__dirname, '../../website.json')

  return new Promise((resolve, reject) => {
    return fs.exists(filepath, exists => {
      if (!exists) { return resolve({}) }

      return Promise.promisify(fs.readJson)(filepath)
      .then(resolve)
      .catch(reject)
    })
  })
}

/**
 * Extend from given type's preset (which key is defined under `extends`)
 *
 * @param  {Object} type
 * @return {void}
 */
function resolveType(type) {
  for (let key in type.schema) {
    let field = type.schema[key]

    if (field.extends) {
      let extendFrom = presets[field.extends]

      if (!extendFrom) {
        throw new Error(`Can't extend from ${ field.extends }`)
      }

      _.extend({}, extendFrom, field)

      field.type = field.extends
      delete field.extends
    }
  }
}

module.exports = { load }