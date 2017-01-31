const Promise = require('bluebird')
const fs = require('fs-extra')
const _ = require('lodash')
const presets = require('../../common/util/validator-presets')
const defaultSchema = require('../../schema.default.json')

/**
 * Config access module
 *
 * Loads / caches / resolves current website configuration
 */

module.exports = function (nimda) {
  return { load, loadFromPath }

  /**
   * Get configured types schema
   *
   * @return {Promise}
   */
  function load(userSchema = {}) {
    let schema = _.extend(defaultSchema, userSchema)

    // Resolve inheritances for types
    for (let key in schema.types) {
      resolveInheritances(schema.types[key].schema)
    }

    // Resolve inheritances for statics
    resolveInheritances(schema.statics)

    // Make all static fields optional
    for (let key in schema.statics) {
      schema.statics[key].rules.required = false
    }

    // Cache
    return nimda.schema = schema
  }

  /**
   * Read user configuration from given path if it exists
   *
   * @param  {String} filepath
   * @return {Promise}
   */
  function loadFromPath(filepath) {
    return new Promise((resolve, reject) => {
      fs.exists(filepath, exists => {
        if (!exists) {
          nimda.util.log.info('Schema file not found', filepath)
          return resolve(nimda.schema = {})
        }

        return Promise.promisify(fs.readJson)(filepath)
        .then(schema => resolve(this.load(schema)))
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