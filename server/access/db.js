const { MongoClient } = require('mongodb')
const config = require('config')
const Promise = require('bluebird')
const log = require('../util/log')

/**
 * DB module
 *
 * Callback wrapper to evented mongoose connection using app config
 */

var db = false

/**
 * Connects to database and triggers callback in case of success or error -
 * Logs event if called with `verbose` set to true
 *
 * @param  {Function} callback
 * @param  {Boolean=} verbose
 * @return {Promise}
 */
function connect(verbose = true) {
  return new Promise((resolve, reject) => {
    if (db) { return resolve(db) }

    // Open MongoDB connection
    if (verbose) { log.task('Connecting to database..', 0) }
    MongoClient.connect(config.get('mongo.url'))
    .then(result => {
      db = result
      if (verbose) { log.task('Connected', 1) }
      resolve(db)
    })
    .catch(err => {
      if (verbose) { log.task('Failed to connect to database', 2) }
      return reject(err)
    })
  })
}

/**
 * Returns wrapped method that applies to current DB instance
 *
 * @param  {String} key
 * @param  {Boolean=} collectionMethod
 * @return {Function}
 */
function wrapped(key, collectionMethod = false) {
  return function () {
    let args = Array.from(arguments)

    if (collectionMethod) {
      let collection = db.collection(args[0])
      return collection[key].apply(collection, args.slice(1))
    }

    return db[key].apply(db, args)
  }
}

// Wrapped driver methods
const collection = wrapped('collection')
const insert = wrapped('insert', true)
const find = wrapped('find', true)
const remove = wrapped('remove', true)
const findOne = wrapped('findOne', true)
const count = wrapped('count', true)

module.exports = { connect, find, remove, findOne, collection, insert, count }