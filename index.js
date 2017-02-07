const {spawn} = require('child_process')
const {join} = require('path')
const qs = require('querystring')
const url = require('url')
const {send} = require('micro')
const microCors = require('micro-cors')
const compress = require('micro-compress')
const got = require('got')
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

async function after(data) {
	const consulta = await stock(data.text)
	got
		.post(data.response_url, {
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				response_type: 'ephemeral',
				text: slackBody(consulta)
			}),
			followRedirect: false
		})
		.then(res => {
			process.stdout.write(res.status)
		})
		.catch(err => {
			process.stdout.write(err.message)
		})
}

async function quote(req, res) {
	try {
		const post = await streamToPromise(req)
		const data = qs.parse(post.toString('utf8'))
		const checked = await check(data)
		if (checked) {
			after(data)
		}
		send(res, 200, "localizando a cotação...")
	} catch (err) {
		send(res, 400, err.message)
	}
}

module.exports = cors(compress(quote))
