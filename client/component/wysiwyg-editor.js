const Vue = require('vue/dist/vue.js')
const template = require('./wysiwyg-editor.pug')()
const Quill = require('quill')

/**
 * Wysiwyg Editor component
 *
 * Display and binds QUILL editor
 */

Vue.component('wysiwyg-editor', {
  template,
  props   : [ 'value' ],
  methods : { init, textChange },
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
        [ 'blockquote', 'code-block' ],
        [ { 'align': [] } ],
        [ 'clean' ]
      ],
      history : true
    },
    theme: 'snow'
  })

  if (this.value && this.value !== '') {
    this._editor.pasteHTML(this.value)
  }

  this._editor.on('text-change', this.textChange)
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