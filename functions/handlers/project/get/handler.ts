import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./../../../lib/utils');

const dynamoDb = utils.dynamoDb;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(bodyParser.json({ strict: false }));

// Get Project endpoint
app.get('/project/id/:project_id/', (req:express.Request, res:express.Response) => {
  const params = {
    TableName: PROJECTS_TABLE,
    // ProjectionExpression: 'project_id',
    KeyConditionExpression: 'project_id = :project_id',
    ExpressionAttributeValues: {
      ':project_id': req.params.project_id
    }
  };

  console.log(params);

  dynamoDb.query(params, (error: Error, result: any) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get project' });
    }
    if (result.Items) {
      const { project_id } = result.Items;
      res.json(result);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
