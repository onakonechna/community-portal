const axios = require('axios');
const projects = require('./fixtures/projects.json')

const getTokenOptions = {
  method: 'POST',
  url: 'http://localhost:3000/token/get',
  data: {
    githubId: 'dummyId',
  }
}

const getOptions = {
  method: 'GET',
  url: 'http://localhost:3000/project/id/test1',
};

function putProject(project){
  axios(getTokenOptions)
    .then((response) => {
      const postOptions = {
        method: 'POST',
        url: 'http://localhost:3000/project/create',
        data: project,
        headers: {
          Authorization: response.data.message,
        }
      };
      return axios(postOptions);
    })
    .then((response) => {
      console.log(response.data);
    });
}

function likeProject(project_id){
  const likeProjectOptions = {
    method: 'POST',
    url: 'http://localhost:3000/user/likeProject',
    data: { project_id },
  };

  axios(likeProjectOptions)
    .then((response) => {
      console.log(response.data);
    });
}

// for (let i = 0; i < projects.length; i++){
//   putProject(projects[i])
// }

likeProject('test21');

//
// test('CREATE works with token authorization', () => {
//   expect.assertions(1);
//
//   return axios(getTokenOptions)
//     .then((response) => {
//       const postOptions = {
//         method: 'POST',
//         url: 'http://localhost:3000/project/create',
//         data: data,
//         headers: {
//           Authorization: response.data.message,
//         }
//       };
//       return axios(postOptions);
//     })
//     .then((response) => {
//       expect(response.data.Item.projectId).toBe('42');
//     });
// });
//
// test('READ works', () => {
//   expect.assertions(1);
//   return axios(getOptions).then((response) => {
//     expect(response.data.projectId).toBe('42');
//   });
// });
