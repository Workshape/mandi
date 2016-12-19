/**
 * Array util
 *
 * Exports useful methods to work with Arrays
 */

/**
 * Returns true if Array A contains at least one of values from Array B
 *
 * @param  {Array} arrayA
 * @param  {Array} arrayB
 * @return {Boolean}
 */
function containsOneOf(arrayA, arrayB) {
  return !!arrayB
  .map(value => arrayA.indexOf(value) !== -1)
  .filter(result => !!result)
  .length
}

module.exports = { containsOneOf }