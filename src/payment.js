'use strict';
const { ApolloClient } = require('apollo-client');
const createNetworkInterface = require('apollo-client').createNetworkInterface;
const config = require('./config');
const queries = require('./queries');

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: 'https://api.graph.cool/simple/v1/' + config.graphcool.uri
    })
});

const addPayment = (req, res) => {
    return new Promise((resolve, reject) => {
        client.mutate({
            mutation: queries.CREATE_PAYMENT,
            variables: {
                currency: req.currency,
                price: req.price,
                email: req.email
            }
        }).then(data => {
            console.log('Payment mutation response:', data);
            resolve(data);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}

module.exports = {
    save: async (req, res) => {
        return addPayment(req);
    }
}