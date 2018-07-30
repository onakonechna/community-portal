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
    method: 'scan',
    target: SkillResource,
    storageSpecs: ['matched_users'],
  },
  {
    controller: ProjectController,
    method: 'storeMatchedUsers',
    target: ProjectResource,
    dataDependencies: ['matched_users'],
  },
];

const onSuccess = (response: any) => {
  const time = new Date();
  console.log(`${context.functionName} ran at ${time}`);
};

const onFailure = (response: any) => {
  const time = new Date();
  console.log(`${context.functionName} failed to run at ${time}`);
};

export const handler = (event: any, context: any) => {
  const packageService = new PackageService(dataflows);
  packageService.package(onSuccess, onFailure);
};
