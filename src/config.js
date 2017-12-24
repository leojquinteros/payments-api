module.exports = {
    stripe: {
        privateKey: process.env.STRIPE_PRIVATE_KEY || 'STRIPE_PRIVATE_KEY_VALUE'
    },
    graphcool: {
        uri: process.env.GRAPHCOOL_URI || 'GRAPHCOOL_URI_VALUE'
    },
    mandrill: {
        apikey: process.env.MANDRILL_API_KEY || 'MANDRILL_API_KEY_VALUE'
    }
};