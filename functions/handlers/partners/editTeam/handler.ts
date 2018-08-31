import * as _ from 'lodash';
import DatabaseConnection from '../../../src/resources/DatabaseConnection';
import Endpoint from './../../../src/Endpoint';
import { PartnersResource,} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import UserResource from "../../../src/resources/UserResource/UserResource";
import GithubUsersResource from "../../../src/resources/GithubUsersResource/GithubUsersResource";
import GithubPartnerTeamsResource from "../../../src/resources/GithubPartnerTeamsResource/GithubPartnerTeamsResource";
import GithubService from "../../../src/services/GithubService";
import PartnerTeamController from '../../../src/controllers/PartnerTeamController/PartnerTeamController';

const partnerTeamController = new PartnerTeamController();
const endpoint = new Endpoint('/partners/team/edit', 'post');
const dbConnection = new DatabaseConnection();
const partnersResource = new PartnersResource(dbConnection);
const usersResource = new UserResource(dbConnection);
const githubUsersResource = new GithubUsersResource(dbConnection);
const githubPartnerTeamsResource = new GithubPartnerTeamsResource(dbConnection);
const githubService = new GithubService();

const removeEmptyValues = (data:any) => _.pickBy(data, val => val !== '');

endpoint.configure((req: Request, res: Response) => {
  const unixTimestamp = new Date().getTime();
  let data = req.body;

  data.updated = unixTimestamp;

  console.log('DATA', data);

  Promise.all([
    partnersResource.getTeam(data.id),
    partnersResource.getTeamOwners(data.id),
    partnersResource.getTeamMembers(data.id)
  ]).then((promisesResponse : any) => {
      const previosTeamData = promisesResponse[0].Item;
      const previoesTeamOwners = promisesResponse[1];
      const previoesTeamMembers = promisesResponse[2];
      const previousTeamOwnersMap:any = {};
      const previousTeamMembersMap:any = {};
      let owners = data.owners || [];
      let members = data.members || [];

    previoesTeamOwners.forEach((owner:any) => {
      previousTeamOwnersMap[owner['user_login']] = owner;
    });

    previoesTeamMembers.forEach((member:any) => {
      previousTeamMembersMap[member['user_login']] = member;
    });

    owners = _.filter(owners, (owner:any) => !previousTeamOwnersMap[owner.login]);
    members = _.filter(members, (owner:any) => !previousTeamOwnersMap[owner.login]);


    delete previosTeamData.owners;
    delete previosTeamData.members;


    console.log('previousTeamMembersMap', previousTeamMembersMap);
    console.log('members', members);

    if (_.isEmpty(previosTeamData)) {return res.status(200).json({payload:{error: true, message: 'Team in not exist'}})}

    data = removeEmptyValues({
      ...previosTeamData,
      ...data
    });

      githubService.getUsersByLogin([...owners, ...members].map((user:any) => user.login))
        .then(
          (users:any) => {

                  let preparedUsers:any[] = [];
                  let ownersTeam:any[] = [];
                  let membersTeam:any[] = [];
                  let createdTeam:any = previosTeamData;

                  preparedUsers = partnerTeamController.prepareUsersToSave(users, data.id, createdTeam.name, createdTeam.id);

                 console.log('preparedUsers', members);


                  ownersTeam = partnerTeamController.getMapByProp(owners.map((owner:any) => owner.login), preparedUsers);
                  membersTeam = partnerTeamController.getMapByProp(members.map((member:any) => member.login), preparedUsers);

                  console.log('members2', members);

                  partnersResource.save(data, membersTeam, ownersTeam).then(
                    () => res.status(200).json({ payload: {id: data.id}}),
                    () => res.status(200).json({error: true, payload: {message: 'Cannot save team'}})
                  );

          },
          () => res.status(200).json({error:true, payload:{message: 'Cant find users on Github'}})
        );
    });
});

const handler = endpoint.execute();
export { handler };
