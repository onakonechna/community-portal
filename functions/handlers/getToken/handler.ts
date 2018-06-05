import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const tokenRequests = require('./../../src/tokenRequests/tokenRequests');
const app = express();

app.use(bodyParser.json({ strict: false }));

app.post('/getToken/', function (req:express.Request, res:express.Response) {
  const { githubId } = req.body;
  var TokenRequest = new tokenRequests();
  res.send(TokenRequest.getToken(githubId));
})

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
