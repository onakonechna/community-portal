import GithubService from '../../src/services/GithubService';
import GithubUsersResource from '../../src/resources/GithubUsersResource/GithubUsersResource'
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import Endpoint from "../../src/Endpoint";
import GithubPartnerTeamsResource from "../../src/resources/GithubPartnerTeamsResource/GithubPartnerTeamsResource";

const endpoint = new Endpoint('/githubPartnerTeamsIndexer', 'get');
const githubService = new GithubService();
const dbConnection = new DatabaseConnection();
const githubPartnerTeamsResource = new GithubPartnerTeamsResource(dbConnection);
console.log('hello11111');

const handle = function (req:any, res:any) {
  githubService.getPartnerTeams().then((result:any) => {
    githubPartnerTeamsResource.save(result.data)
      .then((result:any) => {
        res.status(result.status).json(result);
      });
  });
};

endpoint.configure(handle);
const handler = endpoint.execute();

export { handler }
