import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/project/:project_id', 'get');

const dataFlow = {
  controller: ProjectController,
  method: 'getById',
  target: ProjectResource,
  validationMap: { getById: 'projectIdOnlySchema' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
