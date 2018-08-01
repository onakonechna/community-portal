import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  UserController,
  TrafficController,
  ProjectRecommendationController,
  ProjectResource,
  UserResource,
  TrafficResource,
  ProjectRecommendationEngine,
} from './../../../config/Components';

const dataflows = [
  {
    controller: TrafficController,
    method: 'getLastVisited',
    target: TrafficResource,
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
    controller: TrafficController,
    method: 'recordProjectView',
    target: TrafficResource,
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
