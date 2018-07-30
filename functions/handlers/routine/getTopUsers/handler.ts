import { CustomAuthorizerEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';

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
  console.log('success', response);
};

const onFailure = (response: any) => {
  console.log('failure', response);
};

export const handler = (event: CustomAuthorizerEvent, context: APIGatewayEventRequestContext) => {
  const time = new Date();
  console.log(`Your cron function ran at ${time}`);

  const packageService = new PackageService(dataflows);
  packageService.package(onSuccess, onFailure);
};
