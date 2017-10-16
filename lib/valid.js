'use strict'

const {
	token = false,
	NODE_ENV: env = 'development'
} = process.env

function isValid(data) {
	return (data && data.token && data.token === token && token) || env === 'development'
}

module.exports = isValid
