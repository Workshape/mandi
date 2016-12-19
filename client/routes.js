const router = require('./core/router')

/**
 * App Routes
 *
 * Routes for all app views
 */

router

// Signup page
.add('/sign-in', {
  title      : 'Sign-in',
  controller : require('./view/auth/signin'),
  template   : require('./view/auth/signin.pug'),
  loggedIn   : false
})

// Dashboard
.add('/', {
  title      : 'Dashboard',
  template   : require('./view/dashboard.pug'),
  loggedIn   : true
})

// Type > list
.add('/type/:type', {
  title      : 'Type > List',
  controller : require('./view/type/list'),
  template   : require('./view/type/list.pug')
})


// 404
.add('/404', {
  title      : 'Not found',
  template   : require('./view/404.pug')
})

.otherwise('/404')