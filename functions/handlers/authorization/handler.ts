import * as express from 'express';

const serverless = require('serverless-http');
const GithubService = require('./../../src/github/index');
const UserService = require('./../../src/users/users');
const AuthorizationService = require('./../../src/authorization/index');
const app = express();
const githubService = new GithubService();
const userService = new UserService();
const authorizationService = new AuthorizationService();
const bodyParser = require('body-parser');

'use strict';

app.use(bodyParser.json({ strict: false }));
app.post('/authorize/', (req:express.Request, res:express.Response) => {
    res.set({ 'Access-Control-Allow-Origin': '*'});
    githubService.getGithubToken(req.body.code)
        .then((data: any) => {
            const token = data['access_token'];
            githubService.getUserDataByToken(token)
                .then((body: any) => {
                    userService.createUser(
                        token,
                        body.id,
                        body.name,
                        body.email,
                        body.company,
                        body.avatar_url,
                        body.location,
                        body.html_url,
                        body.url
                    ).then(
                        (user:any) => res.json({ token: authorizationService.createJWT(user) }),
                        (err:Error) => console.log(err));
                }, (err:Error) => console.log(err));
        }, (err:Error) => console.log(err));
});

module.exports.handler = serverless(app);
