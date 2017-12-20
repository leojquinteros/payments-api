'use strict';
const uuidv4 = require('uuid/v4');
const config = require('./config');
const stripe = require('stripe')(config.stripe.apikey);
const payment = require('./payment');
const mailing = require('./mandrill');
stripe.setTimeout(20000);

const createCharge = (req, customer) => {
    return new Promise( (resolve, reject) => {
        stripe.charges.create({
            amount: req.amount,
            currency: req.currency,
            customer: customer.id,
            source: customer.default_source
        }, {
            idempotency_key: uuidv4()
        },  (err, charge) => {
            if (err) {
                reject(err);
            } else {
                resolve(charge);
            }
        });
    });
}

const createSourceForCostumer =  (req, res) => {
    return new Promise( (resolve, reject) => {
        stripe.customers.create({
            description: 'Customer Payment for ' + req.customerEmail,
            source: req.cardToken
        }, {
            idempotency_key: uuidv4()
       }, (err, customer) => {
            if (err) {
                reject(err);
            } else {
                resolve(customer);
            }
        });
    });
}

module.exports = {
    create: async (req, res) => { 
        const customer = await createSourceForCostumer(req);
        const charge = await createCharge(req, customer);
        await mailing.sendMail(req);
        return await payment.save(req);  
    }
}
