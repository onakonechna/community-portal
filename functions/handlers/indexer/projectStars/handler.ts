import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";
import Project from '../../../src/resources/ProjectResource/Project';
import User from "../../../src/resources/UserResource/User";

const dbConnection = new DatabaseConnection();
const projectResource = new ProjectResource(dbConnection);
const projectStarsIndexerEndpoint = new Endpoint('/project-stars-indexer', 'get');

projectStarsIndexerEndpoint.configure((req: Request, res: Response) => {
  projectResource.getProjectToIndexStars()
    .then((result:any) => result.Items)
});

export const handler = projectStarsIndexerEndpoint.execute();
