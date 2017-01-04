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

// Type entries > List
.add('/:type/list', {
  id         : 'type-list',
  title      : 'Entries > List',
  controller : require('./view/type/list'),
  template   : require('./view/type/list.pug')
})
.add('/:type/list/page-:page', {
  extends    : 'type-list'
})

// Type entries > Add
.add('/:type/add', {
  id         : 'form',
  title      : 'Entries > Add',
  controller : require('./view/type/form'),
  template   : require('./view/type/form.pug')
})

// Type entries > Edit
.add('/:type/edit/:id', {
  extends    : 'form',
  title      : 'Entries > Edit'
})

// 404
.add('/404', {
  title      : 'Not found',
  template   : require('./view/404.pug')
})

.otherwise('/404')