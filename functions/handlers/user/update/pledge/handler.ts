import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../../config/components';
import { UserController, UserResource } from './../../../../config/components';

const endpoint = new Endpoint('/user/pledge', 'post');

const dataflows = [
  {
    controller: ProjectController,
    method: 'addPledgedHours',
    target: ProjectResource,
    validationMap: { addPledgedHours: 'pledgeSchema' },
    authDataDependencies: ['user_id'],
  },
  {
    controller: ProjectController,
    method: 'addPledgedHistory',
    target: ProjectResource,
    dataDependencies: ['project_id', 'hours'],
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
    method: 'addPledger',
    target: ProjectResource,
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
    method: 'addSubscriber',
    target: ProjectResource,
    dataDependencies: ['project_id', 'user_id'],
  },
  {
    controller: UserController,
    method: 'pledge',
    target: UserResource,
    dataDependencies: ['user_id', 'project_id', 'hours'],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
