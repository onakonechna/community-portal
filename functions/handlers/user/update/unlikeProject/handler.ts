import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';
import { UserController, UserResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/user/unlikeProject', 'post');

// need to specify data dependencies for the first dataFlow
// in order to retrieve user_id from authorization context
// note that user_id is not sent in request body
const dataFlows = [
  {
    controller: UserController,
    method: 'removeUpvotedProject',
    target: UserResource,
    validationMap: { removeUpvotedProject: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
  },
  {
    controller: ProjectController,
    method: 'removeUpvoter',
    target: ProjectResource,
    dataDependencies: ['project_id', 'user_id'],
  },
  {
    controller: ProjectController,
    method: 'downvote',
    target: ProjectResource,
    dataDependencies: ['project_id'],
  },
];

packageService.createEndpoint(endpoint);
packageService.addDataFlows(dataFlows);
const handler = packageService.package();
export { handler };
