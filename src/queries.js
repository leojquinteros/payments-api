'use strict'
const gql = require('graphql-tag');
const queries = {};

queries.CREATE_PAYMENT = gql`
  mutation NewPayment($currency: String!, $price: Int!, $email: String!) {
      createNewPayment(currency: $currency, price: $price, email: $email) {
        id
        currency
        price
        customer {
          id
          email
        }
      }
    }
  `
;

module.exports = queries;