import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/project', 'post');

const dataFlow = {
  controller: ProjectController,
  method: 'create',
  target: ProjectResource,
  validationMap: { create: 'createProjectSchema' },
  authDataDependencies: ['user_id'],
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
