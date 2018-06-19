const jwt = require('jsonwebtoken');

class Authorization {
  createJWT(data:any) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
  }

  verifyJWT(token:string) {
    return new Promise((resolve: any, reject:any) => {
      jwt.verify(token, process.env.JWT_SECRET, (err:Error, payload:string) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
  }
}

module.exports = Authorization;
