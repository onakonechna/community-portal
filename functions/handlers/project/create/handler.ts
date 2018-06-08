import express = require('express');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./../../../lib/utils');

const dynamoDb = utils.dynamoDb;
const TEST_TABLE = process.env.TEST_TABLE;

app.use(bodyParser.json({ strict: false }));

// Create Project endpoint
app.post('/project/create/', (req:express.Request, res:express.Response) => {
  const { projectId } = req.body;
  if (typeof projectId !== 'string') {
    res.status(400).json({ error: '"projectId" must be a string' });
  }

  const params = {
    TableName: TEST_TABLE,
    Item: {
      projectId,
    },
  };

  dynamoDb.put(params, (error:Error) => {
    if (error) {
      res.status(400).json({ error: 'Could not create project' });
      return;
    }
    res.json(params);
  });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
