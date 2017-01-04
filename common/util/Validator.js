const stringUtil = require('./string')
const REGEXES = require('./regexes')
const PRESETS = require('./validator-presets')
const _ = require('lodash')

/**
 * Validator class
 *
 * Takes a smart schema and generates validation Objects on demand - handy for
 * forms and API endpoints
 */

module.exports = class Validator {

  /**
   * Validator constructor
   *
  * @constructor
  * @param  {Object} schema
  */
  constructor(schema) {
    this.schema = schema
  }

  /**
   * Validate given object and return validation containing errors and flags
   * Work recursively by calling itself with a subSchema
   *
   * @param  {Object} object
   * @param  {Object=} subSchema
   * @return {Object}
   */
  validate(object = null, subSchema = null) {
    let schema = subSchema || this.schema
    let out = {}
    let isValid = true

    for (let field in schema) {
      let config = schema[field]

      if (config.extends) {
        let preset = PRESETS[config.extends]

        if (!preset) {
          throw new Error(`Fail to extend validation preset '${ config.extends }'`)
        }

        config = _.merge({ label: field, rules: [] }, preset, config)
      }

      out[field] = this.validateField(object[field], config.rules, config, object)

      if (!out[field].valid) { isValid = false }

      if (!config.schema) { continue }

      if (typeof object[field] !== 'object') {
        out[field] = { valid: false, error: 'Invalid schema' }
        isValid = false
        continue
      }

      let result = this.validate(object[field], config.schema)

      for (let key in config.schema) {
        let subKey = `${ field }.${ key }`

        out[subKey] = result[key]
      }

      if (!result.valid) { isValid = false }
    }

    out.valid = isValid

    return out
  }

  /**
   * Get blank validation Object with all errors and valid states set to null
   *
   * @param  {Object=} object
   * @return {Object}
   */
  getBlank(object) {
    let out = { valid: false }

    if (object) {
      out.valid = this.validate(object).valid
    }

    for (let field in this.schema) {
      out[field] = { valid: null, error: null }
    }

    return out
  }

  /**
   * Return validation Object for a single field
   *
   * @param  {*} value
   * @param  {Object} rules
   * @param  {Object} config
   * @param  {Object} values
   * @return {Object}
   */
  validateField(value, rules, config, values) {
    for (let ruleKey in rules) {
      let fn = RULES[ruleKey]

      if (!fn) {
        throw new Error(`Validation rule '${ ruleKey }' not recognised`)
      }

      let error = fn.call({ config, values }, value, rules[ruleKey])

      if (typeof error === 'object' && error.stopPropagation) {
        return { valid: true, error: null }
      }

      if (error) {
        return { valid: false, error }
      }
    }

    return { valid: true, error: null }
  }

  /**
   * Validate Object and returns first error message if available
   *
   * @param  {Object} object
   * @return {String|void}
   */
  getError(object) {
    let validation = this.validate(object)

    for (let key in validation) {
      if (validation[key].error) {
        return validation[key].error
      }
    }

    return null
  }

}

const RULES = {

  /**
   * Returns error message if String doesn't reach the specified length
   *
   * @param  {String} value
   * @param  {Number} min
   * @return {String|void}
   */
  minLength(value, min = 1) {
    if (!value || !value.length || value.length < min) {
      if (this.config.rules.type === 'string') {
        return `${ this.config.label } must be at least ${ min } characters long`
      }

      return `${ this.config.label } must have at least ${ min } entries`
    }
  },

  /**
   * Returns error message if String exceeds the specified length
   *
   * @param  {String} value
   * @param  {Number} max
   * @return {String|void}
   */
  maxLength(value, max = 150) {
    if (value && value.length && value.length > max) {
      return `${ this.config.label } cannot be longer than ${ max } characters`
    }
  },

  /**
   * Returns error message if value is falsy
   *
   * @param  {String} value
   * @param  {Boolean} isRequired
   * @return {String|void}
   */
  required(value, isRequired = true) {
    // Always return valid if false is falsy and set as `{ required: false }`
    if (isRequired === false && !value) { return { stopPropagation: true } }

    // Account for Boolean values, but don't accept falsy values otherwise
    if (this.config.rules.type === 'boolean' && value === false) { return }

    if (!value) {
      return `${ this.config.label } is required`
    }

    if (value instanceof Array && !value.length) {
      return `${ this.config.label } selection can\'t be empty`
    }
  },

  /**
   * Returns error message if value doesn't match given type
   *
   * @param  {String} value
   * @param  {String} type
   * @return {String|void}
   */
  type(value, type) {
    if (type === 'array') {
      if (value instanceof Array === false) {
        return `${ this.config.label } must be an Array`
      }
    } else {
      if (typeof value !== type) {
        let article = stringUtil.getArticle(type)
        type = stringUtil.upperFirst(type)
        return `${ this.config.label } must be ${ article } ${ type }`
      }
    }
  },

  /**
   * Returns error message if value doesn't match given matched value
   * or its returned value, in case it's a function
   *
   * @param  {String} value
   * @param  {*} matchTo
   * @return {String|void}
   */
  match(value, matchTo) {
    if (typeof matchTo === 'function') {
      matchTo = matchTo.call(this)
    }

    if (value !== matchTo) {
      return `${ this.config.label } must match`
    }
  },

  /**
   * Returns error message if value doesn't test positively against given regex
   *
   * @param  {String} value
   * @param  {RegExp|String} exp
   * @return {String|void}
   */
  regex(value, exp) {
    exp = exp instanceof RegExp ? exp : REGEXES[exp.toUpperCase()]

    if (!exp) {
      throw new Error(`Regex with key '${ exp }' not found`)
    }

    if (!value || typeof value !== 'string' || !exp.test(value)) {
      return `Must be a valid ${ this.config.label }`
    }
  },

  /**
   * Returns error message if value doesn't equal one of the given choices
   *
   * @param  {*} value
   * @param  {[*]} allowedValues
   * @return {String|void}
   */
  oneOf(value, allowedValues) {
    if (allowedValues.indexOf(value) === -1) {
      return `${ this.config.label } must be one of: ${ allowedValues.join(', ') }`
    }
  },

  /**
   * Returns error message if value doesn't equal one of the given choices
   *
   * @param  {[*]} values
   * @param  {[*]} allowedValues
   * @return {String|void}
   */
  manyOf(values, allowedValues) {
    if (values instanceof Array === false) { return }

    for (let value of values) {
      if (allowedValues.indexOf(value) === -1) {
        return `${ this.config.label } can only contain the following values: ${ allowedValues.join(', ') }`
      }
    }
  },

  /**
   * Run custom function and return custom error message if passed - params must
   * be an Array formed by [ function, errorMessage ]
   *
   * @param  {*} value
   * @param  {[Function,String]} params
   * @return {String|void}
   */
  custom(value, params) {
    let [ fn, message ] = params

    // Evaluate message if a function is passed
    if (typeof message === 'function') {
      message = message.apply(this, arguments)
    }

    if (!fn(value)) { return message }
  }

}