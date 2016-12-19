/**
 * Browser utility
 *
 * Exports utility methods to detect browser types and versions from userAgent
 */

/**
 * Returns true if is IE browser equal or below given version
 *
 * @param  {Number} version
 * @return {Boolean}
 */
function isIeEqualOrBelow(version) {
  let v

  if (navigator.userAgent.indexOf('MSIE') === -1 || window.ActiveXObject === undefined) {
    v = null
  } else if (!document.querySelector) {
    v = 7
  } else if (!document.addEventListener) {
    v = 8
  } else if (!window.atob) {
    v = 9
  } else if (!document.__proto__) {
    v = 10
  } else {
    v = 11
  }

  return v && v <= version
}

/**
 * Returns true if is Opera Mini browser
 *
 * @return {Boolean}
 */
function isOperaMini() {
  return navigator.userAgent.indexOf('Opera Mini') !== -1
}

module.exports = { isIeEqualOrBelow, isOperaMini }