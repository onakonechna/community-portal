import * as express from 'express';

const serverless = require('serverless-http');
const users = require('./../../../src/users/users');
const app = express();

app.get('/users/', (req:express.Request, res:express.Response) => {
  const usersService = new users();
  res.send(usersService.getUsers(req));
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
