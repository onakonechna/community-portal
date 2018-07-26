import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  UserController,
  ProjectResource,
  UserResource,
} from './../../../config/Components';

// need to specify data dependencies for the first dataFlow
// in order to retrieve user_id from authorization context
// note that user_id is not sent in request body
const dataflows = [
  {
    controller: ProjectController,
    method: 'addUpvoter',
    target: ProjectResource,
    validationMap: { addUpvoter: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
  },
  {
    controller: UserController,
    method: 'addUpvotedProject',
    target: UserResource,
    dataDependencies: ['project_id', 'user_id'],
  },
  {
    controller: ProjectController,
    method: 'upvote',
    target: ProjectResource,
    dataDependencies: ['project_id'],
  },
];

const endpoint = new Endpoint('/user/likeProject', 'post');
endpoint.configure((req: Request, res: Response) => {
  new PackageService(dataflows).package(req, res);
});
export const handler = endpoint.execute();
