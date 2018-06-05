const jwt = require('jsonwebtoken');

class tokenRequests {
    getToken(githubId: string) {
        return {
            message: jwt.sign({ githubId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME }),
            input: githubId,
        };
    }
}

module.exports = tokenRequests;

export {}; // for TypeScript to recognize local scoping
