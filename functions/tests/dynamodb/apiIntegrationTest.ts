import axios from 'axios';
import * as jwt from 'jsonwebtoken';

const yaml = require('js-yaml');
const fs = require('fs');

function loadYAML(filename) {
  try {
    return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
  } catch (error) {
    console.log(error);
  }
}

const projects = require('./fixtures/projects.json');
const config = loadYAML('./serverless.yml');
const token = jwt.sign({ user_id: '39741185' }, config.custom.jwt.secret, { expiresIn: '1d' });

// const hostAddr = 'https://iq0sxk313f.execute-api.us-east-1.amazonaws.com/dev';
const hostAddr = 'http://localhost:3000';

function getProjectCards(){
  const getCardsOptions = {
    method: 'GET',
    url: hostAddr + '/projects',
  };

  return axios(getCardsOptions);
}

function getProjectDetails(project_id){
  const getDetailsOptions = {
    method: 'GET',
    url: hostAddr + '/project/' + project_id,
  };

  return axios(getDetailsOptions);
}

function putProject(project){
  const postOptions = {
    method: 'POST',
    url: hostAddr + '/project',
    data: project,
    headers: {
      Authorization: token,
    }
  };
  return axios(postOptions);
}

const test21EditData = {
  project_id: 'test21',
  description: 'edited',
}

function editProject(data){
  const postOptions = {
    data,
    method: 'PUT',
    url: hostAddr + '/project',
    headers: {
      Authorization: token,
    }
  };
  return axios(postOptions);
}

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

function updateProjectStatus(project_id, status){
  const likeProjectOptions = {
    method: 'PUT',
    url: hostAddr +  '/project/status',
    data: { project_id, status },
    headers: {
      Authorization: token,
    }
  };

  return axios(likeProjectOptions);
}

function tokenAuthorize(code){
  const options = {
    method: 'POST',
    url: hostAddr + '/authorize'
    data: { code },
  }

  return axios(options);
}

///////////
// Tests //
///////////

describe('authorize endpoint', () => {
  it('should create user and return JWT token', () => {
    expect.assertions(1);

    return tokenAuthorize('ceee573a0387d876417e')
      .then((response) => {
        console.log(response.data);
      });
  });
});

// describe('createProject endpoint', () => {
//   it('should create multiple projects with fixture data via token authorization', () => {
//     let promises = [];
//
//     for (let i = 0; i < projects.length; i++){
//       promises.push(putProject(projects[i]));
//     }
//
//     expect.assertions(promises.length);
//
//     return Promise.all(promises).then((responses) => {
//       const results = responses.map(response => response.data);
//       for (let i = 0; i < promises.length; i++){
//           expect(results[i].message).toBe('Project created successfully');
//       }
//     });
//   });
// });
//
// describe('getProjectCards endpoint', () => {
//   it('should upvote project', () => {
//     expect.assertions(1);
//
//     return likeProject('test21')
//       .then((response) => {
//         expect(response.data.message).toBe('Project upvoted successfully');
//       });
//   });
//
//   it('should get open projects sorted by upvotes', () => {
//     expect.assertions(1);
//
//     return getProjectCards()
//       .then((response) => {
//         expect(response.data[0].project_id).toBe('test21');
//       });
//   });
//
//   it('should change the status of test21 to closed', () => {
//     expect.assertions(1);
//
//     return updateProjectStatus('test21', 'closed')
//       .then((response) => {
//         expect(response.data.message).toBe('Project status updated successfully');
//       });
//   });
//
//   it('should not display test21 in the project cards', () => {
//     expect.assertions(1);
//
//     return getProjectCards()
//       .then((response) => {
//         expect(response.data[0].project_id).not.toBe('test21');
//       });
//   });
// });
//
// describe('editProject endpoint', () => {
//   it('should edit project details', () => {
//     expect.assertions(1);
//
//     return editProject(test21EditData)
//       .then((response) => {
//         expect(response.data.message).toBe('Project edited successfully');
//       })
//       .catch((error) => {
//         console.log(error.response);
//       });
//   });
// });
//
// describe('getProjectDetails endpoint', () => {
//   it('should get project details', () => {
//     expect.assertions(2);
//
//     return getProjectDetails('test21')
//       .then((response) => {
//         expect(response.data.status).toBe('closed');
//         expect(response.data.description).toBe('edited');
//       });
// });
