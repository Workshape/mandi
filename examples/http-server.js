const Nimda = require('../lib/Nimda')
const http = require('http')

/**
 * Examples > HTTP server
 *
 * Mount a Nimda instance on a HTTPServer using the `middleware()` method
 */

// Create a simple configuration
let config = {
  mongo     : { url: 'mongodb://localhost/nimda-cms' },
  basePath  : '/admin',
  publicUrl : 'http://localhost:8000/admin'
}
let schema = {
  title: 'My simple blog',
  types: {
    posts: {
      label: 'Post',
      schema: {
        cover: { extends: 'image', label: 'Cover' },
        name: { extends: 'name' },
        content: { extends : 'content' }
      }
    }
  },
  statics: {
    title: { extends: 'title', label: 'Website title' },
    description: { extend: 'content', label: 'Website description' }
  }
}

// Instanciate Nimda
let nimda = new Nimda(config, schema)

// Instanciate a HTTPServer using Nimda's middleware function
let server = http.createServer(nimda.middleware())

// Start server on port 8000
server.listen(8000)

// The Nimda interface should now be available at localhost:8000/admin
nimda.util.log.info('Running Nimda on', 'http://localhost:8000/admin')