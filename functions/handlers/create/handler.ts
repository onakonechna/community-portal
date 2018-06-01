import express = require('express');
import awsSdk = require('aws-sdk');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();

const TEST_TABLE = process.env.TEST_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb:awsSdk.DynamoDB.DocumentClient;

if (IS_OFFLINE === 'true') {
  dynamoDb = new awsSdk.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new awsSdk.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({ strict: false }));

// Create Project endpoint
app.post('/create', (req:express.Request, res:express.Response) => {
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
      console.log(error);
      res.status(400).json({ error: 'Could not create project' });
      return;
    }
    res.json(params);
  });
});

module.exports.handler = serverless(app);
