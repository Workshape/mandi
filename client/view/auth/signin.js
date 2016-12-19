const api = require('../../core/api')
const error = require('../../core/error')
const auth = require('../../core/auth')
const router = require('../../core/router')

/**
 * Sign in page controller
 *
 * Controller module for Signin page
 */

const scope = {
  data       : {
    username       : '',
    password       : '',
    passwordRepeat : ''
  },
  success    : false
}
const methods = { submit }

/**
 * Controller is ready
 *
 * @param  {Object} req
 * @return {void}
 */
function ready(req) {
  this.redirectTo = req.queryParams.redirect

  this.$watch('data', () => {
    this.error = null
  }, { deep: true })
}

/**
 * Submit form, register new user
 *
 * @return {void}
 */
function submit() {
  if (this.loading) { return }

  this.error = null
  this.loading = true

  let { username, password } = this.data

  api.auth.login({ username, password }).then(res => {
    let { token } = res.body

    return auth.setToken(token).then(() => {
      router.goTo(this.redirectTo || '/')
    })
    .catch(error.handle)
  }, res => {
    this.error = res.body
    this.loading = false
  })
  .catch(error.handle)
}

module.exports = { ready, scope, methods }