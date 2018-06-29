import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';

const jwt = require('jsonwebtoken');

interface contextSpecs {
  user_id: string;
}

const buildIAMPolicy = function (principalId: string,
                                 effect: string,
                                 resource: string,
                                 context: contextSpecs) {
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

const REGION = process.env.REGION;
const STAGE = process.env.STAGE;
const API = process.env.API;

// Override aws-lambda type definition to support string errors
// string error supported in latest Github version but not in npm version as of 06-06-2018
type Callback<TResult = any> = (error?: Error | null | string, result?: TResult) => void;

module.exports.handler = function (event: CustomAuthorizerEvent,
                                   context: APIGatewayEventRequestContext,
                                   callback: Callback) {
  const token = event.authorizationToken;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded;

    const effect = 'Allow';
    const authorizerContext = { user_id };

    // Return an IAM policy document for the current endpoint
    const resource = `arn:aws:execute-api:${REGION}:*:${API}/${STAGE}/*/*`;
    const policyDocument = buildIAMPolicy(user_id, effect, resource, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};
