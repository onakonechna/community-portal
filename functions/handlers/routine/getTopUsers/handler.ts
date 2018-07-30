import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  UserController,
  ProjectResource,
  UserResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: SkillsController,
    method: 'scan',
    target: SkillsResource,
  },
];

new PackageService(dataflows).package(onSuccess, onFailure);

export const handler = ();
