import express = require('express');

const serverless = require('serverless-http');
const project = require('./../../src/projects/projects');
const app = express();

app.get('/projects/', (req:express.Request, res:express.Response) => {
  const projectsService = new project();
  res.send(projectsService.getProjects());
});

module.exports.handler = serverless(app);

export {}; // for TypeScript to recognize local scoping
