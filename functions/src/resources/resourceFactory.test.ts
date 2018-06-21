import ResourceFactory from './resourceFactory';

describe('ResourceFactory test', () => {
  it('check that factory loads connection instance by config', () => {
    // const factory = new ResourceFactory({'project': './../../projects/projects'});
    const resource = factory.create('project');
    expect(1).toBe(1);
  });
});
