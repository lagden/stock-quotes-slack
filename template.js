function slackBody(data) {
	return [
		`*${data.papel}* ${/^-/.test(data.variacao) ? ':_neg:' : ':_pos:'} ${data.variacao} ${data.ultimo}\n`,
		`:_max: ${data.max} :_min: ${data.min}\n`,
		`:_open: ${data.abertura} :_close: ${data.fechamento}\n`,
		`:_vol: ${data.volume} :_time: ${data.hora}`
	].join('')
}

module.exports = slackBody
