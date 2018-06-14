import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const { validator } = require('./../../../../lib/validator');
const utils = require('./../../../../lib/utils');

const dynamodb = utils.dynamodb;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(bodyParser.json({ strict: false }));

app.get('/project/id/:project_id/', (req:express.Request, res:express.Response) => {
  const data = req.params;

  // validate input
  const valid = validator.validate('projectIdOnlySchema', data);

  if (!valid) {
    res.status(400).json({ errors: validator.errors });
    return;
  }

  const params = {
    TableName: PROJECTS_TABLE,
    Key: data,
  };

  dynamodb.get(params, (error: Error, result: any) => {
    if (error) {
      res.status(400).json({ error: 'Could not get project' });
    }
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
