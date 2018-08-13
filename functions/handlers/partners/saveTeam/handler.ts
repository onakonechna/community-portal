import * as _ from 'lodash';
import DatabaseConnection from '../../../src/resources/DatabaseConnection';
import Endpoint from './../../../src/Endpoint';
import { PartnersResource,} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import UserResource from "../../../src/resources/UserResource/UserResource";
import GithubUsersResource from "../../../src/resources/GithubUsersResource/GithubUsersResource";
import GithubPartnerTeamsResource from "../../../src/resources/GithubPartnerTeamsResource/GithubPartnerTeamsResource";
import GithubService from "../../../src/services/GithubService";

const endpoint = new Endpoint('/partners/team/save', 'post');
const dbConnection = new DatabaseConnection();
const partnersResource = new PartnersResource(dbConnection);
const usersResource = new UserResource(dbConnection);
const githubUsersResource = new GithubUsersResource(dbConnection);
const githubPartnerTeamsResource = new GithubPartnerTeamsResource(dbConnection);
const githubService = new GithubService();

const getUsersByLogin = (users:string[]) => usersResource.getUsersByLogin(users);
const removeEmptyValues = (data:any) => _.pickBy(data, val => val !== '');
const validateUsersEmail = (users:any[], domains:string) => {
  const usersWithWrongEmails =
    _.filter(users, (user:any) =>
      !_.find(user.emails, (data:any) =>
        _.find(domains, (domain:string) => data.email.match(`@${domain}`)) && data.verified));

  return {
    valid: !usersWithWrongEmails.length,
    list: usersWithWrongEmails,
  }
};
const validateTwoFactorAuthentication = (users:any[]) => {
  const usersWithoutTwoFactorAuthentication = _.filter(users, (user:any) => !user.two_factor_authentication);

  return {
    valid: !usersWithoutTwoFactorAuthentication.length,
    list: usersWithoutTwoFactorAuthentication
  }
};
const generateMessageString = (data:any[]) =>
  data.reduce((first:any, second:any) => `"${first.login}", "${second.login}"`);
const prepareUsers = (users:any, partnerTeamId:string, partnerTeamName:string) => {
  let data:any = {
    usersList: {},
    usersToSendInvitation: []
  };

  users.forEach((user:any) => {
    data.usersToSendInvitation.push(user);
    data.usersList[user.login] = {
      user_id: user.user_id,
      user_login: user.login,
      team_id: partnerTeamName,
      github_team_id: partnerTeamId,
      status: 'pending'
    };
  });

  return data;
};

const prepareUsersDataBeforeSave = (users:any, partnerTeamMembers:any, partnerTeamId:string, partnerTeamName:string) => {
  let data:any = {
    usersList: {},
    usersToSendInvitation: []
  };

  users.forEach((user:any) => {
    if (partnerTeamMembers[user.user_id]) {
      data.usersList[user.login] = {
        user_id: user.user_id,
        user_login: user.login,
        team_id: partnerTeamName,
        github_team_id: partnerTeamId,
        status: 'active'
      };
    } else {
      data.usersToSendInvitation.push(user);
      data.usersList[user.login] = {
        user_id: user.user_id,
        user_login: user.login,
        team_id: partnerTeamName,
        github_team_id: partnerTeamId,
        status: 'pending'
      };
    }
  });

  return data;
};
const saveTeam = (data:any, preparedUsers:any) => {
  let owners:object[] = [];
  let members:object[] = [];
  let savePromises:any[] = [];

  data.owners.forEach((item:any) => {
    owners.push(preparedUsers.usersList[item.login]);
    savePromises.push(usersResource.addUserAsPartnerTeamOwner(preparedUsers.usersList[item.login]));
  });

  data.members.forEach((item:any) => {
    members.push(preparedUsers.usersList[item.login]);
    savePromises.push(usersResource.addUserAsPartnerTeamMember(preparedUsers.usersList[item.login]));
  });

  savePromises.push(partnersResource.save(data, members, owners));

  return Promise.all(savePromises);
};

