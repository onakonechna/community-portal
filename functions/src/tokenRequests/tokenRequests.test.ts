describe('tokenRequests-lambda-test', () => {
  it('tokenRequests function should return a string given input githubId', () => {
    const tokenRequest = require('./tokenRequests');
    const t1 = new tokenRequest();
    expect(typeof t1.getToken('dummyId', 'secret', '5m').message).toBe('string');
  });
});
