const qs = require('querystring')
const {send, text} = require('micro')
const got = require('got')
const stock = require('lagden-stock-quote')
const template = require('./template')
const isValid = require('./lib/valid')

function asyncCall(data) {
	// Faz a consulta no serviço
	stock(data.text)
		// Faz um post da resposta para o Slack
		.then(consulta => got.post(data.response_url, {
			json: true,
			body: {
				response_type: 'in_channel',
				text: template(consulta)
			}
		.catch(err => {
			console.error(err.message)
		})
	}))
}

async function quote(req, res) {
	try {
		// Parse do Post do Slack
		const post = await text(req)
		const data = qs.parse(post)

		// Verifica se o token do Slack é válido
		if (isValid(data.token) === false) {
			const err = new Error('Token inválido')
			err.statusCode = 401
			throw err
		}

		// Responde para o Slack dizendo que está processando
		send(res, 200, {
			response_type: 'ephemeral',
			text: `:hourglass: buscando ação...`
		})

		// Consulta e Posta
		asyncCall(data)
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
	got
		.post('https://slash-cotacao.herokuapp.com', {
			form: true,
			body: {
				token: process.env.token,
				text: 'vale5'
			}
		})
		.then(res => {
			console.log(res)
		})
		.catch(err => {
			console.error(err.message)
		})
}, 60 * 1000)

module.exports = quote
