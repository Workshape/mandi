const color = require('cli-color')
const moment = require('moment')

/**
 * Log util
 *
 * Exports methods to log various events in standardised fashion
 */

module.exports = function (nimda) {
  var lastLoggedTime = ''
  var { log } = console

  return { task, info, warn, time, log }

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

    time()

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

    nimda.util.log.log(`${ prefix }${ color.whiteBright(message) }`)
  }

  /**
   * Log single piece of information - e.g. a Number or String
   *
   * @param  {String} label
   * @param  {*} value
   */
  function info(label, value) {
    let prefix = color.yellow('-') + ' '

    time()

    nimda.util.log.log(
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
    time()

    nimda.util.log.log(color.yellow(`[!] ${ message }`))
  }

  /**
   * Log current time (If different from last logged)
   *
   * @return {void}
   */
  function time() {
    let time = `[ ${ moment().format('ddd DD-MM-YYYY HH:mm') } ]`
    if (lastLoggedTime === time) { return }
    lastLoggedTime = time
    nimda.util.log.log(color.blackBright(time))
  }

}