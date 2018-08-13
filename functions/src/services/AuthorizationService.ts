const jwt = require('jsonwebtoken');
import * as _ from 'lodash';


export const PARTNER_ADMINS_ORGANIZATION = 'magento-engcom';
export const PARTNER_ADMINS_TEAM = 'engcom-team';

class AuthorizationService {
  create(data:any) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
  }

  verify(token:string) {
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

  isParnersAdmin(user:any) {
    return !_.isEmpty(user) &&
      user.organization.organization === PARTNER_ADMINS_ORGANIZATION &&
      user.team.name === PARTNER_ADMINS_TEAM;
  }
}

export default AuthorizationService;
