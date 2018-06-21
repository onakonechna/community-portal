// const hostAddr = 'https://cef6942jo1.execute-api.us-east-1.amazonaws.com/dev';
const hostAddr = 'http://localhost:3000';

const axios = require('axios');
const projects = require('./fixtures/projects.json');

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

const getTokenOptions = {
  method: 'POST',
  url: hostAddr + '/token/get',
  data: {
    githubId: 'test_id',
  },
};

function putProject(project){
  return axios(getTokenOptions)
    .then((response) => {
      const postOptions = {
        method: 'POST',
        url: hostAddr + '/project',
        data: project,
        headers: {
          Authorization: response.data.message,
        }
      };
      return axios(postOptions);
    })
}

const test21EditData = {
  project_id: 'test21',
  description: 'edited',
}

function editProject(data){
  return axios(getTokenOptions)
    .then((response) => {
      const postOptions = {
        data,
        method: 'POST',
        url: hostAddr + '/project/edit',
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
    url: hostAddr +  '/project/status',
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

describe('editProject endpoint', () => {
  it('should edit project details', () => {
    expect.assertions(1);

    return editProject(test21EditData)
      .then((response) => {
        expect(response.data.message).toBe('Project edited successfully');
      });
  });
});

describe('getProjectDetails endpoint', () => {
  it('should get project details', () => {
    expect.assertions(2);

    return getProjectDetails('test21')
      .then((response) => {
        expect(response.data.status).toBe('closed');
        expect(response.data.description).toBe('edited');
      });
});
