'use strict'
const config = require('../config/config')
const stripe = require('stripe')(config.stripe.privateKey)
stripe.setTimeout(20000)

const createCustomer = (req, res) => {
  return new Promise((resolve, reject) => {
    stripe.customers.create({
      description: 'Customer for ' + req.email,
      source: req.token
    }, (err, customer) => {
      if (err) {
        reject(err)
      } else {
        resolve(customer)
      }
    })
  })
}

const createCharge = (req, customer) => {
  return new Promise((resolve, reject) => {
    stripe.charges.create({
      amount: req.amount * 100,
      currency: req.currency,
      customer: customer.id,
      source: customer.default_source,
      description: 'Charge for ' + req.email
    }, (err, charge) => {
      if (err) {
        reject(err)
      } else {
        resolve(charge)
      }
    })
  })
}

module.exports = {
  create: async (req, res) => {
    const customer = await createCustomer(req)
    const charge = await createCharge(req, customer)
    return charge
  }
}
