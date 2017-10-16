'use strict'

const {
	token = false,
	token2 = false,
	NODE_ENV: env = 'development'
} = process.env

function isValid(_token) {
	return (_token && (_token === token || _token === token2)) || env === 'development'
}

module.exports = isValid
