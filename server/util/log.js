const color = require('cli-color')
const moment = require('moment')

/**
 * Log util
 *
 * Exports methods to log various events in standardised fashion
 */

var lastLoggedTime = ''

/**
 * Log task message - statuses are:
 *
 * -1 - Title
 *  0 - Starting
 *  1 - Completed
 *  2 - Failed
 *
 * @return {void}
 */
function task(message, status = 0) {
  let prefix = ''

  logTime()

  if (status === -1) {
    prefix = color.cyan('+')
  } else if (status === 0) {
    prefix = color.blackBright('•')
  } else if (status === 1) {
    prefix = color.green('✔')
  } else if (status === 2) {
    prefix = color.red('✘')
  }

  if (prefix) { prefix += ' ' }

  console.log(`${ prefix }${ color.whiteBright(message) }`)
}

/**
 * Log single piece of information - e.g. a Number or String
 *
 * @param  {String} label
 * @param  {*} value
 */
function info(label, value) {
  let prefix = color.yellow('-') + ' '

  logTime()

  console.log(
    `${ prefix }${ color.whiteBright(label + ':') } ` +
    `${  color.white.bold.italic(value || '-') } `
  )
}

/**
 * Log warning message
 *
 * @param  {String} message
 * @return {void}
 */
function warn(message) {
  logTime()

  console.log(color.yellow(`[!] ${ message }`))
}

/**
 * Log current time (If different from last logged)
 *
 * @return {void}
 */
function logTime() {
  let time = `[ ${ moment().format('ddd DD-MM-YYYY HH:mm') } ]`
  if (lastLoggedTime === time) { return }
  lastLoggedTime = time
  console.log(color.blackBright(time))
}

module.exports = { task, info, warn, logTime }