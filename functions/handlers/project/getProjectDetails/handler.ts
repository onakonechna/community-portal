import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  ProjectController,
  UserController,
  RecommendationController,
  ProjectResource,
  UserResource,
  RecommendationEngine,
} from './../../../config/Components';

const dataflows = [
  {
    controller: TrafficStatisticsController,
    method: 'getLastVisited',
    target: TrafficStatisticsResource,
    validationMap: { getLastVisited: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['last_visited'],
  },
  {
    controller: RecommendationController,
    method: 'getRecommendations',
    target: RecommendationEngine,
    dataDependencies: ['last_visited'],
    storageSpecs: ['recommended'],
  },
  {
    controller: TrafficStatisticsController,
    method: 'recordProjectView',
    target: TrafficStatisticsResource,
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
