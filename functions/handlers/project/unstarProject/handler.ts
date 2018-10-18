import Endpoint from '../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import RemoveStarController from '../../../src/controller/project/RemoveStar';

const unstarProjectEndpoint = new Endpoint('/project/star', 'delete');

unstarProjectEndpoint.configure((req: Request, res: Response) => {
	const removeStarController = new RemoveStarController();
	removeStarController.execute(req, res);
});

export const handler = unstarProjectEndpoint.execute();