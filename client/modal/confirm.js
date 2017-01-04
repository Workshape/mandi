/**
 * Confirm modal controller
 *
 * Exports controller for confirm modal
 */

const scope = {
  title     : null, // Question user is asked confirm (required)
  text      : null, // Additional explanation text (optonal)
  dangerous : false // Default to Cancel instead of Ok if set to true (optonal)
}

module.exports = { scope }