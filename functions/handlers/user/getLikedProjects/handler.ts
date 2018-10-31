import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import StarredProjectsController from "../../../src/user/controller/StarredProjects";

const getStarredProjects = new Endpoint('/user/likedProjects', 'get');

getStarredProjects.configure((req: Request, res: Response) => {
  const starredProjectsController = new StarredProjectsController();
  starredProjectsController.execute(req, res);
});

export const handler = getStarredProjects.execute();
