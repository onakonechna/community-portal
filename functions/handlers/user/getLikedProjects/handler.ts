import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";

const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const getStarredProjects = new Endpoint('/user/likedProjects', 'get');

getStarredProjects.configure((req: Request, res: Response) => {
  userResource.getById({user_id: req.tokenContents.user_id})
    .then((result:any) => result.Item)
    .then((userData:any) => userResource.getGithubUpvotedProjects(userData['access_token']))
    .then((projects:any) => res.status(200).json({
      data: projects.data.map((project:any) => ({project_id: project.id = project.id.toString()}))
    }));
});
export const handler = getStarredProjects.execute();
