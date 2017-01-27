const Nimda = require('../server/Nimda')
const http = require('http')

let config = { mongo: { url: 'mongodb://localhost/nimda-cms' } }
let fn = new Nimda(config, {}).middleware()
let server = http.createServer(fn)

server.listen(8000)