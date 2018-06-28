import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';
import { UserController, UserResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/user/likedProjects', 'get');

const dataFlow = {
  controller: UserController,
  method: 'getUpvotedProjects',
  target: UserResource,
  validationMap: { getUpvotedProjects: 'nullSchema' },
  dataDependencies: ['user_id'],
};

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
