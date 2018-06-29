import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/project/status', 'put');

const dataFlows = [
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

packageService.createEndpoint(endpoint);
packageService.addDataFlows(dataFlows);
const handler = packageService.package();
export { handler };
