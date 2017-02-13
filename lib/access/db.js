const { MongoClient, ObjectID } = require('mongodb')
const Promise = require('bluebird')

/**
 * DB module
 *
 * Callback wrapper to evented mongoose connection using app config
 */

module.exports = function (mandi) {
  var db = false

  return {
    connect,
    collection : wrapped('collection'),
    insert     : wrapped('insert', true),
    update     : wrapped('update', true),
    updateOne  : wrapped('updateOne', true),
    find       : wrapped('find', true),
    remove     : wrapped('remove', true),
    findOne    : wrapped('findOne', true),
    count      : wrapped('count', true)
  }

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
      if (verbose) { mandi.util.log.task('Connecting to database..', 0) }
      MongoClient.connect(mandi.config.mongo.url)
      .then(result => {
        db = result
        if (verbose) { mandi.util.log.task('Connected', 1) }
        resolve(db)
      })
      .catch(err => {
        if (verbose) { mandi.util.log.task('Failed to connect to database', 2) }
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
        return collection[key].apply(collection, processArguments(args.slice(1)))
      }

      return db[key].apply(db, processArguments(args))
    }
  }

  /**
   * Process query arguments - convert all _id named properties in BSON ObjectIds
   *
   * @param  {[*]} args
   * @return {[*]}
   */
  function processArguments(args) {
    args.forEach(arg => {
      if (typeof arg === 'object' && arg instanceof Array === false) {
        // Convert _id properties
        if (arg._id) {
          arg._id = new ObjectID(arg._id)
        }
      }
    })

    return args
  }

}