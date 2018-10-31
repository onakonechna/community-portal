import { Request, Response } from "../../../config/Types";
import Endpoint from '../../../src/EndpointWrapper';
import ProjectSaveController from '../../../src/project/controller/Save';

const projectCreateEndpoint = new Endpoint('/project', 'post');

projectCreateEndpoint.configure((req: Request, res: Response) => {
	const projectSaveController = new ProjectSaveController();
	projectSaveController.execute(req, res);
});

export const handler = projectCreateEndpoint.execute();
