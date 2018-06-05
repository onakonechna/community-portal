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

module.exports.handler =  function(event:any, context:any, callback:any) {
  var token = event.authorizationToken;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const githubId = decoded.githubId;
    console.log(decoded)

    const effect = 'Allow';
    const authorizerContext = { githubId: githubId };

    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(githubId, effect, event.methodArn, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    console.log(e);
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};
