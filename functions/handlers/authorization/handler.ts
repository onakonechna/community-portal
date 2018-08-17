import Endpoint from './../../src/Endpoint';
import { TokenController, UserController, TokenAPI, UserResource } from './../../config/Components';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import {PartnersResource} from "../../config/Components";
import {Request, Response} from "../../config/Types";
import * as querystring from 'querystring';
import AuthorizationService from '../../src/services/AuthorizationService';
import GithubService from '../../src/services/GithubService';
import * as _ from 'lodash';
import GithubUsersResource from "../../src/resources/GithubUsersResource/GithubUsersResource";

const endpoint = new Endpoint('/authorize', 'post');
const dbConnection = new DatabaseConnection();
const usersResource = new UserResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);
const githubUsersResource = new GithubUsersResource(dbConnection);
const tokenController = new TokenController();
const userController = new UserController();
const tokenApi = new TokenAPI();
const authroizationService = new AuthorizationService();
const githubService = new GithubService();

const removeEmptyValues = (data:any) => _.pickBy(data, val => val !== '');
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
const getError2FAResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'Access denied. Please enable Github 2FA.'
  }
});
const getSuccessSaveResponseObject = (data:any, jwt:string) => ({
  status: 200,
  token: jwt,
  payload: {
    user_id: data.user_id,
    message: 'User saved',
    token: jwt,
  },
});

const getErrorSaveResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'User do not saved'
  }
});

const getErrorGetTokenResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'Cannot get Github token'
  }
});

const getErrorGetUserDataResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'Cannot get user data by provided GitHub token'
  }
});

const getErrorExistentUserDataResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'Cannot get user data by provided GitHub token'
  }
});

const getErrorGithubUserDataResponseObject = () => ({
  status: 200,
  payload: {
    error: true,
    message: 'Cannot get GitHub team user data'
  }
});

endpoint.configure((req: Request, res: Response) => {
  const data = req.body;

  tokenApi.getGithubToken(data).then((githubResponse:any) => {
    const access_token = querystring.parse(githubResponse.data).access_token;
    const promises:any[] = [
      tokenApi.getUserDataByToken({access_token}),
      tokenApi.getUserEmailsByToken({access_token})
    ];

    Promise.all(promises)
      .then((result:any) => {
        let userData = result[0].data;
        const userEmails = result[1].data;

        userData.user_id = userData.id.toString();
        userData.emails = userEmails;
        userData.access_token = access_token;
        userData['partner_team_member'] = {};
        userData['partner_team_owner'] = {};
        userData['partners_admin'] = false;
        userData = removeEmptyValues(userData);

        usersResource.getById({user_id: userData.user_id}).then((userExist:any) => {
          userExist = userExist.Item;

          if (!_.isEmpty(userExist)) {
            userData = {
              ...userExist,
              ...userData,
              'partner_team_member': userExist['partner_team_member'],
              'partner_team_owner': userExist['partner_team_owner']
            }
          }

          delete userData.id;

          if (data.partner) {
            const promises:any[] = [
              githubUsersResource.getById(userData.user_id),
              partnersResource.getTeamsbyOwnerId(userData.user_id),
              partnersResource.getTeamsbyMemberId(userData.user_id)
            ];

            Promise.all(promises).then((promisesResult:any[]) => {
              const githubUserData = promisesResult[0];
              const userDataByTitle:any = {
                'partner_team_owner': promisesResult[1][0],
                'partner_team_member': promisesResult[2][0]
              };

              let userTitle:string;

              userData['partners_admin'] =
                !_.isEmpty(githubUserData) ? authroizationService.isParnersAdmin(githubUserData.Item) : false;

              if (userDataByTitle['partner_team_member']) {
                userTitle = 'partner_team_member';
              } else if (userDataByTitle['partner_team_owner']) {
                userTitle = 'partner_team_owner';
              }

              if (userTitle) {
                userData[userTitle] = {
                  team_id: userDataByTitle[userTitle].team_id,
                  github_team_id: userDataByTitle[userTitle].github_team_id,
                  github_team_name: userDataByTitle[userTitle].github_team_name,
                  status: userDataByTitle[userTitle].status
                };

                partnersResource.getTeam(userDataByTitle[userTitle].team_id).then((partnerTeamsPromisesResult:any) => {
                  const teamAllowedDomains = partnerTeamsPromisesResult.Item.allowedDomains;

                  userData[userTitle].emailVerified = !!_.find(userData.emails, (data:any) =>
                    _.find(teamAllowedDomains, (domain:string) => data.email.match(`@${domain}`)) && data.verified);

                  if (
                    userData[userTitle].emailVerified &&
                    userData[userTitle].status === 'unverified' &&
                    userData.two_factor_authentication
                  ) {
                    const promises = [
                      githubService.inviteUserToTeam(userData.login, userData[userTitle]['github_team_id']),
                      partnersResource.setPartnerTeamUserStatus(userDataByTitle[userTitle]['row_id'], 'pending', userTitle)
                    ];

                    Promise.all(promises).then(
                      () => {
                        userData[userTitle].status = 'pending';
                        usersResource.create(userData).then(
                          () => res.json(getSuccessSaveResponseObject(userData, createJWT(userData))),
                          () => res.json(getErrorSaveResponseObject())
                        );
                      },
                      () => res.status(200).json({
                        payload: {
                          error: true,
                          message: 'Cannot send invite to user'
                        }
                      })
                    )
                  } else {
                    usersResource.create(userData).then(
                      () => res.json(getSuccessSaveResponseObject(userData, createJWT(userData))),
                      () => res.json(getErrorSaveResponseObject())
                    );
                  }
                });
              } else {
                usersResource.create(userData).then(
                  () => res.json(getSuccessSaveResponseObject(userData, createJWT(userData))),
                  () => res.json(getErrorSaveResponseObject())
                );
              }
            });
          } else {
            usersResource.create(userData).then(
              () => res.json(getSuccessSaveResponseObject(userData, createJWT(userData))),
              () => res.json(getErrorSaveResponseObject())
            );
          }
        },
          () => res.json(getErrorExistentUserDataResponseObject())
        );
      },
        () => res.json(getErrorGetUserDataResponseObject())
      );
    },
    () => res.json(getErrorGetTokenResponseObject())
  );
});

const handler = endpoint.execute();
export { handler };
