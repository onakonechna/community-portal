import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'getBookmarkedProjects',
    target: UserResource,
    validationMap: { getBookmarkedProjects: 'nullSchema' },
    authDataDependencies: ['user_id'],
  },
];

const endpoint = new Endpoint('/user/bookmarkedProjects', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
