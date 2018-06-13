const jwt = require('jsonwebtoken');

class Authorization {
    createJWT(data) {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
    }

    verifyJWT(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(payload);
                }
            })
        })
    }
}
    
module.exports = Authorization;