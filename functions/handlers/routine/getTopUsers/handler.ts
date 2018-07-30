import { Request, Response } from './../../../config/Types';

import PackageService from './../../../src/services/PackageService';
import Endpoint from './../../../src/Endpoint';
import {
  SkillsController,
  SkillsResource,
} from './../../../config/Components';

const dataflows = [
  {
    controller: SkillsController,
    method: 'scan',
    target: SkillsResource,
  },
];

const onSuccess = (response: any) => {
  console.log('success', response);
};

const onFailure = (response: any) => {
  console.log('failure', response);
};

const packageService = new PackageService(dataflows).package(onSuccess, onFailure);

export const handler = ();
