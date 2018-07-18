import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  ProjectResource,
  UserController,
  UserResource,
} from './../../../config/Components';

const endpoint = new Endpoint('/project/meeting', 'post');

const dataflows = [
  {
    controller: ProjectController,
    method: 'scheduleMeeting',
    validationMap: { scheduleMeeting: 'scheduleMeetingSchema' },
    target: ProjectResource,
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
