import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'getById',
    target: UserResource,
    validationMap: { getById: 'userIdOnlySchema' },
  },
];

const endpoint = new Endpoint('/user/:user_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
