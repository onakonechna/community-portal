import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import AddStarController from './../../../src/controller/Project/AddStar';

const starProjectEndpoint = new Endpoint('/project/star', 'post');

starProjectEndpoint.configure((req: Request, res: Response) => {
	const addStarController = new AddStarController();
	addStarController.execute(req, res);
});

export const handler = starProjectEndpoint.execute();