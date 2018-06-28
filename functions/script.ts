const axios = require('axios');
const jwt = require('jsonwebtoken');

const yaml = require('js-yaml');
const fs = require('fs');

function loadYAML(filename) {
  try {
    return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
  } catch (error) {
    console.log(error);
  }
}

const projects = require('./tests/dynamodb/fixtures/projects.json');
const config = loadYAML('./serverless.yml');
const token = jwt.sign({ user_id: 'test_id2' }, config.custom.jwt.secret, { expiresIn: '1d' });

const hostAddr = 'http://localhost:3000';

function likeProject(project_id){
  const likeProjectOptions = {
    method: 'POST',
    url: hostAddr +  '/user/likeProject',
    data: { project_id },
    headers: {
      Authorization: token,
    }
  };

  return axios(likeProjectOptions);
}

function unlikeProject(project_id){
  const likeProjectOptions = {
    method: 'POST',
    url: hostAddr +  '/user/unlikeProject',
    data: { project_id },
    headers: {
      Authorization: token,
    }
  };

  return axios(likeProjectOptions);
}

function getLikedProjects(){
  const getLikedProjectsOptions = {
    method: 'GET',
    url: hostAddr +  '/user/likedProjects',
    // data: { project_id },
    headers: {
      Authorization: token,
    }
  };

  return axios(getLikedProjectsOptions);
}

getLikedProjects('test23')
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
