describe('users-lambda-test', () => {
  it('users function should return a string', () => {
    const user = require('./users');
    const u1 = new user();
    expect(typeof u1.getUsers().message).toBe('string');
  });
});
