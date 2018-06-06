const jwt = require('jsonwebtoken');

class tokenRequests {
    getToken(githubId: string, secret: string, exp: string) {
        return {
            message: jwt.sign({ githubId }, secret, { expiresIn: exp }),
            input: githubId,
        };
    }
}

module.exports = tokenRequests;

export {}; // for TypeScript to recognize local scoping
