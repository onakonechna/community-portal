const axios = require('axios');
const data = require('./fixtures/projects.json')

const getTokenOptions = {
  method: 'POST',
  url: 'http://localhost:3000/token/get',
  data: {
    githubId: 'dummyId',
  }
}

const getOptions = {
  method: 'GET',
  url: 'http://localhost:3000/project/id/42',
};

axios(getTokenOptions)
  .then((response) => {
    const postOptions = {
      method: 'POST',
      url: 'http://localhost:3000/project/create',
      data: data,
      headers: {
        Authorization: response.data.message,
      }
    };
    console.log(response.data.message);
    return axios(postOptions);
  })
  .then((response) => {
    console.log(response.data);
  });
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
