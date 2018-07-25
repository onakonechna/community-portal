import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const endpoint = new Endpoint('/user/bookmarkedProjects', 'get');

const dataflows = [
  {
    controller: UserController,
    method: 'getBookmarkedProjects',
    target: UserResource,
    validationMap: { getBookmarkedProjects: 'nullSchema' },
    authDataDependencies: ['user_id'],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
