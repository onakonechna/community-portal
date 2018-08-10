import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  UserController,
  UserResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'postGithubData',
    target: UserResource,
    validationMap: { postGithubData: 'postGithubDataSchema' },
  },
];

const endpoint = new Endpoint('/user/github', 'post', new PackageService(dataflows));

export const handler = endpoint.execute();
