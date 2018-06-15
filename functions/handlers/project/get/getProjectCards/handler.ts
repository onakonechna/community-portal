import express = require('express');
import awsSdk = require('aws-sdk');

import validator from './../../../../lib/validator';
import { dynamodb } from './../../../../lib/utils';

const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;
const PROJECTS_INDEX = process.env.PROJECTS_INDEX;

app.use(cors());
app.use(bodyParser.json({ strict: false }));

app.get('/project/cards/', (req:express.Request, res:express.Response) => {
  const params = {
    TableName: PROJECTS_TABLE,
    IndexName: PROJECTS_INDEX,
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'open',
    },
    ScanIndexForward: false,
    Limit: 10,
  };

  dynamodb.query(params, (error: Error, result: any) => {
    res.set('Access-Control-Allow-Headers', '');
    if (error) {
      res.status(400).json({ error: 'Could not get project cards' });
      return;
    }

    if (result.Items) {
      res.json(result.Items);
    } else {
      res.status(404).json({ error: 'No project found' });
    }
  });
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
