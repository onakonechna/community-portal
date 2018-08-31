import GithubService from '../../src/services/GithubService';
import DatabaseConnection from "../../src/resources/DatabaseConnection";
import Endpoint from "../../src/EndpointWrapper";
import GithubPartnerTeamsResource from "../../src/resources/GithubPartnerTeamsResource/GithubPartnerTeamsResource";
import {Request, Response} from "../../config/Types";

const githubPartnerTeamsIndexer = new Endpoint('/githubPartnerTeamsIndexer', 'get');
const githubService = new GithubService();
const dbConnection = new DatabaseConnection();
const githubPartnerTeamsResource = new GithubPartnerTeamsResource(dbConnection);

githubPartnerTeamsIndexer.configure((req: Request, res: Response) => {
  githubService.getTeams().then((result:any) => {
    githubPartnerTeamsResource.save(result.data)
      .then((result:any) => {
        res.status(result.status).json(result);
      });
  });
});

export const handler = githubPartnerTeamsIndexer.execute();
