/**
 * Cookie Parser util
 *
 * Export methods to parse / serialize cookies
 */

/**
 * Parse cookie String to Object
 *
 * @param  {String=} str
 * @return {Object}
 */
function parse(str = null) {
  let out = {}

  if (!str) { return out }

  escape(str)
  .split(';')
  .forEach(part => {
    let parts = part.split('=').map(s => s.trim())
    let key = parts.splice(0, 1)[0]
    let value = parts.join('=')

    out[unescape(key)] = unescape(value)
  })

  return out
}

/**
 * Serialize Object to cookie format
 *
 * @param  {Object=} obj
 * @return {String}
 */
function serialize(obj = {}) {
  return Object.keys(obj)
  .map(key => `${ key }=${ obj[key] || '' }`)
  .join('; ') + ';'
}

/**
 * Escape equals and semicolons
 *
 * @param  {String} str
 * @return {String}
 */
function escape(str) {
  return str.replace(/\\"/g, '{{ DQ }}')
  .replace(/\\'/g, '{{ SQ }}')
  .replace(/"[^"]*"/g, quoted => {
    return quoted
    .replace(/;/g, '{{ SC }}')
    .replace(/=/g, '{{ EQ }}')
  })
}

/**
 * Unescape equals and semicolons
 *
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
  return str
  .replace(/{{ DQ }}/g, '\"')
  .replace(/{{ SQ }}/g, '\'')
  .replace(/{{ SC }}/g, ';')
  .replace(/{{ EQ }}/g, '=')
}

module.exports = { parse, serialize }