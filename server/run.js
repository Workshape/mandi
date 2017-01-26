const config = require('config')
const Nimda = require('./Nimda')

new Nimda(config, {})
.app.listen(4000)