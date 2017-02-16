/**
 * Confirm modal controller
 *
 * Exports controller for confirm modal
 */

const scope = {
  title       : null, // Question user is asked confirm
  text        : null, // Additional explanation text
  confirmText : null, // Confirmation button label
  dangerous   : false // Default to Cancel instead of Ok if set to true
}

module.exports = { scope }