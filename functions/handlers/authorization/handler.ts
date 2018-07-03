import PackageService from './../../src/services/PackageService';
import Endpoint from './../../src/Endpoint';
import { TokenController, TokenAPI } from './../../config/components';
import { UserController, UserResource } from './../../config/components';

const endpoint = new Endpoint('/authorize', 'post');

const dataflows = [
  {
    controller: TokenController,
    method: 'getGithubToken',
    target: TokenAPI,
    targetType: 'api',
    validationMap: { getGithubToken: 'getGithubTokenSchema' },
    storageSpecs: ['access_token'],
  },
  {
    controller: TokenController,
    method: 'getUserDataByToken',
    target: TokenAPI,
    targetType: 'api',
    dataDependencies: ['access_token'],
    storageSpecs: [
      'user_id',
      'name',
      'email',
      'company',
      'avatar_url',
      'location',
      'html_url',
      'url',
    ],
  },
  {
    controller: UserController,
    method: 'checkExistence',
    target: UserResource,
    methodMap: { checkExistence: 'getById' },
    dataDependencies: ['user_id'],
    storageSpecs: ['user_exists'],
  },
  {
    controller: UserController,
    method: 'create',
    target: UserResource,
    dataDependencies: [
      'user_exists',
      'user_id',
      'access_token',
      'name',
      'email',
      'company',
      'avatar_url',
      'location',
      'html_url',
      'url',
    ],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
