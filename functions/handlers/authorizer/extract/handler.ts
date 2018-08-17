import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { Callback } from './../../config/Types';

const jwt = require('jsonwebtoken');

const buildIAMPolicy = function (principalId: string,
                                 effect: string,
                                 resource: string,
                                 context: any) {
  const policy = {
    principalId,
    context,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };

  return policy;
};

const getUniversalPath = function (methodArn: string) {
  const root = methodArn.match(/.*:.*?\/.*?\//)[0];
  return `${root}*/*`;
};

const IS_OFFLINE = process.env.IS_OFFLINE;

interface customErrorInterface {
  customErrorString: string;
}

module.exports.handler = function (event: CustomAuthorizerEvent,
                                   context: APIGatewayEventRequestContext & customErrorInterface,
                                   callback: Callback) {
  const token = event.authorizationToken;
  let authorizerContext: any = {};

  /**
   * extract token if it is valid
   * notice that we do not enforce token check here
   * we will still grant user access if token is not valid
   * this is *NOT* used for protected endpoints
   * this authorizer is merely a token extractor
   */
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded;
    authorizerContext = { user_id };
  } catch (e) {
    console.log(e);
  }

  const effect = 'Allow';

  /** Return an IAM policy document for the current endpoint
   * the TTL for extractor in the yml file of the associated handler should be set to 0
   * because we do not grant access to every endpoint when this authorizer passes
   * otherwise if two handlers use the extractor
   * and user invokes one
   * for the duration of TTL
   * the user cannot use the other handler due to policy caching
   */
  const resource = event.methodArn;
  const principalId = authorizerContext.user_id ? authorizerContext.user_id : 'user';

  const policyDocument = buildIAMPolicy(authorizerContext.user_id, effect, resource, authorizerContext);

  callback(null, policyDocument);
};
