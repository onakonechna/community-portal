import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

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
const authUserId = '39741185';

const secret = process.env.JWT_SECRET;

const tokens = {
  mae: jwt.sign({ user_id: '40802007' }, secret, { expiresIn: '1d' }),
  xiya: jwt.sign({ user_id: authUserId }, secret, { expiresIn: '1d' }),
};

console.log(tokens);

const token = tokens.xiya; // default token

const hostAddr = 'http://localhost:3000';

function tokenAuthorize(code){
  const options = {
    method: 'POST',
    url: hostAddr + '/authorize',
    data: { code },
  }

  return axios(options);
}

function getProjectCards(){
  const options = {
    method: 'GET',
    url: hostAddr + '/projects',
  };

  return axios(options);
}

function getProjectDetails(project_id){
  const options = {
    method: 'GET',
    url: hostAddr + '/project/' + project_id,
  };

  return axios(options);
}

function putProject(project, token=tokens.xiya){
  const options = {
    method: 'POST',
    url: hostAddr + '/project',
    data: project,
    headers: {
      Authorization: token,
    },
  };
  return axios(options);
}

const editData = {
  project_id: '8f1b18ab-907f-4c59-8778-f56154fd6c27',
  description: 'Magento Payment API is a W3C standard candidate so most of the modern browsers support it. PR API allows improving user workflow during the purchase process, providing a more consistent user experience and enabling merchants to easily leverage different payment methods. To get more details, please, read Introducing the Payment Request API.',
};

function editProject(data, token=tokens.xiya){
  const postOptions = {
    data,
    method: 'PUT',
    url: hostAddr + '/project',
    headers: {
      Authorization: token,
    },
  };
  return axios(postOptions);
}

