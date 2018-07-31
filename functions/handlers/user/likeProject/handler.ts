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
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'addUpvoter' },
    validationMap: { null: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
  },
  {
    controller: UserController,
    method: 'null',
    target: UserResource,
    methodMap: { null: 'addUpvotedProject' },
    dataDependencies: ['project_id', 'user_id'],
  },
  {
    controller: ProjectController,
    method: 'upvote',
    target: ProjectResource,
    dataDependencies: ['project_id'],
  },
];

const endpoint = new Endpoint('/user/likeProject', 'post', new PackageService(dataflows));
export const handler = endpoint.execute();
