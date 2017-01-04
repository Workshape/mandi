/**
 * Modals index
 *
 * Exports all available Modal presets
 */

module.exports = {

  'confirm' : {
    template   : require('./confirm.pug'),
    controller : require('./confirm')
  },

  'alert'  : {
    template   : require('./alert.pug'),
    controller : require('./alert')
  }

}