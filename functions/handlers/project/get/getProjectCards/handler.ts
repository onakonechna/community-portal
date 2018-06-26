import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/projects/', 'get');

const dataFlow = {
  controller: ProjectController,
  method: 'getProjectCards',
  target: ProjectResource,
  methodMap: { getProjectCards: 'get' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
