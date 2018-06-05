import express = require('express');

const serverless = require('serverless-http');
const users = require('./../../src/users/users');
const app = express();

app.get('/users/', function (req:express.Request, res:express.Response) {
  var usersService = new users();
  res.send(usersService.getUsers(req));
})

module.exports.handler = serverless(app);
