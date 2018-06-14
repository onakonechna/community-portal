import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./../../../../lib/utils');

const dynamodb = utils.dynamodb;
const USERS_TABLE = process.env.USERS_TABLE;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(bodyParser.json({ strict: false }));

app.post('/user/likeProject/', (req:express.Request, res:express.Response) => {
  const data = req.body;

  // validate input
  // const valid = createProjectValidator.validate('createProjectSchema', data);

  // if (!valid) {
  //   res.status(400).json({ errors: createProjectValidator.errors });
  //   return;
  // }

  const params = {
    TableName: PROJECTS_TABLE,
    Key: data,
    AttributeUpdates: {
      upvotes: {
        Action: 'ADD',
        Value: 1,
      },
    },
  };

  const request = dynamodb.update(params).promise();

  request
    .then((response: any) => {
      res.json({ message: 'Project upvoted successfully', project_id: data.project_id });
    })
    .catch((error: Error) => {
      res.status(400).json({ error: 'Could not upvote projects' });
    });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
