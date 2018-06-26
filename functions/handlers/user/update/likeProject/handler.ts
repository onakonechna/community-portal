import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';

import { ProjectController, ProjectResource } from './../../../../config/components';

const packageService = new PackageService();
const endpoint = new Endpoint('/user/likeProject', 'post');

const dataFlow = {
  controller: ProjectController,
  method: 'upvote',
  target: ProjectResource,
  validationMap: { upvote: 'projectIdOnlySchema' },
}

packageService.createEndpoint(endpoint);
packageService.addDataFlow(dataFlow);
const handler = packageService.package();
export { handler };
