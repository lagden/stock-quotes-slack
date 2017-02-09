const qs = require('querystring')
const {send} = require('micro')
const microCors = require('micro-cors')
const compress = require('micro-compress')
const streamToPromise = require('stream-to-promise')
const stock = require('lagden-stock-quote')
const slackBody = require('./template')

const cors = microCors({allowMethods: ['POST']})

let token = process.env.token || false
let token2 = process.env.token2 || false

function check(data) {
	if (data && data.token && (data.token === token || data.token === token2)) {
		return Promise.resolve(true)
	}
	return Promise.reject(new Error('Token inválido'))
}

async function quote(req, res) {
	try {
		const post = await streamToPromise(req)
		const data = qs.parse(post.toString('utf8'))
		const checked = await check(data)
		const consulta = await stock(data.text)
		send(res, 200, {
			response_type: 'in_channel',
			text: slackBody(consulta)
		})
	} catch (err) {
		send(res, 400, {
			response_type: 'in_channel',
			text: `✖ ${err.message}`
		})
	}
}

module.exports = cors(compress(quote))
