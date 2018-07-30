import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';

import rankUsers from './../../../src/algorithms/rankUsers';

import {
  SkillController,
  SkillResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: SkillController,
    method: 'scan',
    target: SkillResource,
  },
];

const onSuccess = (response: any) => {
  const results = rankUsers(response.data);
  console.log('results:', results);
};

const onFailure = (response: any) => {
  console.log('rankUsers failed to run:', JSON.stringify(response));
};

export const handler = (event: any, context: any) => {
  const time = new Date();
  console.log(`${context.functionName} ran at ${time}`);

  const packageService = new PackageService(dataflows);
  packageService.package(onSuccess, onFailure);
};
