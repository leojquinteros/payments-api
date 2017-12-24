'use strict';
const moment = require('moment');
const mandrill = require('mandrill-api/mandrill');
const config = require('./config');
const mandrill_client = new mandrill.Mandrill(config.mandrill.apikey);

const sendMailToCustomer = (req, res) => {
    return new Promise( (resolve, reject) => {
        const template_content = [{
            "name": "name",
            "content": "new_payment"
        }];
        const message = {
            "subject": "Thank you for your payment!",
            "from_email": "payments@leojquinteros.com",
            "from_name": "Payments",
            "to": [{
                "email": req.email
            }],
            "merge_vars": [{
                "rcpt": req.email,
                "vars": [
                    {
                        "name": "currency",
                        "content": req.currency
                    },
                    {
                        "name": "price",
                        "content": req.price
                    },
                    {
                        "name": "date",
                        "content": moment().format("MMMM DD YYYY")
                    }
                ]}
            ]
        };

        mandrill_client.messages.sendTemplate({
            "template_name": "new_payment", 
            "template_content": template_content, 
            "message": message, 
            "async": true, 
            "ip_pool": "Main Pool", 
            "send_at": moment()
            },
            (result) => {
                console.log('[Mandrill] Email successfully sent: ', result);
                resolve(result);
            }, (err) => {
                console.log('[Mandrill] An error occurred: ' + err.name + ' - ' + err.message);
                //resolve promise anyway in case of error
                resolve(err);
            }
        );
    })
}

module.exports = {
    sendMail: async (req, res) => {
        return await sendMailToCustomer(req);
    }
}
