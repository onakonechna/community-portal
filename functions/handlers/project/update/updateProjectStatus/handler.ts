import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/project/status', 'put');

const dataFlow = {
  controller: ProjectController,
  method: 'updateStatus',
  target: ProjectResource,
  validationMap: { updateStatus: 'updateProjectStatusSchema' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
