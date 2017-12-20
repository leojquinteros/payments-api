module.exports = {
    stripe: {
        privateKey: process.env.STRIPE_PRIVATE_KEY | 'sk_test_ny6ghZN9qZRn50ShukKLMEee'
    },
    graphcool: {
        uri: process.env.GRAPHCOOL_URI || 'cj41c9u2zddol0177la66g30g'
    },
    mandrill: {
        apikey: process.env.MANDRILL_API_KEY || '7GZhk_UytExYjiiB9briAw'
    }
};