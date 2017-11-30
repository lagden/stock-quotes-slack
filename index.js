'use strict'

const micro = require('micro')
const app = require('./app.js')

const {PORT = 3000} = process.env
const server = micro(app)

server.listen(PORT, () => {
	console.log(`Server listening on port ${server.address().port}`)
})
