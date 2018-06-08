import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const tokenRequests = require('./../../../src/tokenRequests/tokenRequests');
const app = express();

app.use(bodyParser.json({ strict: false }));

app.post('/token/get/', (req:express.Request, res:express.Response) => {
  const { githubId } = req.body;
  const tokenRequest = new tokenRequests();
  res.send(tokenRequest.getToken(githubId,
                                 process.env.JWT_SECRET,
                                 process.env.JWT_EXPIRATION_TIME));
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
