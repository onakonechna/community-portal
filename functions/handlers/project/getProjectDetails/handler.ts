import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/Components';

const dataflows = [
  {
    controller: ProjectController,
    method: 'getById',
    target: ProjectResource,
    validationMap: { getById: 'projectIdOnlySchema' },
  },
];

const endpoint = new Endpoint('/project/:project_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
