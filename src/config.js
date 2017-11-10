'use strict'
const config = {};

// allowed payment methods
config.allowedPaymentMethods=["stripe","paypal"]

// STRIPE config
config.stripe = {};
// ***** DEV *****
config.stripe.apikey = process.env.STRIPE_PRIVATE_KEY || 'sk_test_ny6ghZN9qZRn50ShukKLMEee';
// ***** PROD *****
// config.stripe.apikey = process.env.STRIPE_PRIVATE_KEY || 'sk_live_BYfvgcYF9m4p4qycvpM0SOvw';

// GRAPHCOOL config
config.graphcool = {};
// ***** DEV *****
config.graphcool.uri = process.env.GRAPHCOOL_SUBSCRIPTIONS_URI || 'cj41c9u2zddol0177la66g30g';
// ***** PROD *****
//config.graphcool.uri = process.env.GRAPHCOOL_SUBSCRIPTIONS_URI || 'cj76588cy10aq0133eli0nu97';

// MANDRILL config
config.mandrill = {};
// ***** DEV *****
config.mandrill.apikey = process.env.MANDRILL_API_KEY || '7GZhk_UytExYjiiB9briAw';
config.mandrill.ownerEmail = process.env.MANDRILL_OWNER_EMAIL || 'ep@preferencepass.com';

// ***** PROD *****
// config.mandrill.apikey = process.env.MANDRILL_API_KEY || '7GZhk_UytExYjiiB9briAw';
// config.mandrill.mail = process.env.MANDRILL_OWNER_EMAIL || 'pt@preferencepass.com';

module.exports = config;