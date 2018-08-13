import Endpoint from './../../src/Endpoint';
import { TokenController, UserController, TokenAPI, UserResource } from './../../config/Components';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import {PartnersResource} from "../../config/Components";
import {Request, Response} from "../../config/Types";
import * as querystring from 'querystring';
import AuthorizationService from '../../src/services/AuthorizationService';
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
              two_factor_authentication: userExist.two_factor_authentication
            }
          }

          delete userData.id;

          if (data.partner) {
            if (!userData.two_factor_authentication) {
              res.json(getError2FAResponseObject())
            }

            githubUsersResource.getById(userData.user_id).then((githubUserData:any) => {
              githubUserData = githubUserData.Item;
              userData['partners_admin'] = authroizationService.isParnersAdmin(githubUserData);
              usersResource.create(userData).then(
                () => res.json(getSuccessSaveResponseObject(userData, createJWT(userData))),
                () => res.json(getErrorSaveResponseObject())
              );
            },
              () => res.json(getErrorGithubUserDataResponseObject())
            )
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
