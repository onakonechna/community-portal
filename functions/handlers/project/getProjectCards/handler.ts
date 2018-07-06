import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/components';

const endpoint = new Endpoint('/projects/', 'get');

const dataflows = [
  {
    controller: ProjectController,
    method: 'getCards',
    target: ProjectResource,
    validationMap: { getCards: 'nullSchema' },
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
