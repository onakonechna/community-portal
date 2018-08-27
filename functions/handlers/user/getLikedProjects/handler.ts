import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";


const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const getStarredProjects = new Endpoint('/user/likedProjects', 'get');

getStarredProjects.configure((req: Request, res: Response) => {
  userResource.getUpvotedProjects(req.tokenContents.user_id)
    .then((result:any) => res.status(200).json({data: result.Items}));
});

export const handler = getStarredProjects.execute();
