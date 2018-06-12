import express = require('express');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app = express();
const utils = require('./../../../lib/utils');

// import { projectParamsInterface } from './../../../lib/interfaces';
// remove this later
interface projectParamsInterface {
  TableName: string;
  Item: {
    project_id: string,
    field: string,
    data?: string | number,
    nested?: any
  };
}

const dynamoDb = utils.dynamoDb;
const entries = utils.entries;
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

app.use(bodyParser.json({ strict: false }));

// Create Project endpoint
app.post('/project/create/', (req:express.Request, res:express.Response) => {
  const projects = req.body;
  const promises = [];

  for (let i = 0; i < projects.length; i++){

    // validate

    for (let [key, value] of entries(projects[i])){
      if (key === 'project_id'){
        continue;
      }

      const params: projectParamsInterface = {
        TableName: PROJECTS_TABLE,
        Item: {
          project_id: projects[i].project_id,
          field: key
        },
      };

      if (typeof value === 'object'){
        params.Item['nested'] = value;
      } else {
        params.Item['data'] = value;
      }

      console.log(params);

      promises.push(
        dynamoDb.put(params).promise()
      );
    }
  }

  Promise.all(promises)
    .then((values: any) => {
      res.json({ message: 'Project created successfully' });
    })
    .catch((reason: any) => {
      console.log(reason);
      res.status(400).json({ error: 'Could not create project' });
      return;
    });

  // if (typeof project_id !== 'string') {
  //   res.status(400).json({ error: '"project_id" must be a string' });
  // }
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
