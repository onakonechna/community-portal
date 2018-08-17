import Endpoint from './../../../src/Endpoint';
import {PartnersResource, TokenAPI} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";
import GithubService from '../../../src/services/GithubService'

import * as _ from 'lodash';
import AuthorizationService from "../../../src/services/AuthorizationService";

const endpoint = new Endpoint('/partners/user/verify/:id', 'get');
const dbConnection = new DatabaseConnection();
const usersResource = new UserResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);
const tokenApi = new TokenAPI();
const authroizationService = new AuthorizationService();
const githubService = new GithubService();

const createJWT = (userData:any) => authroizationService.create({
  name: userData.name,
  user_id: userData.user_id,
  login: userData.login,
  avatar_url: userData.avatar_url,
  location: userData.location,
  url: userData.url,
  company: userData.company,
  email: userData.email,
  two_factor_authentication: userData.two_factor_authentication,
  partners_admin: userData.partners_admin,
  partner_team_owner: userData.partner_team_owner,
  partner_team_member: userData.partner_team_member
});

endpoint.configure((req: Request, res: Response) => {
  const user_id = req.params.id;

  Promise.all([
    usersResource.getById({user_id}),
    partnersResource.getTeamsbyOwnerId(user_id),
    partnersResource.getTeamsbyMemberId(user_id)
  ]).then((usersPromisesResponse:any) => {
    const userData = usersPromisesResponse[0].Item;
    const userTeam = [...usersPromisesResponse[2], ...usersPromisesResponse[1]][0];
    let type:string;

    if (usersPromisesResponse[2].length) {
      type = 'partner_team_member'
    }

    if (usersPromisesResponse[1].length) {
      type = 'partner_team_owner'
    }

    if (_.isEmpty(userData)) {
      res.status(200).json({payload:{error:true, message: 'Cannot get user information'}})
    }

    if (_.isEmpty(userTeam)) {
      res.status(200).json({payload:{error:true, message: 'Cannot get user team'}})
    }

    const usersPromises:any[] = [
      tokenApi.getUserDataByToken({access_token: userData.access_token}),
      tokenApi.getUserEmailsByToken({access_token: userData.access_token}),
      partnersResource.getTeam(userTeam['team_id'])
    ];


    Promise.all(usersPromises).then((usersPromisesResult:any) => {
      const githubUserData = usersPromisesResult[0].data;
      const userEmails = usersPromisesResult[1].data;
      const team = usersPromisesResult[2].Item;
      const savePromises:any = [];
      const emailVerified = !!_.find(userEmails, (data:any) =>
        _.find(team.allowedDomains, (domain:string) => data.email.match(`@${domain}`)) && data.verified);

      userData.emails = userEmails;
      userData.emailVerified = emailVerified;
      userData.two_factor_authentication = githubUserData.two_factor_authentication;

      if (
        userData.emailVerified &&
        userTeam.status === 'unverified' &&
        userData.two_factor_authentication
      ) {
        userData[type].status = 'pending';
        savePromises.push(githubService.inviteUserToTeam(userData.login, userTeam['github_team_id']));
        savePromises.push(partnersResource.setPartnerTeamUserStatus(userTeam['row_id'], 'pending', type))
      }

      savePromises.push(usersResource.create(userData));

      Promise.all(savePromises).then((savePromisesResponse:any) => {
        res.status(200).json({
          payload: {
            data: createJWT(userData)
          }
        })
      })

    }, () => res.status(200).json({payload:{error:true}}));
  }, () => res.status(200).json({payload:{error:true, message: 'Cannot get user information'}}));
});

const handler = endpoint.execute();
export { handler };
