import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  ProjectResource,
  UserController,
  UserResource,
} from './../../../config/Components';

const endpoint = new Endpoint('/project', 'post');

const dataflows = [
  {
    controller: UserController,
    method: 'getScopes',
    target: UserResource,
    methodMap: { getScopes: 'getById' },
    validationMap: { getScopes: 'createProjectSchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['scopes'],
  },
  {
    controller: ProjectController,
    method: 'create',
    target: ProjectResource,
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
