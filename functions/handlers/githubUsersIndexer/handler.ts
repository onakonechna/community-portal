import GithubService from '../../src/services/GithubService';
import GithubUsersResource from '../../src/resources/GithubUsersResource/GithubUsersResource'
import config from './config';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import Endpoint from "../../src/EndpointWrapper";

const endpoint = new Endpoint('/githubUsersIndexer', 'get');
const githubService = new GithubService();
const dbConnection = new DatabaseConnection();
const githubUsersResource = new GithubUsersResource(dbConnection);
const handle = function (req:any, res:any) {
  let promises:any[] = [];

  config.forEach((item:any) => {
    promises.push(githubService.getTeamsInOrganizationByName(item.organization)
      .then((res:any) => ({data: res.data, organization: item})));
  });

  Promise.all(promises).then((data:any) => {
    let membersPromises:any[] = [];

    data.forEach((item:any) => {
      item.organization.teams.forEach((team:string) => {
        let teamInfo = item.data.find((teamItem:any) => teamItem.name === team);

        membersPromises.push(githubService.getTeamMembers(teamInfo.id)
          .then((res:any) => ({data: res.data, team: teamInfo, organization: item.organization})));
      });

      Promise.all(membersPromises).then((membersData:any) => {
        let result:any[] = [];

        membersData.forEach((membersByTeam:any) => {
          result = [
            ...result,
            ...membersByTeam.data
              .map((item:any) => ({
                ...item,
                id: item.id.toString(),
                team: membersByTeam.team,
                organization: membersByTeam.organization}))
          ]
        });

        githubUsersResource.save(result)
          .then(() => res.json({
            status: 200
          }));
      });
    });
  });
};

endpoint.configure(handle);
const handler = endpoint.execute();

export { handler }
