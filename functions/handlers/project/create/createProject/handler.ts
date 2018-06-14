import express = require('express');

const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { dynamodb } = require('./../../../../lib/utils');
const { validator } = require('./../../../../lib/validator');
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(cors());
app.use(bodyParser.json({ strict: false }));

// Create Project endpoint
app.post('/project/create/', (req:express.Request, res:express.Response) => {
  const data = req.body;

  // validate input
  const valid = validator.validate('createProjectSchema', data);

  if (!valid) {
    res.status(400).json({ errors: validator.errors });
    return;
  }

  // append additional data
  data.status = 'open';
  data.upvotes = 0;

  const params = {
    TableName: PROJECTS_TABLE,
    Item: data,
  };

  const request = dynamodb.put(params).promise();

  request
    .then((response: any) => {
      res.json({ message: 'Project created successfully', project_id: data.project_id });
    })
    .catch((error: Error) => {
      res.status(400).json({ error: 'Could not create projects' });
    });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
