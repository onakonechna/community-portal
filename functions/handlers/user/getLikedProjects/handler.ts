import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'getUpvotedProjects',
    target: UserResource,
    validationMap: { getUpvotedProjects: 'nullSchema' },
    authDataDependencies: ['user_id'],
  },
];

const endpoint = new Endpoint('/user/likedProjects', 'get');
endpoint.configure((req: Request, res: Response) => {
  new PackageService(dataflows).package(req, res);
});
export const handler = endpoint.execute();
