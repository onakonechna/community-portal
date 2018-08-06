import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';

import {
  ProjectTrafficController,
  ProjectRecommendationController,
  ProjectTrafficResource,
  ProjectRecommendationEngine,
} from './../../../config/Components';

const dataflows = [
  {
    controller: ProjectTrafficController,
    method: 'train',
    target: ProjectTrafficResource,
    methodMap: { train: 'scan' },
    storageSpecs: ['model'],
  },
  {
    controller: ProjectRecommendationController,
    method: 'null',
    target: ProjectRecommendationEngine,
    methodMap: { null: 'storeModel' },
    dataDependencies: ['model'],
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
