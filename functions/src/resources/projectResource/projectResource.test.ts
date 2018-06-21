describe('projects-lambda-test', () => {
  it('projects function should return a string', () => {
    const project = require('./project');
    const p1 = new project();
    expect(typeof p1.getProjects().message).toBe('string');
  });
});
