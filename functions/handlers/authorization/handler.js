const serverless = require('serverless-http');
const express = require('express');
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
app.post('/authorize/', function (req, res) {
    res.set({ 'Access-Control-Allow-Origin': '*'});
    githubService.getGithubToken(req.body.code)
        .then(data => {
            const token = data['access_token'];
            githubService.getUserDataByToken(token)
                .then(body => {
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
                        user => res.json({ token: authorizationService.createJWT(user) }),
                        err => console.log(err));
                }, err => console.log(err));
        }, err => console.log(err));
});

module.exports.handler = serverless(app);
