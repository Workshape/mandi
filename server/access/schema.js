const Promise = require('bluebird')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const presets = require('../../common/util/validator-presets')

/**
 * Config access module
 *
 * Loads / caches / resolves current website configuration
 */

module.exports = function () {
  var cached

  return { load }

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
        for (let key in config.types) {
          resolveInheritances(config.types[key].schema)
        }
        resolveInheritances(config.statics)

        // Make all static fields optional
        for (let key in config.statics) {
          config.statics[key].rules.required = false
        }

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
   * Resolve extends for all given target's fields
   *
   * @param  {Object} target
   * @return {Object}
   */
  function resolveInheritances(target) {
    for (let key in target) {
      let field = target[key]

      if (field.extends) {
        let extendFrom = presets[field.extends]

        if (!extendFrom) {
          throw new Error(`Can't extend from ${ field.extends }`)
        }

        target[key] = _.extend({}, extendFrom, field)

        target[key].type = field.extends
        delete target[key].extends
      }
    }

    return target
  }

}