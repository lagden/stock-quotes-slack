function slackBody(data) {
	if (data && data.papel) {
		return [
			`*${data.papel}*  :cotacao: ${data.ultimo} `,
			`${data.variacao.startsWith('-') ? ':negativo:' : ':positivo:'} ${data.variacao}\n`,
			`:max: ${data.max} :min: ${data.min}\n`,
			`:abertura: ${data.abertura} :fechamento: ${data.fechamento}\n`,
			`:volume: ${data.volume} :hora: ${data.hora}`
		].join('')
	}
	return '✖ Cotação não encontrada'
}

module.exports = slackBody
