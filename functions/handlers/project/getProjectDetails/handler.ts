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
    storageSpecs: ['recommended', 'should_explore'],
    skipWithout: ['user_id', 'project'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getDefaultRecommendations',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    dataDependencies: ['project_id'],
    storageSpecs: ['recommended'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },

  /**
   * train a model for the first time if no model exists yet
   * we need to do this to solve the chicken and egg problem
   * the following data flows are adapted from the trainProjectRecommendationModel routine
   * they are always skipped when a model exists
   */
  {
    controller: ProjectController,
    method: 'storeItems',
    target: ProjectResource,
    methodMap: { storeItems: 'scanPledgingStats' },
    storageSpecs: ['projects'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },
  {
    controller: ProjectTrafficController,
    method: 'scan',
    target: ProjectTrafficResource,
    storageSpecs: ['traffic'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'null',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    methodMap: { null: 'trainModel' },
    dataDependencies: ['projects', 'traffic'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getRecommendations',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    dataDependencies: ['last_visited', 'project_id'],
    storageSpecs: ['recommended', 'should_explore'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'getDefaultRecommendations',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    dataDependencies: ['project_id'],
    storageSpecs: ['recommended'],
    skipWithout: ['user_id', 'project'],
    skipOn: ['recommended'],
  },
  // End of first-time model training and retrieval section

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
    methodMap: { returnProjectDetails: 'getRecommended' },
  },
];

const endpoint = new Endpoint('/project/:project_id', 'get', new PackageService(dataflows));
export const handler = endpoint.execute();
