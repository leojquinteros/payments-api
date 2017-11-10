'use strict';
const mandrill = require('mandrill-api/mandrill');
const config = require('./config');
const mandrill_client = new mandrill.Mandrill(config.mandrill.apikey);
const moment = require('moment');
const pricing = require('./pricing');
const DATE_FORMAT = "MMMM DD YYYY";

module.exports = {
    sendMailForNewSubscription: async function (req, customerEmail, discount, res) {
        if(customerEmail) {
            await sendMailToCustomer(req, customerEmail, discount);
            return await sendMailToPreferencePass(req, customerEmail, discount);
        } else {
            console.log("Unable to send subscription email - customerEmail missing");
        }
    }
}

const sendMailToCustomer = function (req, customerEmail, discount, res) {
    return new Promise(function (resolve, reject) {
        const template_content = [{
            "name": "name",
            "content": "new_subscription"
        }];
        const message = {
            "subject": "Thank you for your subscription!",
            "from_email": "subscriptions@preferencepass.com",
            "from_name": "Preference Pass Subscriptions",
            "to": [{
                "email": customerEmail
            }],
            "merge_vars": [{
                "rcpt": customerEmail,
                "vars": [
                    {
                        "name": "adultsAmount",
                        "content": req.adultsAmount
                    },
                    {
                        "name": "kidsAmount",
                        "content": req.kidsAmount
                    },
                    {
                        "name": "plan",
                        "content": req.plan
                    },
                    {
                        "name": "price",
                        "content": pricing.finalPriceForEmail(req, discount)
                    },
                    {
                        "name": "currency",
                        "content": "USD"
                    },
                    {
                        "name": "startsAt",
                        "content": req.startsAt ? moment(req.startsAt).format(DATE_FORMAT) : ''
                    }
                ]}
            ]
        };

        mandrill_client.messages.sendTemplate({
            "template_name": "new_subscription", 
            "template_content": template_content, 
            "message": message, 
            "async": true, 
            "ip_pool": "Main Pool", 
            "send_at": moment()
            },
            function(result) {
                console.log('[Mandrill] Email successfully sent to customer:', result);
                resolve(result);
            }, function(e) {
                console.log('[Mandrill] An error occurred: ' + e.name + ' - ' + e.message);
                //resolve promise anyway in case of error
                resolve(e);
            }
        );
    })
}

const sendMailToPreferencePass = function (req, customerEmail, discount, res) {
    return new Promise(function (resolve, reject) {
        const template_content = [{
            "name": "name",
            "content": "new_subscription_ppass"
        }];
        const message = {
            "subject": "New customer subscription",
            "from_email": "subscriptions@preferencepass.com",
            "from_name": "Preference Pass Subscriptions",
            "to": [{
                "email": config.mandrill.ownerEmail
            }],
            "merge_vars": [{
                "rcpt": config.mandrill.ownerEmail,
                "vars": [
                    {
                        "name": "adultsAmount",
                        "content": req.adultsAmount
                    },
                    {
                        "name": "kidsAmount",
                        "content": req.kidsAmount
                    },
                    {
                        "name": "plan",
                        "content": req.plan
                    },
                    {
                        "name": "price",
                        "content": pricing.finalPriceForEmail(req, discount)
                    },
                    {
                        "name": "currency",
                        "content": "USD"
                    },
                    {
                        "name": "startsAt",
                        "content": req.startsAt ? moment(req.startsAt).format(DATE_FORMAT) : ''
                    },
                    {
                        "name": "customerEmail",
                        "content": customerEmail
                    }
                ]}
            ]
        };

        mandrill_client.messages.sendTemplate({
            "template_name": "new_subscription_ppass", 
            "template_content": template_content, 
            "message": message, 
            "async": true, 
            "ip_pool": "Main Pool", 
            "send_at": moment()
            },
            function(result) {
                console.log('[Mandrill] Email successfully sent to ppass:', result);
                resolve(result);
            }, function(e) {
                console.log('[Mandrill] An error occurred: ' + e.name + ' - ' + e.message);
                //resolve promise anyway in case of error
                resolve(e);
            }
        );
    })
}
