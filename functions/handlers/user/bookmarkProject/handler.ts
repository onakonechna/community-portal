import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import BoookmarkProjectController from '../../../src/controller/user/BookmarkProject'

const bookmarkProjectEndpoint = new Endpoint('/user/bookmarkProject', 'post');

bookmarkProjectEndpoint.configure((req: Request, res: Response) => {
  const boookmarkProjectController = new BoookmarkProjectController();
  boookmarkProjectController.execute(req, res);
});

export const handler = bookmarkProjectEndpoint.execute();
