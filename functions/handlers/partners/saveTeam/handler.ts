import * as _ from 'lodash';
import DatabaseConnection from '../../../src/resources/DatabaseConnection';
import Endpoint from './../../../src/EndpointWrapper';
import { PartnersResource,} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import UserResource from "../../../src/resources/UserResource/UserResource";
import GithubUsersResource from "../../../src/resources/GithubUsersResource/GithubUsersResource";
import GithubPartnerTeamsResource from "../../../src/resources/GithubPartnerTeamsResource/GithubPartnerTeamsResource";
import GithubService from "../../../src/services/GithubService";
import PartnerTeamController from '../../../src/controllers/PartnerTeamController/PartnerTeamController';

const partnerTeamController = new PartnerTeamController();
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
      team_id: data.githubTeamName,
      github_team_name: partnerTeamName,
      github_team_id: partnerTeamId,
      status: 'unverified'
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
        team_id: data.githubTeamName,
        github_team_name: partnerTeamName,
        github_team_id: partnerTeamId,
        status: 'active'
      };
    } else {
      data.usersToSendInvitation.push(user);
      data.usersList[user.login] = {
        user_id: user.user_id,
        user_login: user.login,
        team_id: data.githubTeamName,
        github_team_name: partnerTeamName,
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

const getErrorAllowedDomainsResponse = () => ({
  payload: {
    error: true,
    message: 'Allowed domains are not provided'
  }
});
const getErrorGithubTeamNameResponse = () => ({
  payload: {
    error: true,
    message: 'Team name is not provided'
  }
});

endpoint.configure((req: Request, res: Response) => {
  const unixTimestamp = new Date().getTime();
  let data = req.body;

  data.created = unixTimestamp;
  data.updated = unixTimestamp;
  data = removeEmptyValues(data);

  if (!data.allowedDomains.length) {return res.status(200).json(getErrorAllowedDomainsResponse())}
  if (!data.githubTeamName) {return res.status(200).json(getErrorGithubTeamNameResponse())}

  githubService.getUsersByLogin([...data.owners, ...data.members].map((user:any) => user.login))
    .then(
      (users:any) => {
        if (data.isNewTeam) {
          githubService.createTeam(data.githubTeamName).then(
            (createdTeam:any) => {
              let preparedUsers:any[] = [];
              let owners:any[] = [];
              let members:any[] = [];

              createdTeam = createdTeam.data;
              createdTeam.id = createdTeam.id.toString();

              preparedUsers = partnerTeamController.prepareUsersToSave(users, data.id, createdTeam.name, createdTeam.id);
              owners = partnerTeamController.getMapByProp(data.owners.map((owner:any) => owner.login), preparedUsers);
              members = partnerTeamController.getMapByProp(data.members.map((member:any) => member.login), preparedUsers);
              partnersResource.save(data, members, owners).then(
                () => res.status(200).json({ payload: {id: data.id}}),
                () => res.status(200).json({error: true, payload: {message: 'Cannot save team'}})
              );
            },
            () => res.status(200).json({
              payload: {
                error: true,
                message: `Cannot create team ${data.githubTeamName} on Github`
              }
            })
          )
        } else {
          githubPartnerTeamsResource.getByName(data.githubTeamName)
            .then(
              (result:any) => {
                const partnerTeam = result.Items[0];

                if (!partnerTeam) {
                  return res.status(200).json({
                    payload: {
                      error: true,
                      message: `Can't find team with name ${data.githubTeamName}. Please check that team is created.`
                    }
                  })
                }

                githubService.getTeamMembers(partnerTeam.id)
                  .then(
                    (result:any) => {
                      const githubPartnerTeamMembersMap = _.keyBy(result.data, (item:any) => item.id);
                      let preparedUsers = partnerTeamController.prepareUsersToSave(users, data.id, partnerTeam.name, partnerTeam.id);
                      let owners:any[] = [];
                      let members:any[] = [];

                      preparedUsers = preparedUsers.map((user:any) =>
                        githubPartnerTeamMembersMap[user.id] ? {...user, status: 'active'} : user);
                      owners = partnerTeamController.getMapByProp(data.owners.map((owner:any) => owner.login), preparedUsers);
                      members = partnerTeamController.getMapByProp(data.members.map((member:any) => member.login), preparedUsers);
                      partnersResource.save(data, members, owners).then(
                        (data:any) => res.status(200).json({ payload: {id: data.id}}),
                        () => res.status(200).json({error: true, payload: {message: 'Cannot save team'}})
                      );
                    },
                    () => res.status(200)
                      .json({error: true, payload: {message: 'Cannot get partner team users'}})
                  )

              },
              () => res.status(200)
                .json({error:true, payload:{message: `Cannot find ${data.githubTeamName} team`}})
            )
        }
      },
      () => res.status(200).json({error:true, payload:{message: 'Cant find users on Github'}})
    );
});

const handler = endpoint.execute();
export { handler };
