'use strict';

const serverless = require('serverless-http');
const express = require('express');
const users = require('./../../src/users/users');
const app = express()

app.get('/users/', function (req, res) {
  var usersService = new users();
  res.send(usersService.getUsers(req))
})

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping