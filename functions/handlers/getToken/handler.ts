import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ strict: false }));

app.get('/getToken/', function (req:express.Request, res:express.Response) {
  var projectsService = new TokenRequest();
  res.send(projectsService.getProjects())
})

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
