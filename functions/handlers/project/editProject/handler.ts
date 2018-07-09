import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/Components';

const endpoint = new Endpoint('/project', 'put');

const dataflows = [
  {
    controller: ProjectController,
    method: 'checkOwner',
    target: ProjectResource,
    methodMap: { checkOwner: 'getById' },
    validationMap: { checkOwner: 'editProjectSchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['is_owner'],
  },
  {
    controller: ProjectController,
    method: 'edit',
    target: ProjectResource,
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
