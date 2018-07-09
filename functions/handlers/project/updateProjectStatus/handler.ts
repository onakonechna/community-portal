import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/Components';

const endpoint = new Endpoint('/project/status', 'put');

const dataflows = [
  {
    controller: ProjectController,
    method: 'updateStatus',
    target: ProjectResource,
    validationMap: { updateStatus: 'updateProjectStatusSchema' },
    storageSpecs: ['display'],
  },
  {
    controller: ProjectController,
    method: 'updateDisplay',
    target: ProjectResource,
    dataDependencies: ['project_id', 'display'],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
