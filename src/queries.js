'use strict'
const gql = require('graphql-tag');
const queries = {};

queries.GET_USER_DISCOUNTS_CODES = gql`
query getUserCodes($userId: ID!, $used: Boolean!) {
    User(id: $userId) {
      discountCodes(filter: {used: $used}, first: 1) {
        id
      }
    }
  }
`;

queries.UPDATE_DISCOUNT_CODE = gql`
mutation UpdateDiscount($discountId: ID!, $used: Boolean!) {
    updateDiscountCode(id: $discountId, used: $used) {
      id
    }
  }
`;

queries.CREATE_SUBSCRIPTION = gql`
mutation NewPPSubscription($adults: Int!, $kids: Int!, $plan: String!, $subscriptorId: ID!, $payment: Json!, $startsAt: DateTime!, $paymentSource: String!, $validity: DateTime!) {
    createPPSubscription(adults: $adults, kids: $kids, plan: $plan, userId: $subscriptorId, payment: $payment, validity: $validity, startsAt: $startsAt, paymentSource: $paymentSource) {
      id
      validity
      kids
      adults
      companions {
        id
      }
      plan
      user {
        id
        email
      }
      reservations {
        id
      }
    }
  }
`;

module.exports = queries;