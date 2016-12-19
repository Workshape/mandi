/**
 * Modals index
 *
 * Exports all available Modal presets
 */

module.exports = {

  'confirm': {
    template : require('./confirm.pug')
  },

  'alert': {
    template : require('./alert.pug')
  },

  'admin-location': {
    controller : require('./admin/location'),
    template   : require('./admin/location.pug')
  }

}