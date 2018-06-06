const axios = require('axios');

const getTokenOptions = {
  method: 'POST',
  url: 'http://localhost:3000/getToken',
  data: {
    githubId: 'dummyId',
  }
}

const getOptions = {
  method: 'GET',
  url: 'http://localhost:3000/project/42',
};

test('CREATE works with token authorization', () => {
  expect.assertions(1);

  return axios(getTokenOptions)
    .then((response) => {
      const postOptions = {
        method: 'POST',
        url: 'http://localhost:3000/create',
        data: {
          projectId: '42',
        },
        headers: {
          Authorization: response.data.message,
        }
      };
      return axios(postOptions);
    })
    .then((response) => {
      expect(response.data.Item.projectId).toBe('42');
    });
});

test('READ works', () => {
  expect.assertions(1);
  return axios(getOptions).then((response) => {
    expect(response.data.projectId).toBe('42');
  });
});
