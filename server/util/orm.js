const db = require('../access/db')

/**
 * ORM utility
 *
 * Exports helpers that help preventing repetition in orm methods
 */

const PAGINATION_DEFAULTS = { LIMIT: 20, SORT: '-id' }

/**
 * Get paginated listings from given collection - called form a controller
 *
 * @param  {String} collection
 * @param  {String=} namespace
 * @param  {Object=} filter
 * @param  {Function=} decorate
 * @return {Promise}
 */
function getPaginated(collection, namespace = 'entries', filter = {}, decorate = null) {
  let page = parseInt(this.param('page', 1), 10)
  let limit = parseInt(this.param('limit', PAGINATION_DEFAULTS.LIMIT), 10)
  let sort = parseSortingString(this.param('sort', PAGINATION_DEFAULTS.SORT))

  return db.count(collection)
  .then(count => {
    let pages = Math.ceil(count / limit)

    if (page > pages) { page = pages }
    if (page < 1) { page = 1 }

    let isFirst = page <= 1
    let isLast = page >= pages
    let out = { pagination: { page, pages, isFirst, isLast } }
    let skip = (page - 1) * limit

    return db.find(collection, filter, { sort, limit, skip })
    .toArray()
    .then(results => {
      // Run default results decoration
      results.forEach(result => {
        if (result._id) {
          result.id = result._id
          delete result._id
        }
      })

      // Output results
      out[namespace] = decorate ? results.map(decorate) : results

      this.body = out
    })
  })
}

/**
 * Get page ay which entry is found for given collection
 *
 * @param  {String} collection
 * @param  {String} id
 * @return {Promise}
 */
function getEntryPageById(collection, id) {
  let limit = parseInt(this.param('limit', PAGINATION_DEFAULTS.LIMIT), 10)
  let sort = parseSortingString(this.param('sort', PAGINATION_DEFAULTS.SORT))

  return db.find(collection, {}, { _id: 1 })
  .sort(sort)
  .toArray()
  .then(ids => {
    ids = ids.map(val => String(val._id))
    let index = ids.indexOf(String(id))
    return Math.floor(index / limit) + 1
  })
}

/**
 * Convert sorting String to Object (e.g. `-created` -> `{ created: -1 }`)
 *
 * @param  {String} str
 * @return {Object}
 */
function parseSortingString(str) {
  if (!str) { return { id: -1 } }

  let out = {}
  let order = 1

  if (str.substr(0, 1) === '-') {
    order = -1
    str = str.substr(1)
  }

  if (str === 'id') { str = '_id' }

  out[str] = order

  return out
}

module.exports = { getPaginated, getEntryPageById }