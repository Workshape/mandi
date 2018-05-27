const Vue = require('vue/dist/vue.js')
const template = require('./wysiwyg-editor.pug')()
const Quill = require('quill')
const domUtil= require('../util/dom')

/**
 * Wysiwyg Editor component
 *
 * Display and binds QUILL editor
 */

Vue.component('wysiwyg-editor', {
  template,
  props   : [ 'value' ],
  data    : () => ({ fullscreen: false }),
  methods : { init, textChange, toggleFullscreen },
  mounted,
  beforeDestroy
})

/**
 * Run initialisation with starting values
 *
 * @return {void}
 */
function mounted() {
  // Next tick..
  setTimeout(() => this.init())
}

/**
 * Initialise component
 *
 * @return {void}
 */
function init() {
  if (!this.$refs.editor) { return }

  this._editor = new Quill(this.$refs.editor, {
    modules: {
      toolbar: [
        [ 'bold', 'italic', 'underline', 'strike' ],
        [ 'link', 'image' ],
        [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
        [ { 'color': [] } ],
        [ 'blockquote', 'code-block' ],
        [ { 'align': [] } ],
        [ 'clean' ],
        [ { 'list': 'ordered'}, { 'list': 'bullet' } ],
        [ 'full-screen' ],
      ],
      history : true
    },
    theme: 'snow'
  })

  var toolbar = this._editor.getModule('toolbar');

  if (this.value && this.value !== '') {
    this._editor.pasteHTML(this.value)
  }

  this._editor.on('text-change', this.textChange)

  const fullScreenButton = this.$el.querySelector('.ql-full-screen')

  fullScreenButton.addEventListener('click', e => this.toggleFullscreen())
}

/**
 * Handle Quill editor's text change event
 *
 * @return {void}
 */
function textChange() {
  let value = this._editor.container.firstChild.innerHTML

  if (value === '<p><br></p>') { value = '' }

  this.$emit('input', { target: { value } })
}

/**
 * Destroy Quill instance before component is removed
 *
 * @return {void}
 */
function beforeDestroy() {
  if (!this._editor) { return }
  this._editor.off('text-change', this.textChange)
}

/**
 * Toggle fullscreen mode
 *
 * @return {void}
 */
function toggleFullscreen() {
  const state = this.fullscreen = !this.fullscreen
  domUtil.toggleClass(document.body, 'show-overlay', state)
}