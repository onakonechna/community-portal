import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { UserController, UserResource } from './../../../config/Components';

const endpoint = new Endpoint('/user/bookmarkProject', 'post');

const dataflows = [
  {
    controller: UserController,
    method: 'addBookmarkedProject',
    target: UserResource,
    validationMap: { addBookmarkedProject: 'projectIdOnlySchema' },
    dataDependencies: ['project_id'],
    authDataDependencies: ['user_id'],
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
