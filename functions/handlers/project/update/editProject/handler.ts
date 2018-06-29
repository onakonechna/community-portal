import PackageService from './../../../../src/services/PackageService';
import Endpoint from './../../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../../config/components';

const endpoint = new Endpoint('/project', 'put');

const dataflows = [
  {
    controller: ProjectController,
    method: 'edit',
    target: ProjectResource,
    validationMap: { edit: 'editProjectSchema' },
  },
];

const handler = new PackageService(endpoint, dataflows).package();
export { handler };
