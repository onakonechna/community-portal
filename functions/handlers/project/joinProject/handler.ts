import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import AddContributorController from './../../../src/controller/Project/AddContributor';

const joinProjectEndpoint = new Endpoint('/project/join', 'post');

joinProjectEndpoint.configure((req: Request, res: Response) => {
	const addContributorController = new AddContributorController();
	addContributorController.execute(req, res);
});

export const handler = joinProjectEndpoint.execute();
