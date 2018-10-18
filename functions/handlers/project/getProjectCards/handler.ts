import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectsController from '../../../src/controller/project/Projects';

const getProjectsEndpoint = new Endpoint('/projects/', 'get');

console.log('START')

getProjectsEndpoint.configure((req: Request, res: Response) => {
	console.log('INSIDE', process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_USERPASSWORD, process.env.IS_OFFLINE);

	const projectsController = new ProjectsController();
	projectsController.execute(req, res);
});

export const handler = getProjectsEndpoint.execute();
