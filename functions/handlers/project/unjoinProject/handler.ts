import Endpoint from '../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import RemoveContributorController from '../../../src/controller/project/RemoveContributor';

const joinProjectEndpoint = new Endpoint('/project/join', 'delete');

joinProjectEndpoint.configure((req: Request, res: Response) => {
	const removeContributorController = new RemoveContributorController();
	removeContributorController.execute(req, res);
});

export const handler = joinProjectEndpoint.execute();