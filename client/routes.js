const router = require('./core/router')
const { basePath } = require('./config')

/**
 * App Routes
 *
 * Routes for all app views
 */

router

// Signup page
.add(`${ basePath }sign-in`, {
  title      : 'Sign-in',
  controller : require('./view/auth/signin'),
  template   : require('./view/auth/signin.pug'),
  loggedIn   : false
})

// Dashboard
.add(`${ basePath }`, {
  title      : 'Dashboard',
  template   : require('./view/dashboard.pug'),
  loggedIn   : true
})

// Type entries > List
.add(`${ basePath }:type/list`, {
  id         : 'type-list',
  title      : 'Entries > List',
  controller : require('./view/type/list'),
  template   : require('./view/type/list.pug'),
  loggedIn   : true
})
.add(`${ basePath }:type/list/page-:page`, {
  extends    : 'type-list'
})

// Type entries > Add
.add(`${ basePath }:type/add`, {
  id         : 'form',
  title      : 'Entries > Add',
  controller : require('./view/type/form'),
  template   : require('./view/type/form.pug'),
  loggedIn   : true
})

// Type entries > Edit
.add(`${ basePath }:type/edit/:id`, {
  extends    : 'form',
  title      : 'Entries > Edit',
  loggedIn   : true
})

// User settings
.add(`${ basePath }user/settings`, {
  title      : 'User settings',
  controller : require('./view/users/settings'),
  template   : require('./view/users/settings.pug'),
  loggedIn   : true
})

// Edit website statics
.add(`${ basePath }statics`, {
  title      : 'Website statics',
  controller : require('./view/statics'),
  template   : require('./view/statics.pug'),
  loggedIn   : true
})

// 404
.add(`${ basePath }404`, {
  title      : 'Not found',
  template   : require('./view/404.pug')
})

router.otherwise(`${ basePath }404`)