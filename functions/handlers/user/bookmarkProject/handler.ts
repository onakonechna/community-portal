import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'addBookmarkedProject',
    target: UserResource,
    validationMap: { addBookmarkedProject: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
  },
];

const endpoint = new Endpoint('/user/bookmarkProject', 'post', new PackageService(dataflows));
export const handler = endpoint.execute();
