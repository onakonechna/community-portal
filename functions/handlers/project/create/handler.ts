import express = require('express');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./../../../lib/utils');

const dynamoDb = utils.dynamoDb;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

// const validator = utils.validator;

app.use(bodyParser.json({ strict: false }));

// Create Project endpoint
app.post('/project/create/', (req:express.Request, res:express.Response) => {
  const project = req.body;

  // validate input

  const params = {
    TableName: PROJECTS_TABLE,
    Item: project,
  };

  const request = dynamoDb.put(params).promise()

  request
    .then((response: any) => {
      res.json({ message: 'Project created successfully', project_id: project.project_id });
    })
    .catch((error: Error) => {
      res.status(400).json({ error: 'Could not create projects' });
      return;
    });

  // if (typeof project_id !== 'string') {
  //   res.status(400).json({ error: '"project_id" must be a string' });
  // }
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
