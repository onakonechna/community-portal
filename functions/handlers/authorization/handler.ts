import * as express from 'express';

const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

import AuthorizationService from './../../src/services/AuthorizationService';
import GithubService from './../../src/services/GithubService';
import UserService from './../../src/services/UserService';

const authorizationService = new AuthorizationService();
const githubService = new GithubService();
const userService = new UserService();

app.use(cors());
app.use(bodyParser.json({ strict: false }));

app.post('/authorize/', (req:express.Request, res:express.Response) => {

  githubService.getGithubToken(req.body.code)
    .then((data: any) => {
      const token = data['access_token'];
      githubService.getUserDataByToken(token)
        .then((body: any) => {
          // store user ID as a string
          body.id = String(body.id);
          userService.createUser(
                token,
                body.id,
                body.name,
                body.email,
                body.company,
                body.avatar_url,
                body.location,
                body.html_url,
                body.url,
            ).then(
                (user:any) => res.json({ token: authorizationService.create(user) }),
                (err:Error) => console.log(err));
        },    (err:Error) => console.log(err));
    },    (err:Error) => console.log(err));
});

module.exports.handler = serverless(app);
