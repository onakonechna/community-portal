import Endpoint from './../../../src/EndpointWrapper';
import {PartnersResource} from './../../../config/Components';
import {Request, Response} from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";

const endpoint = new Endpoint('/partners/team/:id', 'get');
const dbConnection = new DatabaseConnection();
const usersResource = new UserResource(dbConnection);
const partnersResource = new PartnersResource(dbConnection);

const generateUsersMap = (users:any) => {
  const map:any = {};

  users.forEach((user:any) => {
    map[user.user_id] = user;
  });

  return map;
};

endpoint.configure((req: Request, res: Response) => {
  const team_id = req.params.id;

  Promise.all([
    partnersResource.getTeam(team_id),
    partnersResource.getTeamOwners(team_id),
    partnersResource.getTeamMembers(team_id)
  ]).then((teamDataPromisesResult:any) => {
    const team = teamDataPromisesResult[0].Item;
    const teamOwners = teamDataPromisesResult[1];
    const teamMembers = teamDataPromisesResult[2];
    const teamUsers = [...teamOwners, ...teamMembers];
    const usersDataPromises:any[] = [];

    if (teamUsers.length) {
      usersResource.getUsersById(teamUsers.map((owner:any) => owner.user_id))
        .then((usersResponse:any) => {
          const usersMap = generateUsersMap(usersResponse.data);

          team.owners = teamOwners.map((owner:any) => usersMap[owner.user_id] || {
            user_id: owner.user_id,
            login: owner.user_login,
            emails: [{email: 'N/A'}],
            partner_team_owner: {
              status: owner.status,
              team_id: owner.team_id,
              github_team_id: owner.github_team_id,
              github_team_name: owner.github_team_name
            }
          });
          team.members = teamMembers.map((member:any) => usersMap[member.user_id] || {
            user_id: member.user_id,
            login: member.user_login,
            emails: [{email: 'N/A'}],
            partner_team_member: {
              status: member.status,
              team_id: member.team_id,
              github_team_id: member.github_team_id,
              github_team_name: member.github_team_name
            }
          });

          res.status(200).json({
            payload: {
              data: team
            }
          })

        }, (error:any) => console.log(error) || res.status(200).json({payload:{error: true, message: 'Cannot get users'}}))
    } else {
      res.status(200).json({
        payload: {
          data: team
        }
      })
    }
  });
});

const handler = endpoint.execute();
export { handler };