endpoint.configure((req: Request, res: Response) => {
  const unixTimestamp = new Date().getTime();
  let data = req.body;

  data.created = unixTimestamp;
  data.updated = unixTimestamp;
  data = removeEmptyValues(data);

  if (!data.allowedDomains.length) {
    res.json({
      status: 200,
      payload: {
        error: true,
        message: 'Allowed domains are not provided'
      }
    })
  }

  if (!data.githubTeamName) {
    res.json({
      status: 200,
      payload: {
        error: true,
        message: 'Team name is not provided'
      }
    })
  }

  getUsersByLogin([...data.owners, ...data.members].map((user:any) => user.login)).then((users:any) => {
    const validateUsersEmailResult = validateUsersEmail(users, data.allowedDomains);
    const validateTwoFactorAuthenticationResult = validateTwoFactorAuthentication(users);

    if (!validateUsersEmailResult.valid) {
      return res.status(200).json({
        payload: {
          message: `The next users emails have invalid domain: ${generateMessageString(validateUsersEmailResult.list)}`
        }
      });
    }

    if (!validateTwoFactorAuthenticationResult.valid) {
      return res.status(200).json({
        payload: {
          message: `Two factor authorization is required. The next users have disabled two factor authorization: ${generateMessageString(validateTwoFactorAuthenticationResult.list)}`
        },
      });
    }

    if (data.isNewTeam) {
      githubService.createPartnerTeam(data.githubTeamName).then(
        (createdTeam:any) => {
          createdTeam = createdTeam.data;
          createdTeam.id = createdTeam.id.toString();

          const preparedUsers = prepareUsers(users, createdTeam.id, data.githubTeamName);

          githubService.inviteUsersToTeam(preparedUsers.usersToSendInvitation, createdTeam.id).then((invitationsResult:any) => {
            if (invitationsResult.error) {
              return res.status(200).json({
                payload: {
                  error: true,
                  message: `Cant send invite to team to next users: ${generateMessageString(invitationsResult.list)}`
                }
              })
            }

            saveTeam(data, preparedUsers).then((data:any) =>
              res.status(200).json({ payload: {id: data.id}}));
          }, () => res.status(200).json({
            payload: {
              error: true,
              message: `Cant send invite to team`
            }
          }));
        },
        () => res.status(200).json({
          payload: {
            error: true,
            message: `Cannot create team ${data.githubTeamName} on Github`
          }
        })
      )
    } else {
      githubPartnerTeamsResource.getByName(data.githubTeamName).then((result:any) => {
        const partnerTeam = result.Items[0];
        const githubUsersMap = _.keyBy({}, (item:any) => item.id);

        if (!partnerTeam) {
          return res.status(200).json({
            payload: {
              error: true,
              message: `Can't find team with name ${data.githubTeamName}. Please check that team is created.`
            }
          })
        }

        githubService.getTeamMembers(partnerTeam.id).then((result:any) => {
          const githubPartnerTeamMembers = result.data;
          const githubPartnerTeamMembersMap = _.keyBy(githubPartnerTeamMembers, (item:any) => item.id);
          const preparedUsers = prepareUsersDataBeforeSave(users, githubPartnerTeamMembers, partnerTeam.id, data.githubTeamName);

          if (preparedUsers.usersToSendInvitation.length) {
            githubService.inviteUsersToTeam(preparedUsers.usersToSendInvitation, partnerTeam.id).then((invitationsResult:any) => {
              if (invitationsResult.error) {
                return res.status(200).json({
                  payload: {
                    error: true,
                    message: `Cant send invite to team to next users: ${generateMessageString(invitationsResult.list)}`
                  }
                })
              }

              saveTeam(data, preparedUsers).then((data:any) =>
                res.status(200).json({ payload: {id: data.id}}));
            })
          } else {
            saveTeam(data, preparedUsers).then((data:any) =>
              res.status(200).json({ payload: {id: data.id}}));
          }
        });
      },
        () => res.json({
          status: 200,
          payload: {
            error: true,
            message: `Cannot find partner team with name ${data.githubTeamName}`
          }
        })
      );
    }
  }, () => res.json({
    status: 200,
    payload: {
      error: true,
      message: `The users are not authorized`
    }
  }));
});

const handler = endpoint.execute();
export { handler };
