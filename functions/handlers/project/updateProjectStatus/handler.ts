import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  ProjectResource,
  UserController,
  UserResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: UserController,
    method: 'getScopes',
    target: UserResource,
    methodMap: { getScopes: 'getById' },
    validationMap: { getScopes: 'updateProjectStatusSchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['scopes'],
  },
  {
    controller: ProjectController,
    method: 'updateStatus',
    target: ProjectResource,
    storageSpecs: ['display'],
  },
  {
    controller: ProjectController,
    method: 'updateDisplay',
    target: ProjectResource,
    dataDependencies: ['project_id', 'display'],
  },
];

const endpoint = new Endpoint('/project/status', 'put', new PackageService(dataflows));
export const handler = endpoint.execute();
