'use strict';
const { ApolloClient } = require('apollo-client');
const createNetworkInterface = require('apollo-client').createNetworkInterface;
const config = require('./config');
const queries = require('./queries');
const validity = require('./validity');

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri : 'https://api.graph.cool/simple/v1/' + config.graphcool.uri
  })
});

const markDiscountCodeAsUsed = async function (discount){
    return new Promise((resolve, reject) => {
        console.log('Going to check user discount code');
        client.mutate({
            mutation: queries.UPDATE_DISCOUNT_CODE,
            variables : {
                discountId: discount.id,
                used: true
            }
        }).then(result => {
            const _resp = result.data.updateDiscountCode;
            resolve(_resp);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        })
    })
}

const getUserDisCountCode = async function (req, res) {
    return new Promise((resolve, reject) => {
        console.log('Checking user discount code for userID:', req.subscriptorId);
        client.query({
            query: queries.GET_USER_DISCOUNTS_CODES,
            variables : {
                userId: req.subscriptorId,
                used: false
            },
            fetchPolicy: 'network-only'
        }).then(result => {
            let resp = {
                id: '',
                hasDiscountCode: false
            }
            if(result.data.User && result.data.User.discountCodes && result.data.User.discountCodes.length) {
                const _discount = result.data.User.discountCodes[0];
                resp.hasDiscountCode = true;
                resp.id = _discount.id;
                console.log('Discount Code Response:', resp);
            }
            resolve(resp);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        })
    })
}

const addSubscription = function (paymentSource, charge, req, res) {
    return new Promise((resolve, reject) => {
        console.log('Creating subscription for userID: ', req.subscriptorId);
        client.mutate({
            mutation: queries.CREATE_SUBSCRIPTION,
            variables: {
                kids: req.kidsAmount,
                adults: req.adultsAmount,
                plan: req.plan,
                subscriptorId: req.subscriptorId,
                payment: charge,
                startsAt: validity.from(req.startsAt),
                validity: validity.to(req.plan, req.startsAt),
                paymentSource: paymentSource
            }
        }).then(data => {
            console.log('Subscription mutation response:', data);
            resolve(data);
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

module.exports = {
    saveSubscriptionFromStripe: async function (charge, req, res) {
        return addSubscription('Stripe', charge, req);
    },
    saveSubscriptionFromPayPal: async function (req, res) {
        return addSubscription('PayPal', req.payment, req);
    },

    checkIfUserHasDiscount: async function(req, res) {
        return getUserDisCountCode(req, res);
    },
    markDiscountCode: async function(discount) {
        return markDiscountCodeAsUsed(discount);
    }
}