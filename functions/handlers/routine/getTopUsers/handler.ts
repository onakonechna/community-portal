import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';

import {
  SkillController,
  ProjectController,
  SkillResource,
  ProjectResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: SkillController,
    method: 'rankUsers',
    target: SkillResource,
    methodMap: { rankUsers: 'scan' },
    storageSpecs: ['ranked_users'],
  },
  {
    controller: ProjectController,
    method: 'null',
    target: ProjectResource,
    methodMap: { null: 'storeRankedUsers' },
    dataDependencies: ['ranked_users'],
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
