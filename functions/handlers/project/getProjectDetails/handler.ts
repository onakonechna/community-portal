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
    controller: ProjectController,
    method: 'getById',
    target: ProjectResource,
    validationMap: { getById: 'projectIdOnlySchema' },
    authDataDependencies: ['user_id'],
    storageSpecs: ['project'],
  },
  {
    controller: ProjectTrafficController,
    method: 'getLastVisited',
    target: ProjectTrafficResource,
    storageSpecs: ['last_visited'],
    skipWithout: ['user_id', 'project'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getRecommendations',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    dataDependencies: ['last_visited', 'project_id'],
    storageSpecs: ['recommended'],
    skipWithout: ['user_id', 'project'],
  },
  {
    controller: ProjectTrafficController,
    method: 'null',
    target: ProjectTrafficResource,
    methodMap: { null: 'recordProjectView' },
    dataDependencies: ['user_id', 'project_id', 'recommended'],
    skipWithout: ['user_id', 'project'],
  },
  {
    controller: ProjectController,
    method: 'returnProjectDetails',
    target: ProjectResource,
    methodMap: { returnProjectDetails: 'null' },
  },
];

const endpoint = new Endpoint('/project/:project_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
