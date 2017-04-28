const Promise = require('bluebird')
const _ = require('lodash')
const Validator = require('../../common/util/Validator')

/**
 * Types controllers
 *
 * Exports controllers related to types
 */

const UPLOADABLES = {
  file  : null,
  image : [ 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml' ]
}

module.exports = function (mandi) {
  return { list, getById, save, update, remove, move, clone }

  /**
   * List entries for given type
   *
   * @return {void}
   */
  function * list() {
    let schemas = yield mandi.schema.types
    let type = this.param('type')

    if (!schemas[type]) { return this.throw(400, 'Invalid Type') }

    this.params.sort = '-_i'

    yield mandi.util.orm.getPaginated.call(this, type, 'entries', {}, entry => {
      return decorateEntry(entry, schemas[type])
    })
  }

  /**
   * Get single entry by id
   *
   * @return {void}
   */
  function * getById() {
    let schemas = mandi.schema.types
    let type = this.param('type')
    let id = this.param('id')

    // Type should be always defined as it's a param - but just to be sure..
    if (!id) { return this.throw(400, 'Missing id') }

    // Make sure schema exists
    let schema = schemas[type]
    if (!schema) { return this.throw(400, 'Invalid type') }

    // Make sure entry exists
    let entry = yield mandi.db.findOne(type, { _id: id })
    if (!entry) { return this.throw(404, `${ schema.label } not found`)}

    // Store a copy of the unmodified entry (used by other controllers)
    this._entry = _.cloneDeep(entry)

    // Move `_id` to `id`
    entry.id = entry._id
    delete entry._id
    delete entry._i

    // Attach variables to controller that will be re-used by other controllers
    this.entry = decorateEntry(entry, schema)
    this.schema = schema

    // Respond with entry
    this.body = { entry: this.entry }

    // Add page if requested
    if (this.request.query.page) {
      this.params.sort = '-_i'
      this.body.page = yield mandi.util.orm
      .getEntryPageById.call(this, type, entry.id)
    }
  }

  /**
   * Save entry for type
   *
   * @return {void}
   */
  function * save() {
    let schemas = mandi.schema.types
    let type = this.param('type')

    // Make sure schema exists
    this.schema = schemas[type]
    if (!this.schema) { return this.throw(400, 'Invalid Type') }

    // Form entry Object from values selected from request payload
    let keys = Object.keys(this.schema.schema)
    let entry = _.pick(this.request.body, keys)

    // Run validation
    let validator = new Validator(this.schema.schema)
    let validationError = validator.getError(entry)
    if (validationError) { return this.throw(400, validationError) }

    // Add _i increment
    let incr = yield getIncrement(type)
    entry._i = incr ? (incr._i || 0) + 1 : 0

    // Add date fields
    entry._created = entry._lastUpdated = new Date()

    // Save entry to DB
    yield mandi.db.insert(type, entry)

    // Upload attachments if present and specified in schema
    yield addFiles.call(this, entry, true)

    // Respond positively
    this.body = { success: true, entry: decorateEntry(entry, this.schema) }
  }

  /**
   * Update entry by id
   *
   * @return {void}
   */
  function * update() {
    let type = this.param('type')
    let removeFiles = []

    // Get entry by id
    yield getById.apply(this, arguments)

    // Form entry Object from values selected from request payload
    let keys = Object.keys(this.schema.schema)
    .filter(key => {
      let type = this.schema.schema[key].type
      let isUploadable = _.includes(Object.keys(UPLOADABLES), type)

      // Store file fields to be removed if passed as null
      if (
        isUploadable &&
        this.request.body[key] === null &&
        this._entry[key] &&
        this._entry[key].path
      ) {
        removeFiles.push(key)
      }

      return !isUploadable
    })

    let props = _.pick(this.request.body, keys)

    for (let key of removeFiles) {
      try {
        yield mandi.file.remove(this._entry[key].path)
      } catch (e) {
        // Suppress errors as the upload method may have changed
      }

      props[key] = this._entry[key].path
    }

    // Extend current entry data with payload properties
    _.extend(this.entry, props)

    // Run validation
    let validator = new Validator(this.schema)
    let validationError = validator.getError(this.entry)
    if (validationError) { return this.throw(400, validationError) }

    // Upload attachments if present and specified in schema
    props._id = this.entry.id
    yield addFiles.call(this, props, false)
    delete props._id

    // Add date created
    props._lastUpdated = new Date()

    // Update entry
    yield mandi.db.updateOne(type, { _id: this.entry.id }, { $set: props })

    // Respond successfully
    this.body = { success: true, entry: decorateEntry(this.entry, this.schema) }
  }

  /**
   * Delete entry by id
   *
   * @return {void}
   */
  function * remove() {
    let type = this.param('type')

    // Get entry by id
    yield getById.apply(this, arguments)

    // Remove all entry's uploadables
    for (let key of Object.keys(this.schema.schema)) {
      let type = this.schema.schema[key].type
      let isUploadable = _.includes(Object.keys(UPLOADABLES), type)

      if (
        !this.schema.softDelete &&
        isUploadable &&
        this._entry[key] &&
        this._entry[key].path
      ) {
        try {
          yield mandi.file.remove(this._entry[key].path)
        } catch (e) {
          // Suppress errors as the upload method may have changed
        }
      }
    }

    let filter = { _id: this.entry.id }

    if (this.schema.softDelete) {
      // Soft delete entry (if enabled on the type)
      yield mandi.db.updateOne(type, filter, { $set: { _deleted: true } })
    } else {
      // Hard delete entry
      yield mandi.db.remove(type, filter)
    }

    // Respond successfully
    this.body = { success: true }
  }

  /**
   * Upload files if passed to controller and present in schema
   *
   * @param  {Object} entry
   * @param  {Boolean=} save
   * @return {void}
   */
  function * addFiles(entry, save = false) {
    let type = this.param('type')
    let { files } = this.request
    let props = {}
    let allowedFields = Object.keys(UPLOADABLES)

    for (let key of Object.keys(files)) {
      let fieldType = this.schema.schema[key].type
      let file = files[key]

      if (this.schema.schema[key] && _.includes(allowedFields, fieldType)) {
        let options = { addExtension: true }
        let allowedMimes = UPLOADABLES[fieldType]
        let path = `${ type }/${ entry._id }/${ key }`
        let { label } = this.schema.schema[key]

        if (allowedMimes) { options.allowedTypes = allowedMimes }

        try {
          yield mandi.image.applyTransformations(file, this.schema.schema[key])

          let meta = yield mandi.image.getMeta(file)
          let uploaded = yield mandi.file.upload(file, path, options)

          props[key] = _.extend(uploaded, meta)
        } catch (err) {
          return this.throw(400, `Error uploading ${ label }: ${ err }`)
        }
      }
    }

    // Extend current entry
    _.extend(entry, props)

    // Update entry if instructed to
    if (save && Object.keys(props).length) {
      yield mandi.db.updateOne(type, { _id: entry._id }, { $set: props })
    }
  }

  /**
   * Decorate given entry for output
   *
   * @param  {Object} entry
   * @param  {Object} schema
   * @return {Object}
   */
  function decorateEntry(entry, schema) {
    entry = _.cloneDeep(entry)

    for (let key of Object.keys(schema.schema)) {
      let val = entry[key]
      let fieldType = schema.schema[key].type

      // Ensure all schema keys are set
      entry[key] = val || null

      // Replace uploadable values to URL strings
      if (Object.keys(UPLOADABLES).indexOf(fieldType) !== -1 && val) {
        entry[key] = val.url || null
      }
    }

    entry.id = entry.id || entry._id
    delete entry._id
    delete entry._i

    return entry
  }

  /**
   * Move entry up / down
   *
   * @return {void}
   */
  function * move() {
    let type = this.param('type')
    let dir = this.param('dir')
    let adjacent

    // Validate direction (only 'up' and 'down' are allowed)
    if (dir !== 'up' && dir !== 'down') {
      return this.throw(404, 'Endpoint not found')
    }

    // Get entry by id
    yield getById.apply(this, arguments)

    // Get adjacent entry
    if (dir === 'up') {
      adjacent = yield mandi.db
      .collection(type)
      .find({
        _deleted : { $ne: true },
        _i       : { $gt: this._entry._i }
      }, { _i: 1, _id: 1 })
      .sort({ _i: 1 })
      .limit(1)
      .next()
    } else {
      adjacent = yield mandi.db
      .collection(type)
      .find({
        _deleted : { $ne: true },
        _i       : { $lt: this._entry._i }
      }, { _i: 1, _id: 1 })
      .sort({ _i: -1 })
      .limit(1)
      .next()
    }

    // Respond with error if it's the first / last entry
    if (!adjacent) { return this.throw(403, `Cannot move further ${ dir }`) }

    // Swap index
    yield Promise.all([
      mandi.db.update(type, { _id: this._entry._id }, { $set: { _i: adjacent._i } }),
      mandi.db.update(type, { _id: adjacent._id }, { $set: { _i: this._entry._i } })
    ])

    // Respond successfully
    this.body = { success: true, index: adjacent._i }
  }

  /**
   * Clone entry by id
   *
   * @return {void}
   */
  function * clone() {
    let type = this.param('type')

    // Get entry by id
    yield getById.apply(this, arguments)

    // Remove `_id` and change `_i` increment value
    delete this._entry._id
    this._entry._i = yield getIncrement(type)

    // Store in db
    let result = yield mandi.db.insert(type, this._entry)

    // Get entry by id
    this.params.id = result.ops[0]._id
    yield getById.apply(this, arguments)
  }

  /**
   * Resolve `_i` increment for given collection
   *
   * @param  {String} collection
   * @return {Number}
   */
  function getIncrement(collection) {
    return mandi.db.collection(collection)
    .find({ _deleted: { $ne: true } }, { _i: 1 })
    .sort({ _i: -1 })
    .limit(1)
    .next()
  }

}
