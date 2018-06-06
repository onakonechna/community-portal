import awsLambda = require('aws-lambda');

const jwt = require('jsonwebtoken');

interface contextSpecs {
  githubId: string;
}

const buildIAMPolicy = (githubId: string, effect: string, resource: string, context: contextSpecs) => {
  const policy = {
    principalId: githubId,
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
    context,
  };

  return policy;
};

// Override aws-lambda type definition to support string errors (string error supported in latest Github version but not in npm version as of 06-06-2018)
type Callback<TResult = any> = (error?: Error | null | string, result?: TResult) => void;

module.exports.handler = function(event: awsLambda.CustomAuthorizerEvent, context: awsLambda.APIGatewayEventRequestContext, callback: Callback) {
  var token = event.authorizationToken;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const githubId = decoded.githubId;

    const effect = 'Allow';
    const authorizerContext = { githubId: githubId };

    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(githubId, effect, event.methodArn, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};
