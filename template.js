function slackBody(data) {
	if (data && data.papel) {
		// return [
		// 	`*${data.papel}* ${/^-/.test(data.variacao) ? ':_neg:' : ':_pos:'} ${data.variacao} ${data.ultimo}\n`,
		// 	`:_max: ${data.max} :_min: ${data.min}\n`,
		// 	`:_open: ${data.abertura} :_close: ${data.fechamento}\n`,
		// 	`:_vol: ${data.volume} :_time: ${data.hora}`
		// ].join('')
		return [
			`*${data.papel}*  :cotacao: ${data.ultimo} `,
			`${/^-/.test(data.variacao) ? ':negativo:' : ':positivo:'} ${data.variacao}\n`,
			`:max: ${data.max} :min: ${data.min}\n`,
			`:abertura: ${data.abertura} :fechamento: ${data.fechamento}\n`,
			`:volume: ${data.volume} :hora: ${data.hora}`
		].join('')
	}
	return '✖ Cotação não encontrada'
}

module.exports = slackBody
