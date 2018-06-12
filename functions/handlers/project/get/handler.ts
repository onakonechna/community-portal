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
    Key: {
      project_id: req.params.project_id,
    },
  };

  dynamoDb.get(params, (error:Error, result:any) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get project' });
    }
    if (result.Item) {
      const { project_id } = result.Item;
      res.json({ project_id });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
