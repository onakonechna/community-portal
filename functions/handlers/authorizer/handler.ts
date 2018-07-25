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

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded;

    const effect = 'Allow';
    const authorizerContext = { user_id };

    // Return an IAM policy document for the current endpoint
    let resource: string;
    if (IS_OFFLINE === 'true') {
      resource = event.methodArn;
    } else {
      resource = getUniversalPath(event.methodArn);
    }
    const policyDocument = buildIAMPolicy(user_id, effect, resource, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    console.log(e);
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};
