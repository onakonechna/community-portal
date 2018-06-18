// const hostAddr = 'https://boebm330qg.execute-api.us-east-1.amazonaws.com/demo';
const hostAddr = 'http://localhost:3000';

const axios = require('axios');
const projects = require('./fixtures/projects.json');

function getProjectCards(){
  const getCardsOptions = {
    method: 'GET',
    url: hostAddr + '/project/cards',
  };

  return axios(getCardsOptions);
}

function getProjectDetails(project_id){
  const getDetailsOptions = {
    method: 'GET',
    url: hostAddr + '/project/id/' + project_id,
  };

  return axios(getDetailsOptions);
}

function putProject(project){
  const getTokenOptions = {
    method: 'POST',
    url: hostAddr + '/token/get',
    data: {
      githubId: 'test_id',
    },
  };

  return axios(getTokenOptions)
    .then((response) => {
      const postOptions = {
        method: 'POST',
        url: hostAddr + '/project/create',
        data: project,
        headers: {
          Authorization: response.data.message,
        }
      };
      return axios(postOptions);
    })
}

function likeProject(project_id){
  const likeProjectOptions = {
    method: 'POST',
    url: hostAddr +  '/user/likeProject',
    data: { project_id },
  };

  return axios(likeProjectOptions);
}

function updateProjectStatus(project_id, status){
  const likeProjectOptions = {
    method: 'POST',
    url: hostAddr +  '/project/update/status',
    data: { project_id, status },
  };

  return axios(likeProjectOptions);
}

let promises = [];

for (let i = 0; i < projects.length; i++){
  promises.push(putProject(projects[i]));
}

describe('createProject endpoint', () => {
  it('should create multiple projects with fixture data via token authorization', () => {
    expect.assertions(promises.length);

    return Promise.all(promises).then((responses) => {
      const results = responses.map(response => response.data);
      for (let i = 0; i < promises.length; i++){
          expect(results[i].message).toBe('Project created successfully');
      }
    });
  });
});

describe('getProjectCards endpoint', () => {
  it('should upvote project', () => {
    expect.assertions(1);

    return likeProject('test21')
      .then((response) => {
        expect(response.data.message).toBe('Project upvoted successfully');
      });
  });

  it('should get open projects sorted by upvotes', () => {
    expect.assertions(1);

    return getProjectCards()
      .then((response) => {
        expect(response.data[0].project_id).toBe('test21');
      });
  });

  it('should change the status of test21 to closed', () => {
    expect.assertions(1);

    return updateProjectStatus('test21', 'closed')
      .then((response) => {
        expect(response.data.message).toBe('Project status updated successfully');
      });
  });

  it('should not display test21 in the project cards', () => {
    expect.assertions(1);

    return getProjectCards()
      .then((response) => {
        expect(response.data[0].project_id).not.toBe('test21');
      });
  });
});

describe('getProjectDetails endpoint', () => {
  it('should get project details', () => {
    expect.assertions(1);

    return getProjectDetails('test21')
      .then((response) => {
        expect(response.data.status).toBe('closed');
      });
});
