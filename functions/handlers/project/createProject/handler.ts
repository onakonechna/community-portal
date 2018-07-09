import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/Components';

const endpoint = new Endpoint('/project', 'post');

const dataflows = [
  {
    controller: ProjectController,
    method: 'create',
    target: ProjectResource,
    validationMap: { create: 'createProjectSchema' },
    authDataDependencies: ['user_id'],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
