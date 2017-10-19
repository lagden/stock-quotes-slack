const qs = require('querystring')
const {send, text} = require('micro')
const got = require('got')
const stock = require('lagden-stock-quote')
const template = require('./template')
const isValid = require('./lib/valid')

async function _preConsulta(quote) {
	try {
		const consulta = await stock(quote)
		return {ok: true, data: consulta}
	} catch (err) {
		return {ok: false, data: err.message}
	}
}

function _consulta(data) {
	// Faz a consulta no serviço
	_preConsulta(data.text)
		// Faz um post da resposta para o Slack
		.then(res => got.post(data.response_url, {
			json: true,
			body: {
				response_type: res.ok ? 'in_channel' : 'ephemeral',
				text: template(res.data)
			}
		}))
		.catch(err => {
			console.error(err.message)
		})
	return ':hourglass: buscando cotação...'
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
			text: _consulta(data)
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
	got
		.post('https://slash-cotacao.herokuapp.com', {
			form: true,
			body: {
				token: 'invalid_token',
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
