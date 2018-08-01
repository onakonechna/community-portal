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
    skipWithout: ['user_id'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getRecommendations',
    target: ProjectRecommendationEngine,
    dataDependencies: ['last_visited'],
    storageSpecs: ['recommended'],
    skipWithout: ['user_id'],
  },
  {
    controller: ProjectTrafficController,
    method: 'null',
    target: ProjectTrafficResource,
    methodMap: { null: 'recordProjectView' },
    dataDependencies: ['user_id', 'project_id', 'recommended'],
    skipWithout: ['user_id'],
  },
  {
    controller: ProjectController,
    method: 'getById',
    target: ProjectResource,
  },
];

const endpoint = new Endpoint('/project/:project_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
