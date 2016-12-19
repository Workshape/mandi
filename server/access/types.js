const presets = require('../../common/util/validator-presets')
const fs = require('fs')
const Promise = require('bluebird')
const path = require('path')
const _ = require('lodash')

/**
 * Types access module
 *
 * Loads / caches / resolves current types schema configuration
 */

var schema

/**
 * Get configured types schema
 *
 * @return {Promise}
 */
function getSchema() {
  return new Promise((resolve, reject) => {
    if (schema) { return resolve(schema)}

    // Resolve path of types schema in use
    let filepath = path.resolve(__dirname, '../../data/types.json')

    // Read JSON schema
    fs.readFile(filepath, 'utf8', (err, content) => {
      if (err) { return reject(err) }

      // Parse JSON schema
      let data = JSON.parse(content)

      // Resolve inheritances
      for (let key in data) { resolveType(data[key]) }

      // Cache
      schema = data

      // Resolve Promise
      resolve(schema)
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

      _.extend(field, extendFrom)

      field.class = field.extends
      delete field.extends
    }
  }
}

module.exports = { getSchema }