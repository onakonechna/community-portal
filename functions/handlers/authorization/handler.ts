import * as express from 'express';

const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const authorizationServiceModule = require('./../../src/authorization/index');
const authorizationService = new authorizationServiceModule();
const githubServiceModule = require('./../../src/github/index');
const githubService = new githubServiceModule();
const userServiceModule = require('./../../src/users/users');
const userService = new userServiceModule();

app.use(cors());
app.use(bodyParser.json({ strict: false }));

app.post('/authorize/', (req:express.Request, res:express.Response) => {
  githubService.getGithubToken(req.body.code)
    .then((data: any) => {
      const token = data['access_token'];
      githubService.getUserDataByToken(token)
        .then((body: any) => {
          userService.createUser(
                token,
                String(body.id),
                body.name,
                body.email,
                body.company,
                body.avatar_url,
                body.location,
                body.html_url,
                body.url,
            ).then(
                (user:any) => res.json({ token: authorizationService.createJWT(user) }),
                (err:Error) => console.log(err));
        },    (err:Error) => console.log(err));
    },    (err:Error) => console.log(err));
});

module.exports.handler = serverless(app);