function likeProject(project_id){
  const options = {
    method: 'POST',
    url: hostAddr +  '/user/likeProject',
    data: { project_id },
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function bookmarkProject(project_id){
  const options = {
    method: 'POST',
    url: hostAddr +  '/user/bookmarkProject',
    data: { project_id },
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function unlikeProject(project_id){
  const options = {
    method: 'POST',
    url: hostAddr +  '/user/unlikeProject',
    data: { project_id },
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function getLikedProjects(){
  const options = {
    method: 'GET',
    url: hostAddr +  '/user/likedProjects',
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function getBookmarkedProjects(){
  const options = {
    method: 'GET',
    url: hostAddr +  '/user/bookmarkedProjects',
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function updateProjectStatus(project_id, status, token=tokens.xiya){
  const options = {
    method: 'PUT',
    url: hostAddr +  '/project/status',
    data: { project_id, status },
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

function pledge(project_id, hours){
  const options = {
    method: 'POST',
    url: hostAddr +  '/user/pledge',
    data: { project_id, hours },
    headers: {
      Authorization: token,
    },
  };

  return axios(options);
}

///////////
// Tests //
///////////

describe('createProject endpoint', () => {
  it('should create multiple projects with fixture data via token authorization', () => {
    let promises = [];

    for (let i = 0; i < projects.length; i++){
      promises.push(putProject(projects[i]));
    }

    expect.assertions(promises.length);

    return Promise.all(promises).then((responses) => {
      const results = responses.map(response => response.data);
      for (let i = 0; i < promises.length; i++){
          expect(results[i].message).toBe('Project created successfully');
      }
    });
  });

  it('should not create a project if the user has no write:project scope', () => {
    expect.assertions(1);

    return putProject(projects[0], tokens.mae)
      .catch((error) => {
        expect(error.response.data.error).toBe('User does not have the required scope (write:project) to create project');
      });
  });
});

describe('likeProject, updateProjectStatus and getProjectCards endpoints', () => {
  it('should upvote project', () => {
    expect.assertions(1);

    return likeProject('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        expect(response.data.message).toBe('Project upvoted successfully');
      });
  });

  it('should get open projects sorted by upvotes', () => {
    expect.assertions(1);

    return getProjectCards()
      .then((response) => {
        expect(response.data[0].project_id).toBe('8f1b18ab-907f-4c59-8778-f56154fd6c27');
      });
  });

  it('should change the status of 8f1b18ab-907f-4c59-8778-f56154fd6c27 to closed', () => {
    expect.assertions(1);

    return updateProjectStatus('8f1b18ab-907f-4c59-8778-f56154fd6c27', 'closed')
      .then((response) => {
        expect(response.data.message).toBe('Project status updated successfully');
      });
  });

  it('should not display 8f1b18ab-907f-4c59-8778-f56154fd6c27 in the project cards', () => {
    expect.assertions(1);

    return getProjectCards()
      .then((response) => {
        expect(response.data[0].project_id).not.toBe('8f1b18ab-907f-4c59-8778-f56154fd6c27');
      });
  });

  it('should not change the project status of 8f1b18ab-907f-4c59-8778-f56154fd6c27 to open if the user has no write:project scope', () => {
    expect.assertions(1);

    return updateProjectStatus('8f1b18ab-907f-4c59-8778-f56154fd6c27', 'open', tokens.mae)
      .catch((error) => {
        expect(error.response.data.error).toBe('User does not have the required scope (write:project) to update project status');
      });
  });

  it('should change the status of 8f1b18ab-907f-4c59-8778-f56154fd6c27 to open', () => {
    expect.assertions(1);

    return updateProjectStatus('8f1b18ab-907f-4c59-8778-f56154fd6c27', 'open')
      .then((response) => {
        expect(response.data.message).toBe('Project status updated successfully');
      });
  });
});

describe('editProject endpoint', () => {
  it('should edit project details', () => {
    expect.assertions(1);

    return editProject(editData)
      .then((response) => {
        expect(response.data.message).toBe('Project edited successfully');
      })
      .catch((error) => {
        console.log(error.response);
      });
  });

  it('should not edit project if user has no write:project scope', () => {
    expect.assertions(1);

    return editProject(editData, tokens.mae)
      .catch((error) => {
        expect(error.response.data.error).toBe('User does not have the required scope (write:project) to edit project');
      });
  });
});

describe('getProjectDetails endpoint', () => {
  it('should get project details', () => {
    expect.assertions(3);

    return getProjectDetails('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        expect(response.data.status).toBe('open');
        expect(response.data.description).toBe('Magento Payment API is a W3C standard candidate so most of the modern browsers support it. PR API allows improving user workflow during the purchase process, providing a more consistent user experience and enabling merchants to easily leverage different payment methods. To get more details, please, read Introducing the Payment Request API.');
        expect(response.data.upvotes).toBe(1);
      });
});

describe('getLikedProjects endpoint', () => {
  it('should get a list of liked projects', () => {
    expect.assertions(1);

    return getLikedProjects()
      .then((response) => {
        expect(_.includes(response.data.upvoted_projects, '8f1b18ab-907f-4c59-8778-f56154fd6c27')).toBeTruthy();
      });
  });
});

describe('unlikeProject endpoint', () => {
  it('should downvote the project', () => {
    expect.assertions(1);

    return unlikeProject('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        expect(response.data.message).toBe('Project downvoted successfully');
      });
  });

  it('should see the project upvotes decreased', () => {
    expect.assertions(1);

    return getProjectDetails('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        expect(response.data.upvotes).toBe(0);
      });
  });
};

describe('pledge endpoint', () => {
  it('should get successful response from the pledge endpoint', () => {
    expect.assertions(1);

    return pledge('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        expect(response.data.message).toBe('Pledged successfully');
      });
  });

  it('should update pledging-related data in projects data', () => {
    expect.assertions(4);

    return getProjectDetails('8f1b18ab-907f-4c59-8778-f56154fd6c27')
      .then((response) => {
        const { pledged, pledgers, pledged_history, subscribers } = response.data;
        expect(pledged).toBe(1);
        expect(authUserId in pledgers).toBeTruthy();
        expect(_.includes(pledged_history, authUserId)).toBeTruthy();
        expect(_.includes(subscribers.values, authUserId)).toBeTruthy();
      });
  });

  it('should update pledging-related data in users data', () => {
    // to be implemented after implementing API to get pledged projects for users
    expect(1).toBe(1);
  });

  describe('bookmark endpoint', () => {
    it('should bookmark the project', () => {
      expect.assertions(1);

      return bookmarkProject('8f1b18ab-907f-4c59-8778-f56154fd6c27')
        .then((response) => {
          expect(response.data.message).toBe('Project bookmarked successfully');
        });
    });

    it('should get a list of bookmarked projects', () => {
      expect.assertions(1);

      return getBookmarkedProjects()
        .then((response) => {
          expect(_.includes(response.data.bookmarked_projects, '8f1b18ab-907f-4c59-8778-f56154fd6c27')).toBeTruthy();
        });
    });
  });
});
