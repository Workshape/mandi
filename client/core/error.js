/**
 * Error module
 *
 * Centralised error handling module
 */

/**
 * Handle error
 *
 * @param  {Error} err
 * @return {void}
 */
function handle(err) {
  console.error('[ Handled ]', err.stack)
}

module.exports = { handle }