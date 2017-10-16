'use strict'

const {
	token = false,
	NODE_ENV: env = 'development'
} = process.env

function isValid(_token) {
	return (_token && token && _token === token) || env === 'development'
}

module.exports = isValid
