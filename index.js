const {spawn} = require('child_process')
const {join} = require('path')
const qs = require('querystring')
const url = require('url')
const {send} = require('micro')
const microCors = require('micro-cors')
const compress = require('micro-compress')
const streamToPromise = require('stream-to-promise')
const got = require('got')

// require('now-logs')('chuchu-blz')
let token = process.env.token || false
let token2 = process.env.token2 || false

const bin = join(__dirname, 'node_modules', 'lagden-stock-quote-cli', 'cli.js')
const cors = microCors({allowMethods: ['POST', 'GET']})

function check(data) {
	if (data && data.token && (data.token === token || data.token === token2)) {
		return Promise.resolve()
	}
	return Promise.reject(new Error('Token inválido'))
}

async function delayed(data) {
	const infobuf = await streamToPromise(spawn(bin, [data.text]).stdout)
	const info = infobuf.toString('utf8')
	got
		.post(data.response_url, {
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				response_type: 'in_channel',
				text: "```\n" + info + "\n```"
			}),
			followRedirect: false
		})
		.then(res => {
			process.stdout.write('ok')
		})
		.catch(err => {
			process.stdout.write(err.message)
		})
}

async function quote(req, res) {
	try {
		const post = await streamToPromise(req)
		const data = qs.parse(post.toString('utf8'))
		await check(data)
		delayed(data)
		send(res, 200, "localizando o papel...")
	} catch (err) {
		send(res, 400, err.message)
	}
}

module.exports = cors(compress(quote))
