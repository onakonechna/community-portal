const jwt = require('jsonwebtoken');

class Project {
    getProjects(event:any) {
        return {
            message: jwt.sign({githubId: 'pelican2014'}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION_TIME}),// 'Go Serverless v1.0! Your function executed successfully!',
            input: event,
        };
    }
}

module.exports = Project;
