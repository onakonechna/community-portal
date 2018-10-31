import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectsController from '../../../src/project/controller/Projects';

const getProjectsEndpoint = new Endpoint('/projects/', 'get');

getProjectsEndpoint.configure((req: Request, res: Response) => {
	const projectsController = new ProjectsController();

	projectsController.execute(req, res);
});

export const handler = getProjectsEndpoint.execute();
