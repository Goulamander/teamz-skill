const jwt = require('express-jwt');
const Config = require('../config');

const auth = jwt({
    secret: Config.JWT_SECRET,
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.jwtauthorization && req.headers.jwtauthorization.split(' ')[0] === 'Bearer') {
            return req.headers.jwtauthorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
    },
    userProperty: 'payload'
});

module.exports = auth;