import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import DatabaseConnection from "../../../src/resources/DatabaseConnection";
import UserResource from "../../../src/resources/UserResource/UserResource";
import ProjectResource from "../../../src/resources/ProjectResource/ProjectResource";
import User from "../../../src/resources/UserResource/User";

const dbConnection = new DatabaseConnection();
const userResource = new UserResource(dbConnection);
const projectResource = new ProjectResource(dbConnection);
const bookmarkProjectEndpoint = new Endpoint('/user/bookmarkProject', 'delete');

bookmarkProjectEndpoint.configure((req: Request, res: Response) => {
  const user = new User(req.tokenContents);

  projectResource.unbookmarkProject({project_id: req.body.project_id, user_id: user.get('user_id')})
    .then((result:any) => res.status(200).json({user_id: user.get('user_id')}))
    .catch((err:any) =>
      console.log(err) ||
      res.status(200).json({error:true, message: 'Cannot bookmark project'}));
});

export const handler = bookmarkProjectEndpoint.execute();
