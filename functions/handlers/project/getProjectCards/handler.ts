import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectsController from '../../../src/controller/project/Projects';

const getProjectsEndpoint = new Endpoint('/projects/', 'get');

console.log('START')

getProjectsEndpoint.configure((req: Request, res: Response) => {
	console.log('INSIDE')

	const projectsController = new ProjectsController();
	projectsController.execute(req, res);
});

export const handler = getProjectsEndpoint.execute();
