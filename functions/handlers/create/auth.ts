const jwt = require('jsonwebtoken');

const buildIAMPolicy = (userId, effect, resource, context) => {
  const policy = {
    principalId: userId,
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

module.exports.handler =  function(event, context, callback) {
    var token = event.authorizationToken;

    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const githubId = decoded.githubId;

      // Checks if the user's scopes allow her to call the current function
      const effect = 'Allow';
      const authorizerContext = { githubId: githubId };

      // Return an IAM policy document for the current endpoint
      const policyDocument = buildIAMPolicy(githubId, effect, event.methodArn, authorizerContext);

      callback(null, policyDocument);
    } catch (e) {
      callback('Unauthorized'); // Return a 401 Unauthorized response
    }
};
