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
    controller: ProjectController,
    method: 'checkPledged',
    target: ProjectResource,
    methodMap: { checkPledged: 'getById' },
    validationMap: { checkPledged: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
  },
  {
    controller: ProjectController,
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'addPledged' },
  },
  {
    controller: ProjectController,
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'addPledgedHistory' },
    dataDependencies: ['project_id', 'user_id'],
  },
  // we want to get the avatar url
  {
    controller: UserController,
    method: 'storeAvatarUrl',
    target: UserResource,
    methodMap: { storeAvatarUrl: 'getById' },
    dataDependencies: ['user_id'],
    storageSpecs: ['avatar_url'],
  },
  // save both user_id and avartar_url in the list of pledgers
  {
    controller: ProjectController,
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'addPledger' },
    dataDependencies: ['project_id', 'user_id', 'avatar_url'],
  },
  {
    controller: UserController,
    method: 'subscribe',
    target: UserResource,
    dataDependencies: ['user_id', 'project_id'],
  },
  {
    controller: ProjectController,
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'addSubscriber' },
    dataDependencies: ['project_id', 'user_id'],
  },
  {
    controller: UserController,
    method: 'pledge',
    target: UserResource,
    dataDependencies: ['user_id', 'project_id'],
  },
];

const endpoint = new Endpoint('/user/pledge', 'post', new PackageService(dataflows));
export const handler = endpoint.execute();
