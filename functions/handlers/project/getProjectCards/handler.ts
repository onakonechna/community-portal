import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import { ProjectController, ProjectResource } from './../../../config/Components';

const dataflows = [
  {
    controller: ProjectController,
    method: 'getCards',
    target: ProjectResource,
    validationMap: { getCards: 'nullSchema' },
  },
];

const endpoint = new Endpoint('/projects/', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
