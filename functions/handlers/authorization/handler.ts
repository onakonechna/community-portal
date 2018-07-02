// import * as express from 'express';
//
// const serverless = require('serverless-http');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
//
// import AuthorizationService from './../../src/services/AuthorizationService';
// import GithubService from './../../src/services/GithubService';
// import UserService from './../../src/services/UserService';
//
// const authorizationService = new AuthorizationService();
// const githubService = new GithubService();
// const userService = new UserService();
//
// app.use(cors());
// app.use(bodyParser.json({ strict: false }));
//
// app.post('/authorize/', (req:express.Request, res:express.Response) => {
//
//   githubService.getGithubToken(req.body.code)
//     .then((data: any) => {
//       const token = data['access_token'];
//       githubService.getUserDataByToken(token)
//         .then((body: any) => {
//           // store user ID as a string
//           body.id = String(body.id);
//           userService.createUser(
//                 token,
//                 body.id,
//                 body.name,
//                 body.email,
//                 body.company,
//                 body.avatar_url,
//                 body.location,
//                 body.html_url,
//                 body.url,
//             ).then(
//                 (user:any) => res.json({ token: authorizationService.create(user) }),
//                 (err:Error) => console.log(err));
//         },    (err:Error) => console.log(err));
//     },    (err:Error) => console.log(err));
// });
//
// module.exports.handler = serverless(app);

import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../../config/components';
import { UserController, UserResource } from './../../../../config/components';

const endpoint = new Endpoint('/user/pledge', 'post');

const dataflows = [
  {
    controller: TokenController,
    method: 'getGithubToken',
    target: TokenResource,
    validationMap: { getGithubToken: 'getGithubTokenSchema' },
    storageSpecs: ['access_token'],
  },
  {
    controller: TokenController,
    method: 'getUserDataByToken',
    target: TokenResource,
    dataDependencies: ['access_token'],
  },
  {
    controller: UserController,
    method: 'userExists',
    target: UserResource,
    methodMap: { userExists: 'getById' },
    dataDependencies: ['user_id'],
  },
  {
    controller: UserController,
    method: 'create',
    target: UserResource,
    dataDependencies: [
      'access_token',
      'user_id',
      'name',
      'email',
      'company',
      'avatar_url',
      'location',
      'html_url',
      'url',
    ],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
