'use strict'
const jwt = require('jsonwebtoken');
const createError = require('micro').createError

module.exports = {
    getID: function (req, res) {
        return getFromToken(req, 'userId');
    }
}

const getFromToken = (req, key) => {
    if(!req.headers.authorization) {
        throw createError(400,'No authorization headers');
    }
    var token = req.headers.authorization.replace('Bearer ','');
    token = jwt.decode(token);
    return token[key];
} 