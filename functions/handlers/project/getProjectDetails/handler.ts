import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/components';

const endpoint = new Endpoint('/project/:project_id', 'get');

const dataflows = [
  {
    controller: ProjectController,
    method: 'getById',
    target: ProjectResource,
    validationMap: { getById: 'projectIdOnlySchema' },
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
