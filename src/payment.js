'use strict';
const config = require('./config');
const pricing = require('./pricing');
const subscription = require('./subscription');
const mailing = require('./mandrill');

const uuidv4 = require('uuid/v4');
const stripe = require('stripe')(config.stripe.apikey);
stripe.setTimeout(20000);

module.exports = {
    createSubscription: async function (req, res) {
        let subscriptionResult;
        let discount = await subscription.checkIfUserHasDiscount(req);
        switch(req.type) {
            case "paypal":
                console.log('[PayPal] Starting subscription request');
                subscriptionResult = await subscription.saveSubscriptionFromPayPal(req);
                break;
            case "stripe":
                console.log('[Stripe] Starting subscription request');
                const customer = await createSourceForCostumer(req);
                const charge = await createCharge(customer, req, discount);
                subscriptionResult = await subscription.saveSubscriptionFromStripe(charge, req, discount);
                break;
            default:
                console.log('Can not create subscription');
        }
        if(discount.hasDiscountCode) {
            console.log('Marking discount code as used');
            subscription.markDiscountCode(discount);
        }
        console.log('Going to send subscription email');
        await mailing.sendMailForNewSubscription(req, getCustomerEmail(subscriptionResult), discount);
        return subscriptionResult;
    }
}

const createCharge = function (customer, req, discount) {
    // check if user has any kind of discount code with him 
    const amount = pricing.totalChargeAmount(req, discount);
    console.log('[Stripe] Total charge amount in cents:', amount);
    console.log('[Stripe] Customer created:', customer.id);
    console.log('[Stripe] Customer default source:', customer.default_source);

    return new Promise(function (resolve, reject) {
        stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            source: customer.default_source
        }, {
            idempotency_key: uuidv4()
        }, function (err, charge) {
            if (err) {
                reject(err);
            } else {
                resolve(charge);
            }
        });
    });
}

const createSourceForCostumer = function (req, res) {
    return new Promise(function (resolve, reject) {
        stripe.customers.create({
            description: 'Customer for Preference Pass',
            source: req.cardToken
        }, {
            idempotency_key: uuidv4()
       }, function (err, customer) {
            if (err) {
                reject(err);
            } else {
                resolve(customer);
            }
        });
    });
}

const getCustomerEmail = (req, res) => {
    if (req && req.data && req.data.createPPSubscription) {
        console.log('Retrieving user email for subscription:', req.data.createPPSubscription.id);
        console.log('User:', req.data.createPPSubscription.user);
        return req.data.createPPSubscription.user.email
    }
    return;
}