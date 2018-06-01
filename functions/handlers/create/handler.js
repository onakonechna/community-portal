const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const TEST_TABLE = process.env.TEST_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;

if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));


// Create Project endpoint
app.post('/create', function (req, res) {
  const { projectId } = req.body;
  if (typeof projectId !== 'string') {
    res.status(400).json({ error: '"projectId" must be a string' });
  }

  const params = {
    TableName: TEST_TABLE,
    Item: {
      projectId: projectId
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create project' });
      return
    }
    res.json(params);
  });
})

module.exports.handler = serverless(app);