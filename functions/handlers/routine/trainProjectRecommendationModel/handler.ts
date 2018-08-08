import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';

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
    method: 'storeItems',
    target: ProjectResource,
    methodMap: { storeItems: 'scanPledgingStats' },
    storageSpecs: ['projects'],
  },
  {
    controller: ProjectTrafficController,
    method: 'scan',
    target: ProjectTrafficResource,
    storageSpecs: ['traffic'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'null',
    target: ProjectRecommendationEngine,
    targetType: 'engine',
    methodMap: { null: 'trainModel' },
    dataDependencies: ['projects', 'traffic'],
  },
];

const onSuccess = (context: any) => (response: any) => {
  const time = new Date();
  console.log(`${context.functionName} ran at ${time}`);
};

const onFailure = (context: any) => (response: any) => {
  const time = new Date();
  console.log(`${context.functionName} failed to run at ${time}`);
};

export const handler = (event: any, context: any) => {
  const packageService = new PackageService(dataflows);
  packageService.package(onSuccess(context), onFailure(context));
};
