const qs = require('querystring')
const {send, text} = require('micro')
const got = require('got')
const stock = require('lagden-stock-quote')
const slackBody = require('./template')
const isValid = require('./lib/valid')

async function quote(req, res) {
	try {
		// Parse do Post do Slack
		const post = await text(req)
		const data = qs.parse(post)

		// Verifica se o token do Slack é válido
		if (isValid(data) === false) {
			const err = new Error('Token inválido')
			err.statusCode = 401
			throw err
		}

		// Responde para o Slack dizendo que está processando
		send(res, 200, {
			response_type: 'ephemeral',
			text: `:hourglass: buscando ação...`
		})

		// Faz a consulta no serviço
		const consulta = await stock(data.text)

		// Faz um post da resposta para o Slack
		await got.post(data.response_url, {
			json: true,
			body: {
				response_type: 'in_channel',
				text: slackBody(consulta)
			}
		})
	} catch (err) {
		// Responde o erro
		send(res, err.statusCode || 404, {
			response_type: 'ephemeral',
			text: `✖ ${err.message}`
		})
	}
}

// Evita inatividade
setInterval(() => {
	got.post('https://slash-cotacao.herokuapp.com', {
		form: true,
		body: {
			token: process.env.token,
			text: 'vale5'
		}
	})
		.then(console.log)
		.catch(console.error)
}, 60 * 1000)

module.exports = quote
