const jwt = require('jsonwebtoken');

export default function getToken(githubId: string, secret: string, exp: string) {
  return {
    message: jwt.sign({ githubId }, secret, { expiresIn: exp }),
    input: githubId,
  };
}
