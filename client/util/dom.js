/**
 * DOM utility
 *
 * Exports handy methods to work with DOM elements
 */

 /**
  * Get elements matching given selector in Array forma as opposed to NodesList
  *
  * @param  {String} selector
  * @param  {DOMNode=} parent
  * @return {[DOMNode]}
  */
function getElements(selector, parent = document) {
  return Array.prototype.slice.call(parent.querySelectorAll(selector))
}

/**
 * Returns true if element has given className
 *
 * @param  {HTMLElement} element
 * @return {Boolean}
 * @return {void}
 */
function hasClass(element, className) {
  return element.className.split(' ').indexOf(className) !== -1
}

/**
 * Removes class from element if it currently has it
 *
 * @param  {HTMLElement} element
 * @param  {String} className
 * @return {void}
 */
function removeClass(element, className) {
  if (!hasClass(element, className)) { return }

  let classNames = element.className.split(' ')

  classNames.splice(classNames.indexOf(className), 1)
  element.className = classNames.join(' ')
}

/**
 * Adds class to element if doesn't currently have it
 *
 * @param  {HTMLElement} element
 * @param  {String} className
 * @return {void}
 */
function addClass(element, className) {
  if (hasClass(element, className)) { return }

  element.className += ' ' + className
}

/**
 * Toggles class on element - adds it or removes it if a state value is passed
 * depending wether it's truthy of not
 *
 * @param  {HTMLElement} element
 * @param  {String} className
 * @param  {Boolean=} state
 * @return {void}
 */
function toggleClass(element, className, state = null) {
  state = typeof state === 'boolean' ? state : !hasClass(element, className)

  let fn = state ? addClass : removeClass

  fn(element, className)
}

module.exports = { getElements, hasClass, addClass, removeClass, toggleClass}