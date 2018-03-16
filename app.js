'use strict'
const { json, send } = require('micro')
const { router, post, get } = require('microrouter')
const microCors = require('micro-cors')
const cors = microCors()
const payment = require('./server/payment')

const postPayment = async (req, res) => {
  try {
    const request = await json(req)
    const response = await payment.create(request)
    send(res, 200, response)
  } catch (err) {
    console.log('An error has occurred during payment: ', err.stack)
    send(res, err.statusCode, err.message)
  }
}

const notfound = (req, res) =>
  send(res, 404, 'Could not find route: ' + req.method + req.url)

module.exports = cors(router(
  post('/payments', postPayment),
  get('/*', notfound)
))
