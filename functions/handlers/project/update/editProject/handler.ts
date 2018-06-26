import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/project', 'put');

const dataFlow = {
  controller: ProjectController,
  method: 'edit',
  target: ProjectResource,
  validationMap: { edit: 'editProjectSchema' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
