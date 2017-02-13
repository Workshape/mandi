const Mandi = require('../lib/Mandi')
const http = require('http')

/**
 * Examples > HTTP server
 *
 * Mount a Mandi instance on a HTTPServer using the `middleware()` method
 */

// Create a simple configuration
let config = {
  mongo     : { url: 'mongodb://localhost/mandi-cms' },
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

// Instanciate Mandi
let mandi = new Mandi(config, schema)

// Instanciate a HTTPServer using Mandi's middleware function
let server = http.createServer(mandi.middleware())

// Start server on port 8000
server.listen(8000)

// The Mandi interface should now be available at localhost:8000/admin
mandi.util.log.info('Running Mandi on', 'http://localhost:8000/admin')