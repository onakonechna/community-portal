import * as querystring from 'querystring';
import * as _ from 'lodash';

import { Request, Response } from '../../config/Types';
import Endpoint from '../../src/EndpointWrapper';
import User from '../../src/resources/UserResource/User';
import UserResource from '../../src/resources/UserResource/UserResource';
import ProjectResource from '../../src/resources/ProjectResource/ProjectResource';

import { TokenAPI } from '../../config/Components';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import AuthorizationService from '../../src/services/AuthorizationService';
import {message} from "aws-sdk/clients/sns";

const authorizationEndpoint = new Endpoint('/authorize', 'post');
const tokenApi = new TokenAPI();
const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const projectResource = new ProjectResource(dbConnection);
const authorizationService = new AuthorizationService();

authorizationEndpoint.configure((req: Request, res: Response) => {
  tokenApi.getGithubToken(req.body)
    .then((response:{data:string}) => querystring.parse(response.data).access_token)
    .then((access_token:string) => tokenApi.getUserDataByToken({access_token})
      .then((responseGetUserDataByToken:any) => ({
        access_token,
        responseGetUserDataByToken: responseGetUserDataByToken.data
      }))
    )
    .then(({access_token, responseGetUserDataByToken}) => {
      const userId = responseGetUserDataByToken.id.toString();

      return userResource.getById({user_id: userId})
      .then((responseGetUserById:any) => {

        const user = new User(responseGetUserById.Item ?
          {...responseGetUserById.Item, ...responseGetUserDataByToken} :
          responseGetUserDataByToken
        );

        user.set('user_id', userId);
        user.set('access_token', access_token);

        return user;
      })
    })
    .then((user:any) => new Promise((resolve:any) => {
      Promise.all([
        userResource.getGithubUpvotedProjects(user.get('access_token')),
        projectResource.getProjectToIndexStars()
      ])
        .then((response:any) =>
          resolve({
            user,
            starredProjects: response[0].data.map((project:any) => {project.id = project.id.toString(); return project}),
            projectToIndexStars: response[1].Items
          }))
    }))
    .then(({user, starredProjects, projectToIndexStars}) => {
      const starredProjectsByUser:any[] = [];
      const starredProjectsMap = _.keyBy(starredProjects, 'id');

      _.forEach(projectToIndexStars, (project:any) => {
        if (starredProjectsMap[project['project_id']]) {
          starredProjectsByUser.push({
            project_id: starredProjectsMap[project['project_id']].id,
            project_name: starredProjectsMap[project['project_id']].name,
            user_id: user.get('user_id'),
            user_name: user.get('login')
          })
        }
      });

      return {user, starredProjects: starredProjectsByUser};
    })
    .then(({user, starredProjects}) => starredProjects.length ?
      projectResource.setStarredProjects(starredProjects).then(() => user) : user
    )
    .then((user:any) => userResource.create(user.getData()).then((response:any) => user))
    .then((user:any) => res.status(200).json({
      user_id: user.get('user_id'),
      scopes: user.get('scopes'),
      message: 'User saved',
      token: authorizationService.create(user.getPublicData())
    }))
    .catch((err:any) => console.log(err) || res.json({err: true, message: 'Authorization failed'}))
});

export const handler = authorizationEndpoint.execute();
