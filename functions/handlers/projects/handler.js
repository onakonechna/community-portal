'use strict';

const serverless = require('serverless-http');
const express = require('express')
const project = require('./../../src/projects/projects');
const app = express()

app.get('/projects/', function (req, res) {
  var projectsService = new project();
  res.send(projectsService.getProjects())
})

module.exports.handler = serverless(app);