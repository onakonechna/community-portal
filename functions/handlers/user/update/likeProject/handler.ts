import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { validator } = require('./../../../../lib/validator');
const utils = require('./../../../../lib/utils');

const dynamodb = utils.dynamodb;
const USERS_TABLE = process.env.USERS_TABLE;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(cors());
app.use(bodyParser.json({ strict: false }));

app.post('/user/likeProject/', (req:express.Request, res:express.Response) => {
  const data = req.body;

  // validate input
  const valid = validator.validate('projectIdOnlySchema', data);

  if (!valid) {
    res.status(400).json({ errors: validator.errors });
    return;
  }

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
