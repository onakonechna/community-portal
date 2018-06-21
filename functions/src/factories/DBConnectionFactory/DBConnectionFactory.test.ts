import DBConnectionFactory from './DBConnectionFactory';

describe('DBConnectionFactory test', () => {
  it('check that factory loads connection instance by config', () => {
    const connFactory = new DBConnectionFactory({'project': './../../projects/projects'});
    const projectConn = connFactory.create('project');
    expect(projectConn.getProjects().message).toBe('Go Serverless v1.0! Your function executed successfully!');
  });
});
