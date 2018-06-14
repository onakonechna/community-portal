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

app.post('/project/update/status/', (req:express.Request, res:express.Response) => {
  const data = req.body;

  // validate input
  const valid = validator.validate('updateProjectStatusSchema', data);

  if (!valid) {
    res.status(400).json({ errors: validator.errors });
    return;
  }

  const params = {
    TableName: PROJECTS_TABLE,
    Key: {
      project_id: data.project_id,
    },
    AttributeUpdates: {
      status: {
        Action: 'PUT',
        Value: data.status,
      },
    },
  };

  const request = dynamodb.update(params).promise();

  request
    .then((response: any) => {
      res.json({ message: 'Project status updated successfully', project_id: data.project_id });
    })
    .catch((error: Error) => {
      console.log(error);
      res.status(400).json({ error: 'Could not update project status' });
    });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
