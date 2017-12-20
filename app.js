'use strict'
global.fetch = require('node-fetch');
const { json, send }  = require('micro');
const { router, post, get } = require('microrouter');
const microCors = require('micro-cors');
const cors = microCors();
const stripe = require('./src/stripe');

const postPayment = async (req, res) => {
  try {
    let request = await json(req);  
    console.log('New payment for request: ', request);
    const response = await stripe.createPayment(request);
    send(res, 200, response.data.createNewPayment);
  } catch (err) {
    console.log('An error has occurred during payment: ', err.stack);
    send(res, err.statusCode, err.message);
  }
}

const notfound = (req, res) => 
  send(res, 404, 'Could not find route: ' + req.method + req.url);

module.exports = cors(router(
  post('/payment', postPayment),
  get('/*', notfound)
));
