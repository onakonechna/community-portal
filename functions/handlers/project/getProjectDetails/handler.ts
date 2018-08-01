import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  ProjectTrafficController,
  ProjectRecommendationController,
  ProjectResource,
  ProjectTrafficResource,
  ProjectRecommendationEngine,
} from './../../../config/Components';

const dataflows = [
  {
    controller: ProjectTrafficController,
    method: 'getLastVisited',
    target: ProjectTrafficResource,
    validationMap: { getLastVisited: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['last_visited'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getRecommendations',
    target: ProjectRecommendationEngine,
    dataDependencies: ['last_visited'],
    storageSpecs: ['recommended'],
  },
  {
    controller: ProjectTrafficController,
    method: 'null',
    target: ProjectTrafficResource,
    methodMap: { null: 'recordProjectView' },
    dataDependencies: ['user_id', 'project_id', 'recommended'],
  },
  {
    controller: ProjectController,
    method: 'getById',
    target: ProjectResource,
    dataDependencies: ['project_id'],
  },
];

const endpoint = new Endpoint('/project/:project_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
