const jwt = require('jsonwebtoken');

let privateKey = 'secret'
module.exports = {
    sign: (payload) => {
        let signOptions = {
            expiresIn: "30d",
            algorithm: "HS256"
        };
        return jwt.sign(payload, privateKey, signOptions);
    },
}