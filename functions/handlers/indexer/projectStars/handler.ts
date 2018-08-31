/*
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
*/

import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";

const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);

export const handler = (event:any, context:any, callback:any) => {
  const time = new Date();
  userResource.create({
    user_id: '1234',
    login: 'super',
    time: new Date()
  })
};
