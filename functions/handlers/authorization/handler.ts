import * as querystring from 'querystring';
import * as _ from 'lodash';

import { Request, Response } from '../../config/Types';
import Endpoint from '../../src/EndpointWrapper';
import User from '../../src/resources/UserResource/User';
import UserResource from '../../src/resources/UserResource/UserResource';
import ProjectResource from '../../src/resources/ProjectResource/ProjectResource';
import PartnersResource from '../../src/resources/PartnersTeamResource/PartnersTeamResource';

import { TokenAPI } from '../../config/Components';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import AuthorizationService from '../../src/services/AuthorizationService';
import GithubService from '../../src/services/GithubService';

const authorizationEndpoint = new Endpoint('/authorize', 'post');
const tokenApi = new TokenAPI();
const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const projectResource = new ProjectResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);
const authorizationService = new AuthorizationService();
const githubService = new GithubService();

authorizationEndpoint.configure((req: Request, res: Response) => {
  tokenApi.getGithubToken(req.body)
    .then((response:{data:string}) => querystring.parse(response.data).access_token)
    .then((access_token:string) => Promise.all([
      tokenApi.getUserDataByToken({access_token}),
      tokenApi.getUserEmailsByToken({access_token})
    ])
      .then((result:any) => ({
        access_token,
        responseGetUserEmails: result[1].data,
        responseGetUserDataByToken: result[0].data
      }))
    )
    .then(({access_token, responseGetUserDataByToken, responseGetUserEmails}) => {
      const userId = responseGetUserDataByToken.id.toString();

      return userResource.getById({user_id: userId})
      .then((responseGetUserById:any) => {
        const user = new User(responseGetUserById.Item ?
          {...responseGetUserById.Item, ...responseGetUserDataByToken} :
          responseGetUserDataByToken
        );

        user.set('user_id', userId);
        user.set('emails', responseGetUserEmails);
        user.set('access_token', access_token);

        return user;
      })
    })
    //PARTNERS
    .then((user:any) => req.body['partners-admin'] ?
      githubService.getTeamMembers(2254696)
        .then((members:any) => {
          user.set('partners_admin', !!members.data.find((member:any) => member.id === Number(user.get('user_id'))));
          return user;
        }) : user
    )
    .then((user:any) => req.body['partners-admin'] && !user.get('partners_admin') ?
      Promise.all([
        partnersResource.getTeamsbyOwnerId(user.get('user_id')),
        partnersResource.getTeamsbyMemberId(user.get('user_id'))
      ])
        .then((result:any) => {
          let userTitle;

          if (result[0][0]) {
            userTitle = 'partner_team_owner';
            user.set(userTitle, result[0][0])
          } else if (result[1][0]) {
            userTitle = 'partner_team_member';
            user.set(userTitle, result[1][0])
          }

          return {user, userTitle};
        })
      : {user, userTitle: ''}
    )
    .then(({user, userTitle}) => req.body['partners-admin'] && userTitle ?
      partnersResource.getTeam(user.get(userTitle).team_id)
        .then((team:any) => {
          user.set(`${userTitle}.emailVerified`, !!_.find(user.get('emails'), (data:any) =>
            _.find(team.Item.allowedDomains, (domain:string) => data.email.match(`@${domain}`)) && data.verified));

          return {user, userTitle};
        })
      : {user, userTitle: ''}
    )
    .then(({user, userTitle}) =>
      req.body['partners-admin'] &&
      userTitle &&
      user.get(`${userTitle}.emailVerified`) &&
      user.get(`${userTitle}.status`) === 'unverified' &&
      user.get('two_factor_authentication') ?
        Promise.all([
          githubService.inviteUserToTeam(user.get('login'), user.get(`${userTitle}.github_team_id`)),
          partnersResource.setPartnerTeamUserStatus(user.get(`${userTitle}.row_id`), 'pending', userTitle)
        ])
          .then((result:any) => {
            user.set(`${userTitle}.status`, 'pending');

            return user;
          })
        : user
    )
    //PARTNERS END
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
