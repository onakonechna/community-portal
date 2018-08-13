// controllers
import ProjectController from './../src/controllers/ProjectController/ProjectController';
import UserController from './../src/controllers/UserController/UserController';
import TokenController from './../src/controllers/TokenController/TokenController';
import PartnerTeamController from './../src/controllers/PartnerTeamController/PartnerTeamController';

// resources
import ProjectResource from './../src/resources/ProjectResource/ProjectResource';
import UserResource from './../src/resources/UserResource/UserResource';
import PartnersResource from './../src/resources/PartnersTeamResource/PartnersTeamResource';

// APIs

import TokenAPI from './../src/APIs/TokenAPI/TokenAPI';

export {
  ProjectController,
  UserController,
  TokenController,
  PartnerTeamController,

  ProjectResource,
  UserResource,
  PartnersResource,

  TokenAPI,
};
