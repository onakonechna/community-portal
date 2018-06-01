const rp = require('request-promise');

const postOptions = {
  method: 'POST',
  uri: 'https://cgeywrihv0.execute-api.us-east-1.amazonaws.com/dev/create',
  body: {
    projectId: '42',
  },
  json: true,
};

const getOptions = {
  uri: 'https://cgeywrihv0.execute-api.us-east-1.amazonaws.com/dev/project/42',
  json: true,
};

// rp(options).then(data => {console.log(data.projectId === '42')});

test('CREATE works', () => {
  expect.assertions(1);
  return rp(postOptions).then((data) => {
    expect(data.Item.projectId).toBe('42');
  });
});

test('READ works', () => {
  expect.assertions(1);
  return rp(getOptions).then((data) => {
    expect(data.projectId).toBe('42');
  });
});
