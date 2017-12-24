'use strict';
const config = require('./config');
const stripe = require('stripe')(config.stripe.privateKey);
const payment = require('./payment');
const mailing = require('./mandrill');
stripe.setTimeout(20000);

const createCharge = (req, customer) => {
    return new Promise( (resolve, reject) => {
        stripe.charges.create({
            amount: req.amount * 100,
            currency: req.currency,
            customer: customer.id,
            source: customer.default_source,
            description: 'Charge for ' + req.email
        },  (err, charge) => {
            if (err) {
                reject(err);
            } else {
                resolve(charge);
            }
        });
    });
}

const createCustomer =  (req, res) => {
    return new Promise( (resolve, reject) => {
        stripe.customers.create({
            description: 'Customer for ' + req.email,
            source: req.cardToken
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
    createPayment: async (req, res) => { 
        const customer = await createCustomer(req);
        const charge = await createCharge(req, customer);
        await mailing.sendMail(req);
        return await payment.save(req);  
    }
}
