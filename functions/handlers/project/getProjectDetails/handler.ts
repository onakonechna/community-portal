import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectController from '../../../src/project/controller/Project';

const getProjectEndpoint = new Endpoint('/project/:id', 'get');

getProjectEndpoint.configure((req: Request, res: Response) => {
	const projectController = new ProjectController();

	projectController.execute(req, res);
});

export const handler = getProjectEndpoint.execute();
